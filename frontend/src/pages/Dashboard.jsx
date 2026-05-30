import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import StatCard from "../components/StatCard";
import AlertRow from "../components/AlertRow";
import RangeButtons from "../components/RangeButtons";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="p-3" style={{ backgroundColor: "#0d0d14", border: "1px solid #1a1a24", fontFamily: "monospace", fontSize: 11 }}>
      <p className="mb-2 text-[10px]" style={{ color: "#666" }}>{new Date(label).toLocaleTimeString()}</p>
      {payload.map(p => (
        <p key={p.dataKey} className="text-[11px] font-mono" style={{ color: p.color }}>
          {p.dataKey.toUpperCase()}: {p.value?.toFixed(1)}%
        </p>
      ))}
    </div>
  );
}

export default function Dashboard({ live, history, alerts, setAlerts, range, setRange, loading }) {
  const getSeverity = (val) => val >= 90 ? "#ff0040" : val >= 75 ? "#ffaa00" : "#00ff41";
  const formatBytes = (b) => b ? `${(b / 1e9).toFixed(1)}GB` : "—";

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-mono font-bold tracking-[0.2em] mb-1" style={{ color: "#00ff41" }}>NEXUS</h1>
        <div className="text-xs tracking-[0.15em]" style={{ color: "#666" }}>REAL-TIME MONITORING INTERFACE</div>
      </div>

      {loading ? (
        <p className="text-xs tracking-widest" style={{ color: "#666" }}>CONNECTING TO BACKEND...</p>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard label="CPU USAGE" value={live?.cpu_percent?.toFixed(1) ?? "—"} unit="%" color={getSeverity(live?.cpu_percent)} />
            <StatCard label="MEMORY" value={live?.memory_percent?.toFixed(1) ?? "—"} unit="%" color={getSeverity(live?.memory_percent)} />
            <StatCard label="DISK" value={live?.disk_percent?.toFixed(1) ?? "—"} unit="%" color={getSeverity(live?.disk_percent)} />
            <StatCard label="NET RECV" value={formatBytes(live?.network_bytes_recv)} unit="" color="#00d9ff" />
          </div>

          <div className="relative overflow-hidden p-6 mb-6" style={{ backgroundColor: "#0d0d14", border: "1px solid #1a1a24" }}>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="text-xs tracking-[0.2em]" style={{ color: "#666" }}>SYSTEM METRICS</div>
                <RangeButtons range={range} setRange={setRange} />
              </div>
              <div className="flex gap-6 mb-4">
                {[["CPU", "#ff6b35"], ["MEMORY", "#00d9ff"], ["DISK", "#ffd700"]].map(([label, color]) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-3 h-[2px]" style={{ backgroundColor: color }} />
                    <span className="text-xs tracking-wider" style={{ color }}>{label}</span>
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={history} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a24" />
                  <XAxis dataKey="timestamp" tickFormatter={t => new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} stroke="#333" tick={{ fill: "#666", fontSize: 10 }} />
                  <YAxis domain={[0, 100]} stroke="#333" tick={{ fill: "#666", fontSize: 10 }} unit="%" />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="cpu" stroke="#ff6b35" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="memory" stroke="#00d9ff" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="disk" stroke="#ffd700" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <div className="text-xs tracking-[0.2em] mb-4" style={{ color: "#666" }}>RECENT ALERTS</div>
            {alerts.length === 0 ? (
              <div className="p-8 text-center text-xs tracking-widest" style={{ backgroundColor: "#0d0d14", border: "1px solid #1a1a24", color: "#666" }}>
                NO ANOMALIES DETECTED — SYSTEM NOMINAL
              </div>
            ) : (
              <div className="space-y-2">
                {alerts.slice(0, 5).map(a => <AlertRow key={a.id} alert={a} onDelete={(id) => setAlerts(prev => prev.filter(a => a.id !== id))} />)}
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}