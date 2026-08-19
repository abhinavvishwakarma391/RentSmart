from pathlib import Path

import pandas as pd

BACKEND_DIR = Path(__file__).resolve().parents[1]
DATA_PATH = BACKEND_DIR / "data" / "raipur_bhilai_rentals.csv"
ARTIFACTS_DIR = Path(__file__).resolve().parent / "artifacts"

TARGET = "rent"
NUMERIC_FEATURES = ["bhk", "area_sqft", "bathrooms"]
CATEGORICAL_FEATURES = [
    "city",
    "locality",
    "property_type",
    "furnishing",
    "parking",
]
FEATURES = NUMERIC_FEATURES + CATEGORICAL_FEATURES

PROPERTY_TYPE_MAP = {
    "apartment": "Apartment",
    "flat": "Apartment",
    "house": "Independent House",
    "independent house": "Independent House",
    "villa": "Independent House",
    "studio": "Apartment",
}

FURNISHING_MAP = {
    "furnished": "Furnished",
    "semi-furnished": "Semi-Furnished",
    "semi furnished": "Semi-Furnished",
    "unfurnished": "Unfurnished",
}


def load_raw(path: Path | None = None) -> pd.DataFrame:
    csv_path = path or DATA_PATH
    if not csv_path.exists():
        raise FileNotFoundError(f"Dataset not found: {csv_path}")
    return pd.read_csv(csv_path)


def clean_rentals(df: pd.DataFrame) -> pd.DataFrame:
    data = df.copy()
    required = FEATURES + [TARGET]
    missing_cols = [col for col in required if col not in data.columns]
    if missing_cols:
        raise ValueError(f"Dataset is missing columns: {missing_cols}")

    data = data.dropna(subset=required)
    data = data.drop_duplicates(subset=FEATURES + [TARGET])

    data["city"] = data["city"].astype(str).str.strip()
    data["locality"] = data["locality"].astype(str).str.strip()
    data["property_type"] = data["property_type"].map(normalize_property_type)
    data["furnishing"] = data["furnishing"].map(normalize_furnishing)
    data["parking"] = data["parking"].astype(str).str.strip().str.title()
    data["parking"] = data["parking"].replace({"Y": "Yes", "N": "No"})

    data["bhk"] = data["bhk"].astype(int).clip(1, 5)
    data["bathrooms"] = data["bathrooms"].astype(int).clip(1, 5)
    data["area_sqft"] = pd.to_numeric(data["area_sqft"], errors="coerce")
    data["rent"] = pd.to_numeric(data["rent"], errors="coerce")
    data = data.dropna(subset=["area_sqft", "rent"])

    data = data[(data["area_sqft"] >= 200) & (data["area_sqft"] <= 5000)]
    data = data[(data["rent"] >= 2500) & (data["rent"] <= 150000)]
    data = _remove_rent_outliers(data)

    return data.reset_index(drop=True)


def _remove_rent_outliers(df: pd.DataFrame) -> pd.DataFrame:
    cleaned = []
    for _, group in df.groupby(["city", "bhk"], dropna=False):
        q1 = group["rent"].quantile(0.05)
        q3 = group["rent"].quantile(0.95)
        cleaned.append(group[(group["rent"] >= q1) & (group["rent"] <= q3)])
    if not cleaned:
        return df
    return pd.concat(cleaned, ignore_index=True)


def normalize_property_type(value: str) -> str:
    key = str(value).strip().lower()
    return PROPERTY_TYPE_MAP.get(key, "Apartment")


def normalize_furnishing(value: str) -> str:
    key = str(value).strip().lower()
    return FURNISHING_MAP.get(key, "Semi-Furnished")


def normalize_parking(value: str) -> str:
    key = str(value).strip().lower()
    if key in {"yes", "y", "true", "1"}:
        return "Yes"
    return "No"


def xy(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series]:
    return df[FEATURES], df[TARGET]
