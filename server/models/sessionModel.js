const db = global.db; // using the global pool

const readingSessionModel = {

  // Start a new session
  startSession: async ({ child_id, book_id, device_type }) => {
    const query = `
      INSERT INTO reading_sessions (child_id, book_id, device_type)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [child_id, book_id, device_type];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  // End a session and fetch page/audio events
  endSession: async ({ session_id, end_time, total_minutes }) => {
    try {
      // 1️⃣ Update the session
      const updateQuery = `
        UPDATE reading_sessions
        SET end_time = $1, total_minutes = $2
        WHERE id = $3
        RETURNING *;
      `;
      const updateValues = [end_time, total_minutes, session_id];
      const sessionResult = await db.query(updateQuery, updateValues);
      const session = sessionResult.rows[0];

      if (!session) return null;

      // 2️⃣ Fetch page events
      const pageQuery = `
        SELECT page_number, event_type, time_spent_seconds, created_at
        FROM page_events
        WHERE session_id = $1
        ORDER BY created_at ASC;
      `;
      const pageResult = await db.query(pageQuery, [session_id]);
      session.page_events = pageResult.rows;

      // 3️⃣ Fetch audio events
      const audioQuery = `
        SELECT page_number, action, created_at
        FROM audio_events
        WHERE session_id = $1
        ORDER BY created_at ASC;
      `;
      const audioResult = await db.query(audioQuery, [session_id]);
      session.audio_events = audioResult.rows;

      return session;
    } catch (err) {
      console.error('Error in readingSessionModel.endSession:', err);
      throw err;
    }
  }

};

module.exports = readingSessionModel;
