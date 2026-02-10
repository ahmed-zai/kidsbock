const db = require('./db');

async function getProgress(childId, bookId) {
  const result = await db.query(
    `SELECT * FROM reading_progress WHERE child_id = $1 AND book_id = $2`,
    [childId, bookId]
  );
  return result.rows[0];
}

async function upsertProgress(childId, bookId, lastPage, percent, completed) {
  await db.query(
    `INSERT INTO reading_progress (child_id, book_id, last_page_read, progress_percent, completed)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (child_id, book_id)
     DO UPDATE SET
       last_page_read = EXCLUDED.last_page_read,
       progress_percent = EXCLUDED.progress_percent,
       completed = EXCLUDED.completed,
       last_read_at = CURRENT_TIMESTAMP`,
    [childId, bookId, lastPage, percent, completed]
  );
}

module.exports = { getProgress, upsertProgress };
