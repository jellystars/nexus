import psutil
from datetime import datetime

def get_current_metrics():
    net = psutil.net_io_counters()
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "cpu_percent": psutil.cpu_percent(interval=1),
        "memory_percent": psutil.virtual_memory().percent,
        "disk_percent": psutil.disk_usage('/').percent,
        "network_bytes_sent": net.bytes_sent,
        "network_bytes_recv": net.bytes_recv,
    }