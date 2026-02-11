import { useEffect, useState } from 'react';
import api from '../api/api';
import ChildCard from '../components/ChildCard';

export default function Dashboard() {
  const [children, setChildren] = useState([]);

  useEffect(() => {
    api.get('/children')
      .then(res => setChildren(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Children</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {children.map(child => <ChildCard key={child.id} child={{ ...child, dob: child.dob }} />)}
      </div>
    </div>
  );
}
