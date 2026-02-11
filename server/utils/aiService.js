const axios = require('axios');

async function sendSessionToAI(sessionData) {
  try {
    const response = await axios.post('http://localhost:6000/api/ai/analyze', sessionData);
    return response.data.insights;
  } catch (err) {
    console.error('AI service error:', err.message);
    return [];
  }
}

module.exports = { sendSessionToAI };
