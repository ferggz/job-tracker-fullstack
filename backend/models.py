from sqlalchemy import Boolean, Column, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(Text, unique=True, nullable=False)
    hashed_password = Column(Text, nullable=False)


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True)
    company = Column(Text, nullable=False)
    position = Column(Text, nullable=False)
    status = Column(Text, nullable=False)
    date_applied = Column(Text, nullable=False)

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