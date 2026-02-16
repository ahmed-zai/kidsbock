const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const childrenRoutes = require('./childrenRoutes');
const booksRoutes = require('./booksRoutes');
const progressRoutes = require('./readingProgressRoutes');
const sessionRoutes = require('./readingSessionRoutes');
const pageEventRoutes = require('./pageEventRoutes');
const audioEventRoutes = require('./audioEventRoutes');
const aiInsightRoutes = require('./aiInsightRoutes');
const dashboardController = require('../controllers/dashboardController'); // Assuming this will be used for /dashboard
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

// Mount sub-routers under their respective paths
router.use('/users', userRoutes); // Matches /users/*
router.use('/children', childrenRoutes);
router.use('/books', booksRoutes);
router.use('/progress', progressRoutes);
router.use('/sessions', sessionRoutes);
router.use('/page-events', pageEventRoutes);
router.use('/audio-events', audioEventRoutes);
router.use('/insights', aiInsightRoutes);

// Handle dashboard route (if it's not part of another module)
// The path here is '/dashboard' because index.js is mounted under '/api' in app.js
router.get('/dashboard', protect, dashboardController.getDashboardData);

module.exports = router;
