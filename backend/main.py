from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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
    return applications


@app.post("/applications")
def create_application(application: ApplicationCreate):
    new_application = {
        "id": len(applications) + 1,
        "company": application.company,
        "position": application.position,
        "status": application.status
    }

    applications.append(new_application)

    return new_application


@app.put("/applications/{application_id}")
def update_application(application_id: int, updated_application: ApplicationCreate):
    for application in applications:
        if application["id"] == application_id:
            application["company"] = updated_application.company
            application["position"] = updated_application.position
            application["status"] = updated_application.status
            return application

    return {"message": "Application not found"}


@app.delete("/applications/{application_id}")
def delete_application(application_id: int):
    for application in applications:
        if application["id"] == application_id:
            applications.remove(application)
            return {"message": "Application deleted"}

    return {"message": "Application not found"}