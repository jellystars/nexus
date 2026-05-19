import { useState, useEffect, useCallback } from "react";
import { fetchLive, fetchHistory, fetchAlerts } from "./api";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AlertsPage from "./pages/AlertsPage";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [live, setLive] = useState(null);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [range, setRange] = useState("1h");
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const [l, h, a] = await Promise.all([fetchLive(), fetchHistory(range), fetchAlerts()]);
      setLive(l);
      setHistory(h);
      setAlerts(a);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (e) { console.error(e); }
  }, [range]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 10000);
    return () => clearInterval(id);
  }, [refresh]);

  const pages = { dashboard: Dashboard, alerts: AlertsPage };
  const PageComponent = pages[page] || Dashboard;

  return (
    <div className="flex h-screen overflow-hidden font-mono" style={{ backgroundColor: "#0a0a0f", color: "#e0e0e0" }}>
      <Sidebar page={page} setPage={setPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageComponent live={live} history={history} alerts={alerts} range={range} setRange={setRange} setPage={setPage} loading={loading} />
      </div>
    </div>
  );
}