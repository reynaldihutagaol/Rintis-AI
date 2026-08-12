"""
Opportunity analysis service.
Currently returns dummy data — will be replaced with real ML model in Phase 6.
"""


def analyze_keyword(keyword: str) -> dict:
    """
    Analyze a keyword and return opportunity data.
    TODO: Replace dummy data with real XGBoost model + SHAP (Phase 6).
    """

    dummy_data = {
        "gamis syar'i premium": {
            "category": "Fashion",
            "opportunity_score": 81,
            "opportunity_level": "high",
            "opportunity_label": "High Opportunity — Enter Market",
            "metrics": {
                "predicted_demand": 920,
                "competition_density": 0.12,
                "competition_label": "Rendah",
                "avg_price": 185000,
            },
            "explanations": [
                {"icon": "✅", "text": "Persaingan sangat rendah (0.12) — sedikit seller di niche ini"},
                {"icon": "✅", "text": "Demand tinggi (920 unit) — tren modest fashion terus naik"},
                {"icon": "✅", "text": "Harga tinggi (Rp 185.000) — margin besar per unit"},
            ],
            "shap_features": [
                {"name": "Competition", "value": 0.35},
                {"name": "Demand", "value": 0.28},
                {"name": "Price", "value": 0.18},
                {"name": "Rating", "value": 0.09},
            ],
            "whatif": {
                "current_price": 185000,
                "min_price": 148000,
                "max_price": 222000,
                "current_demand": 920,
            },
        },
        "kaos polos": {
            "category": "Fashion",
            "opportunity_score": 18,
            "opportunity_level": "red_ocean",
            "opportunity_label": "High Risk — Red Ocean",
            "metrics": {
                "predicted_demand": 3200,
                "competition_density": 0.94,
                "competition_label": "Sangat Tinggi",
                "avg_price": 35000,
            },
            "explanations": [
                {"icon": "❌", "text": "Persaingan sangat tinggi (0.94) — pasar sudah jenuh"},
                {"icon": "✅", "text": "Demand tinggi (3.200 unit) — tapi terbagi ke banyak seller"},
                {"icon": "❌", "text": "Harga sangat rendah (Rp 35.000) — margin tipis"},
            ],
            "shap_features": [
                {"name": "Competition", "value": 0.42},
                {"name": "Demand", "value": 0.25},
                {"name": "Price", "value": 0.20},
                {"name": "Rating", "value": 0.08},
            ],
            "whatif": {
                "current_price": 35000,
                "min_price": 28000,
                "max_price": 42000,
                "current_demand": 3200,
            },
        },
        "frozen food dimsum": {
            "category": "Makanan",
            "opportunity_score": 74,
            "opportunity_level": "high",
            "opportunity_label": "High Opportunity — Enter Market",
            "metrics": {
                "predicted_demand": 780,
                "competition_density": 0.18,
                "competition_label": "Rendah",
                "avg_price": 45000,
            },
            "explanations": [
                {"icon": "✅", "text": "Persaingan rendah (0.18) — belum banyak seller frozen dimsum"},
                {"icon": "✅", "text": "Demand tinggi (780 unit) — tren frozen food terus naik"},
                {"icon": "⚠️", "text": "Harga menengah (Rp 45.000) — margin cukup baik"},
            ],
            "shap_features": [
                {"name": "Competition", "value": 0.33},
                {"name": "Demand", "value": 0.30},
                {"name": "Price", "value": 0.15},
                {"name": "Rating", "value": 0.10},
            ],
            "whatif": {
                "current_price": 45000,
                "min_price": 36000,
                "max_price": 54000,
                "current_demand": 780,
            },
        },
        "snack pedas kekinian": {
            "category": "Makanan",
            "opportunity_score": 48,
            "opportunity_level": "niche",
            "opportunity_label": "Niche Differentiation Required",
            "metrics": {
                "predicted_demand": 560,
                "competition_density": 0.58,
                "competition_label": "Sedang",
                "avg_price": 28000,
            },
            "explanations": [
                {"icon": "⚠️", "text": "Persaingan sedang (0.58) — perlu diferensiasi produk"},
                {"icon": "✅", "text": "Demand lumayan (560 unit) — pasar masih aktif"},
                {"icon": "❌", "text": "Harga rendah (Rp 28.000) — margin kecil"},
            ],
            "shap_features": [
                {"name": "Competition", "value": 0.30},
                {"name": "Demand", "value": 0.27},
                {"name": "Price", "value": 0.22},
                {"name": "Rating", "value": 0.11},
            ],
            "whatif": {
                "current_price": 28000,
                "min_price": 22400,
                "max_price": 33600,
                "current_demand": 560,
            },
        },
        "kopi susu literan": {
            "category": "Minuman",
            "opportunity_score": 55,
            "opportunity_level": "niche",
            "opportunity_label": "Niche Differentiation Required",
            "metrics": {
                "predicted_demand": 480,
                "competition_density": 0.47,
                "competition_label": "Sedang",
                "avg_price": 65000,
            },
            "explanations": [
                {"icon": "⚠️", "text": "Persaingan sedang (0.47) — banyak brand bermunculan"},
                {"icon": "✅", "text": "Demand cukup (480 unit) — kebiasaan ngopi masih tinggi"},
                {"icon": "✅", "text": "Harga menengah-tinggi (Rp 65.000) — margin lumayan"},
            ],
            "shap_features": [
                {"name": "Competition", "value": 0.28},
                {"name": "Demand", "value": 0.26},
                {"name": "Price", "value": 0.24},
                {"name": "Rating", "value": 0.12},
            ],
            "whatif": {
                "current_price": 65000,
                "min_price": 52000,
                "max_price": 78000,
                "current_demand": 480,
            },
        },
        "teh botol kemasan": {
            "category": "Minuman",
            "opportunity_score": 15,
            "opportunity_level": "red_ocean",
            "opportunity_label": "High Risk — Red Ocean",
            "metrics": {
                "predicted_demand": 4500,
                "competition_density": 0.96,
                "competition_label": "Sangat Tinggi",
                "avg_price": 5000,
            },
            "explanations": [
                {"icon": "❌", "text": "Persaingan ekstrem (0.96) — didominasi brand besar"},
                {"icon": "✅", "text": "Demand sangat tinggi (4.500 unit) — tapi dikuasai pemain lama"},
                {"icon": "❌", "text": "Harga sangat rendah (Rp 5.000) — margin nyaris nol"},
            ],
            "shap_features": [
                {"name": "Competition", "value": 0.45},
                {"name": "Demand", "value": 0.22},
                {"name": "Price", "value": 0.20},
                {"name": "Rating", "value": 0.06},
            ],
            "whatif": {
                "current_price": 5000,
                "min_price": 4000,
                "max_price": 6000,
                "current_demand": 4500,
            },
        },
    }

    default = {
        "category": "Umum",
        "opportunity_score": 50,
        "opportunity_level": "niche",
        "opportunity_label": "Niche Differentiation Required",
        "metrics": {
            "predicted_demand": 500,
            "competition_density": 0.50,
            "competition_label": "Sedang",
            "avg_price": 50000,
        },
        "explanations": [
            {"icon": "⚠️", "text": "Persaingan sedang — perlu strategi diferensiasi"},
            {"icon": "✅", "text": "Demand cukup — ada potensi pasar"},
            {"icon": "⚠️", "text": "Harga menengah — margin standar"},
        ],
        "shap_features": [
            {"name": "Competition", "value": 0.30},
            {"name": "Demand", "value": 0.28},
            {"name": "Price", "value": 0.22},
            {"name": "Rating", "value": 0.10},
        ],
        "whatif": {
            "current_price": 50000,
            "min_price": 40000,
            "max_price": 60000,
            "current_demand": 500,
        },
    }

    keyword_lower = keyword.lower().strip()
    data = dummy_data.get(keyword_lower, default)

    return {
        "keyword": keyword,
        **data,
    }
