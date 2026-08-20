from functools import lru_cache

import numpy as np
import pandas as pd

from .predict import classify_price, load_model, parse_location
from .preprocess import FEATURES, clean_rentals, load_raw


def _status_label(status: str) -> str:
    if status == "Underpriced":
        return "Good Value"
    if status == "Overpriced":
        return "Overpriced"
    return "Fair Price"


@lru_cache(maxsize=1)
def catalog() -> pd.DataFrame:
    df = clean_rentals(load_raw()).copy()
    model = load_model()
    preds = model.predict(df[FEATURES])
    fair = np.maximum(2500, np.round(preds / 100) * 100).astype(int)
    df["fair_rent"] = fair

    labels = []
    for listed, predicted in zip(df["rent"], df["fair_rent"]):
        info = classify_price(float(listed), float(predicted))
        labels.append(info)

    df["status"] = [item["status"] for item in labels]
    df["status_label"] = df["status"].map(_status_label)
    df["difference"] = [item["difference"] for item in labels]
    df["difference_pct"] = [item["difference_pct"] for item in labels]
    df["value_score"] = (df["fair_rent"] - df["rent"]) / df["fair_rent"].clip(lower=1)
    df["status_rank"] = df["status"].map(
        {"Underpriced": 0, "Fair": 1, "Overpriced": 2}
    )
    return df


def listing_to_dict(row: pd.Series) -> dict:
    return {
        "id": int(row["id"]),
        "name": str(row["title"]),
        "city": str(row["city"]),
        "locality": str(row["locality"]),
        "location": f"{row['locality']}, {row['city']}",
        "property_type": str(row["property_type"]),
        "bhk": int(row["bhk"]),
        "area": int(row["area_sqft"]),
        "bathrooms": int(row["bathrooms"]),
        "furnishing": str(row["furnishing"]),
        "parking": str(row["parking"]),
        "rent": int(row["rent"]),
        "fair_rent": int(row["fair_rent"]),
        "status": str(row["status"]),
        "status_label": str(row["status_label"]),
        "difference": int(row["difference"]),
        "difference_pct": float(row["difference_pct"]),
        "latitude": float(row["latitude"]) if "latitude" in row and pd.notna(row["latitude"]) else None,
        "longitude": float(row["longitude"]) if "longitude" in row and pd.notna(row["longitude"]) else None,
    }


def list_properties(city: str | None = None, limit: int = 18) -> list[dict]:
    df = catalog()
    if city:
        resolved_city, _ = parse_location(city)
        city_rows = df[df["city"].str.lower() == resolved_city.lower()]
        if not city_rows.empty:
            df = city_rows

    ranked = df.sort_values(["status_rank", "value_score"], ascending=[True, False])
    picked = []
    seen_localities = set()
    for _, row in ranked.iterrows():
        key = (row["city"], row["locality"])
        if key in seen_localities:
            continue
        seen_localities.add(key)
        picked.append(listing_to_dict(row))
        if len(picked) >= limit:
            return picked

    for _, row in ranked.iterrows():
        item = listing_to_dict(row)
        if any(existing["id"] == item["id"] for existing in picked):
            continue
        picked.append(item)
        if len(picked) >= limit:
            break
    return picked


def compare_properties(ids: list[int]) -> dict:
    if len(ids) < 2:
        raise ValueError("Select at least two properties to compare.")
    if len(ids) > 3:
        raise ValueError("Compare up to 3 properties at a time.")

    df = catalog()
    selected = df[df["id"].isin(ids)].copy()
    if selected.empty:
        raise ValueError("None of the selected properties were found.")

    ordered = []
    for prop_id in ids:
        match = selected[selected["id"] == prop_id]
        if match.empty:
            continue
        ordered.append(listing_to_dict(match.iloc[0]))

    best = max(ordered, key=lambda item: item["fair_rent"] - item["rent"])
    return {
        "properties": ordered,
        "best": {
            "id": best["id"],
            "name": best["name"],
            "reason": (
                f"{best['name']} is the strongest value: listed rent "
                f"Rs {best['rent']:,} vs fair rent Rs {best['fair_rent']:,}."
            ),
        },
    }


def recommend_properties(
    *,
    location: str = "Raipur",
    budget: float = 15000,
    bhk: int = 2,
    min_area: float = 900,
    furnishing: str = "Furnished",
    parking: str = "Yes",
    limit: int = 8,
) -> list[dict]:
    df = catalog()
    city, locality = parse_location(location)
    location_lower = location.lower()
    locality_specified = locality.lower() not in {"raipur", "bhilai"} and locality.lower() in location_lower

    scored = []
    for _, row in df.iterrows():
        score = 0
        if row["city"].lower() == city.lower():
            score += 30
        if locality_specified and row["locality"].lower() == locality.lower():
            score += 15
        if int(row["bhk"]) == int(bhk):
            score += 25
        if row["rent"] <= budget:
            score += 20
            leftover = max(budget - row["rent"], 0)
            score += min(8, int(leftover / 4000))
        elif row["rent"] <= budget * 1.08:
            score += 8
        if row["area_sqft"] >= min_area:
            score += 10
        if str(row["furnishing"]) == furnishing:
            score += 10
        if str(row["parking"]) == parking:
            score += 5
        if row["status"] == "Underpriced":
            score += 8
        elif row["status"] == "Overpriced":
            score -= 12

        score = int(max(0, min(score, 100)))
        if score < 35:
            continue
        item = listing_to_dict(row)
        item["match"] = score
        scored.append(item)

    scored.sort(key=lambda item: (item["match"], item["fair_rent"] - item["rent"]), reverse=True)
    return scored[:limit]
