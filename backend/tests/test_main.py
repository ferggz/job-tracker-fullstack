from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def test_home_returns_api_message():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {"message": "Job Tracker API"}


def test_get_applications_returns_list():
    response = client.get("/applications")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_application_returns_created_application():
    payload = {
        "company": "Test Company",
        "position": "Junior Developer",
        "status": "Applied",
        "date_applied": "2026-06-22"
    }

    response = client.post("/applications", json=payload)

    assert response.status_code == 200

    data = response.json()

    assert data["company"] == payload["company"]
    assert data["position"] == payload["position"]
    assert data["status"] == payload["status"]
    assert data["date_applied"] == payload["date_applied"]
    assert "id" in data


def test_create_reminder_returns_created_reminder():
    application_payload = {
        "company": "Reminder Test Company",
        "position": "Backend Developer",
        "status": "Applied",
        "date_applied": "2026-06-22"
    }

    application_response = client.post("/applications", json=application_payload)
    application_id = application_response.json()["id"]

    reminder_payload = {
        "application_id": application_id,
        "title": "Follow up",
        "due_date": "2026-06-29",
        "completed": False,
        "notes": "Send email"
    }

    response = client.post("/reminders", json=reminder_payload)

    assert response.status_code == 200

    data = response.json()

    assert data["application_id"] == application_id
    assert data["title"] == reminder_payload["title"]
    assert data["due_date"] == reminder_payload["due_date"]
    assert data["completed"] is False
    assert data["notes"] == reminder_payload["notes"]
    assert "id" in data


def test_complete_reminder_marks_reminder_as_completed():
    application_payload = {
        "company": "Complete Test Company",
        "position": "Frontend Developer",
        "status": "Applied",
        "date_applied": "2026-06-22"
    }

    application_response = client.post(
        "/applications",
        json=application_payload
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
        json=reminder_payload
    )

    reminder_id = reminder_response.json()["id"]

    response = client.put(
        f"/reminders/{reminder_id}/complete"
    )

    assert response.status_code == 200
    assert response.json()["completed"] is True