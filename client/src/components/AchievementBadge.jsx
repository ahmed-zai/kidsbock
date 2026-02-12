export default function AchievementBadge({ achievement }) {
  return (
    <div className="flex flex-col items-center bg-yellow-50 border border-yellow-200 rounded-xl p-3 shadow-sm hover:shadow transition">
      <img
        src={achievement.icon_url || "https://cdn-icons-png.flaticon.com/512/190/190411.png"}
        alt={achievement.name}
        className="w-12 h-12 mb-2"
      />
      <p className="text-xs font-semibold text-center text-yellow-800">
        {achievement.name}
      </p>
    </div>
  );
}
