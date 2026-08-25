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
        keyword_lower, _AVAILABLE_KEYWORDS, n=1, cutoff=0.4
    )
    if close_matches:
        return close_matches[0]

    raise ValueError(f"Keyword '{keyword_lower}' tidak ditemukan di data pasar.")


def _competition_label(hhi: float) -> str:
    """
    TODO: threshold masih tebakan, sesuaikan dengan definisi bisnis kamu.
    Ini murni statistik pasar (HHI), bukan output SHAP, jadi tetap
    dihitung terpisah dari fungsi-fungsi berbasis SHAP di bawah.
    """
    if hhi < 0.15:
        return "Rendah"
    elif hhi < 0.30:
        return "Sedang"
    return "Tinggi"


# Label manusiawi untuk tiap fitur, dipakai buat generate teks penjelasan
# otomatis dari SHAP values. Tambah entry di sini kalau nanti ada fitur baru.
FEATURE_LABELS: dict[str, str] = {
    "log_price": "Harga produk",
    "price_relative_to_median": "Harga dibanding median pasar",
    "hhi_market_concentration": "Konsentrasi pasar (dominasi top seller)",
    "log_wishlist_count": "Minat pasar (wishlist)",
    "positive_eWOM_ratio": "Sentimen ulasan positif (eWOM)",
    "keyword_encoded": "Karakteristik niche keyword",
}


def _explanation_for_feature(feature: str, shap_value: float) -> dict:
    """
    Bikin satu baris penjelasan dari nama fitur + kontribusi SHAP-nya.
    Icon dan arah kalimat ditentukan dari tanda (+/-) nilai SHAP.
    """
    label = FEATURE_LABELS.get(feature, feature)
    if shap_value >= 0:
        icon = "✅"
        arah = "mendorong naik"
    else:
        icon = "⚠️"
        arah = "menekan"
    return {
        "icon": icon,
        "text": f"{label} {arah} estimasi penjualan (kontribusi SHAP: {shap_value:+.3f}).",
    }


def _build_explanations(kontribusi: dict, top_n: int = 3) -> list[dict]:
    """
    Bangun daftar penjelasan otomatis dari SHAP values — diurutkan
    berdasarkan besarnya pengaruh (|shap value|) ke prediksi, ambil top_n
    paling berpengaruh. Ini menggantikan pendekatan lama yang cuma
    hardcode 2 kondisi if/else.
    """
    sorted_features = sorted(
        kontribusi.items(), key=lambda kv: abs(kv[1]), reverse=True
    )
    return [
        _explanation_for_feature(feature, value)
        for feature, value in sorted_features[:top_n]
    ]


def _opportunity_score(kontribusi: dict) -> tuple[int, str, str]:
    """
    Skor dihitung dari total kontribusi SHAP (net effect kasus ini relatif
    terhadap base value model), di-scale ke 0-100 lewat sigmoid.
    net_shap > 0 artinya prediksi kasus ini di atas rata-rata (base value)
    model; net_shap < 0 artinya di bawah rata-rata.

    TODO: skala sigmoid ini masih perlu divalidasi terhadap distribusi
    net_shap di seluruh keyword yang ada di market_ref, biar threshold
    high/medium/low-nya representatif (sekarang cuma dibagi rata 70/40).
    """
    net_shap = sum(kontribusi.values())
    score = int(round(100 / (1 + np.exp(-net_shap))))
    score = max(0, min(100, score))

    if score >= 70:
        level, label = "high", "High Opportunity"
    elif score >= 40:
        level, label = "medium", "Medium Opportunity"
    else:
        level, label = "low", "Low Opportunity"

    return score, level, label


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

    explanations = _build_explanations(kontribusi)
    competition_label = _competition_label(stats["hhi_pasar"])
    score, level, label = _opportunity_score(kontribusi)

    return {
        "keyword": keyword,
        # Keyword asli di data pasar yang dipakai untuk prediksi (berguna
        # buat debug kalau input user gak exact match).
        "matched_keyword": matched_keyword,
        # TODO: kategori masih hardcode. Ganti kalau market_ref punya kolom
        # kategori sendiri, atau bikin mapping keyword -> kategori.
        "category": "F&B",
        "opportunity_score": score,
        "opportunity_level": level,
        "opportunity_label": label,
        "metrics": {
            "predicted_demand": estimasi_terjual,
            "competition_density": float(stats["hhi_pasar"]),
            "competition_label": competition_label,
            "avg_price": harga,
        },
        "explanations": explanations,
        "shap_features": [
            {"name": k, "value": float(v)} for k, v in kontribusi.items()
        ],
        "whatif": {
            "current_price": harga,
            # TODO: range ini placeholder (±30% dari harga).
            "min_price": int(harga * 0.7),
            "max_price": int(harga * 1.3),
            "current_demand": estimasi_terjual,
        },
    }