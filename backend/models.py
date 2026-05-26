from sqlalchemy import Column, Integer, Text

from database import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True)
    company = Column(Text, nullable=False)
    position = Column(Text, nullable=False)
    status = Column(Text, nullable=False)
    date_applied = Column(Text, nullable=False)