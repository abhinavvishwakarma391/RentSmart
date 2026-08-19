import json
import pandas as pd

from .preprocess import ARTIFACTS_DIR, clean_rentals, load_raw


def summarize(df: pd.DataFrame) -> dict:
    by_city = (
        df.groupby("city")["rent"]
        .agg(count="count", avg_rent="mean", median_rent="median", min_rent="min", max_rent="max")
        .round(0)
        .reset_index()
        .to_dict(orient="records")
    )
    by_locality = (
        df.groupby(["city", "locality"])["rent"]
        .agg(count="count", avg_rent="mean")
        .round(0)
        .reset_index()
        .sort_values("avg_rent", ascending=False)
        .to_dict(orient="records")
    )
    by_bhk = (
        df.groupby(["city", "bhk"])["rent"]
        .agg(count="count", avg_rent="mean", avg_area="mean")
        .round(0)
        .reset_index()
        .to_dict(orient="records")
    )

    numeric = df[["bhk", "area_sqft", "bathrooms", "rent"]].corr().round(3)
    return {
        "rows": int(len(df)),
        "cities": by_city,
        "top_localities": by_locality[:12],
        "rent_by_bhk": by_bhk,
        "correlation": numeric.to_dict(),
        "furnishing_avg_rent": (
            df.groupby("furnishing")["rent"].mean().round(0).to_dict()
        ),
    }


def run_eda() -> dict:
    raw = load_raw()
    cleaned = clean_rentals(raw)
    summary = summarize(cleaned)
    summary["raw_rows"] = int(len(raw))
    summary["cleaned_rows"] = int(len(cleaned))

    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    out_path = ARTIFACTS_DIR / "eda_summary.json"
    out_path.write_text(json.dumps(summary, indent=2), encoding="utf-8")

    print("=== RentSmart EDA ===")
    print(f"Raw rows: {summary['raw_rows']} | Cleaned rows: {summary['cleaned_rows']}")
    print("\nAverage rent by city:")
    for row in summary["cities"]:
        print(
            f"  {row['city']}: avg Rs {int(row['avg_rent']):,} "
            f"(n={int(row['count'])}, median Rs {int(row['median_rent']):,})"
        )
    print("\nHighest-rent localities:")
    for row in summary["top_localities"][:8]:
        print(
            f"  {row['city']} / {row['locality']}: avg Rs {int(row['avg_rent']):,}"
        )
    print(f"\nSaved {out_path}")
    return summary


if __name__ == "__main__":
    run_eda()
