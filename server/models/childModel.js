const childModel = {

  createChild: async ({ user_id, name, birth_date, avatar_url, reading_level = 1 }) => {
    const query = `
      INSERT INTO children (user_id, name, birth_date, avatar_url, reading_level)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, user_id, name, birth_date, avatar_url, reading_level, created_at
    `;
    const values = [user_id, name, birth_date, avatar_url, reading_level];
    const { rows } = await global.db.query(query, values);
    return rows[0];
  },

  getChildrenByUser: async (user_id) => {
    const query = `
      SELECT id, user_id, name, birth_date, avatar_url, reading_level, created_at
      FROM children
      WHERE user_id = $1
    `;
    const { rows } = await global.db.query(query, [user_id]);
    return rows;
  },

  getChildById: async (id) => {
    const query = `
      SELECT id, user_id, name, birth_date, avatar_url, reading_level, created_at
      FROM children
      WHERE id = $1
    `;
    const { rows } = await global.db.query(query, [id]);
    return rows[0] || null;
  },

  updateChild: async (id, fields = {}) => {
    const allowedFields = ['name', 'birth_date', 'avatar_url', 'reading_level']; // Whitelist of allowed columns to update
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

    if (setClauses.length === 0) return null;

    values.push(id);

    const query = `
      UPDATE children
      SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${i}
      RETURNING id, user_id, name, birth_date, avatar_url, reading_level, updated_at
    `;
    const { rows } = await global.db.query(query, values);
    return rows[0];
  },

  updateReadingLevel: async (child_id, change) => {
    const query = `
      UPDATE children
      SET reading_level = GREATEST(1, reading_level + $2),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING reading_level
    `;
    const { rows } = await global.db.query(query, [child_id, change]);
    return rows[0];
  },

  deleteChild: async (id) => {
    const query = `
      DELETE FROM children
      WHERE id = $1
      RETURNING id
    `;
    const { rows } = await global.db.query(query, [id]);
    return rows[0];
  }

};

module.exports = childModel;
