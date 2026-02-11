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

router.use('/users', userRoutes);
router.use('/children', childrenRoutes);
router.use('/books', booksRoutes);
router.use('/progress', progressRoutes);
router.use('/sessions', sessionRoutes);
router.use('/page-events', pageEventRoutes);
router.use('/audio-events', audioEventRoutes);
router.use('/insights', aiInsightRoutes);

module.exports = router;
