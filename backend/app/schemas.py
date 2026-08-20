from pydantic import BaseModel

# Schema for creating a new property
class PropertyBase(BaseModel):
    title: str
    location: str
    city: str = "Raipur"
    locality: str = "Shankar Nagar"
    property_type: str = "Apartment"
    bhk: int = 2
    area_sqft: float = 900.0
    bathrooms: int = 2
    furnishing: str = "Semi-Furnished"
    parking: str = "Yes"
    rent: float

class PropertyCreate(PropertyBase):
    pass

# Schema for reading property data (the "response")
class Property(PropertyBase):
    id: int
    fair_rent: float | None = None
    status: str | None = None
    status_label: str | None = None
    difference: float | None = None
    difference_pct: float | None = None
    latitude: float | None = None
    longitude: float | None = None

    class Config:
        from_attributes = True  # Allows Pydantic to read from SQLAlchemy objects


class RentPredictRequest(BaseModel):
    location: str = ""
    city: str | None = None
    locality: str | None = None
    property_type: str = "Apartment"
    bhk: int = 2
    area_sqft: float = 900
    bathrooms: int = 2
    furnishing: str = "Semi-Furnished"
    parking: str = "Yes"
    listed_rent: float | None = None


class RentPredictResponse(BaseModel):
    city: str
    locality: str
    predicted_rent: int
    min_rent: int
    max_rent: int
    status: str
    listed_rent: int | None = None
    difference: int | None = None
    difference_pct: float | None = None


class Listing(BaseModel):
    id: int
    name: str
    city: str
    locality: str
    location: str
    property_type: str
    bhk: int
    area: int
    bathrooms: int
    furnishing: str
    parking: str
    rent: int
    fair_rent: int
    status: str
    status_label: str
    difference: int
    difference_pct: float
    latitude: float | None = None
    longitude: float | None = None
    match: int | None = None


class CompareRequest(BaseModel):
    ids: list[int]


class CompareBest(BaseModel):
    id: int
    name: str
    reason: str


class CompareResponse(BaseModel):
    properties: list[Listing]
    best: CompareBest


class RecommendRequest(BaseModel):
    location: str = "Raipur"
    budget: float = 15000
    bhk: int = 2
    min_area: float = 900
    furnishing: str = "Furnished"
    parking: str = "Yes"


class MarketLocality(BaseModel):
    name: str
    avg_rent: int
    count: int
    change_pct: float
    status: str


class MarketBhk(BaseModel):
    bhk: int
    label: str
    avg_rent: int
    count: int


class MarketFurnishing(BaseModel):
    furnishing: str
    avg_rent: int
    count: int


class MarketCityComparison(BaseModel):
    city: str
    avg_rent: int
    median_rent: int
    count: int


class MarketMapPoint(BaseModel):
    locality: str
    city: str
    avg_rent: int
    count: int
    latitude: float
    longitude: float


class MarketSummary(BaseModel):
    avg_rent: int
    median_rent: int
    avg_price_per_sqft: float
    listing_count: int
    peer_change_pct: float
    most_affordable_locality: dict
    premium_locality: dict


class MarketInsight(BaseModel):
    title: str
    body: str


class MarketResponse(BaseModel):
    city: str
    summary: MarketSummary
    bhk_breakdown: list[MarketBhk]
    furnishing_breakdown: list[MarketFurnishing]
    localities: list[MarketLocality]
    city_comparison: list[MarketCityComparison]
    map_points: list[MarketMapPoint]
    insight: MarketInsight