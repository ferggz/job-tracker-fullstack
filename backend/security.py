from datetime import datetime, timedelta, timezone
import hashlib
import os
import secrets

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from jose import jwt, JWTError


SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "30"))

password_hasher = PasswordHasher()


def hash_password(password: str) -> str:
    return password_hasher.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    try:
        return password_hasher.verify(hashed_password, password)
    except VerifyMismatchError:
        return False


def create_access_token(data: dict) -> str:
    payload = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload.update({"exp": expire})

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except JWTError:
        return None


def create_refresh_token(user_id: int) -> str:
    return f"{user_id}.{secrets.token_urlsafe(32)}"


def hash_refresh_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def store_refresh_token(user, token: str) -> None:
    user.refresh_token_hash = hash_refresh_token(token)
    user.refresh_token_expires_at = datetime.now(timezone.utc) + timedelta(
        days=REFRESH_TOKEN_EXPIRE_DAYS
    )


def clear_refresh_token(user) -> None:
    user.refresh_token_hash = None
    user.refresh_token_expires_at = None


def is_refresh_token_valid(user, token: str) -> bool:
    if user.refresh_token_hash is None or user.refresh_token_expires_at is None:
        return False

    if user.refresh_token_expires_at < datetime.now(timezone.utc):
        return False

    return hash_refresh_token(token) == user.refresh_token_hash


def parse_refresh_token_user_id(token: str) -> int | None:
    user_id, _, _ = token.partition(".")

    try:
        return int(user_id)
    except ValueError:
        return None