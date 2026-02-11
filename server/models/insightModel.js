const insightModel = {

  saveInsight: async ({ child_id, insight_type, score, summary }) => {
    const query = `
      INSERT INTO child_insights (child_id, insight_type, score, summary)
      VALUES ($1,$2,$3,$4)
      RETURNING *
    `;
    const { rows } = await global.db.query(query, [child_id, insight_type, score, summary]);
    return rows[0];
  },

  getInsightsByChild: async (child_id) => {
    const query = `
      SELECT * FROM child_insights
      WHERE child_id = $1
      ORDER BY generated_at DESC
    `;
    const { rows } = await global.db.query(query, [child_id]);
    return rows;
  }

};

module.exports = insightModel;
