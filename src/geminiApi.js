const axios = require('axios');
const { GEMINI_API_KEYS } = require('./config');
const { formatResponse } = require('./utils/messageFormatter');
const { matchesPattern } = require('./utils/messagePatterns');
const responseTemplates = require('./utils/responseTemplates');

class GeminiAPI {
  constructor() {
    this.currentApiKeyIndex = 0;
  }

  getNextApiKey() {
    const apiKey = GEMINI_API_KEYS[this.currentApiKeyIndex];
    this.currentApiKeyIndex = (this.currentApiKeyIndex + 1) % GEMINI_API_KEYS.length;
    return apiKey;
  }

  async generateResponse(prompt) {
    // Check for source code request
    if (matchesPattern(prompt, 'sourceCode')) {
      return responseTemplates.sourceCode;
    }

    // Regular AI response generation
    for (let i = 0; i < GEMINI_API_KEYS.length; i++) {
      try {
        const apiKey = this.getNextApiKey();
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        
        const response = await axios.post(url, {
          contents: [{
            parts: [{ text: prompt }]
          }]
        }, {
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.data.candidates && response.data.candidates[0]) {
          const rawText = response.data.candidates[0].content.parts[0].text;
          return formatResponse(rawText);
        }
      } catch (error) {
        console.error(`Error with API key: ${error.message}`);
        continue;
      }
    }
    
    return "Sorry, I couldn't generate a response at the moment. Please try again later.";
  }
}

module.exports = new GeminiAPI();