const booksModel = {

  createBook: async ({ title, description, cover_image_url, content_url, audio_url, reading_level, age_min, age_max, is_published = false, is_premium = false }) => {
    const query = `
      INSERT INTO books (title, description, cover_image_url, content_url, audio_url, reading_level, age_min, age_max, is_published, is_premium)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
    `;
    const values = [title, description, cover_image_url, content_url, audio_url, reading_level, age_min, age_max, is_published, is_premium];
    const { rows } = await global.db.query(query, values);
    return rows[0];
  },

  getAllBooks: async () => {
    const query = `SELECT * FROM books WHERE is_published = true`;
    const { rows } = await global.db.query(query);
    return rows;
  },

  getBookById: async (id) => {
    const query = `SELECT * FROM books WHERE id = $1`;
    const { rows } = await global.db.query(query, [id]);
    return rows[0];
  },

  updateBook: async (id, fields = {}) => {
    const allowedFields = ['title', 'description', 'cover_image_url', 'content_url', 'audio_url', 'reading_level', 'age_min', 'age_max', 'is_published', 'is_premium']; // Whitelist of allowed columns to update
    const setClauses = [];
    const values = [];
    let i = 1;
    for (const key in fields) {
      if (allowedFields.includes(key)) { // Only update allowed fields
        setClauses.push(`${key} = $${i}`);
        values.push(fields[key]);
        i++;
      }
    }
    values.push(id);
    if (setClauses.length === 0) return null; // No allowed fields to update

    const query = `
      UPDATE books
      SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${i}
      RETURNING *
    `;
    const { rows } = await global.db.query(query, values);
    return rows[0];
  },

  deleteBook: async (id) => {
    const query = `DELETE FROM books WHERE id = $1 RETURNING id`;
    const { rows } = await global.db.query(query, [id]);
    return rows[0];
  }
};

module.exports = booksModel;
