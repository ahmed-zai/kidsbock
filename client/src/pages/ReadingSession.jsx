import { useEffect, useState } from 'react';
import api from '../api/api';
import BookCard from '../components/BookCard';
import InsightCard from '../components/InsightCard';

export default function ReadingSession() {
  const [books, setBooks] = useState([]);
  const [children, setChildren] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [session, setSession] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [insights, setInsights] = useState([]);
  const [deviceType, setDeviceType] = useState('tablet');
  const [pageContent, setPageContent] = useState(null);

  // Fetch books and children on mount
  useEffect(() => {
    api.get('/books')
      .then(res => setBooks(res.data.books || res.data))
      .catch(err => console.error(err));
    
    api.get('/children')
      .then(res => {
        const childrenList = res.data.children || res.data;
        setChildren(childrenList);
        if (childrenList.length > 0) setSelectedChild(childrenList[0]);
      })
      .catch(err => console.error(err));
  }, []);

  // Fetch page content whenever book or page changes
  useEffect(() => {
    if (selectedBook && currentPage > 0 && (pageCount === 0 || currentPage <= pageCount)) {
      api.get(`/books/${selectedBook.id}/pages/${currentPage}`)
        .then(res => setPageContent(res.data))
        .catch(err => console.error(err));
    }
  }, [selectedBook, currentPage, pageCount]);

  // Fetch page count when book changes
  useEffect(() => {
    if (selectedBook) {
      api.get(`/books/${selectedBook.id}/pages`)
        .then(res => setPageCount(res.data.length))
        .catch(err => console.error(err));
      setCurrentPage(1);
    }
  }, [selectedBook]);

  const handleStartSession = async () => {
    if (!selectedBook) return alert('Select a book first');
    if (!selectedChild) return alert('Select a child first');
    try {
      const res = await api.post('/sessions/start', {
        child_id: selectedChild.id,
        book_id: selectedBook.id,
        device_type: deviceType,
      });
      setSession(res.data.session);
    } catch (err) {
      console.error(err);
      alert('Failed to start session');
    }
  };

  const handlePageEvent = async (eventType) => {
    if (!session) return;
    try {
      await api.post('/page-events', {
        session_id: session.id,
        page_number: currentPage,
        event_type: eventType,
        time_spent_seconds: 1, 
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAudioEvent = async (action) => {
    if (!session) return;
    try {
      await api.post('/audio-events', {
        session_id: session.id,
        page_number: currentPage,
        action,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const nextPage = () => {
    handlePageEvent('next');
    if (currentPage < pageCount) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    handlePageEvent('previous');
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleEndSession = async () => {
    if (!session) return;
    try {
      const res = await api.post('/sessions/end', {
        session_id: session.id,
        end_time: new Date(),
        total_minutes: Math.ceil((new Date() - new Date(session.start_time)) / 60000),
      });
      setInsights(res.data.insights);
      setSession(null);
      setCurrentPage(1);
      setPageContent(null);
    } catch (err) {
      console.error(err);
      alert('Failed to end session');
    }
  };

  const handleBackToSelection = () => {
    setSession(null);
    setCurrentPage(1);
    setPageContent(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Interactive Reading Session</h1>

      {!session ? (
        <>
          {/* Child selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Child:</label>
            <div className="flex gap-4">
              {children.length === 0 ? (
                <p className="text-red-500">No children found. Please add a child first.</p>
              ) : (
                children.map(child => (
                  <div
                    key={child.id}
                    onClick={() => setSelectedChild(child)}
                    className={`cursor-pointer p-4 border rounded-xl flex items-center gap-3 transition ${
                      selectedChild?.id === child.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <img src={child.avatar_url || 'https://via.placeholder.com/50'} alt={child.name} className="w-10 h-10 rounded-full" />
                    <span className="font-semibold">{child.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Book selection */}
          <h2 className="text-lg font-semibold mb-2">Select a Book:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {books.map(book => (
              <div
                key={book.id}
                className={`cursor-pointer p-2 border rounded ${
                  selectedBook?.id === book.id ? 'border-blue-600 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedBook(book)}
              >
                <BookCard book={book} />
              </div>
            ))}
          </div>

          {/* Device selection */}
          <div className="mb-4">
            <label className="mr-2">Device:</label>
            <select
              value={deviceType}
              onChange={e => setDeviceType(e.target.value)}
              className="border p-1 rounded"
            >
              <option value="tablet">Tablet</option>
              <option value="mobile">Mobile</option>
              <option value="desktop">Desktop</option>
            </select>
          </div>

          <div className="mb-4">
            <button
              onClick={handleStartSession}
              className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Start Session
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handleBackToSelection}
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              ← Back to Selection
            </button>
            <button
              onClick={handleEndSession}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
            >
              End Session
            </button>
          </div>

          {/* Page display */}
          {pageContent && (
            <div className="bg-white border rounded-2xl p-8 shadow-sm mb-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Page {currentPage} of {pageCount}</h2>
                <span className="text-sm text-gray-500">Reading with {selectedChild?.name}</span>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8">
                {pageContent.image_url && (
                  <div className="flex-1 text-center">
                    <img src={pageContent.image_url} alt={`Page ${currentPage}`} className="max-w-full h-auto rounded-xl shadow-md mx-auto" />
                  </div>
                )}
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-2xl leading-relaxed text-gray-800 mb-6">{pageContent.text_content}</p>
                  
                  {pageContent.audio_url && (
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                      <audio
                        src={pageContent.audio_url}
                        controls
                        className="w-full"
                        onPlay={() => handleAudioEvent('play')}
                        onPause={() => handleAudioEvent('pause')}
                      />
                    </div>
                  )}

                  <div className="flex justify-between items-center gap-4">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className="flex-1 bg-gray-100 py-3 rounded-xl font-semibold disabled:opacity-50 transition hover:bg-gray-200"
                    >
                      Previous
                    </button>
                    <button
                      onClick={nextPage}
                      disabled={currentPage === pageCount}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 transition hover:bg-blue-700 shadow-md"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* AI Insights */}
      {insights.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">AI Insights</h2>
          <div className="grid gap-4">
            {insights.map(insight => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
