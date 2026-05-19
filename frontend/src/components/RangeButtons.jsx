export default function RangeButtons({ range, setRange, color = "#00ff41" }) {
  return (
    <div className="flex gap-2">
      {["1h", "6h", "24h"].map(r => (
        <button key={r} onClick={() => setRange(r)}
          className="px-3 py-1 text-xs tracking-wider border transition-colors"
          style={range === r
            ? { backgroundColor: color, color: "#000", borderColor: color }
            : { backgroundColor: "transparent", color: "#666", borderColor: "#1a1a24" }}>
          {r.toUpperCase()}
        </button>
      ))}
    </div>
  );
}