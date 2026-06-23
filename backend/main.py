from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import SessionLocal, engine, Base
from models import Application, Reminder

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


class ReminderCreate(BaseModel):
    application_id: int
    title: str
    due_date: str
    completed: bool = False
    notes: str | None = None


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


@app.get("/applications/{application_id}/reminders")
def get_application_reminders(
    application_id: int,
    db: Session = Depends(get_db)
):
    reminders = db.query(Reminder).filter(
        Reminder.application_id == application_id
    ).all()

    return reminders


@app.post("/reminders")
def create_reminder(
    reminder: ReminderCreate,
    db: Session = Depends(get_db)
):
    application = db.query(Application).filter(
        Application.id == reminder.application_id
    ).first()

    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")

    new_reminder = Reminder(
        application_id=reminder.application_id,
        title=reminder.title,
        due_date=reminder.due_date,
        completed=reminder.completed,
        notes=reminder.notes
    )

    db.add(new_reminder)
    db.commit()
    db.refresh(new_reminder)

    return new_reminder


@app.put("/reminders/{reminder_id}/complete")
def complete_reminder(
    reminder_id: int,
    db: Session = Depends(get_db)
):
    reminder = db.query(Reminder).filter(
        Reminder.id == reminder_id
    ).first()

    if reminder is None:
        raise HTTPException(status_code=404, detail="Reminder not found")

    reminder.completed = True

    db.commit()
    db.refresh(reminder)

    return reminder


@app.delete("/reminders/{reminder_id}")
def delete_reminder(
    reminder_id: int,
    db: Session = Depends(get_db)
):
    reminder = db.query(Reminder).filter(
        Reminder.id == reminder_id
    ).first()

    if reminder is None:
        raise HTTPException(status_code=404, detail="Reminder not found")

    db.delete(reminder)
    db.commit()

    return {"message": "Reminder deleted"}


@app.get("/reminders")
def get_reminders(db: Session = Depends(get_db)):
    reminders = db.query(Reminder).all()

    return [
        {
            "id": reminder.id,
            "application_id": reminder.application_id,
            "title": reminder.title,
            "due_date": reminder.due_date,
            "completed": reminder.completed,
            "notes": reminder.notes,
            "company": reminder.application.company,
            "position": reminder.application.position
        }
        for reminder in reminders
    ]