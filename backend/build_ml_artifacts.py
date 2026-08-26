import os
import pandas as pd
import numpy as np
import xgboost as xgb
import joblib
import shap

from app.services.opportunity import TargetEncoderWrapper

def build_artifacts():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(base_dir, "data", "data_final.csv")
    ml_dir = os.path.join(base_dir, "ml")
    model_path = os.path.join(ml_dir, "xgb_model.json")

    print(f"Reading dataset from {csv_path}...")
    df = pd.read_csv(csv_path)

    # 1. Market Reference DataFrame
    print("Building market reference data...")
    df["keyword_clean"] = df["keyword"].astype(str).str.lower().str.strip()
    
    market_ref = df.groupby("keyword_clean").agg(
        median_price=("price", "median"),
        hhi_pasar=("hhi_market_concentration", "median"),
        median_wishlist=("wishlist_count", "median"),
        median_eWOM=("positive_eWOM_ratio", "median")
    ).reset_index()

    market_ref.rename(columns={"keyword_clean": "keyword"}, inplace=True)
    
    market_ref_path = os.path.join(ml_dir, "market_reference.pkl")
    joblib.dump(market_ref, market_ref_path)
    print(f"Saved {market_ref_path}")

    # 2. Target Encoder
    print("Building target encoder...")
    kw_map = df.groupby("keyword_clean")["keyword_encoded"].mean().to_dict()
    global_mean_encoded = float(df["keyword_encoded"].mean())
    encoder = TargetEncoderWrapper(kw_map, global_mean_encoded)

    encoder_path = os.path.join(ml_dir, "target_encoder.pkl")
    joblib.dump(encoder, encoder_path)
    print(f"Saved {encoder_path}")

    # 3. SHAP Explainer
    print("Building SHAP explainer...")
    model = xgb.XGBRegressor()
    model.load_model(model_path)
    explainer = shap.TreeExplainer(model)

    explainer_path = os.path.join(ml_dir, "shap_explainer.pkl")
    joblib.dump(explainer, explainer_path)
    print(f"Saved {explainer_path}")

    print("All ML artifacts built successfully!")

if __name__ == "__main__":
    build_artifacts()
