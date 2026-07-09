from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class ApplicationCreate(BaseModel):
    company: str
    position: str
    status: str
    platform: str | None = None
    source_url: str | None = None
    date_applied: str


class ReminderCreate(BaseModel):
    application_id: int
    title: str
    due_date: str
    completed: bool = False
    notes: str | None = None
