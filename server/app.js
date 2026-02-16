require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { Pool } = require('pg');
const routes = require('./routes'); // Re-enable modular routes import
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
const corsOptions = {
  origin: '*', // Allow all origins (for now, consider tightening in production)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', 1); // Enable trusting of proxy headers for correct IP identification

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
app.use('/', routes); // Change to use root path

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
