const childModel = require('../models/childModel');

/**
 * Reading levels in order
 */
const LEVELS = ['beginner', 'early', 'intermediate', 'advanced'];

/**
 * Decide how reading level should change based on AI score
 * @param {number} score - AI comprehension/engagement score (0–100)
 * @returns {number} change (-1, 0, +1)
 */
function calculateLevelChange(score) {
  if (score >= 85) return 1;     // Doing great → level up
  if (score <= 40) return -1;    // Struggling → level down
  return 0;                      // Stay at same level
}

/**
 * Adjust child reading level safely
 */
const adjustReadingLevel = async (child_id, score) => {
  const child = await childModel.getChildById(child_id);
  if (!child) return null;

  const currentIndex = LEVELS.indexOf(child.reading_level);
  if (currentIndex === -1) return null;

  const change = calculateLevelChange(score);
  let newIndex = currentIndex + change;

  // Prevent going below beginner or above advanced
  if (newIndex < 0) newIndex = 0;
  if (newIndex >= LEVELS.length) newIndex = LEVELS.length - 1;

  // No change needed
  if (newIndex === currentIndex) {
    return { updated: false, level: child.reading_level };
  }

  const newLevel = LEVELS[newIndex];

  const updatedChild = await childModel.updateChild(child_id, {
    reading_level: newLevel,
  });

  return {
    updated: true,
    old_level: child.reading_level,
    new_level: newLevel,
    child: updatedChild,
  };
};

module.exports = {
  adjustReadingLevel,
};
