const pageEventModel = {

  addPageEvent: async ({ session_id, page_number, event_type, time_spent_seconds }) => {
    const query = `
      INSERT INTO page_events (session_id, page_number, event_type, time_spent_seconds)
      VALUES ($1,$2,$3,$4)
      RETURNING *
    `;
    const values = [session_id, page_number, event_type, time_spent_seconds];
    const { rows } = await global.db.query(query, values);
    return rows[0];
  }

};

module.exports = pageEventModel;
