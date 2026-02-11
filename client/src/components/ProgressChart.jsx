import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function ProgressChart({ data }) {
  const chartData = data.map((p) => ({
    name: p.book_title || `Book ${p.book_id}`,
    progress: p.progress_percent,
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="progress" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
