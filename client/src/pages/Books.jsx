import { useEffect, useState } from 'react';
import api from '../api/api';
import BookCard from '../components/BookCard';

export default function Books() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    api.get('/books')
      .then(res => setBooks(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {books.map(book => <BookCard key={book.id} book={book} />)}
    </div>
  );
}
