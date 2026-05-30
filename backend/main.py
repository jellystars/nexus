from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from database import get_db, engine
from models import Base, Metric, Alert
from collector import get_current_metrics
import threading, time
from database import get_db, engine, SessionLocal

Base.metadata.create_all(bind=engine)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def collect_loop():
    from analyzer import check_for_anomalies
    while True:
        db = SessionLocal()
        data = get_current_metrics()
        db.add(Metric(
            cpu_percent=data["cpu_percent"],
            memory_percent=data["memory_percent"],
            disk_percent=data["disk_percent"],
            network_bytes_sent=data["network_bytes_sent"],
            network_bytes_recv=data["network_bytes_recv"],
        ))
        db.commit()
        db.close()
        check_for_anomalies(data)
        time.sleep(30)

threading.Thread(target=collect_loop, daemon=True).start()

@app.get("/metrics/live")
def live_metrics():
    return get_current_metrics()

@app.get("/metrics/history")
def metric_history(range: str = "1h", db: Session = Depends(get_db)):
    hours = {"1h": 1, "6h": 6, "24h": 24}.get(range, 1)
    since = datetime.utcnow() - timedelta(hours=hours)
    rows = db.query(Metric).filter(Metric.timestamp >= since).all()
    return [{"timestamp": r.timestamp, "cpu": r.cpu_percent,
             "memory": r.memory_percent, "disk": r.disk_percent} for r in rows]

@app.post("/alerts")
def create_alert(metric_type: str, value: float, message: str, db: Session = Depends(get_db)):
    alert = Alert(metric_type=metric_type, value=value, message=message)
    db.add(alert)
    db.commit()
    return {"status": "alert created", "id": alert.id}

@app.get("/alerts")
def get_alerts(db: Session = Depends(get_db)):
    return db.query(Alert).order_by(Alert.timestamp.desc()).limit(20).all()

@app.delete("/alerts/{alert_id}")
def delete_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    db.delete(alert)
    db.commit()
    return {"status": "deleted"}