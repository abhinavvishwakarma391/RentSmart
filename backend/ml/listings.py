from functools import lru_cache

import numpy as np
import pandas as pd

from .predict import classify_price, load_model, parse_location
from .preprocess import FEATURES, clean_rentals, load_raw


# ============================================================
# STATUS LABEL
# ============================================================

def _status_label(status: str) -> str:
    if status == "Underpriced":
        return "Good Value"

    if status == "Overpriced":
        return "Overpriced"

    return "Fair Price"


# ============================================================
# FURNISHING NORMALIZER
# ============================================================

def _normalize_furnishing(value: str) -> str:
    """
    Normalize the furnishing selected by the user so that
    comparisons are consistent with the cleaned dataset.
    """

    value = str(value or "").strip().lower()

    furnishing_map = {
        "furnished": "Furnished",

        "semi-furnished": "Semi-Furnished",
        "semi furnished": "Semi-Furnished",
        "semifurnished": "Semi-Furnished",

        "unfurnished": "Unfurnished",
    }

    return furnishing_map.get(
        value,
        str(value).strip().title(),
    )


# ============================================================
# PARKING NORMALIZER
# ============================================================

def _normalize_parking(value: str) -> str:
    """
    Normalize parking input.
    """

    value = str(value or "").strip().lower()

    if value in {
        "yes",
        "y",
        "true",
        "1",
    }:
        return "Yes"

    if value in {
        "no",
        "n",
        "false",
        "0",
    }:
        return "No"

    return str(value).strip().title()


# ============================================================
# LOAD RENTAL CATALOG
# ============================================================

@lru_cache(maxsize=1)
def catalog() -> pd.DataFrame:

    df = clean_rentals(
        load_raw()
    ).copy()

    model = load_model()

    preds = model.predict(
        df[FEATURES]
    )

    fair = np.maximum(
        2500,
        np.round(preds / 100) * 100
    ).astype(int)

    df["fair_rent"] = fair


    # ========================================================
    # PRICE CLASSIFICATION
    # ========================================================

    labels = []

    for listed, predicted in zip(
        df["rent"],
        df["fair_rent"]
    ):

        info = classify_price(
            float(listed),
            float(predicted)
        )

        labels.append(info)


    df["status"] = [
        item["status"]
        for item in labels
    ]

    df["status_label"] = (
        df["status"]
        .map(_status_label)
    )

    df["difference"] = [
        item["difference"]
        for item in labels
    ]

    df["difference_pct"] = [
        item["difference_pct"]
        for item in labels
    ]


    # ========================================================
    # VALUE SCORE
    # ========================================================

    df["value_score"] = (
        df["fair_rent"] - df["rent"]
    ) / df["fair_rent"].clip(
        lower=1
    )


    # ========================================================
    # STATUS RANK
    # ========================================================

    df["status_rank"] = df["status"].map(
        {
            "Underpriced": 0,
            "Fair": 1,
            "Overpriced": 2,
        }
    )

    return df


# ============================================================
# CONVERT LISTING TO API DICTIONARY
# ============================================================

def listing_to_dict(row: pd.Series) -> dict:

    return {

        "id":
            int(row["id"]),

        "name":
            str(row["title"]),

        "city":
            str(row["city"]),

        "locality":
            str(row["locality"]),

        "location":
            f"{row['locality']}, {row['city']}",

        "property_type":
            str(row["property_type"]),

        "bhk":
            int(row["bhk"]),

        "area":
            int(row["area_sqft"]),

        "bathrooms":
            int(row["bathrooms"]),

        "furnishing":
            str(row["furnishing"]),

        "parking":
            str(row["parking"]),

        "rent":
            int(row["rent"]),

        "fair_rent":
            int(row["fair_rent"]),

        "status":
            str(row["status"]),

        "status_label":
            str(row["status_label"]),

        "difference":
            int(row["difference"]),

        "difference_pct":
            float(row["difference_pct"]),

        "latitude":
            (
                float(row["latitude"])
                if "latitude" in row
                and pd.notna(row["latitude"])
                else None
            ),

        "longitude":
            (
                float(row["longitude"])
                if "longitude" in row
                and pd.notna(row["longitude"])
                else None
            ),
    }


# ============================================================
# LIST PROPERTIES
# ============================================================

def list_properties(
    city: str | None = None,
    limit: int = 18,
) -> list[dict]:

    df = catalog()

    if city:

        resolved_city, _ = parse_location(
            city
        )

        city_rows = df[
            df["city"].str.lower()
            == resolved_city.lower()
        ]

        if not city_rows.empty:
            df = city_rows


    # ========================================================
    # RANK AVAILABLE PROPERTIES
    # ========================================================

    ranked = df.sort_values(
        [
            "status_rank",
            "value_score",
        ],
        ascending=[
            True,
            False,
        ],
    )


    picked = []

    seen_localities = set()


    # ========================================================
    # FIRST PICK ONE PROPERTY PER LOCALITY
    # ========================================================

    for _, row in ranked.iterrows():

        key = (
            row["city"],
            row["locality"],
        )

        if key in seen_localities:
            continue

        seen_localities.add(key)

        picked.append(
            listing_to_dict(row)
        )

        if len(picked) >= limit:
            return picked


    # ========================================================
    # FILL REMAINING RESULTS
    # ========================================================

    for _, row in ranked.iterrows():

        item = listing_to_dict(
            row
        )

        if any(
            existing["id"] == item["id"]
            for existing in picked
        ):
            continue

        picked.append(item)

        if len(picked) >= limit:
            break

    return picked


# ============================================================
# COMPARE PROPERTIES
# ============================================================

def compare_properties(
    ids: list[int],
) -> dict:

    if len(ids) < 2:
        raise ValueError(
            "Select at least two properties to compare."
        )

    if len(ids) > 3:
        raise ValueError(
            "Compare up to 3 properties at a time."
        )


    df = catalog()

    selected = df[
        df["id"].isin(ids)
    ].copy()


    if selected.empty:
        raise ValueError(
            "None of the selected properties were found."
        )


    ordered = []


    for prop_id in ids:

        match = selected[
            selected["id"] == prop_id
        ]

        if match.empty:
            continue

        ordered.append(
            listing_to_dict(
                match.iloc[0]
            )
        )


    if len(ordered) < 2:
        raise ValueError(
            "At least two valid properties are required."
        )


    # ========================================================
    # FIND BEST VALUE
    # ========================================================

    best = max(
        ordered,
        key=lambda item:
            item["fair_rent"] - item["rent"]
    )


    return {

        "properties":
            ordered,

        "best": {

            "id":
                best["id"],

            "name":
                best["name"],

            "reason":
                (
                    f"{best['name']} is the strongest value: "
                    f"listed rent Rs {best['rent']:,} "
                    f"vs fair rent Rs {best['fair_rent']:,}."
                ),
        },
    }


# ============================================================
# RECOMMEND PROPERTIES
# ============================================================

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


    # ========================================================
    # NORMALIZE USER INPUT
    # ========================================================

    city, locality = parse_location(
        location
    )

    requested_furnishing = (
        _normalize_furnishing(
            furnishing
        )
    )

    requested_parking = (
        _normalize_parking(
            parking
        )
    )

    budget = float(
        budget or 0
    )

    bhk = int(
        bhk or 0
    )

    min_area = float(
        min_area or 0
    )


    # ========================================================
    # LOCALITY CHECK
    # ========================================================

    location_lower = str(
        location or ""
    ).lower()

    locality_lower = str(
        locality or ""
    ).lower()


    locality_specified = (
        bool(locality_lower)
        and locality_lower
        not in {
            "raipur",
            "bhilai",
        }
        and locality_lower
        in location_lower
    )


    # ========================================================
    # SCORED RESULTS
    # ========================================================

    scored = []


    # ========================================================
    # PROCESS EACH PROPERTY
    # ========================================================

    for _, row in df.iterrows():


        # ====================================================
        # IMPORTANT FIX:
        #
        # FURNISHING IS NOW A HARD FILTER.
        #
        # The old code only gave +10 points for a matching
        # furnishing type. That allowed Unfurnished properties
        # to still rank above Furnished properties.
        #
        # Now wrong furnishing properties are completely
        # removed before scoring.
        # ====================================================

        property_furnishing = (
            _normalize_furnishing(
                row["furnishing"]
            )
        )

        if (
            property_furnishing
            != requested_furnishing
        ):
            continue


        # ====================================================
        # PROPERTY PARKING
        # ====================================================

        property_parking = (
            _normalize_parking(
                row["parking"]
            )
        )


        # ====================================================
        # START MATCH SCORE
        # ====================================================

        score = 0


        # ====================================================
        # CITY MATCH
        # ====================================================

        if (
            str(row["city"]).lower()
            == str(city).lower()
        ):

            score += 30


        # ====================================================
        # LOCALITY MATCH
        # ====================================================

        if locality_specified:

            if (
                str(row["locality"]).lower()
                == locality_lower
            ):

                score += 15


        # ====================================================
        # BHK MATCH
        # ====================================================

        if (
            int(row["bhk"])
            == int(bhk)
        ):

            score += 25


        # ====================================================
        # BUDGET MATCH
        # ====================================================

        if (
            float(row["rent"])
            <= budget
        ):

            score += 20


            leftover = max(
                budget
                - float(row["rent"]),
                0,
            )


            score += min(
                8,
                int(
                    leftover / 4000
                ),
            )


        elif (
            float(row["rent"])
            <= budget * 1.08
        ):

            score += 8


        # ====================================================
        # AREA MATCH
        # ====================================================

        if (
            float(row["area_sqft"])
            >= min_area
        ):

            score += 10


        # ====================================================
        # FURNISHING MATCH
        #
        # Since wrong furnishing types were already filtered
        # above, this is guaranteed to match.
        # ====================================================

        if (
            property_furnishing
            == requested_furnishing
        ):

            score += 10


        # ====================================================
        # PARKING MATCH
        # ====================================================

        if (
            property_parking
            == requested_parking
        ):

            score += 5


        # ====================================================
        # PROPERTY VALUE
        # ====================================================

        if (
            row["status"]
            == "Underpriced"
        ):

            score += 8


        elif (
            row["status"]
            == "Overpriced"
        ):

            score -= 12


        # ====================================================
        # KEEP SCORE BETWEEN 0 AND 100
        # ====================================================

        score = int(
            max(
                0,
                min(
                    score,
                    100,
                ),
            )
        )


        # ====================================================
        # REMOVE VERY WEAK MATCHES
        # ====================================================

        if score < 35:
            continue


        # ====================================================
        # CREATE API RESULT
        # ====================================================

        item = listing_to_dict(
            row
        )

        item["match"] = score

        scored.append(
            item
        )


    # ========================================================
    # BEST MATCH SORTING
    # ========================================================

    scored.sort(
        key=lambda item: (
            item["match"],

            item["fair_rent"]
            - item["rent"],
        ),

        reverse=True,
    )


    # ========================================================
    # RETURN TOP RESULTS
    # ========================================================

    return scored[:limit]