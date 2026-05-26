from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import SessionLocal, engine, Base
from models import Application

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://job-tracker-fullstack-three.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ApplicationCreate(BaseModel):
    company: str
    position: str
    status: str
    date_applied: str


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():
    return {"message": "Job Tracker API"}


@app.get("/applications")
def get_applications(db: Session = Depends(get_db)):
    applications = db.query(Application).all()

    return applications


@app.post("/applications")
def create_application(
    application: ApplicationCreate,
    db: Session = Depends(get_db)
):
    new_application = Application(
        company=application.company,
        position=application.position,
        status=application.status,
        date_applied=application.date_applied
    )

    db.add(new_application)
    db.commit()
    db.refresh(new_application)

    return new_application


@app.put("/applications/{application_id}")
def update_application(
    application_id: int,
    updated_application: ApplicationCreate,
    db: Session = Depends(get_db)
):
    application = db.query(Application).filter(
        Application.id == application_id
    ).first()

    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")

    application.company = updated_application.company
    application.position = updated_application.position
    application.status = updated_application.status
    application.date_applied = updated_application.date_applied

    db.commit()
    db.refresh(application)

    return application


@app.delete("/applications/{application_id}")
def delete_application(
    application_id: int,
    db: Session = Depends(get_db)
):
    application = db.query(Application).filter(
        Application.id == application_id
    ).first()

    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")

    db.delete(application)
    db.commit()

    return {"message": "Application deleted"}