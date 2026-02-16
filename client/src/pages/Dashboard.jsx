// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import api from "../api/api";
import { useTheme } from "../context/ThemeContext";
import { FiUsers, FiBook, FiAward, FiActivity, FiMenu, FiX } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { isDark } = useTheme();
  const [dashboardData, setDashboardData] = useState({
    childrenCount: 0,
    sessionsCount: 0,
    progress: 0,
    recentActivity: [],
    progressHistory: [],
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard");
        setDashboardData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className={`min-h-screen flex ${isDark ? "dark" : ""} bg-gray-100 dark:bg-gray-900 transition-colors duration-500`}>
      
      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 768) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed md:relative z-50 w-64 bg-white dark:bg-gray-800 p-6 h-full shadow-xl flex flex-col"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">KidBooks</h2>
            <nav className="flex flex-col gap-4">
              <SidebarLink href="/dashboard" icon={<FiUsers />}>Dashboard</SidebarLink>
              <SidebarLink href="/children" icon={<FiUsers />}>Children</SidebarLink>
              <SidebarLink href="/reading-session" icon={<FiBook />}>Reading Sessions</SidebarLink>
              <SidebarLink href="/progress" icon={<FiAward />}>Progress</SidebarLink>
            </nav>
            <button
              onClick={() => setSidebarOpen(false)}
              className="mt-auto md:hidden bg-red-500 text-white p-2 rounded-lg shadow hover:bg-red-600 transition"
            >
              <FiX /> Close
            </button>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-8 md:ml-64 transition-all duration-300">
        <header className="flex justify-between items-center mb-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden bg-gray-200 dark:bg-gray-700 p-2 rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            <FiMenu className="text-xl" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome back 👋</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
            + New Session
          </button>
        </header>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Children" value={dashboardData.childrenCount} icon={<FiUsers />} />
          <StatCard title="Sessions" value={dashboardData.sessionsCount} icon={<FiBook />} />
          <StatCard title="Progress" value={`${dashboardData.progress}%`} icon={<FiAward />} />
          <StatCard title="Activity" value={dashboardData.recentActivity.length} icon={<FiActivity />} />
        </div>

        {/* Progress Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Progress Over Time</h2>
          {dashboardData.progressHistory.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No progress data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dashboardData.progressHistory}>
                <XAxis dataKey="date" stroke={isDark ? "#fff" : "#555"} />
                <YAxis stroke={isDark ? "#fff" : "#555"} />
                <Tooltip contentStyle={{ backgroundColor: isDark ? "#1f2937" : "#fff", borderRadius: "8px" }} />
                <Bar dataKey="progress" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h2>
          {dashboardData.recentActivity.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No recent activity</p>
          ) : (
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              {dashboardData.recentActivity.map((activity, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-2 border-b border-gray-200 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  {activity}
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

// Sidebar Link Component
function SidebarLink({ href, icon, children }) {
  return (
    <Link
      to={href}
      className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      {icon} {children}
    </Link>
  );
}

// Stat Card Component
function StatCard({ title, value, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-xl transition flex items-center gap-4"
    >
      <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-lg text-blue-700 dark:text-white">{icon}</div>
      <div>
        <p className="text-gray-500 dark:text-gray-400">{title}</p>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{value}</h2>
      </div>
    </motion.div>
  );
}
