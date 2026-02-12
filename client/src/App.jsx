import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // Import useAuth

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Children from "./pages/Children";
import ReadingSession from "./pages/ReadingSession";
import { useTheme } from "./context/ThemeContext";

import "./index.css"

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { loading } = useAuth(); // Use useAuth hook
    const { isDarkMode } = useTheme();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-2xl font-semibold">Loading authentication...</p>
      </div>
    );
  }

  return (
   
     <div className={isDarkMode ? "dark" : ""}>
      <Routes>

        {/* Public Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/children"
          element={
            <ProtectedRoute>
              <Children />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reading-session"
          element={
            <ProtectedRoute>
              <ReadingSession />
            </ProtectedRoute>
          }
        />

      </Routes>
    </div>
      
      
  );
}

export default App;
