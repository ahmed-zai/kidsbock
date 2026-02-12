import { useEffect, useState } from "react";
import api from "../api/api";
export default function Analytics() {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/insights");
      setInsights(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <pre>{JSON.stringify(insights, null, 2)}</pre>
    </div>
  );
}
