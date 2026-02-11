const readingProgressModel = {

  updateProgress: async ({ child_id, book_id, last_page_read, progress_percent, completed }) => {
    const query = `
      INSERT INTO reading_progress (child_id, book_id, last_page_read, progress_percent, completed)
      VALUES ($1,$2,$3,$4,$5)
      ON CONFLICT (child_id, book_id)
      DO UPDATE SET last_page_read = EXCLUDED.last_page_read,
                    progress_percent = EXCLUDED.progress_percent,
                    completed = EXCLUDED.completed,
                    last_read_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const values = [child_id, book_id, last_page_read, progress_percent, completed];
    const { rows } = await global.db.query(query, values);
    return rows[0];
  },

  getProgressByChild: async (child_id) => {
    const query = `SELECT * FROM reading_progress WHERE child_id = $1`;
    const { rows } = await global.db.query(query, [child_id]);
    return rows;
  }
};

module.exports = readingProgressModel;
