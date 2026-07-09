from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from deps import get_user_application
from models import Application, Reminder, User
from schemas import ApplicationCreate

router = APIRouter(prefix="/applications", tags=["applications"])


@router.get("")
def get_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Application).filter(
        Application.user_id == current_user.id
    ).all()


@router.post("")
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
        notes=application.notes,
        user_id=current_user.id,
    )

    db.add(new_application)
    db.commit()
    db.refresh(new_application)

    return new_application


@router.put("/{application_id}")
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
    application.notes = updated_application.notes

    db.commit()
    db.refresh(application)

    return application


@router.delete("/{application_id}")
def delete_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    application = get_user_application(db, application_id, current_user.id)

    db.delete(application)
    db.commit()

    return {"message": "Application deleted"}


@router.get("/{application_id}/reminders")
def get_application_reminders(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_user_application(db, application_id, current_user.id)

    return db.query(Reminder).filter(
        Reminder.application_id == application_id
    ).all()
