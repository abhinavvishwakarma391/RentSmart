from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas, database

# This creates the tables in your database automatically when the app starts
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Configure CORS so your React frontend can talk to this backend
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173", # Vite default port (very common for React)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# A route to test if everything is connected
@app.get("/")
def read_root():
    return {"message": "RentSmart Backend is up and running!"}

# A route to add a property to the database
@app.post("/properties/")
def create_property(prop: schemas.PropertyCreate, db: Session = Depends(database.get_db)):
    db_prop = models.Property(**prop.model_dump())
    db.add(db_prop)
    db.commit()
    db.refresh(db_prop)
    return db_prop

# A route to view all properties
@app.get("/properties/", response_model=list[schemas.Property])
def read_properties(db: Session = Depends(database.get_db)):
    properties = db.query(models.Property).all()
    return properties