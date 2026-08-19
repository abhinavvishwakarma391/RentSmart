from .listings import catalog
from .predict import parse_location


def _locality_status(avg_rent: float, city_median: float) -> str:
    if avg_rent >= city_median * 1.12:
        return "Premium"
    if avg_rent <= city_median * 0.88:
        return "Affordable"
    return "Stable"


def _city_change_vs_peer(avg_rent: float, peer_avg: float) -> float:
    if not peer_avg:
        return 0.0
    return round(((avg_rent - peer_avg) / peer_avg) * 100, 1)


def market_stats(city: str | None = "Raipur") -> dict:
    df = catalog()
    all_df = df.copy()
    resolved_city, _ = parse_location(city or "Raipur")
    city_df = df[df["city"].str.lower() == resolved_city.lower()].copy()

    if city_df.empty:
        city_df = all_df[all_df["city"].str.lower() == "raipur"].copy()
        resolved_city = "Raipur"

    peer_df = all_df[all_df["city"].str.lower() != resolved_city.lower()]
    peer_avg = float(peer_df["rent"].mean()) if not peer_df.empty else float(city_df["rent"].mean())

    avg_rent = float(city_df["rent"].mean())
    median_rent = float(city_df["rent"].median())
    avg_price_per_sqft = round(float((city_df["rent"] / city_df["area_sqft"]).mean()), 2)

    locality_stats = (
        city_df.groupby("locality")
        .agg(
            avg_rent=("rent", "mean"),
            count=("rent", "count"),
            latitude=("latitude", "mean"),
            longitude=("longitude", "mean"),
        )
        .reset_index()
        .sort_values("avg_rent", ascending=False)
    )

    most_affordable = locality_stats.sort_values("avg_rent").iloc[0]
    premium_locality = locality_stats.iloc[0]

    localities = []
    for _, row in locality_stats.iterrows():
        avg = float(row["avg_rent"])
        localities.append(
            {
                "name": str(row["locality"]),
                "avg_rent": int(round(avg)),
                "count": int(row["count"]),
                "change_pct": _city_change_vs_peer(avg, avg_rent),
                "status": _locality_status(avg, median_rent),
            }
        )

    bhk_breakdown = []
    for bhk, group in city_df.groupby("bhk"):
        bhk_breakdown.append(
            {
                "bhk": int(bhk),
                "label": f"{int(bhk)} BHK",
                "avg_rent": int(round(group["rent"].mean())),
                "count": int(len(group)),
            }
        )
    bhk_breakdown.sort(key=lambda item: item["bhk"])

    furnishing_breakdown = []
    for furnishing, group in city_df.groupby("furnishing"):
        furnishing_breakdown.append(
            {
                "furnishing": str(furnishing),
                "avg_rent": int(round(group["rent"].mean())),
                "count": int(len(group)),
            }
        )
    furnishing_breakdown.sort(key=lambda item: item["avg_rent"], reverse=True)

    city_comparison = []
    for city_name, group in all_df.groupby("city"):
        city_comparison.append(
            {
                "city": str(city_name),
                "avg_rent": int(round(group["rent"].mean())),
                "median_rent": int(round(group["rent"].median())),
                "count": int(len(group)),
            }
        )
    city_comparison.sort(key=lambda item: item["avg_rent"], reverse=True)

    map_points = []
    for _, row in locality_stats.iterrows():
        map_points.append(
            {
                "locality": str(row["locality"]),
                "city": resolved_city,
                "avg_rent": int(round(float(row["avg_rent"]))),
                "count": int(row["count"]),
                "latitude": round(float(row["latitude"]), 6),
                "longitude": round(float(row["longitude"]), 6),
            }
        )

    value = city_df.assign(rent_per_sqft=city_df["rent"] / city_df["area_sqft"])
    bhk_value = (
        value.groupby("bhk")
        .agg(avg_rent=("rent", "mean"), avg_area=("area_sqft", "mean"), rent_per_sqft=("rent_per_sqft", "mean"))
        .reset_index()
        .sort_values("rent_per_sqft", ascending=False)
    )
    best_bhk = int(bhk_value.iloc[0]["bhk"])
    insight = {
        "title": f"{best_bhk} BHK properties currently offer the best balance of price and space in {resolved_city}.",
        "body": (
            f"Based on {len(city_df)} listings, {best_bhk} BHK homes deliver more usable area per rupee "
            f"than other configurations, with an average rent of Rs {int(round(bhk_value.iloc[0]['avg_rent'])):,}."
        ),
    }

    return {
        "city": resolved_city,
        "summary": {
            "avg_rent": int(round(avg_rent)),
            "median_rent": int(round(median_rent)),
            "avg_price_per_sqft": avg_price_per_sqft,
            "listing_count": int(len(city_df)),
            "peer_change_pct": _city_change_vs_peer(avg_rent, peer_avg),
            "most_affordable_locality": {
                "name": str(most_affordable["locality"]),
                "avg_rent": int(round(float(most_affordable["avg_rent"]))),
            },
            "premium_locality": {
                "name": str(premium_locality["locality"]),
                "avg_rent": int(round(float(premium_locality["avg_rent"]))),
            },
        },
        "bhk_breakdown": bhk_breakdown,
        "furnishing_breakdown": furnishing_breakdown,
        "localities": localities,
        "city_comparison": city_comparison,
        "map_points": map_points,
        "insight": insight,
    }
