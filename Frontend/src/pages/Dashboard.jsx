import { useEffect, useState } from "react";
import MetricsChart from "../components/MetricsChart";

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [rootCauses, setRootCauses] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/metrics");
        const data = await res.json();

        setMetrics(data.metrics);
        setAlerts(data.alerts || []);
        setRootCauses(data.root_causes || []);
        setRecommendations(data.recommendations || []);

        setHistory((prev) => {
          const updated = [
            ...prev,
            {
              time: new Date().toLocaleTimeString(),
              cpu: data.metrics.cpu_usage,
              memory: data.metrics.memory_usage,
              latency: data.metrics.latency,
              errors: data.metrics.error_rate,
              req: data.metrics.request_rate,
            },
          ];
          return updated.slice(-30);
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!metrics) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg animate-pulse font-semibold">
          Loading AIOps Dashboard...
        </div>
      </div>
    );
  }

  const healthScore = calculateHealth(metrics);
  const riskScore = calculateRisk(metrics);
  const severity = getSeverity(alerts, metrics);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">

      {/* HEADER */}
      <Header healthScore={healthScore} severity={severity} />

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        <KPI title="CPU Usage" value={metrics.cpu_usage} unit="%" />
        <KPI title="Memory Usage" value={metrics.memory_usage} unit="%" />
        <KPI title="Latency" value={metrics.latency} unit="ms" />
        <KPI title="Error Rate" value={metrics.error_rate} unit="%" />

        <KPI title="Request Rate" value={metrics.request_rate} unit="req/s" />
        <KPI
          title="Traffic Spike"
          value={metrics.traffic_spike ? "YES" : "NO"}
          unit=""
          danger={metrics.traffic_spike}
        />

        <KPI title="Health Score" value={healthScore} unit="/100" />
        <KPI title="Risk Score" value={riskScore} unit="/100" danger={riskScore > 60} />

      </div>

      {/* CHART */}
      <div className="bg-white/80 backdrop-blur shadow-lg rounded-2xl p-4 mb-6">
        <h2 className="font-semibold mb-3">System Telemetry</h2>
        <MetricsChart data={history} />
      </div>

      {/* INSIGHTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <Panel title="Active Alerts" color="red" items={alerts} icon="⚠" />
        <Panel title="Root Cause Analysis" color="yellow" items={rootCauses} icon="🔍" />

      </div>

      {/* RECOMMENDATIONS */}
      {recommendations.length > 0 && (
        <div className="mt-6 bg-white/80 backdrop-blur rounded-2xl shadow p-4">
          <h2 className="font-bold text-blue-600 mb-3">
            AI Recommendations
          </h2>

          {recommendations.map((r, i) => (
            <div key={i} className="p-3 bg-blue-50 rounded-lg mb-2">
              🚀 {r}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

/* ---------------- HEADER ---------------- */

function Header({ healthScore, severity }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          AIOps Intelligence Dashboard
        </h1>
        <p className="text-gray-500">
          Real-time system observability + anomaly detection
        </p>
      </div>

      <div className="flex gap-3 items-center">

        <Badge
          label={`HEALTH ${healthScore}/100`}
          color={healthScore > 70 ? "green" : "yellow"}
        />

        <Badge
          label={`SEVERITY ${severity}`}
          color={
            severity === "P0" ? "red" :
            severity === "P1" ? "orange" : "green"
          }
        />
      </div>
    </div>
  );
}

/* ---------------- KPI CARD ---------------- */

function KPI({ title, value, unit, danger }) {
  return (
    <div className={`bg-white/80 backdrop-blur shadow-lg rounded-2xl p-5 hover:scale-[1.02] transition border ${danger ? "border-red-300" : "border-transparent"}`}>
      <h3 className="text-gray-500 text-sm">{title}</h3>

      <p className={`text-3xl font-bold mt-2 ${danger ? "text-red-500" : "text-gray-800"}`}>
        {typeof value === "number" ? value.toFixed(1) : value}
        <span className="text-sm text-gray-400 ml-1">{unit}</span>
      </p>
    </div>
  );
}

/* ---------------- PANEL ---------------- */

function Panel({ title, items, icon, color }) {
  const colorMap = {
    red: "text-red-600",
    yellow: "text-yellow-600",
    blue: "text-blue-600",
  };

  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl shadow p-4">
      <h2 className={`font-bold mb-3 ${colorMap[color]}`}>
        {title}
      </h2>

      {items.length === 0 ? (
        <p className="text-gray-500">No data</p>
      ) : (
        items.map((item, i) => (
          <div key={i} className="p-3 bg-gray-50 rounded-lg mb-2">
            {icon} {item}
          </div>
        ))
      )}
    </div>
  );
}

/* ---------------- BADGE ---------------- */

function Badge({ label, color }) {
  const map = {
    red: "bg-red-500 text-white",
    orange: "bg-orange-500 text-white",
    yellow: "bg-yellow-400 text-black",
    green: "bg-green-500 text-white",
  };

  return (
    <div className={`px-4 py-2 rounded-full text-sm font-semibold shadow ${map[color]}`}>
      {label}
    </div>
  );
}

/* ---------------- INTELLIGENCE LOGIC ---------------- */

function calculateHealth(m) {
  const penalty =
    m.cpu_usage * 0.25 +
    m.memory_usage * 0.2 +
    m.error_rate * 10 +
    Math.min(m.latency / 30, 30);

  return Math.max(0, Math.round(100 - penalty));
}

function calculateRisk(m) {
  let risk = 0;

  if (m.cpu_usage > 80) risk += 30;
  if (m.memory_usage > 80) risk += 25;
  if (m.latency > 800) risk += 25;
  if (m.error_rate > 1) risk += 20;
  if (m.traffic_spike) risk += 20;

  return Math.min(100, risk);
}

function getSeverity(alerts, metrics) {
  const risk = calculateRisk(metrics);

  if (alerts.length > 3 || risk > 80) return "P0";
  if (alerts.length > 1 || risk > 50) return "P1";
  return "P2";
}