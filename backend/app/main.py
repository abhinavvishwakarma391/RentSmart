import sys
from pathlib import Path

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session


# ============================================================
# BACKEND PATH
# ============================================================

BACKEND_DIR = Path(__file__).resolve().parents[1]

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))


# ============================================================
# IMPORTS
# ============================================================

from app import models, schemas, database

from ml.listings import (
    compare_properties,
    list_properties,
    recommend_properties,
)

from ml.market import market_stats
from ml.predict import predict_rent


# ============================================================
# DATABASE
# ============================================================

# Create database tables automatically
models.Base.metadata.create_all(bind=database.engine)


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="RentSmart API",
    description="AI-powered Rental Price Intelligence & Market Analytics Platform",
    version="1.0.0",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def read_root():
    return {
        "name": "RentSmart API",
        "status": "online",
        "message": "RentSmart Rental Price Intelligence Backend is running.",
        "version": "1.0.0",
    }


# ============================================================
# USER REGISTRATION
# ============================================================

@app.post(
    "/api/register",
    response_model=schemas.UserResponse
)
def register_user(
    user: schemas.UserCreate,
    db: Session = Depends(database.get_db),
):
    """
    Create a new RentSmart user account.
    """

    # Clean User ID
    clean_user_id = user.user_id.strip()

    # Validate User ID
    if len(clean_user_id) < 3:
        raise HTTPException(
            status_code=400,
            detail="User ID must contain at least 3 characters.",
        )

    # Validate password
    if len(user.password) < 4:
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least 4 characters.",
        )

    # Check if User ID already exists
    existing_user = (
        db.query(models.User)
        .filter(models.User.user_id == clean_user_id)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User ID already exists.",
        )

    # Create new user
    new_user = models.User(
        user_id=clean_user_id,
        password=user.password,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# ============================================================
# USER LOGIN
# ============================================================

@app.post(
    "/api/login",
    response_model=schemas.UserResponse
)
def login_user(
    user: schemas.UserLogin,
    db: Session = Depends(database.get_db),
):
    """
    Authenticate an existing RentSmart user.
    """

    clean_user_id = user.user_id.strip()

    # Find user
    existing_user = (
        db.query(models.User)
        .filter(models.User.user_id == clean_user_id)
        .first()
    )

    # User doesn't exist
    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid User ID or Password.",
        )

    # Check password
    if existing_user.password != user.password:
        raise HTTPException(
            status_code=401,
            detail="Invalid User ID or Password.",
        )

    # Login successful
    return existing_user


# ============================================================
# PROPERTY CREATION
# ============================================================

@app.post(
    "/properties/",
    response_model=schemas.Property
)
def create_property(
    prop: schemas.PropertyCreate,
    db: Session = Depends(database.get_db),
):
    """
    Create a new property listing with
    automatic AI fair-rent calculation.
    """

    prop_data = prop.model_dump()

    # Calculate fair rent using ML model
    try:

        prediction = predict_rent(
            location=prop_data.get("location", ""),
            city=prop_data.get("city", "Raipur"),
            locality=prop_data.get("locality", ""),
            property_type=prop_data.get(
                "property_type",
                "Apartment"
            ),
            bhk=prop_data.get("bhk", 2),
            area_sqft=prop_data.get(
                "area_sqft",
                900
            ),
            bathrooms=prop_data.get(
                "bathrooms",
                2
            ),
            furnishing=prop_data.get(
                "furnishing",
                "Semi-Furnished"
            ),
            parking=prop_data.get(
                "parking",
                "Yes"
            ),
            listed_rent=prop_data.get("rent"),
        )

        prop_data["fair_rent"] = prediction.get(
            "predicted_rent"
        )

        prop_data["status"] = prediction.get(
            "status"
        )

        prop_data["status_label"] = (
            "Good Value"
            if prediction.get("status") == "Underpriced"
            else (
                "Overpriced"
                if prediction.get("status") == "Overpriced"
                else "Fair Price"
            )
        )

        prop_data["difference"] = prediction.get(
            "difference"
        )

        prop_data["difference_pct"] = prediction.get(
            "difference_pct"
        )

    except Exception:
        pass

    # Create property
    db_prop = models.Property(
        **prop_data
    )

    db.add(db_prop)
    db.commit()
    db.refresh(db_prop)

    return db_prop


# ============================================================
# GET PROPERTIES
# ============================================================

@app.get(
    "/properties/",
    response_model=list[schemas.Property]
)
def read_properties(
    city: str | None = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db),
):
    """
    Retrieve property listings stored
    in the SQL database.
    """

    query = db.query(models.Property)

    if city:
        query = query.filter(
            models.Property.city.ilike(
                f"%{city}%"
            )
        )

    return (
        query
        .offset(skip)
        .limit(limit)
        .all()
    )


# ============================================================
# RENT PREDICTION
# ============================================================

@app.post(
    "/api/predict",
    response_model=schemas.RentPredictResponse
)
def predict_fair_rent(
    payload: schemas.RentPredictRequest,
):
    """
    Predict fair rental price based
    on property parameters.
    """

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

        raise HTTPException(
            status_code=503,
            detail=str(exc) or "Rent prediction model is unavailable.",
        ) from exc

    except OSError as exc:

        raise HTTPException(
            status_code=503,
            detail="Rent prediction model could not be loaded. Please try again later.",
        ) from exc


# ============================================================
# LISTINGS
# ============================================================

@app.get(
    "/api/listings",
    response_model=list[schemas.Listing]
)
def get_listings(
    city: str | None = None,
    limit: int = 18,
):
    """
    Retrieve catalog listings with
    live AI fair-rent evaluation.
    """

    try:

        return list_properties(
            city=city,
            limit=min(
                max(limit, 1),
                40
            ),
        )

    except FileNotFoundError as exc:

        raise HTTPException(
            status_code=503,
            detail=str(exc),
        ) from exc


# ============================================================
# PROPERTY COMPARISON
# ============================================================

@app.post(
    "/api/compare",
    response_model=schemas.CompareResponse
)
def compare_listings(
    payload: schemas.CompareRequest,
):
    """
    Compare selected properties
    side-by-side with AI value analysis.
    """

    try:

        return compare_properties(
            payload.ids
        )

    except FileNotFoundError as exc:

        raise HTTPException(
            status_code=503,
            detail=str(exc),
        ) from exc

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc


# ============================================================
# RECOMMENDATIONS
# ============================================================

@app.post(
    "/api/recommend",
    response_model=list[schemas.Listing]
)
def recommend_listings(
    payload: schemas.RecommendRequest,
):
    """
    Recommend best matched properties
    based on user preferences and budget.
    """

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

        raise HTTPException(
            status_code=503,
            detail=str(exc),
        ) from exc


# ============================================================
# MARKET ANALYSIS
# ============================================================

@app.get(
    "/api/market",
    response_model=schemas.MarketResponse
)
def get_market(
    city: str = "Raipur",
):
    """
    Get market statistics,
    locality distributions,
    and OpenStreetMap data points.
    """

    try:

        return market_stats(
            city=city
        )

    except FileNotFoundError as exc:

        raise HTTPException(
            status_code=503,
            detail=str(exc),
        ) from exc