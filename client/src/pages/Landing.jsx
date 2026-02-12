import { useTheme } from "../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Landing() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  // ✅ Auto redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleToggleDarkMode = () => {
    toggleDarkMode(); // call context function
    console.log(`Dark mode is now: ${!isDarkMode}`); // optional: log the new state
  };


  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-sky-100 via-pink-100 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">

        {/* 🌙 DARK MODE TOGGLE */}
        <button
          onClick={toggleDarkMode}
          className="absolute top-6 right-6 bg-white dark:bg-gray-700 p-3 rounded-full shadow-md hover:scale-110 transition"
        >
          {isDarkMode ? "🌞" : "🌙"}
        </button>

        {/* FLOATING CLOUDS */}
        <div className="absolute top-10 left-10 w-32 h-20 bg-white rounded-full opacity-70 blur-sm animate-cloud" />
        <div className="absolute top-24 right-16 w-40 h-24 bg-white rounded-full opacity-60 blur-sm animate-cloudSlow" />

        {/* SOFT FLOATING SHAPES */}
        <div className="absolute bottom-10 left-1/4 w-24 h-24 bg-pink-300 opacity-30 rounded-full animate-float" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-yellow-300 opacity-30 rounded-full animate-floatSlow" />

        {/* HERO */}
        <div className="flex flex-col items-center text-center px-6 pt-20 pb-10 relative z-10">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3468/3468377.png"
            alt="Mascot"
            className="w-36 mb-6 animate-bounce-slow"
          />
          <h1 className="text-4xl md:text-5xl font-extrabold text-purple-700 dark:text-yellow-300 mb-4">
            Smart Reading for Happy Kids 📚✨
          </h1>
          <p className="max-w-2xl text-gray-700 dark:text-gray-300 text-lg">
            Stories, rewards, and an AI reading coach that helps parents
            understand and support their child’s learning journey.
          </p>
        </div>

        {/* FEATURES */}
        <div className="grid md:grid-cols-3 gap-6 px-6 max-w-6xl mx-auto py-10 relative z-10">
          <FeatureCard icon="📖" title="Interactive Books" text="Fun stories with sound and pictures." />
          <FeatureCard icon="🏆" title="Badges & Rewards" text="Kids stay motivated while reading." />
          <FeatureCard icon="🤖" title="AI Reading Coach" text="Smart insights to guide parents." />
        </div>

        {/* AUTH CARD */}
        <div className="flex justify-center px-6 pb-20 relative z-10">
          <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 w-full max-w-md transform hover:scale-105 transition duration-300">

            <h2 className="text-2xl font-bold text-center text-purple-700 dark:text-yellow-300 mb-6">
              Welcome Back 👋
            </h2>

            <Link
              to="/login"
              className="block w-full bg-purple-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-purple-700 hover:scale-105 transition mb-4"
            >
              Login
            </Link>

            <p className="text-center text-gray-500 dark:text-gray-400 mb-4">
              New here?
            </p>

            <Link
              to="/register"
              className="block w-full border-2 border-purple-600 text-purple-700 dark:text-yellow-300 text-center py-3 rounded-lg font-semibold hover:bg-purple-50 dark:hover:bg-gray-700 hover:scale-105 transition"
            >
              Create Account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition duration-300 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-bold text-lg text-purple-700 dark:text-yellow-300 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">
        {text}
      </p>
    </div>
  );
}
