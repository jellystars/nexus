export default function StatCard({ label, value, unit, color }) {
  return (
    <div className="relative overflow-hidden p-4"
      style={{ backgroundColor: "#0d0d14", border: "1px solid #1a1a24" }}>
      <div className="relative z-10">
        <div className="text-[10px] tracking-[0.2em] mb-3" style={{ color: "#666" }}>{label}</div>
        <div className="text-4xl tracking-tight mb-1 font-mono" style={{ color }}>
          {value}<span className="text-2xl ml-1">{unit}</span>
        </div>
        <div className="h-[1px] w-full mt-3"
          style={{ background: `linear-gradient(90deg,${color}00,${color},${color}00)`, boxShadow: `0 0 4px ${color}` }} />
      </div>
    </div>
  );
}