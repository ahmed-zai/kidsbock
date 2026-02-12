import { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

export default function Children() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const res = await api.get("/children");
      setChildren(res.data.children || []);
    } catch (err) {
      console.error("Failed to fetch children", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Loading children...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Children</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children.map((child) => (
          <Link
            key={child.id}
            to={`/children/${child.id}`}
            className="bg-white shadow rounded-xl p-4 border hover:shadow-md transition block"
          >
            <img
              src={child.avatar_url || "https://via.placeholder.com/100"}
              alt={child.name}
              className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
            />
            <h2 className="text-lg font-semibold text-center">{child.name}</h2>
            <p className="text-sm text-gray-500 text-center">
              Reading Level: <span className="font-medium">{child.reading_level}</span>
            </p>
            <p className="text-xs text-gray-400 text-center mt-2">
              Born: {new Date(child.birth_date).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
