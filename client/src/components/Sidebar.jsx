import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, BarChart3, Users, Home, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkStyle = (path) =>
    `flex items-center gap-3 p-3 rounded-lg transition ${
      location.pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-blue-100"
    }`;

  return (
    <div className="h-screen w-64 bg-white border-r shadow-sm p-4 flex flex-col">
      <h2 className="text-xl font-bold text-blue-600 mb-8">📚 Kids Reader</h2>

      <nav className="flex flex-col gap-2 flex-1">
        <Link to="/dashboard" className={linkStyle("/dashboard")}>
          <Home size={20} />
          Dashboard
        </Link>

        <Link to="/children" className={linkStyle("/children")}>
          <Users size={20} />
          My Children
        </Link>

        <Link to="/reading-session" className={linkStyle("/reading-session")}>
          <BookOpen size={20} />
          Reading Sessions
        </Link>

        <Link to="/analytics" className={linkStyle("/analytics")}>
          <BarChart3 size={20} />
          Insights & Progress
        </Link>
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-red-100 hover:text-red-600 transition mt-auto"
      >
        <LogOut size={20} />
        Log out
      </button>

      <div className="mt-4 text-sm text-gray-400">
        Parent Panel v1.0
      </div>
    </div>
  );
}
