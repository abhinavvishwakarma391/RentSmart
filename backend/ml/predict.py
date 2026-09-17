from functools import lru_cache
import json
import joblib
import pandas as pd

from .preprocess import (
    ARTIFACTS_DIR,
    FEATURES,
    normalize_furnishing,
    normalize_parking,
    normalize_property_type,
)

MODEL_PATH = ARTIFACTS_DIR / "rent_model.joblib"
CITY_DEFAULT_LOCALITY = {
    "Raipur": "Shankar Nagar",
    "Bhilai": "Smriti Nagar",
}


@lru_cache(maxsize=1)
def load_model():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            "Trained model not found. Run: python -m ml.train from the backend folder."
        )
    return joblib.load(MODEL_PATH)


@lru_cache(maxsize=1)
def _metrics() -> dict:
    meta_path = ARTIFACTS_DIR / "metrics.json"
    if not meta_path.exists():
        return {}
    return json.loads(meta_path.read_text(encoding="utf-8"))


def parse_location(location: str, city: str | None = None, locality: str | None = None):
    text = " ".join(part for part in [city, locality, location] if part).strip()
    lower = text.lower()

    resolved_city = "Raipur"
    if "bhilai" in lower:
        resolved_city = "Bhilai"
    elif "raipur" in lower:
        resolved_city = "Raipur"

    resolved_locality = locality.strip() if locality else None
    if not resolved_locality:
        known = _known_localities().get(resolved_city, [])
        for name in known:
            if name.lower() in lower:
                resolved_locality = name
                break
        if not resolved_locality:
            tokens = [part.strip() for part in text.replace(",", " ").split() if part.strip()]
            skip = {"raipur", "bhilai", "chhattisgarh", "cg", "india"}
            leftover = [t for t in tokens if t.lower() not in skip]
            resolved_locality = " ".join(leftover).title() if leftover else (
                "Shankar Nagar" if resolved_city == "Raipur" else "Smriti Nagar"
            )

    return resolved_city, resolved_locality


def _known_localities() -> dict:
    return _metrics().get("localities", {})


def _resolve_known_locality(city: str, locality: str | None) -> tuple[str, bool]:
    """Map a locality onto a trained neighborhood. Unseen names fall back."""
    known = _known_localities().get(city, [])
    lookup = {name.lower(): name for name in known}
    if locality:
        key = locality.strip().lower()
        if key in lookup:
            return lookup[key], False
        for name_key, name in lookup.items():
            if key in name_key or name_key in key:
                return name, False

    default_name = CITY_DEFAULT_LOCALITY.get(city, "Shankar Nagar")
    if default_name.lower() in lookup:
        return lookup[default_name.lower()], True
    if known:
        return known[0], True
    return default_name, True


def _neighborhood_average(city: str, locality: str | None = None) -> float | None:
    meta = _metrics()
    if locality:
        local_avg = (
            meta.get("neighborhood_averages", {})
            .get(city, {})
            .get(locality)
        )
        if local_avg is not None:
            return float(local_avg)

    city_avg = meta.get("city_averages", {}).get(city)
    if city_avg is not None:
        return float(city_avg)
    return None


def classify_price(listed_rent: float | None, fair_rent: float) -> dict:
    if listed_rent is None:
        return {
            "status": "Fair",
            "listed_rent": None,
            "difference": None,
            "difference_pct": None,
        }

    difference = listed_rent - fair_rent
    difference_pct = round((difference / fair_rent) * 100, 1) if fair_rent else 0
    if listed_rent > fair_rent * 1.10:
        status = "Overpriced"
    elif listed_rent < fair_rent * 0.90:
        status = "Underpriced"
    else:
        status = "Fair"

    return {
        "status": status,
        "listed_rent": int(round(listed_rent)),
        "difference": int(round(difference)),
        "difference_pct": difference_pct,
    }


def predict_rent(
    *,
    location: str = "",
    city: str | None = None,
    locality: str | None = None,
    property_type: str = "Apartment",
    bhk: int = 2,
    area_sqft: float = 900,
    bathrooms: int = 2,
    furnishing: str = "Semi-Furnished",
    parking: str = "Yes",
    listed_rent: float | None = None,
) -> dict:
    resolved_city, parsed_locality = parse_location(location, city, locality)
    model_locality, unseen_locality = _resolve_known_locality(
        resolved_city, parsed_locality
    )

    row = pd.DataFrame(
        [
            {
                "city": resolved_city,
                "locality": model_locality,
                "property_type": normalize_property_type(property_type),
                "bhk": int(max(1, min(5, bhk))),
                "area_sqft": float(area_sqft),
                "bathrooms": int(max(1, min(5, bathrooms))),
                "furnishing": normalize_furnishing(furnishing),
                "parking": normalize_parking(parking),
            }
        ]
    )[FEATURES]

    model = load_model()
    fair_rent = float(model.predict(row)[0])

    if unseen_locality:
        neighborhood_avg = _neighborhood_average(resolved_city)
        if neighborhood_avg is not None:
            fair_rent = neighborhood_avg

    fair_rent = max(2500, int(round(fair_rent / 100) * 100))
    band = max(800, int(round(fair_rent * 0.08 / 100) * 100))
    price = classify_price(listed_rent, fair_rent)

    return {
        "city": resolved_city,
        "locality": parsed_locality if unseen_locality else model_locality,
        "predicted_rent": fair_rent,
        "min_rent": fair_rent - band,
        "max_rent": fair_rent + band,
        **price,
    }
