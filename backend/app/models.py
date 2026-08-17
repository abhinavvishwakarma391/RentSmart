from sqlalchemy import Column, Integer, String, Float
from .database import Base

class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    location = Column(String(255), index=True)
    bhk = Column(Integer)
    area_sqft = Column(Float)
    price = Column(Float)
    property_type = Column(String(100))