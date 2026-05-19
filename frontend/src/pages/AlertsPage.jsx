import AlertRow from "../components/AlertRow";
import { ArrowLeft } from "lucide-react";

export default function AlertsPage({ alerts, setAlerts, setPage }) {
  const high = alerts.filter(a => a.value > 90).length;
  const medium = alerts.filter(a => a.value > 75 && a.value <= 90).length;
  const low = alerts.filter(a => a.value <= 75).length;

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="mb-8 flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-mono font-bold tracking-[0.2em] mb-1" style={{ color: "#ff6b35" }}>ALERT CENTER</h1>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[["TOTAL ALERTS", alerts.length, "#00d9ff"], ["HIGH SEVERITY", high, "#ff0040"], ["MEDIUM SEVERITY", medium, "#ffaa00"], ["LOW SEVERITY", low, "#00d9ff"]].map(([label, val, color]) => (
          <div key={label} className="p-4" style={{ backgroundColor: "#0d0d14", border: "1px solid #1a1a24" }}>
            <div className="text-[10px] tracking-[0.2em] mb-2" style={{ color: "#666" }}>{label}</div>
            <div className="text-4xl font-mono" style={{ color }}>{val}</div>
          </div>
        ))}
      </div>
      <div className="text-xs tracking-[0.2em] mb-4" style={{ color: "#666" }}>ALL ALERTS</div>
      {alerts.length === 0 ? (
        <div className="p-8 text-center text-xs tracking-widest" style={{ backgroundColor: "#0d0d14", border: "1px solid #1a1a24", color: "#666" }}>
          NO ANOMALIES DETECTED — SYSTEM NOMINAL
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.map(a => <AlertRow key={a.id} alert={a} onDelete={(id) => setAlerts(prev => prev.filter(a => a.id !== id))} />)}
        </div>
      )}
    </main>
  );
}