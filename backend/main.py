from fastapi import Depends, FastAPI, File, HTTPException, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import Application, Reminder, User
from schemas import UserCreate
from security import create_access_token, hash_password, verify_password
from storage import delete_file, download_file, upload_file


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://job-tracker-fullstack-three.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ApplicationCreate(BaseModel):
    company: str
    position: str
    status: str
    platform: str | None = None
    source_url: str | None = None
    date_applied: str


class ReminderCreate(BaseModel):
    application_id: int
    title: str
    due_date: str
    completed: bool = False
    notes: str | None = None


VALID_CV_TYPES = {"primary", "secondary"}


def get_user_application(db: Session, application_id: int, user_id: int) -> Application:
    application = db.query(Application).filter(
        Application.id == application_id,
        Application.user_id == user_id,
    ).first()

    if application is None:
        raise HTTPException(status_code=404, detail="Application not found")

    return application


def get_user_reminder(db: Session, reminder_id: int, user_id: int) -> Reminder:
    reminder = db.query(Reminder).join(Application).filter(
        Reminder.id == reminder_id,
        Application.user_id == user_id,
    ).first()

    if reminder is None:
        raise HTTPException(status_code=404, detail="Reminder not found")

    return reminder


def validate_cv_type(cv_type: str) -> None:
    if cv_type not in VALID_CV_TYPES:
        raise HTTPException(status_code=400, detail="Invalid CV type")


def get_cv_filename(user: User, cv_type: str) -> str | None:
    validate_cv_type(cv_type)

    if cv_type == "primary":
        return user.primary_cv_filename

    return user.secondary_cv_filename


def set_cv_filename(user: User, cv_type: str, filename: str | None) -> None:
    validate_cv_type(cv_type)

    if cv_type == "primary":
        user.primary_cv_filename = filename
        return

    user.secondary_cv_filename = filename


@app.get("/")
def home():
    return {"message": "Job Tracker API"}


@app.get("/applications")
def get_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Application).filter(
        Application.user_id == current_user.id
    ).all()


@app.post("/applications")
def create_application(
    application: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_application = Application(
        company=application.company,
        position=application.position,
        status=application.status,
        platform=application.platform,
        source_url=application.source_url,
        date_applied=application.date_applied,
        user_id=current_user.id,
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
    current_user: User = Depends(get_current_user),
):
    application = get_user_application(db, application_id, current_user.id)

    application.company = updated_application.company
    application.position = updated_application.position
    application.status = updated_application.status
    application.platform = updated_application.platform
    application.source_url = updated_application.source_url
    application.date_applied = updated_application.date_applied

    db.commit()
    db.refresh(application)

    return application


@app.delete("/applications/{application_id}")
def delete_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    application = get_user_application(db, application_id, current_user.id)

    db.delete(application)
    db.commit()

    return {"message": "Application deleted"}


@app.get("/applications/{application_id}/reminders")
def get_application_reminders(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_application(db, application_id, current_user.id)

    return db.query(Reminder).filter(
        Reminder.application_id == application_id
    ).all()


@app.post("/reminders")
def create_reminder(
    reminder: ReminderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_application(db, reminder.application_id, current_user.id)

    new_reminder = Reminder(
        application_id=reminder.application_id,
        title=reminder.title,
        due_date=reminder.due_date,
        completed=reminder.completed,
        notes=reminder.notes,
    )

    db.add(new_reminder)
    db.commit()
    db.refresh(new_reminder)

    return new_reminder


@app.put("/reminders/{reminder_id}/complete")
def complete_reminder(
    reminder_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reminder = get_user_reminder(db, reminder_id, current_user.id)
    reminder.completed = True

    db.commit()
    db.refresh(reminder)

    return reminder


@app.delete("/reminders/{reminder_id}")
def delete_reminder(
    reminder_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reminder = get_user_reminder(db, reminder_id, current_user.id)

    db.delete(reminder)
    db.commit()

    return {"message": "Reminder deleted"}


@app.get("/reminders")
def get_reminders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
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
            "position": reminder.application.position,
        }
        for reminder in reminders
    ]


@app.post("/auth/register")
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=user.email,
        hashed_password=hash_password(user.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"id": new_user.id, "email": new_user.email}


@app.post("/auth/login")
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    existing_user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if existing_user is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(form_data.password, existing_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": existing_user.email})

    return {
        "access_token": token,
        "token_type": "bearer",
    }


@app.get("/profile")
def get_profile(
    current_user: User = Depends(get_current_user),
):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "primary_cv_uploaded": current_user.primary_cv_filename is not None,
        "secondary_cv_uploaded": current_user.secondary_cv_filename is not None,
    }


@app.post("/profile/cv/{cv_type}")
def upload_profile_cv(
    cv_type: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    validate_cv_type(cv_type)

    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    filename = f"user_{current_user.id}/{cv_type}_cv.pdf"
    file_content = file.file.read()

    upload_file(filename, file_content, "application/pdf")
    set_cv_filename(current_user, cv_type, filename)

    db.commit()
    db.refresh(current_user)

    return {
        "message": "CV uploaded successfully",
        "cv_type": cv_type,
        "cv_filename": filename,
    }


@app.get("/profile/cv/{cv_type}")
def get_profile_cv(
    cv_type: str,
    current_user: User = Depends(get_current_user),
):
    filename = get_cv_filename(current_user, cv_type)

    if filename is None:
        raise HTTPException(status_code=404, detail="CV not found")

    file_content = download_file(filename)

    return Response(
        content=file_content,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"inline; filename={cv_type}_cv.pdf",
        },
    )


@app.delete("/profile/cv/{cv_type}")
def delete_profile_cv(
    cv_type: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    filename = get_cv_filename(current_user, cv_type)

    if filename is None:
        raise HTTPException(status_code=404, detail="CV not found")

    delete_file(filename)
    set_cv_filename(current_user, cv_type, None)

    db.commit()

    return {
        "message": "CV deleted successfully",
        "cv_type": cv_type,
    }
