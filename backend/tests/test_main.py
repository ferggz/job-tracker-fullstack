from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def get_auth_headers(email="test-user@example.com"):
    password = "password123"

    client.post(
        "/auth/register",
        json={
            "email": email,
            "password": password
        }
    )

    response = client.post(
        "/auth/login",
        data={
            "username": email,
            "password": password
        }
    )

    token = response.json()["access_token"]

    return {"Authorization": f"Bearer {token}"}


def test_home_returns_api_message():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {"message": "Job Tracker API"}


def test_get_applications_returns_list():
    headers = get_auth_headers("list-apps@example.com")

    response = client.get("/applications", headers=headers)

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_application_returns_created_application():
    headers = get_auth_headers("create-app@example.com")

    payload = {
        "company": "Test Company",
        "position": "Junior Developer",
        "status": "Applied",
        "date_applied": "2026-06-22"
    }

    response = client.post(
        "/applications",
        json=payload,
        headers=headers
    )

    assert response.status_code == 200

    data = response.json()

    assert data["company"] == payload["company"]
    assert data["position"] == payload["position"]
    assert data["status"] == payload["status"]
    assert data["date_applied"] == payload["date_applied"]
    assert "id" in data


def test_create_reminder_returns_created_reminder():
    headers = get_auth_headers("create-reminder@example.com")

    application_payload = {
        "company": "Reminder Test Company",
        "position": "Backend Developer",
        "status": "Applied",
        "date_applied": "2026-06-22"
    }

    application_response = client.post(
        "/applications",
        json=application_payload,
        headers=headers
    )

    application_id = application_response.json()["id"]

    reminder_payload = {
        "application_id": application_id,
        "title": "Follow up",
        "due_date": "2026-06-29",
        "completed": False,
        "notes": "Send email"
    }

    response = client.post(
        "/reminders",
        json=reminder_payload,
        headers=headers
    )

    assert response.status_code == 200

    data = response.json()

    assert data["application_id"] == application_id
    assert data["title"] == reminder_payload["title"]
    assert data["due_date"] == reminder_payload["due_date"]
    assert data["completed"] is False
    assert data["notes"] == reminder_payload["notes"]
    assert "id" in data


def test_complete_reminder_marks_reminder_as_completed():
    headers = get_auth_headers("complete-reminder@example.com")

    application_payload = {
        "company": "Complete Test Company",
        "position": "Frontend Developer",
        "status": "Applied",
        "date_applied": "2026-06-22"
    }

    application_response = client.post(
        "/applications",
        json=application_payload,
        headers=headers
    )

    application_id = application_response.json()["id"]

    reminder_payload = {
        "application_id": application_id,
        "title": "Technical interview",
        "due_date": "2026-07-01",
        "completed": False,
        "notes": ""
    }

    reminder_response = client.post(
        "/reminders",
        json=reminder_payload,
        headers=headers
    )

    reminder_id = reminder_response.json()["id"]

    response = client.put(
        f"/reminders/{reminder_id}/complete",
        headers=headers
    )

    assert response.status_code == 200
    assert response.json()["completed"] is True


def test_delete_reminder_returns_success_message():
    headers = get_auth_headers("delete-reminder@example.com")

    application_payload = {
        "company": "Delete Reminder Company",
        "position": "Backend Developer",
        "status": "Applied",
        "date_applied": "2026-06-22"
    }

    application_response = client.post(
        "/applications",
        json=application_payload,
        headers=headers
    )

    application_id = application_response.json()["id"]

    reminder_payload = {
        "application_id": application_id,
        "title": "Delete me",
        "due_date": "2026-07-01",
        "completed": False,
        "notes": ""
    }

    reminder_response = client.post(
        "/reminders",
        json=reminder_payload,
        headers=headers
    )

    reminder_id = reminder_response.json()["id"]

    response = client.delete(
        f"/reminders/{reminder_id}",
        headers=headers
    )

    assert response.status_code == 200
    assert response.json() == {"message": "Reminder deleted"}


def test_update_application_returns_updated_application():
    headers = get_auth_headers("update-app@example.com")

    create_payload = {
        "company": "Old Company",
        "position": "Old Position",
        "status": "Applied",
        "date_applied": "2026-06-22"
    }

    create_response = client.post(
        "/applications",
        json=create_payload,
        headers=headers
    )

    application_id = create_response.json()["id"]

    update_payload = {
        "company": "New Company",
        "position": "New Position",
        "status": "Interview",
        "date_applied": "2026-06-23"
    }

    response = client.put(
        f"/applications/{application_id}",
        json=update_payload,
        headers=headers
    )

    assert response.status_code == 200

    data = response.json()

    assert data["company"] == update_payload["company"]
    assert data["position"] == update_payload["position"]
    assert data["status"] == update_payload["status"]
    assert data["date_applied"] == update_payload["date_applied"]


def test_delete_application_returns_success_message():
    headers = get_auth_headers("delete-app@example.com")

    payload = {
        "company": "Delete Company",
        "position": "Delete Position",
        "status": "Applied",
        "date_applied": "2026-06-22"
    }

    create_response = client.post(
        "/applications",
        json=payload,
        headers=headers
    )

    application_id = create_response.json()["id"]

    response = client.delete(
        f"/applications/{application_id}",
        headers=headers
    )

    assert response.status_code == 200
    assert response.json() == {
        "message": "Application deleted"
    }


def test_register_user_returns_created_user():
    payload = {
        "email": "register-unique-test@example.com",
        "password": "password123"
    }

    response = client.post("/auth/register", json=payload)

    assert response.status_code == 200

    data = response.json()

    assert data["email"] == payload["email"]
    assert "id" in data
    assert "password" not in data
    assert "hashed_password" not in data


def test_login_user_returns_access_token():
    payload = {
        "email": "login-test@example.com",
        "password": "password123"
    }

    client.post("/auth/register", json=payload)

    response = client.post(
        "/auth/login",
        data={
            "username": payload["email"],
            "password": payload["password"]
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"