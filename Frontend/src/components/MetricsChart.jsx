import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function MetricsChart({ data }) {
  return (
    <div className="w-full h-96 bg-white p-4 rounded-xl shadow">
      
      <h2 className="font-bold mb-4">Live System Metrics</h2>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="time" />

          <YAxis />

          <Tooltip />

          <Legend />

          {/* CPU */}
          <Line
            type="monotone"
            dataKey="cpu"
            stroke="#ff4d4f"
            strokeWidth={2}
            dot={false}
          />

          {/* Latency */}
          <Line
            type="monotone"
            dataKey="latency"
            stroke="#1677ff"
            strokeWidth={2}
            dot={false}
          />

          {/* Memory */}
          <Line
            type="monotone"
            dataKey="memory"
            stroke="#52c41a"
            strokeWidth={2}
            dot={false}
          />

          {/* Errors */}
          <Line
            type="monotone"
            dataKey="errors"
            stroke="#faad14"
            strokeWidth={2}
            dot={false}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}