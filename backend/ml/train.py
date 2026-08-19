import json

import joblib
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from xgboost import XGBRegressor

from .eda import run_eda
from .preprocess import (
    ARTIFACTS_DIR,
    CATEGORICAL_FEATURES,
    FEATURES,
    NUMERIC_FEATURES,
    clean_rentals,
    load_raw,
    xy,
)


def build_preprocessor() -> ColumnTransformer:
    return ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), NUMERIC_FEATURES),
            (
                "cat",
                OneHotEncoder(handle_unknown="ignore"),
                CATEGORICAL_FEATURES,
            ),
        ]
    )


def metrics(y_true, y_pred) -> dict:
    rmse = float(np.sqrt(mean_squared_error(y_true, y_pred)))
    return {
        "mae": round(float(mean_absolute_error(y_true, y_pred)), 2),
        "rmse": round(rmse, 2),
        "r2": round(float(r2_score(y_true, y_pred)), 4),
    }


def train() -> dict:
    run_eda()
    df = clean_rentals(load_raw())
    X, y = xy(df)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    candidates = {
        "linear_regression": LinearRegression(),
        "random_forest": RandomForestRegressor(
            n_estimators=300,
            max_depth=12,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1,
        ),
        "xgboost": XGBRegressor(
            n_estimators=400,
            max_depth=6,
            learning_rate=0.08,
            subsample=0.9,
            colsample_bytree=0.9,
            random_state=42,
            n_jobs=-1,
        ),
    }

    results = {}
    best_name = None
    best_rmse = float("inf")
    best_pipeline = None

    for name, model in candidates.items():
        pipeline = Pipeline(
            steps=[
                ("preprocess", build_preprocessor()),
                ("model", model),
            ]
        )
        pipeline.fit(X_train, y_train)
        pred = pipeline.predict(X_test)
        score = metrics(y_test, pred)
        results[name] = score
        print(f"{name}: MAE={score['mae']} RMSE={score['rmse']} R2={score['r2']}")
        if score["rmse"] < best_rmse:
            best_rmse = score["rmse"]
            best_name = name
            best_pipeline = pipeline

    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    model_path = ARTIFACTS_DIR / "rent_model.joblib"
    joblib.dump(best_pipeline, model_path)

    localities = (
        df.groupby("city")["locality"]
        .unique()
        .apply(lambda values: sorted(values.tolist()))
        .to_dict()
    )
    meta = {
        "best_model": best_name,
        "features": FEATURES,
        "metrics": results,
        "localities": localities,
        "n_train": int(len(X_train)),
        "n_test": int(len(X_test)),
    }
    (ARTIFACTS_DIR / "metrics.json").write_text(
        json.dumps(meta, indent=2), encoding="utf-8"
    )

    print(f"\nBest model: {best_name}")
    print(f"Saved {model_path}")
    return meta


if __name__ == "__main__":
    train()
