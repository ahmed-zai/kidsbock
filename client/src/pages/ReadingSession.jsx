import { useEffect, useState } from 'react';
import api from '../api/api';
import BookCard from '../components/BookCard';
import InsightCard from '../components/InsightCard';

export default function ReadingSession() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [session, setSession] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [insights, setInsights] = useState([]);
  const [deviceType, setDeviceType] = useState('tablet');
  const [pageContent, setPageContent] = useState(null);

  // Fetch books on mount
  useEffect(() => {
    api.get('/books')
      .then(res => setBooks(res.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch page content whenever book or page changes
  useEffect(() => {
    if (selectedBook && currentPage > 0 && currentPage <= pageCount) {
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
    try {
      const res = await api.post('/sessions/start', {
        child_id: 'YOUR_CHILD_ID', // replace with real child ID
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
        time_spent_seconds: 1, // can integrate timer logic for real time
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Interactive Reading Session</h1>

      {/* Book selection */}
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

      {/* Start/End session */}
      <div className="mb-4">
        {!session ? (
          <button
            onClick={handleStartSession}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Start Session
          </button>
        ) : (
          <button
            onClick={handleEndSession}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            End Session
          </button>
        )}
      </div>

      {/* Page display */}
      {session && pageContent && (
        <div className="border p-4 rounded mb-4">
          <h2 className="font-semibold mb-2">Page {currentPage}</h2>
          <p className="mb-2">{pageContent.text_content}</p>
          {pageContent.image_url && (
            <img src={pageContent.image_url} alt={`Page ${currentPage}`} className="mb-2" />
          )}
          {pageContent.audio_url && (
            <audio
              src={pageContent.audio_url}
              controls
              onPlay={() => handleAudioEvent('play')}
              onPause={() => handleAudioEvent('pause')}
            />
          )}

          <div className="mt-2 flex justify-between">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={nextPage}
              disabled={currentPage === pageCount}
              className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* AI Insights */}
      {insights.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">AI Insights</h2>
          {insights.map(insight => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      )}
    </div>
  );
}
