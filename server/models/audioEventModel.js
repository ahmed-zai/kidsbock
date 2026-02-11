const audioEventModel = {

  addAudioEvent: async ({ session_id, page_number, action }) => {
    const query = `
      INSERT INTO audio_events (session_id, page_number, action)
      VALUES ($1,$2,$3)
      RETURNING *
    `;
    const { rows } = await global.db.query(query, [session_id, page_number, action]);
    return rows[0];
  }

};

module.exports = audioEventModel;
