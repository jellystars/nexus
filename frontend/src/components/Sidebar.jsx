import { Activity, Bell } from "lucide-react";

export default function Sidebar({ page, setPage }) {
  const items = [
    { icon: Activity, label: "Dashboard", id: "dashboard" },
    { icon: Bell, label: "Alerts", id: "alerts" },
  ];
  return (
    <aside className="w-20 flex-shrink-0 flex flex-col items-center py-6 gap-6"
      style={{ backgroundColor: "#0d0d14", borderRight: "1px solid #1a1a24" }}>
      <nav className="flex-1 flex flex-col gap-4 mt-6">
        {items.map(({ icon: Icon, label, id }) => (
          <button key={id} onClick={() => setPage(id)} title={label}
            className="w-12 h-12 flex items-center justify-center transition-colors relative"
            style={{ color: page === id ? "#00ff41" : "#666" }}>
            <Icon className="w-5 h-5" />
            {page === id && (
              <div className="absolute left-0 top-0 bottom-0 w-[2px]"
                style={{ backgroundColor: "#00ff41" }} />
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
}