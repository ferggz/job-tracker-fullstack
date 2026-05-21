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


class ApplicationCreate(BaseModel):
    company: str
    position: str
    status: str
    date_applied: str


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
        INSERT INTO applications (company, position, status, date_applied)
        VALUES (?, ?, ?, ?)
        """,
        (
            application.company,
            application.position,
            application.status,
            application.date_applied
        )
    )
    connection.commit()

    new_application = connection.execute(
        "SELECT * FROM applications WHERE id = ?",
        (cursor.lastrowid,)
    ).fetchone()

    connection.close()

    return dict(new_application)


@app.put("/applications/{application_id}")
def update_application(
    application_id: int,
    updated_application: ApplicationCreate
):
    connection = get_connection()

    connection.execute(
        """
        UPDATE applications
        SET company = ?, position = ?, status = ?, date_applied = ?
        WHERE id = ?
        """,
        (
            updated_application.company,
            updated_application.position,
            updated_application.status,
            updated_application.date_applied,
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