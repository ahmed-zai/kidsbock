import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import ProgressChart from "../components/ProgressChart";

export default function ChildDetails() {
  const { id } = useParams();
  const [child, setChild] = useState(null);
  const [progress, setProgress] = useState([]);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    fetchChild();
    fetchProgress();
    fetchInsights();
  }, [id]);

  const fetchChild = async () => {
    const res = await api.get(`/children/${id}`);
    setChild(res.data.child);
  };

  const fetchProgress = async () => {
    const res = await api.get(`/progress/${id}`);
    setProgress(res.data.progress || []);
  };

  const fetchInsights = async () => {
    const res = await api.get(`/insights/child/${id}`);
    setInsights(res.data.insights || []);
  };

  if (!child) return <p className="p-6">Loading child profile...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow p-6 flex items-center gap-6">
        <img
          src={child.avatar_url || "https://via.placeholder.com/120"}
          className="w-28 h-28 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">{child.name}</h1>
          <p className="text-gray-500">
            Reading Level: <span className="font-semibold">{child.reading_level}</span>
          </p>
          <p className="text-sm text-gray-400">
            Born: {new Date(child.birth_date).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Reading Progress Chart */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Reading Progress</h2>
        <ProgressChart data={progress} />
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">AI Insights</h2>
        <div className="space-y-3">
          {insights.map((i) => (
            <div key={i.id} className="border rounded-lg p-4">
              <div className="flex justify-between mb-1">
                <span className="font-semibold capitalize">{i.insight_type}</span>
                <span className="text-blue-600 font-bold">{i.score}</span>
              </div>
              <p className="text-gray-600">{i.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
