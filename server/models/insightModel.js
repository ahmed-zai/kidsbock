const db = global.db;

const insightModel = {

  // 🔹 Save ONE insight (keep this — useful for manual/admin inserts)
  saveInsight: async ({ child_id, insight_type, score, summary }) => {
    const query = `
      INSERT INTO child_insights (child_id, insight_type, score, summary)
      VALUES ($1,$2,$3,$4)
      RETURNING *
    `;
    const { rows } = await db.query(query, [child_id, insight_type, score, summary]);
    return rows[0];
  },

  // 🔹 Save MULTIPLE AI insights at once (NEW)
  saveInsights: async (child_id, insights) => {
    if (!insights || insights.length === 0) return;

    const query = `
      INSERT INTO child_insights (child_id, insight_type, score, summary)
      VALUES ($1,$2,$3,$4)
    `;

    for (const insight of insights) {
      await db.query(query, [
        child_id,
        insight.type,
        insight.score,
        insight.summary
      ]);
    }
  },

  // 🔹 Get all insights for a child
  getInsightsByChild: async (child_id) => {
    const query = `
      SELECT * FROM child_insights
      WHERE child_id = $1
      ORDER BY generated_at DESC
    `;
    const { rows } = await db.query(query, [child_id]);
    return rows;
  }

};

module.exports = insightModel;
