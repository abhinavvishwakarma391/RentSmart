from pydantic import BaseModel

# Schema for creating a new property
class PropertyBase(BaseModel):
    title: str
    location: str
    bhk: int
    area_sqft: float
    price: float
    property_type: str

class PropertyCreate(PropertyBase):
    pass

# Schema for reading property data (the "response")
class Property(PropertyBase):
    id: int

    class Config:
        from_attributes = True  # Allows Pydantic to read from SQLAlchemy objects