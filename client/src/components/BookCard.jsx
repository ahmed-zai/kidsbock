export default function BookCard({ book }) {
  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition">
      <img src={book.cover_image_url} alt={book.title} className="w-full h-40 object-cover mb-2 rounded"/>
      <h3 className="font-semibold">{book.title}</h3>
      <p className="text-sm text-gray-600">{book.description}</p>
    </div>
  );
}
