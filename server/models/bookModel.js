const db = require('./db');

async function getBooksForUser(planType) {
  let query = `SELECT * FROM books WHERE is_published = true`;
  const params = [];

  if (planType === 'free') {
    query += ` AND is_premium = false`;
  }

  const result = await db.query(query, params);
  return result.rows;
}

async function getBookById(bookId) {
  const result = await db.query(
    `SELECT * FROM books WHERE id = $1 AND is_published = true`,
    [bookId]
  );
  return result.rows[0];
}

module.exports = { getBooksForUser, getBookById };
