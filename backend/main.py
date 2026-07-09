from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import applications, auth, profile, reminders

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://job-tracker-fullstack-three.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(applications.router)
app.include_router(reminders.router)
app.include_router(auth.router)
app.include_router(profile.router)


@app.get("/")
def home():
    return {"message": "Job Tracker API"}
