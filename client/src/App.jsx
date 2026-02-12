// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./context/ThemeContext";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Children from "./pages/Children";
import Analytics from "./pages/Analytics";
import ReadingSession from "./pages/ReadingSession";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
          {/* Sidebar visible only after login, can handle auth later */}
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/children" element={<Children />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/session/:bookId/:childId" element={<ReadingSession />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
