import { useState } from "react";
import { ChevronDown, AlertTriangle, Trash2 } from "lucide-react";
import { deleteAlert } from "../api";

export default function AlertRow({ alert, onDelete }) {
  const [open, setOpen] = useState(false);
  const colors = { CPU: "#ff0040", Memory: "#ffaa00", Disk: "#ffd700" };
  const color = colors[alert.metric_type] || "#00d9ff";
  const severity = alert.value > 90 ? "HIGH" : alert.value > 75 ? "MEDIUM" : "LOW";

  const handleDelete = async (e) => {
    e.stopPropagation();
    await deleteAlert(alert.id);
    onDelete(alert.id);
  };

  return (
    <div style={{ border: "1px solid #1a1a24" }}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-3 transition-colors text-left"
        style={{ backgroundColor: "#12121a" }}>
        <ChevronDown className="w-4 h-4 transition-transform" style={{ color: "#666", transform: open ? "rotate(180deg)" : "" }} />
        <AlertTriangle className="w-4 h-4" style={{ color }} />
        <span className="text-xs tracking-wider flex-1" style={{ color }}>{alert.metric_type}_ANOMALY</span>
        <div className="px-2 py-0.5 text-[9px] tracking-widest border"
          style={{ color, borderColor: color + "40", backgroundColor: color + "10" }}>
          {severity}
        </div>
        <div className="text-[10px] tracking-wider font-mono" style={{ color: "#666" }}>
          {new Date(alert.timestamp).toLocaleString()}
        </div>
        <div onClick={handleDelete} className="ml-2 p-1 cursor-pointer hover:text-red-400 transition-colors"
            style={{ color: "#444" }}>
            <Trash2 className="w-3.5 h-3.5" />
        </div>
      </button>
      {open && (
        <div className="p-4" style={{ backgroundColor: "#080810", borderTop: "1px solid #1a1a24" }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#00ff41" }} />
            <span className="text-[10px] tracking-[0.2em]" style={{ color: "#00ff41" }}>AI ANALYSIS</span>
          </div>
          <pre className="text-[11px] leading-relaxed whitespace-pre-wrap font-mono" style={{ color: "#00ff41" }}>
            {alert.ai_analysis || "Analysis not available."}
          </pre>
        </div>
      )}
    </div>
  );
}