const API = "http://localhost:8000";
export const fetchLive = () => fetch(`${API}/metrics/live`).then(r => r.json());
export const fetchHistory = (range) => fetch(`${API}/metrics/history?range=${range}`).then(r => r.json());
export const fetchAlerts = () => fetch(`${API}/alerts`).then(r => r.json());
export const deleteAlert = (id) => fetch(`${API}/alerts/${id}`, { method: "DELETE" }).then(r => r.json());