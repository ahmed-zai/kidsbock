const db = require('./db');

async function createChild(userId, name, birthDate, avatarUrl) {
  const result = await db.query(
    `INSERT INTO children (user_id, name, birth_date, avatar_url)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, name, birthDate, avatarUrl]
  );
  return result.rows[0];
}

async function getChildrenByUser(userId) {
  const result = await db.query(
    `SELECT * FROM children WHERE user_id = $1`,
    [userId]
  );
  return result.rows;
}

module.exports = { createChild, getChildrenByUser };
