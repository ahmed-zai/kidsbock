const childModel = require('../models/childModel');
const readingSessionModel = require('../models/sessionModel'); // Not directly used for count/activity, but good to have imported if needed later.
const readingProgressModel = require('../models/progressModel'); // Not directly used for count/history, but good to have imported if needed later.

const getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch Children Count
        const children = await childModel.getChildrenByUser(userId);
        const childrenCount = children.length;

        // Fetch Sessions Count and Recent Activity
        const childIds = children.map(child => child.id);

        let sessionsCount = 0;
        let recentActivity = [];

        if (childIds.length > 0) {
            // Get total sessions count for all children of the user
            const totalSessionsQuery = `
                SELECT COUNT(rs.id) AS total_sessions
                FROM reading_sessions rs
                JOIN children c ON rs.child_id = c.id
                WHERE c.user_id = $1;
            `;
            const { rows: totalSessionsResult } = await global.db.query(totalSessionsQuery, [userId]);
            sessionsCount = parseInt(totalSessionsResult[0].total_sessions, 10);

            // Fetch recent sessions for recent activity
            const recentSessionsQuery = `
                SELECT
                    rs.id,
                    rs.created_at,
                    c.name AS child_name,
                    b.title AS book_title
                FROM
                    reading_sessions rs
                JOIN
                    children c ON rs.child_id = c.id
                JOIN
                    books b ON rs.book_id = b.id
                WHERE
                    c.user_id = $1
                ORDER BY
                    rs.created_at DESC
                LIMIT 5;
            `;
            const { rows: recentSessions } = await global.db.query(recentSessionsQuery, [userId]);

            recentActivity = recentSessions.map(session => (
                `${session.child_name} read "${session.book_title}" on ${new Date(session.created_at).toLocaleDateString()}`
            ));
        }

        // Placeholder for Progress and Progress History
        // Full implementation for these would be more complex and might require schema changes.
        const progress = 0; // Placeholder
        const progressHistory = []; // Placeholder

        res.status(200).json({
            childrenCount,
            sessionsCount,
            progress,
            recentActivity,
            progressHistory,
        });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getDashboardData,
};
