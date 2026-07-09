from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from deps import get_user_application, get_user_reminder
from models import Application, Reminder, User
from schemas import ReminderCreate

router = APIRouter(prefix="/reminders", tags=["reminders"])


@router.get("")
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


@router.post("")
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


@router.put("/{reminder_id}/complete")
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


@router.delete("/{reminder_id}")
def delete_reminder(
    reminder_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reminder = get_user_reminder(db, reminder_id, current_user.id)

    db.delete(reminder)
    db.commit()

    return {"message": "Reminder deleted"}
