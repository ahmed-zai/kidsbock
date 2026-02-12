import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import AchievementBadge from "../components/AchievementBadge";

export default function ChildDetails() {
  const { id } = useParams();
  const [child, setChild] = useState(null);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    fetchChild();
    fetchAchievements();
  }, []);

  const fetchChild = async () => {
    const res = await api.get(`/children/${id}`);
    setChild(res.data.child);
  };

  const fetchAchievements = async () => {
    const res = await api.get(`/children/${id}/achievements`);
    setAchievements(res.data.achievements || []);
  };

  if (!child) return <p className="p-6">Loading child...</p>;

  return (
    <div className="p-6 space-y-8">
      {/* Child Info */}
      <div className="bg-white rounded-xl shadow p-6 flex items-center gap-6">
        <img
          src={child.avatar_url || "https://via.placeholder.com/100"}
          className="w-24 h-24 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">{child.name}</h1>
          <p className="text-gray-500">Reading Level: {child.reading_level}</p>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-xl font-semibold mb-4">🏆 Achievements</h2>
        {achievements.length === 0 ? (
          <p className="text-gray-500">No achievements yet — keep reading!</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map(a => (
              <AchievementBadge key={a.id} achievement={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
