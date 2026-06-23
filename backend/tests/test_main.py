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