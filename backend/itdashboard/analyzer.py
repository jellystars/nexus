from google import genai
from dotenv import load_dotenv
from database import SessionLocal
from models import Metric, Alert
from datetime import datetime, timedelta
import os

load_dotenv()

# initialize gemeni client using api key from the .env file
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# thresholds by percentage
CPU_THRESHOLD = 85
MEMORY_THRESHOLD = 85
DISK_THRESHOLD = 90

# tracks how many consecutive snapshots cpu has been above threshold
cpu_high_count = 0   
def get_recent_metrics(db, minutes=10):
    since = datetime.utcnow() - timedelta(minutes=minutes)
    rows = db.query(Metric).filter(Metric.timestamp >= since).all()
    return [
        {
            "timestamp": str(r.timestamp),
            "cpu": r.cpu_percent,
            "memory": r.memory_percent,
            "disk": r.disk_percent,
        }
        for r in rows
    ]

def ask_gemini(metric_type, value, timestamp, recent_data):
    prompt = f"""
You are an expert IT systems administrator analyzing server metrics.

An anomaly was detected at {timestamp}:
- Metric: {metric_type}
- Value: {value}

Here is the system metric data from the last 10 minutes:
{recent_data}

In 3-4 sentences, explain:
1. What likely caused this spike
2. What an IT admin should check or do right now
Keep it practical and concise.
"""
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return response.text
    except Exception as e:
        return f"AI analysis unavailable: {str(e)}"

def save_alert(db, metric_type, value, message, ai_analysis):
    alert = Alert(
        metric_type=metric_type,
        value=value,
        message=message,
        ai_analysis=ai_analysis,
    )
    db.add(alert)
    db.commit()
    print(f"ALERT: {message}")
    print(f"AI: {ai_analysis}\n")

def check_for_anomalies(metrics: dict):
    global cpu_high_count
    db = SessionLocal()

    try:
        recent = get_recent_metrics(db)
        ts = metrics["timestamp"]

        if metrics["cpu_percent"] > CPU_THRESHOLD:
            cpu_high_count += 1
            if cpu_high_count == 6:
                analysis = ask_gemini("CPU", metrics["cpu_percent"], ts, recent)
                save_alert(db, "CPU", metrics["cpu_percent"],
                           f"CPU sustained above {CPU_THRESHOLD}% for 3+ minutes",
                           analysis)
        else:
            cpu_high_count = 0

        if metrics["memory_percent"] > MEMORY_THRESHOLD:
            analysis = ask_gemini("Memory", metrics["memory_percent"], ts, recent)
            save_alert(db, "Memory", metrics["memory_percent"],
                       f"Memory usage critical at {metrics['memory_percent']}%",
                       analysis)

        if metrics["disk_percent"] > DISK_THRESHOLD:
            analysis = ask_gemini("Disk", metrics["disk_percent"], ts, recent)
            save_alert(db, "Disk", metrics["disk_percent"],
                       f"Disk usage critical at {metrics['disk_percent']}%",
                       analysis)

    finally:
        db.close()