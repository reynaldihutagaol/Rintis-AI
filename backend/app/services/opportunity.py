"""
Opportunity analysis service.
Real XGBoost + SHAP prediction (dummy data sudah tidak dipakai lagi).
"""

import difflib
import os

import numpy as np
import pandas as pd
import xgboost as xgb
import joblib

# ── Path model, gak tergantung cwd saat run uvicorn ──
SERVICES_DIR = os.path.dirname(os.path.abspath(__file__))   # backend/app/services
APP_DIR = os.path.dirname(SERVICES_DIR)                      # backend/app
BACKEND_DIR = os.path.dirname(APP_DIR)                        # backend
ML_DIR = os.path.join(BACKEND_DIR, "ml")                      # backend/ml

# Dimuat sekali saat module ini pertama kali di-import (bukan tiap request)
model = xgb.XGBRegressor()
model.load_model(os.path.join(ML_DIR, "xgb_model.json"))
encoder = joblib.load(os.path.join(ML_DIR, "target_encoder.pkl"))
market_ref = joblib.load(os.path.join(ML_DIR, "market_reference.pkl"))
explainer = joblib.load(os.path.join(ML_DIR, "shap_explainer.pkl"))

_AVAILABLE_KEYWORDS = market_ref["keyword"].unique().tolist()


def _resolve_keyword(keyword_lower: str) -> str:
    """
    Cari keyword di market_reference yang paling cocok dengan input user,
    gak harus exact match. Urutan pencarian:
      1. Exact match.
      2. Substring — misal user ketik "dimsum" dan data punya
         "frozen food dimsum".
      3. Fuzzy match pakai difflib (typo, urutan kata beda dikit, dll).
    Raise ValueError kalau gak ada kandidat yang cukup mirip, biar route
    bisa balikin 404 yang jelas ke frontend (bukan 500 generic).
    """
    if keyword_lower in _AVAILABLE_KEYWORDS:
        return keyword_lower

    substring_matches = [
        k for k in _AVAILABLE_KEYWORDS
        if keyword_lower in k or k in keyword_lower
    ]
    if substring_matches:
        # Ambil yang paling pendek/mirip dulu (paling relevan)
        substring_matches.sort(key=len)
        return substring_matches[0]

    close_matches = difflib.get_close_matches(
        keyword_lower, _AVAILABLE_KEYWORDS, n=1, cutoff=0.7
    )
    if close_matches:
        return close_matches[0]

    raise ValueError(f"Keyword '{keyword_lower}' tidak ditemukan di data pasar.")


def _demand_label(estimasi_terjual: int) -> str:
    """
    Kategori estimasi penjualan, sesuai kesepakatan tim (bukan hasil
    tebakan gw lagi). Sebelumnya ini malah gak dihitung sama sekali di
    backend — frontend (api.ts) yang nebak sendiri pakai threshold beda
    (>2000/>500). Sekarang backend jadi satu-satunya sumber kebenaran.
    """
    if estimasi_terjual > 1000:
        return "Tinggi"
    elif estimasi_terjual >= 100:
        return "Medium"
    return "Rendah"


def _competition_label(hhi_pasar: float) -> str:
    """
    Kategori kompetisi berdasarkan hhi_pasar MENTAH (skala 0-10000),
    sesuai kesepakatan tim. PENTING: arahnya kebalik dari versi
    sebelumnya — di sini HHI KECIL berarti kompetisi TINGGI (banyak
    pesaing aktif berebut pasar), bukan "didominasi top seller".
    Kolom status_kompetisi (Unconcentrated/dst) TIDAK dipakai lagi di
    sini karena arah interpretasinya beda dengan kesepakatan tim.
    """
    if hhi_pasar < 1000:
        return "Tinggi"
    elif hhi_pasar <= 1800:
        return "Medium"
    return "Rendah"


def _opportunity_level(demand_label: str, competition_label: str) -> tuple[str, str, int]:
    """
    Matrix keputusan opportunity, sesuai kesepakatan tim — menggantikan
    pendekatan sigmoid berbasis SHAP yang gw pakai sebelumnya. SHAP tetap
    dipakai buat `explanations` (teks penjelasan per fitur), tapi bukan
    lagi buat nentuin level opportunity-nya.
    """
    if demand_label == "Tinggi" and competition_label == "Rendah":
        level = "high"      # permintaan tinggi, saingan dikuasai sedikit pihak (peluang disrupsi)
    elif demand_label == "Rendah" and competition_label == "Tinggi":
        level = "low"       # permintaan lesu, saingan berdarah-darah
    elif demand_label == "Rendah":
        level = "low"
    else:
        level = "medium"

    label_map = {
        "high": "High Opportunity",
        "medium": "Medium Opportunity",
        "low": "Low Opportunity",
    }
    # Skor numerik 0-100 cuma representasi kasar buat UI (misal progress
    # bar), bukan hasil perhitungan presisi — matrix di atas cuma
    # menghasilkan 3 kategori, bukan angka granular.
    score_map = {"high": 80, "medium": 50, "low": 20}
    return level, label_map[level], score_map[level]


# Mapping keyword -> kategori. market_reference.pkl belum punya kolom
# kategori sendiri, jadi ini dibuat manual berdasarkan daftar keyword yang
# ada di data training. TODO: kalau nanti data training nambah kolom
# kategori asli, ganti fungsi ini biar baca dari situ, bukan hardcode.
_FASHION_KEYWORDS = {
    "baju batik", "baju muslim", "celana pria", "celana wanita",
    "dress wanita", "hijab", "hoodie", "jaket", "kaos pria", "kaos wanita",
    "kemeja pria", "kemeja wanita", "sneakers",
}


def _category_for_keyword(matched_keyword: str) -> str:
    if matched_keyword in _FASHION_KEYWORDS:
        return "Fashion"
    return "F&B"


# Label manusiawi untuk tiap fitur mentah, dipakai di field `shap_features`
# (data teknis buat chart, dsb) — bukan di teks `explanations` lagi.
FEATURE_LABELS: dict[str, str] = {
    "log_price": "Harga produk",
    "price_relative_to_median": "Harga dibanding median pasar",
    "hhi_market_concentration": "Konsentrasi pasar (dominasi top seller)",
    "log_wishlist_count": "Minat pasar (wishlist)",
    "positive_eWOM_ratio": "Sentimen ulasan positif (eWOM)",
    "keyword_encoded": "Karakteristik niche keyword",
}

# Beberapa fitur SHAP itu sebenarnya soal topik yang sama (misal log_price
# dan price_relative_to_median sama-sama soal "harga"), jadi digabung jadi
# 1 topik biar gak muncul 2 penjelasan yang mirip/membingungkan buat user.
_FEATURE_TOPICS: dict[str, str] = {
    "log_price": "price",
    "price_relative_to_median": "price",
    "hhi_market_concentration": "competition",
    "log_wishlist_count": "demand",
    "positive_eWOM_ratio": "sentiment",
    "keyword_encoded": "niche",
}


def _explanation_for_topic(topic: str, net_value: float, context: dict) -> dict:
    """
    Bikin 1 baris penjelasan berbahasa natural (bukan jargon SHAP) buat
    calon penjual, berdasarkan topik (harga/kompetisi/demand/sentimen/niche)
    dan data bisnis asli (harga, median pasar, label kompetisi, dll) —
    bukan cuma nampilin angka SHAP mentah.
    """
    positive = net_value >= 0

    if topic == "price":
        median_price = context["median_price"]
        # Harga selalu = median pasar (belum ada input harga dari penjual),
        # jadi arah kalimat dari sini ditentukan pengaruh model (positive),
        # bukan perbandingan harga vs median (yang bakal selalu 0/sama).
        if positive:
            return {
                "icon": "✅",
                "text": (
                    f"Median harga pasar untuk produk sejenis ini sekitar "
                    f"Rp {median_price:,.0f}. Di level harga ini, potensi "
                    "penjualannya cenderung baik — bisa jadi acuan awal buat "
                    "menentukan harga jualmu."
                ),
            }
        return {
            "icon": "⚠️",
            "text": (
                f"Median harga pasar untuk produk sejenis ini sekitar "
                f"Rp {median_price:,.0f}. Di level harga ini, kamu mungkin "
                "perlu strategi tambahan (kualitas, kemasan, atau promosi) "
                "supaya tetap menarik buat calon pembeli."
            ),
        }

    if topic == "competition":
        label = context["competition_label"]
        if label == "Rendah":
            return {
                "icon": "✅",
                "text": (
                    "Persaingan di kategori ini masih relatif rendah — belum "
                    "banyak penjual yang serius menggarap pasar ini, jadi ini "
                    "peluang bagus untuk masuk lebih awal."
                ),
            }
        elif label == "Medium":
            return {
                "icon": "⚠️",
                "text": (
                    "Persaingan di kategori ini tergolong sedang. Masih ada "
                    "ruang buat masuk, tapi kamu perlu punya pembeda yang jelas "
                    "dari produk-produk yang udah ada."
                ),
            }
        return {
            "icon": "⚠️",
            "text": (
                "Persaingan di kategori ini cukup ketat, banyak penjual lain "
                "menjual produk serupa. Kamu butuh strategi pembeda yang kuat "
                "(harga, kualitas, atau branding) supaya bisa bersaing."
            ),
        }

    if topic == "demand":
        if positive:
            return {
                "icon": "✅",
                "text": (
                    "Produk sejenis ini cukup diminati calon pembeli (dilihat "
                    "dari jumlah wishlist), menandakan permintaan pasar yang sehat."
                ),
            }
        return {
            "icon": "⚠️",
            "text": (
                "Minat pasar terhadap produk sejenis ini masih tergolong "
                "rendah — mungkin perlu usaha ekstra di promosi supaya lebih dilirik."
            ),
        }

    if topic == "sentiment":
        if positive:
            return {
                "icon": "✅",
                "text": (
                    "Ulasan pembeli untuk produk sejenis di kategori ini "
                    "rata-rata positif — ini bisa bantu membangun kepercayaan "
                    "calon pembeli baru terhadap produkmu."
                ),
            }
        return {
            "icon": "⚠️",
            "text": (
                "Cukup banyak ulasan kurang memuaskan pada produk sejenis di "
                "kategori ini. Kualitas produk dan pelayanan jadi kunci penting "
                "supaya produkmu bisa menonjol."
            ),
        }

    # topic == "niche" (keyword_encoded) atau fitur lain yang belum di-cover
    if positive:
        return {
            "icon": "✅",
            "text": "Kategori produk sejenis ini punya karakteristik pasar yang mendukung, cenderung lebih diminati dibanding kategori lain.",
        }
    return {
        "icon": "⚠️",
        "text": "Kategori produk sejenis ini punya karakteristik pasar yang sedikit lebih menantang dibanding kategori lain secara umum.",
    }


def _build_explanations(kontribusi: dict, context: dict, top_n: int = 3) -> list[dict]:
    """
    Bangun daftar penjelasan otomatis berbahasa natural — SHAP values
    digabung per topik (harga/kompetisi/demand/sentimen/niche) dulu,
    baru diurutkan berdasarkan besar pengaruhnya, ambil top_n topik yang
    paling berpengaruh.
    """
    topic_net: dict[str, float] = {}
    topic_abs: dict[str, float] = {}
    for feature, value in kontribusi.items():
        topic = _FEATURE_TOPICS.get(feature, feature)
        topic_net[topic] = topic_net.get(topic, 0.0) + value
        topic_abs[topic] = topic_abs.get(topic, 0.0) + abs(value)

    sorted_topics = sorted(topic_abs.items(), key=lambda kv: kv[1], reverse=True)
    return [
        _explanation_for_topic(topic, topic_net[topic], context)
        for topic, _ in sorted_topics[:top_n]
    ]



def _build_other_product_ideas(category: str, current_keyword: str) -> list[dict]:
    """
    Mengembalikan 3 ide keyword alternatif dalam kategori yang sama
    menggunakan nama keyword asli (tanpa tambahan kata buatan) dan metrik aktual.
    """
    candidates = [
        kw for kw in _AVAILABLE_KEYWORDS
        if _category_for_keyword(kw) == category and kw != current_keyword
    ]

    ideas = []
    for idx, kw in enumerate(candidates, start=1):
        stats = market_ref[market_ref["keyword"] == kw].iloc[0]
        harga = int(stats["median_price"])
        comp_label = _competition_label(stats["hhi_pasar"])

        kw_encoded = encoder.transform(pd.DataFrame({"keyword": [kw]}))["keyword"].iloc[0]
        fitur = pd.DataFrame({
            "keyword_encoded": [kw_encoded],
            "log_price": [np.log1p(harga)],
            "price_relative_to_median": [1.0],
            "hhi_market_concentration": [stats["hhi_pasar"]],
            "log_wishlist_count": [np.log1p(stats["median_wishlist"])],
            "positive_eWOM_ratio": [stats["median_eWOM"]],
        })
        pred_log = model.predict(fitur)[0]
        est_terjual = int(np.expm1(pred_log))
        dem_label = _demand_label(est_terjual)

        ideas.append({
            "id": str(idx),
            "name": kw.title(),
            "demand_label": dem_label,
            "competition_label": comp_label,
            "avg_price_label": f"Rp {harga:,.0f}".replace(",", "."),
            "predicted_demand": est_terjual,
        })

    # Sort by predicted demand descending, take top 3
    ideas.sort(key=lambda x: x["predicted_demand"], reverse=True)
    return ideas[:3]


def analyze_keyword(keyword: str) -> dict:
    """
    Analyze a keyword and return opportunity data hasil prediksi model asli.
    Harga simulasi otomatis pakai median harga pasar untuk keyword tsb
    (frontend cuma kirim keyword, tanpa input harga — lihat SearchBar.tsx).
    Keyword gak harus exact match — lihat _resolve_keyword().
    """
    keyword_lower = keyword.lower().strip()
    matched_keyword = _resolve_keyword(keyword_lower)
    stats = market_ref[market_ref["keyword"] == matched_keyword].iloc[0]

    harga = int(stats["median_price"])

    kw_encoded = encoder.transform(
        pd.DataFrame({"keyword": [matched_keyword]})
    )["keyword"].iloc[0]

    fitur_baru = pd.DataFrame({
        "keyword_encoded": [kw_encoded],
        "log_price": [np.log1p(harga)],
        "price_relative_to_median": [harga / stats["median_price"]],
        "hhi_market_concentration": [stats["hhi_pasar"]],
        "log_wishlist_count": [np.log1p(stats["median_wishlist"])],
        "positive_eWOM_ratio": [stats["median_eWOM"]],
    })

    prediksi_log = model.predict(fitur_baru)[0]
    estimasi_terjual = int(np.expm1(prediksi_log))

    shap_vals = explainer.shap_values(fitur_baru)[0]
    kontribusi = dict(zip(fitur_baru.columns, shap_vals))

    demand_label = _demand_label(estimasi_terjual)
    competition_label = _competition_label(stats["hhi_pasar"])
    category = _category_for_keyword(matched_keyword)
    level, label, score = _opportunity_level(demand_label, competition_label)

    explanations = _build_explanations(
        kontribusi,
        context={
            "harga": harga,
            "median_price": float(stats["median_price"]),
            "competition_label": competition_label,
        },
    )

    other_product_ideas = _build_other_product_ideas(category, matched_keyword)

    return {
        "keyword": keyword,
        # Keyword asli di data pasar yang dipakai untuk prediksi (berguna
        # buat debug kalau input user gak exact match).
        "matched_keyword": matched_keyword,
        # Kategori sekarang dinamis berdasarkan mapping keyword, bukan
        # hardcoded "F&B" lagi.
        "category": category,
        "opportunity_score": score,
        "opportunity_level": level,
        "opportunity_label": label,
        "metrics": {
            "predicted_demand": estimasi_terjual,
            "demand_label": demand_label,
            "competition_density": float(stats["hhi_pasar"]),
            "competition_label": competition_label,
            "avg_price": harga,
        },
        "explanations": explanations,
        "shap_features": [
            {"name": FEATURE_LABELS.get(k, k), "value": float(v)} for k, v in kontribusi.items()
        ],
        "other_product_ideas": other_product_ideas,
        "whatif": {
            "current_price": harga,
            # TODO: range ini placeholder (±30% dari harga).
            "min_price": int(harga * 0.7),
            "max_price": int(harga * 1.3),
            "current_demand": estimasi_terjual,
        },
    }