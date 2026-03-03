import React, { useState, useEffect } from "react";
import api from "../api/api";
import ProgressChart from "../components/ProgressChart";
import { BookOpen, CheckCircle, Clock } from "lucide-react";

export default function Progress() {
  const [children, setChildren] = useState([]);
  const [books, setBooks] = useState({});
  const [childProgress, setChildProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Fetch children and all books
        const [childrenRes, booksRes] = await Promise.all([
          api.get("/children"),
          api.get("/books")
        ]);

        const childrenData = childrenRes.data.children || childrenRes.data;
        const booksData = booksRes.data.books || booksRes.data;

        // Map books by ID for quick lookup
        const bookMap = {};
        booksData.forEach(b => {
          bookMap[b.id] = b;
        });
        setBooks(bookMap);
        setChildren(childrenData);

        // 2. Fetch progress for each child
        const progressPromises = childrenData.map(child => 
          api.get(`/progress/${child.id}`)
        );

        const progressResults = await Promise.all(progressPromises);
        
        const progressMap = {};
        progressResults.forEach((res, index) => {
          const childId = childrenData[index].id;
          progressMap[childId] = res.data.progress || res.data;
        });

        setChildProgress(progressMap);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching progress data:", err);
        setError("Failed to load progress data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-lg m-6 border border-red-200">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Learning Progress</h1>
        <p className="text-gray-600">Track how your children are doing with their reading goals.</p>
      </header>

      {children.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-900">No children registered yet</h2>
          <p className="text-gray-500 mt-2">Go to the Children page to add your first child.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {children.map(child => {
            const progress = childProgress[child.id] || [];
            const enrichedProgress = progress.map(p => ({
              ...p,
              book_title: books[p.book_id]?.title || "Unknown Book"
            }));

            return (
              <section key={child.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {child.avatar_url ? (
                      <img src={child.avatar_url} alt={child.name} className="w-16 h-16 rounded-full border-2 border-white shadow-sm" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-2xl border-2 border-white shadow-sm">
                        {child.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{child.name}'s Reading</h2>
                      <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded-full uppercase tracking-wider">
                        {child.reading_level}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Books Read</p>
                      <p className="text-xl font-bold text-indigo-600">{enrichedProgress.filter(p => p.completed).length}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">In Progress</p>
                      <p className="text-xl font-bold text-amber-500">{enrichedProgress.filter(p => !p.completed).length}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-indigo-500" />
                      Active Books
                    </h3>
                    
                    {enrichedProgress.length === 0 ? (
                      <div className="py-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        No reading activity recorded yet.
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {enrichedProgress.map(p => {
                          const book = books[p.book_id];
                          return (
                            <div key={p.id} className="group">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex gap-3">
                                  {book?.cover_image_url && (
                                    <img src={book.cover_image_url} alt={book.title} className="w-12 h-16 object-cover rounded shadow-sm" />
                                  )}
                                  <div>
                                    <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{p.book_title}</h4>
                                    <p className="text-xs text-gray-500">Last read: {new Date(p.last_read_at).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                {p.completed && (
                                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                )}
                              </div>
                              <div className="relative pt-1">
                                <div className="flex items-center justify-between mb-1">
                                  <div>
                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                                      {p.progress_percent}%
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-xs font-semibold inline-block text-indigo-600">
                                      Page {p.last_page_read}
                                    </span>
                                  </div>
                                </div>
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-100">
                                  <div style={{ width: `${p.progress_percent}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-500"></div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Progress Visualization</h3>
                    {enrichedProgress.length > 0 ? (
                      <ProgressChart data={enrichedProgress} />
                    ) : (
                      <div className="h-64 flex items-center justify-center text-gray-400 italic">
                        Start reading to see progress charts
                      </div>
                    )}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
