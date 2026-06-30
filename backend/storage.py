import os
import requests


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")
BUCKET_NAME = os.getenv("SUPABASE_STORAGE_BUCKET")


def upload_file(path: str, content: bytes, content_type: str) -> None:
    url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET_NAME}/{path}"

    response = requests.post(
        url,
        headers={
            "Authorization": f"Bearer {SUPABASE_SECRET_KEY}",
            "apikey": SUPABASE_SECRET_KEY,
            "Content-Type": content_type,
            "x-upsert": "true",
        },
        data=content,
    )

    response.raise_for_status()


def download_file(path: str) -> bytes:
    url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET_NAME}/{path}"

    response = requests.get(
        url,
        headers={
            "Authorization": f"Bearer {SUPABASE_SECRET_KEY}",
            "apikey": SUPABASE_SECRET_KEY,
        },
    )

    print("DOWNLOAD STATUS:", response.status_code)
    print("DOWNLOAD HEADERS:", response.headers)
    print("DOWNLOAD LENGTH:", len(response.content))

    response.raise_for_status()

    return response.content


def delete_file(path: str) -> None:
    url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET_NAME}/{path}"

    response = requests.delete(
        url,
        headers={
            "Authorization": f"Bearer {SUPABASE_SECRET_KEY}",
            "apikey": SUPABASE_SECRET_KEY,
        },
    )


    response.raise_for_status()

    response.raise_for_status()

    return response.content