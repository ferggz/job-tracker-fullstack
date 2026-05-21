from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import get_connection

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

applications = [
    {
        "id": 1,
        "company": "Google",
        "position": "Backend Developer",
        "status": "Applied"
    },
    {
        "id": 2,
        "company": "Spotify",
        "position": "Python Developer",
        "status": "Interview"
    }
]

class ApplicationCreate(BaseModel):
    company: str
    position: str
    status: str


@app.get("/")
def home():
    return {"message": "Job Tracker API"}


@app.get("/applications")
def get_applications():
    connection = get_connection()

    applications = connection.execute(
        "SELECT * FROM applications"
    ).fetchall()

    connection.close()

    return [dict(application) for application in applications]


@app.post("/applications")
def create_application(application: ApplicationCreate):
    connection = get_connection()

    cursor = connection.execute(
        """
        INSERT INTO applications (company, position, status)
        VALUES (?, ?, ?)
        """,
        (application.company, application.position, application.status)
    )

    connection.commit()

    new_application = connection.execute(
        "SELECT * FROM applications WHERE id = ?",
        (cursor.lastrowid,)
    ).fetchone()

    connection.close()

    return dict(new_application)


@app.put("/applications/{application_id}")
def update_application(application_id: int, updated_application: ApplicationCreate):
    connection = get_connection()

    connection.execute(
        """
        UPDATE applications
        SET company = ?, position = ?, status = ?
        WHERE id = ?
        """,
        (
            updated_application.company,
            updated_application.position,
            updated_application.status,
            application_id
        )
    )

    connection.commit()

    application = connection.execute(
        "SELECT * FROM applications WHERE id = ?",
        (application_id,)
    ).fetchone()

    connection.close()

    return dict(application)


@app.delete("/applications/{application_id}")
def delete_application(application_id: int):
    connection = get_connection()

    connection.execute(
        "DELETE FROM applications WHERE id = ?",
        (application_id,)
    )

    connection.commit()
    connection.close()

    return {"message": "Application deleted"}