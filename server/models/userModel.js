const bcrypt = require('bcryptjs');

const userModel = {

  // Create a new user
  createUser: async ({ full_name, email, password_hash, role = 'parent', plan_type = 'free' }) => {
    const query = `
      INSERT INTO users (full_name, email, password_hash, role, plan_type)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, full_name, email, role, plan_type, created_at
    `;
    const values = [full_name, email, password_hash, role, plan_type];
    const { rows } = await global.db.query(query, values);
    return rows[0];
  },

  // Find a user by email (for login)
  findUserByEmail: async (email) => {
    const query = `
      SELECT id, full_name, email, password_hash, role, plan_type
      FROM users
      WHERE email = $1
    `;
    const { rows } = await global.db.query(query, [email]);
    return rows[0] || null;
  },

  // Get a user by ID
  getUserById: async (id) => {
    const query = `
      SELECT id, full_name, email, role, plan_type, created_at, updated_at
      FROM users
      WHERE id = $1
    `;
    const { rows } = await global.db.query(query, [id]);
    return rows[0] || null;
  },

  // Update user's plan (free -> premium)
  updateUserPlan: async (id, plan_type) => {
    const query = `
      UPDATE users
      SET plan_type = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, full_name, email, role, plan_type, updated_at
    `;
    const { rows } = await global.db.query(query, [plan_type, id]);
    return rows[0];
  },

  // Update user profile (example: full_name)
  updateUserProfile: async (id, fields = {}) => {
    const allowedFields = ['full_name', 'email', 'plan_type']; // Whitelist of allowed columns to update
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
      UPDATE users
      SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${i}
      RETURNING id, full_name, email, role, plan_type, updated_at
    `;

    const { rows } = await global.db.query(query, values);
    return rows[0];
  },

  // Delete a user
  deleteUser: async (id) => {
    const query = `
      DELETE FROM users
      WHERE id = $1
      RETURNING id
    `;
    const { rows } = await global.db.query(query, [id]);
    return rows[0];
  }
};

module.exports = userModel;
