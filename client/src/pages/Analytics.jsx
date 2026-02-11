import { useEffect, useState } from "react";
import api from "../services/api";

export default function Analytics() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const res = await api.get("/insights");
      setInsights(res.data.insights || []);
    } catch (err) {
      console.error("Failed to fetch insights", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Loading insights...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Reading Insights</h1>

      <div className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="bg-white border rounded-xl p-5 shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-lg capitalize">
                {insight.insight_type}
              </h2>
              <span className="text-blue-600 font-bold">
                Score: {insight.score}
              </span>
            </div>

            <p className="text-gray-600">{insight.summary}</p>

            <p className="text-xs text-gray-400 mt-2">
              {new Date(insight.generated_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
