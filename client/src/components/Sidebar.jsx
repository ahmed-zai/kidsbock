import { Link, useLocation } from "react-router-dom";
import { BookOpen, BarChart3, Users, Home } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const linkStyle = (path) =>
    `flex items-center gap-3 p-3 rounded-lg transition ${
      location.pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-blue-100"
    }`;

  return (
    <div className="h-screen w-64 bg-white border-r shadow-sm p-4">
      <h2 className="text-xl font-bold text-blue-600 mb-8">📚 Kids Reader</h2>

      <nav className="flex flex-col gap-2">
        <Link to="/" className={linkStyle("/")}>
          <Home size={20} />
          Dashboard
        </Link>

        <Link to="/children" className={linkStyle("/children")}>
          <Users size={20} />
          My Children
        </Link>

        <Link to="/sessions" className={linkStyle("/sessions")}>
          <BookOpen size={20} />
          Reading Sessions
        </Link>

        <Link to="/analytics" className={linkStyle("/analytics")}>
          <BarChart3 size={20} />
          Insights & Progress
        </Link>
      </nav>

      <div className="absolute bottom-6 left-4 text-sm text-gray-400">
        Parent Panel v1.0
      </div>
    </div>
  );
}
