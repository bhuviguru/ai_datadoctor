const intelligenceService = require('./intelligenceService');

const generateExplanation = async (context) => {
  const { table, issue, type } = context;
  console.log(`[AI-ENGINE] Synthesizing comprehensive LLM report for ${table}...`);
  
  const explanationText = await intelligenceService.generateExplanation(table, issue);

  return `### 🩺 DIAGNOSTIC REPORT: ${table}

**[ANALYSIS]**: 
${explanationText}

**[STATUS]**: 
Neural engine synchronized. Autonomous remediation protocols are ready for deployment.

---
*Synthesized via Google Gemini 3 Flash • AI Data Doctor Pro*`;
};

const generateChatResponse = async (message) => {
  return await intelligenceService.generateChatResponse(message);
};

module.exports = {
  generateExplanation,
  generateChatResponse
};

