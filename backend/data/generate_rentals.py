"""Generate a Raipur + Bhilai rental dataset from published 2026 market ranges."""

import csv
import random
from pathlib import Path

random.seed(42)

# 2BHK typical rent midpoints from MagicBricks / NoBroker / 99acres summaries (2026).
RAIPUR = [
    ("Shankar Nagar", 20000, 21.2514, 81.6296),
    ("Civil Lines", 22000, 21.2497, 81.6089),
    ("Telibandha", 20000, 21.2411, 81.6615),
    ("Avanti Vihar", 18500, 21.2365, 81.6502),
    ("Devendra Nagar", 18500, 21.2519, 81.6412),
    ("Pandri", 17500, 21.2578, 81.6354),
    ("Saddu", 16500, 21.2734, 81.6688),
    ("Kabir Nagar", 16000, 21.2458, 81.6184),
    ("Mowa", 15500, 21.2712, 81.6921),
    ("Katora Talab", 15500, 21.2398, 81.6227),
    ("Kachna", 17000, 21.2689, 81.6550),
    ("Sarona", 14500, 21.2284, 81.5987),
    ("Naya Raipur", 17500, 21.1610, 81.7870),
    ("Magneto Mall Area", 19000, 21.2415, 81.6538),
    ("Vidhan Sabha Road", 18000, 21.2550, 81.6140),
]

BHILAI = [
    ("Smriti Nagar", 7500, 21.2090, 81.3785),
    ("Risali", 11500, 21.1864, 81.3502),
    ("Maitri Nagar", 12000, 21.1902, 81.3488),
    ("Supela", 8000, 21.1936, 81.3148),
    ("Nehru Nagar", 9000, 21.1930, 81.3508),
    ("Junwani", 8500, 21.2168, 81.3654),
    ("Sector 5", 9500, 21.1938, 81.3422),
    ("Sector 7", 10000, 21.1912, 81.3376),
    ("Sector 9", 10500, 21.1884, 81.3310),
    ("Kohka", 7000, 21.2055, 81.3920),
    ("Shanti Nagar", 8000, 21.1988, 81.3612),
    ("Charoda", 6500, 21.2340, 81.4180),
    ("Civic Centre", 11000, 21.1905, 81.2845),
    ("Power House", 9000, 21.2098, 81.3194),
]

BHK_AREA = {
    1: (450, 700),
    2: (750, 1200),
    3: (1100, 1800),
    4: (1600, 2400),
}

BHK_RENT_MULT = {1: 0.62, 2: 1.0, 3: 1.48, 4: 2.05}
BHK_WEIGHTS = [1, 2, 2, 3, 3, 2, 4]
PROPERTY_TYPES = ["Apartment", "Apartment", "Apartment", "Independent House"]
FURNISHING = ["Unfurnished", "Semi-Furnished", "Furnished"]
FURNISH_MULT = {"Unfurnished": 0.92, "Semi-Furnished": 1.0, "Furnished": 1.14}


def jitter(lat, lon):
    return round(lat + random.uniform(-0.008, 0.008), 6), round(
        lon + random.uniform(-0.008, 0.008), 6
    )


def make_row(city, locality, base_2bhk, lat, lon, idx):
    bhk = random.choice(BHK_WEIGHTS)
    area_lo, area_hi = BHK_AREA[bhk]
    area = random.randint(area_lo, area_hi)
    bathrooms = max(1, min(bhk, random.choice([bhk - 1, bhk, bhk, bhk])))
    property_type = random.choice(PROPERTY_TYPES)
    furnishing = random.choices(FURNISHING, weights=[35, 45, 20])[0]
    parking = random.choices(["Yes", "No"], weights=[70, 30])[0]

    rent = base_2bhk * BHK_RENT_MULT[bhk]
    rent *= area / ((area_lo + area_hi) / 2)
    rent *= FURNISH_MULT[furnishing]
    if parking == "Yes":
        rent *= 1.04
    if property_type == "Independent House":
        rent *= 1.06
    rent *= random.uniform(0.88, 1.12)
    rent = int(round(rent / 100) * 100)
    rent = max(2500, rent)

    title = f"{bhk} BHK {property_type} in {locality}"
    lat, lon = jitter(lat, lon)

    return {
        "id": idx,
        "title": title,
        "city": city,
        "locality": locality,
        "property_type": property_type,
        "bhk": bhk,
        "area_sqft": area,
        "bathrooms": bathrooms,
        "furnishing": furnishing,
        "parking": parking,
        "rent": rent,
        "latitude": lat,
        "longitude": lon,
    }


def main():
    rows = []
    idx = 1
    for locality, base, lat, lon in RAIPUR:
        for _ in range(22):
            rows.append(make_row("Raipur", locality, base, lat, lon, idx))
            idx += 1
    for locality, base, lat, lon in BHILAI:
        for _ in range(18):
            rows.append(make_row("Bhilai", locality, base, lat, lon, idx))
            idx += 1

    random.shuffle(rows)
    for i, row in enumerate(rows, start=1):
        row["id"] = i

    out = Path(__file__).with_name("raipur_bhilai_rentals.csv")
    fieldnames = [
        "id",
        "title",
        "city",
        "locality",
        "property_type",
        "bhk",
        "area_sqft",
        "bathrooms",
        "furnishing",
        "parking",
        "rent",
        "latitude",
        "longitude",
    ]
    with out.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    raipur = sum(1 for r in rows if r["city"] == "Raipur")
    bhilai = sum(1 for r in rows if r["city"] == "Bhilai")
    print(f"Wrote {len(rows)} rows -> {out}")
    print(f"Raipur: {raipur} | Bhilai: {bhilai}")
    print(f"Rent range: {min(r['rent'] for r in rows)} - {max(r['rent'] for r in rows)}")


if __name__ == "__main__":
    main()
