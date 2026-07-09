from fastapi import APIRouter, Depends, File, HTTPException, Response, UploadFile
from sqlalchemy.orm import Session

from auth import get_current_user
from cv import get_cv_filename, set_cv_filename, validate_cv_type
from database import get_db
from models import User
from storage import delete_file, download_file, upload_file

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("")
def get_profile(
    current_user: User = Depends(get_current_user),
):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "primary_cv_uploaded": current_user.primary_cv_filename is not None,
        "secondary_cv_uploaded": current_user.secondary_cv_filename is not None,
    }


@router.post("/cv/{cv_type}")
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


@router.get("/cv/{cv_type}")
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


@router.delete("/cv/{cv_type}")
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
