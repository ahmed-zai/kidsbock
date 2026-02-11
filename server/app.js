require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { Pool } = require('pg');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// -----------------------------
// POSTGRES CONNECTION
// -----------------------------
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch((err) => console.error('PostgreSQL connection error:', err));

global.db = pool; // make DB accessible in models

// -----------------------------
// MIDDLEWARE
// -----------------------------
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later',
});
app.use(limiter);

// -----------------------------
// ROUTES
// -----------------------------
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'HKids API is running' });
});

// -----------------------------
// ERROR HANDLER
// -----------------------------
app.use(errorHandler);

// -----------------------------
// START SERVER
// -----------------------------
app.listen(PORT, () => {
  console.log(`HKids backend running on port ${PORT}`);
});
