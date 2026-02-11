const readingSessionModel = {

  startSession: async ({ child_id, book_id, device_type }) => {
    const query = `
      INSERT INTO reading_sessions (child_id, book_id, device_type)
      VALUES ($1,$2,$3)
      RETURNING *
    `;
    const { rows } = await global.db.query(query, [child_id, book_id, device_type]);
    return rows[0];
  },

  endSession: async ({ session_id, end_time, total_minutes }) => {
    const query = `
      UPDATE reading_sessions
      SET end_time = $1, total_minutes = $2
      WHERE id = $3
      RETURNING *
    `;
    const { rows } = await global.db.query(query, [end_time, total_minutes, session_id]);
    return rows[0];
  }
};

module.exports = readingSessionModel;
