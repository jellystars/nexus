from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime
from database import Base

class Metric(Base):
    __tablename__ = "metrics"
    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime, default=datetime.now)
    cpu_percent = Column(Float)
    memory_percent = Column(Float)
    disk_percent = Column(Float)
    network_bytes_sent = Column(Float)
    network_bytes_recv = Column(Float)

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime, default=datetime.now)
    metric_type = Column(String)
    value = Column(Float)
    message = Column(String)
    ai_analysis = Column(String, nullable=True)