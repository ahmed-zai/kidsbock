const db = require('./db');

async function createUser(fullName, email, passwordHash) {
  const result = await db.query(
    `INSERT INTO users (full_name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, full_name, email, plan_type`,
    [fullName, email, passwordHash]
  );
  return result.rows[0];
}

async function findUserByEmail(email) {
  const result = await db.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0];
}

async function updateUserPlan(userId, planType) {
  await db.query(
    `UPDATE users SET plan_type = $1 WHERE id = $2`,
    [planType, userId]
  );
}

module.exports = { createUser, findUserByEmail, updateUserPlan };
