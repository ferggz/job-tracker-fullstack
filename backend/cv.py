from fastapi import HTTPException

from models import User


VALID_CV_TYPES = {"primary", "secondary"}


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
