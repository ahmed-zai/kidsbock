export default function InsightCard({ insight }) {
  return (
    <div className="border-l-4 border-blue-500 bg-white p-4 mb-2 shadow">
      <p><strong>{insight.insight_type}</strong>: {insight.summary}</p>
      <p className="text-gray-500 text-sm">Score: {insight.score}</p>
    </div>
  );
}
