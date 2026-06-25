from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import SessionLocal, engine, Base
from models import Application, Reminder, User
from schemas import UserCreate, UserLogin
from security import hash_password, verify_password, create_access_token
from auth import get_current_user


app = FastAPI()

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
def get_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Application).filter(
        Application.user_id == current_user.id
    ).all()


@app.post("/applications")
def create_application(
    application: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_application = Application(
        company=application.company,
        position=application.position,
        status=application.status,
        date_applied=application.date_applied,
        user_id=current_user.id
    )

    db.add(new_application)
    db.commit()
    db.refresh(new_application)

    return new_application


@app.put("/applications/{application_id}")
def update_application(
    application_id: int,
    updated_application: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == current_user.id
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
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == current_user.id
    ).first()

    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")

    db.delete(application)
    db.commit()

    return {"message": "Application deleted"}


@app.get("/applications/{application_id}/reminders")
def get_application_reminders(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == current_user.id
    ).first()

    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")

    reminders = db.query(Reminder).filter(
        Reminder.application_id == application_id
    ).all()

    return reminders


@app.post("/reminders")
def create_reminder(
    reminder: ReminderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    application = db.query(Application).filter(
        Application.id == reminder.application_id,
        Application.user_id == current_user.id
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
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    reminder = db.query(Reminder).join(Application).filter(
        Reminder.id == reminder_id,
        Application.user_id == current_user.id
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
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    reminder = db.query(Reminder).join(Application).filter(
        Reminder.id == reminder_id,
        Application.user_id == current_user.id
    ).first()

    if reminder is None:
        raise HTTPException(status_code=404, detail="Reminder not found")

    db.delete(reminder)
    db.commit()

    return {"message": "Reminder deleted"}


@app.get("/reminders")
def get_reminders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    reminders = db.query(Reminder).join(Application).filter(
        Application.user_id == current_user.id
    ).all()

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


@app.post("/auth/register")
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=user.email,
        hashed_password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"id": new_user.id, "email": new_user.email}


@app.post("/auth/login")
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if existing_user is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(form_data.password, existing_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(
        {"sub": existing_user.email}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@app.get("/me")
def get_me(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "email": current_user.email
    }