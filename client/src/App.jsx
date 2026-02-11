import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ReadingSession from "./pages/ReadingSession";
import Login from "./pages/Login";
import Analytics from "./pages/Analytics";
import Children from "./pages/Children";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/session/:bookId/:childId" element={<ReadingSession />} />
            <Route path="/login" element={<Login />} />

            <Route path="/children" element={<Children />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
