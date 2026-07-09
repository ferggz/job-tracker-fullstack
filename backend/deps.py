from fastapi import HTTPException
from sqlalchemy.orm import Session

from models import Application, Reminder


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
