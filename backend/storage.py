import os
import requests


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")
BUCKET_NAME = os.getenv("SUPABASE_STORAGE_BUCKET")


def _storage_headers(content_type: str | None = None) -> dict:
    headers = {
        "Authorization": f"Bearer {SUPABASE_SECRET_KEY}",
        "apikey": SUPABASE_SECRET_KEY,
    }

    if content_type:
        headers["Content-Type"] = content_type

    return headers


def _object_url(path: str) -> str:
    return f"{SUPABASE_URL}/storage/v1/object/{BUCKET_NAME}/{path}"


def upload_file(path: str, content: bytes, content_type: str) -> None:
    response = requests.post(
        _object_url(path),
        headers={
            **_storage_headers(content_type),
            "x-upsert": "true",
        },
        data=content,
    )

    response.raise_for_status()


def download_file(path: str) -> bytes:
    response = requests.get(
        _object_url(path),
        headers=_storage_headers(),
    )

    response.raise_for_status()

    return response.content


def delete_file(path: str) -> None:
    response = requests.delete(
        _object_url(path),
        headers=_storage_headers(),
    )

    response.raise_for_status()
