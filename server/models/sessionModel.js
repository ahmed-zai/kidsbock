const db = require('./db');

async function startReadingSession(childId, bookId, deviceType) {
  const result = await db.query(
    `INSERT INTO reading_sessions (child_id, book_id, device_type)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [childId, bookId, deviceType]
  );
  return result.rows[0].id;
}

async function endReadingSession(sessionId, totalMinutes) {
  await db.query(
    `UPDATE reading_sessions
     SET end_time = CURRENT_TIMESTAMP, total_minutes = $2
     WHERE id = $1`,
    [sessionId, totalMinutes]
  );
}

async function logPageEvent(sessionId, pageNumber, eventType, timeSpent) {
  await db.query(
    `INSERT INTO page_events (session_id, page_number, event_type, time_spent_seconds)
     VALUES ($1, $2, $3, $4)`,
    [sessionId, pageNumber, eventType, timeSpent]
  );
}

module.exports = { startReadingSession, endReadingSession, logPageEvent };
