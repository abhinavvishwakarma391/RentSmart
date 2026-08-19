import sys
from pathlib import Path
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Ensure backend directory is in sys.path
BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app import models, schemas, database
from ml.listings import compare_properties, list_properties, recommend_properties
from ml.market import market_stats
from ml.predict import predict_rent

# Create tables in the database automatically on startup
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="RentSmart API",
    description="AI-powered Rental Price Intelligence & Market Analytics Platform",
    version="1.0.0",
)

# Configure flexible CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "name": "RentSmart API",
        "status": "online",
        "message": "RentSmart Rental Price Intelligence Backend is running.",
        "version": "1.0.0",
    }


@app.post("/properties/", response_model=schemas.Property)
def create_property(prop: schemas.PropertyCreate, db: Session = Depends(database.get_db)):
    """Create a new property listing with automatic AI fair-rent calculation."""
    prop_data = prop.model_dump()

    # Calculate fair rent using ML model if available
    try:
        prediction = predict_rent(
            location=prop_data.get("location", ""),
            city=prop_data.get("city", "Raipur"),
            locality=prop_data.get("locality", ""),
            property_type=prop_data.get("property_type", "Apartment"),
            bhk=prop_data.get("bhk", 2),
            area_sqft=prop_data.get("area_sqft", 900),
            bathrooms=prop_data.get("bathrooms", 2),
            furnishing=prop_data.get("furnishing", "Semi-Furnished"),
            parking=prop_data.get("parking", "Yes"),
            listed_rent=prop_data.get("rent"),
        )
        prop_data["fair_rent"] = prediction.get("predicted_rent")
        prop_data["status"] = prediction.get("status")
        prop_data["status_label"] = "Good Value" if prediction.get("status") == "Underpriced" else (
            "Overpriced" if prediction.get("status") == "Overpriced" else "Fair Price"
        )
        prop_data["difference"] = prediction.get("difference")
        prop_data["difference_pct"] = prediction.get("difference_pct")
    except Exception:
        pass

    db_prop = models.Property(**prop_data)
    db.add(db_prop)
    db.commit()
    db.refresh(db_prop)
    return db_prop


@app.get("/properties/", response_model=list[schemas.Property])
def read_properties(
    city: str | None = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db),
):
    """Retrieve property listings stored in the SQL database."""
    query = db.query(models.Property)
    if city:
        query = query.filter(models.Property.city.ilike(f"%{city}%"))
    return query.offset(skip).limit(limit).all()


@app.post("/api/predict", response_model=schemas.RentPredictResponse)
def predict_fair_rent(payload: schemas.RentPredictRequest):
    """Predict fair rental price based on property parameters using trained ML model."""
    try:
        return predict_rent(
            location=payload.location,
            city=payload.city,
            locality=payload.locality,
            property_type=payload.property_type,
            bhk=payload.bhk,
            area_sqft=payload.area_sqft,
            bathrooms=payload.bathrooms,
            furnishing=payload.furnishing,
            parking=payload.parking,
            listed_rent=payload.listed_rent,
        )
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@app.get("/api/listings", response_model=list[schemas.Listing])
def get_listings(city: str | None = None, limit: int = 18):
    """Retrieve catalog listings with live AI fair rent evaluation."""
    try:
        return list_properties(city=city, limit=min(max(limit, 1), 40))
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@app.post("/api/compare", response_model=schemas.CompareResponse)
def compare_listings(payload: schemas.CompareRequest):
    """Compare selected properties side-by-side with AI value analysis."""
    try:
        return compare_properties(payload.ids)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/api/recommend", response_model=list[schemas.Listing])
def recommend_listings(payload: schemas.RecommendRequest):
    """Recommend best matched properties based on user preferences and budget."""
    try:
        return recommend_properties(
            location=payload.location,
            budget=payload.budget,
            bhk=payload.bhk,
            min_area=payload.min_area,
            furnishing=payload.furnishing,
            parking=payload.parking,
        )
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc


@app.get("/api/market", response_model=schemas.MarketResponse)
def get_market(city: str = "Raipur"):
    """Get market statistics, locality distributions, and OpenStreetMap data points."""
    try:
        return market_stats(city=city)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc