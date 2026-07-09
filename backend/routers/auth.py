from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import User
from schemas import RefreshTokenRequest, UserCreate
from security import (
    clear_refresh_token,
    create_access_token,
    create_refresh_token,
    hash_password,
    is_refresh_token_valid,
    parse_refresh_token_user_id,
    store_refresh_token,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["auth"])


def issue_token_pair(user: User, db: Session) -> dict:
    access_token = create_access_token({"sub": user.email})
    refresh_token = create_refresh_token(user.id)

    store_refresh_token(user, refresh_token)
    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


@router.post("/register")
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


@router.post("/login")
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

    return issue_token_pair(existing_user, db)


@router.post("/refresh")
def refresh_tokens(
    body: RefreshTokenRequest,
    db: Session = Depends(get_db),
):
    user_id = parse_refresh_token_user_id(body.refresh_token)

    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    user = db.query(User).filter(User.id == user_id).first()

    if user is None or not is_refresh_token_valid(user, body.refresh_token):
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    return issue_token_pair(user, db)


@router.post("/logout")
def logout_user(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    clear_refresh_token(current_user)
    db.commit()

    return {"message": "Logged out"}
