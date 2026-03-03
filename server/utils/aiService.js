const axios = require('axios');

async function sendSessionToAI(sessionData) {
  const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://flask:6000';
  try {
    const response = await axios.post(`${aiServiceUrl}/api/ai/analyze`, sessionData);
    return response.data.insights;
  } catch (err) {
    console.error('AI service error:', err.message);
    return [];
  }
}

module.exports = { sendSessionToAI };
