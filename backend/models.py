from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, Text, String
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(Text, unique=True, nullable=False)
    hashed_password = Column(Text, nullable=False)
    refresh_token_hash = Column(Text, nullable=True)
    refresh_token_expires_at = Column(DateTime(timezone=True), nullable=True)
    primary_cv_filename = Column(Text, nullable=True)
    secondary_cv_filename = Column(Text, nullable=True)


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True)
    company = Column(Text, nullable=False)
    position = Column(Text, nullable=False)
    status = Column(Text, nullable=False)
    platform = Column(String, nullable=True)
    source_url = Column(String, nullable=True)
    date_applied = Column(Text, nullable=False)
    notes = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    reminders = relationship(
        "Reminder",
        back_populates="application",
        cascade="all, delete-orphan"
    )


class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True)
    application_id = Column(
        Integer,
        ForeignKey("applications.id"),
        nullable=False
    )
    title = Column(Text, nullable=False)
    due_date = Column(Text, nullable=False)
    completed = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)

    application = relationship("Application", back_populates="reminders")