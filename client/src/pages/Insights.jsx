import { useEffect, useState } from 'react';
import api from '../api/api';
import InsightCard from '../components/InsightCard';

export default function Insights() {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    api.get('/insights')
      .then(res => setInsights(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">AI Insights</h1>
      {insights.length === 0 && <p>No insights yet</p>}
      {insights.map(insight => <InsightCard key={insight.id} insight={insight} />)}
    </div>
  );
}
