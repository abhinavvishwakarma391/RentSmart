from sqlalchemy import Column, Integer, String, Float
from .database import Base

class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    city = Column(String(100), index=True, default="Raipur")
    locality = Column(String(100), index=True)
    location = Column(String(255), index=True)
    property_type = Column(String(100), default="Apartment")
    bhk = Column(Integer, default=2)
    area_sqft = Column(Float, default=900.0)
    bathrooms = Column(Integer, default=2)
    furnishing = Column(String(100), default="Semi-Furnished")
    parking = Column(String(50), default="Yes")
    rent = Column(Float)
    fair_rent = Column(Float, nullable=True)
    status = Column(String(50), nullable=True)
    status_label = Column(String(50), nullable=True)
    difference = Column(Float, nullable=True)
    difference_pct = Column(Float, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)