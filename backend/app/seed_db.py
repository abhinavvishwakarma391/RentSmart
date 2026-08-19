"""Seed SQLite/MySQL database with rental listings and ML-evaluated fair rents."""

import os
import sys
from pathlib import Path

# Ensure backend root is on Python path
BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import pandas as pd
from app.database import Base, SessionLocal, engine
from app.models import Property
from ml.listings import catalog


def seed_database(force: bool = False):
    if force:
        print("Dropping existing tables for schema update...")
        Base.metadata.drop_all(bind=engine)

    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        existing_count = db.query(Property).count()
        if existing_count > 0 and not force:
            print(f"Database already contains {existing_count} properties. Skipping seed. (Use force=True to re-seed)")
            return

        if force and existing_count > 0:
            print(f"Clearing {existing_count} existing properties...")
            db.query(Property).delete()
            db.commit()

        print("Loading and evaluating rental catalog with ML model...")
        df = catalog()

        print(f"Seeding {len(df)} properties into database...")
        properties = []
        for _, row in df.iterrows():
            prop = Property(
                id=int(row["id"]),
                title=str(row["title"]),
                city=str(row["city"]),
                locality=str(row["locality"]),
                location=f"{row['locality']}, {row['city']}",
                property_type=str(row["property_type"]),
                bhk=int(row["bhk"]),
                area_sqft=float(row["area_sqft"]),
                bathrooms=int(row["bathrooms"]),
                furnishing=str(row["furnishing"]),
                parking=str(row["parking"]),
                rent=float(row["rent"]),
                fair_rent=float(row["fair_rent"]) if "fair_rent" in row else None,
                status=str(row["status"]) if "status" in row else None,
                status_label=str(row["status_label"]) if "status_label" in row else None,
                difference=float(row["difference"]) if "difference" in row else None,
                difference_pct=float(row["difference_pct"]) if "difference_pct" in row else None,
                latitude=float(row["latitude"]) if "latitude" in row and pd.notna(row["latitude"]) else None,
                longitude=float(row["longitude"]) if "longitude" in row and pd.notna(row["longitude"]) else None,
            )
            properties.append(prop)

        db.bulk_save_objects(properties)
        db.commit()
        print(f"Successfully seeded {len(properties)} properties into the database!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    force_seed = "--force" in sys.argv
    seed_database(force=force_seed)
