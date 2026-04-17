const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const calculateHealth = (table) => {
  let deductions = 0;

  // Logic: Latency threshold
  const latency = parseFloat(table.pipeline?.latency || 0);
  if (latency > 1.0) deductions += 30; // 1s+ is critical
  else if (latency > 0.5) deductions += 15; // 500ms+ is unstable

  // Logic: Pipeline history
  const history = table.pipeline?.history || [];
  const failures = history.filter(h => h === 'Failed').length;
  deductions += (failures * 20);

  // Logic: Missing ownership (Governance)
  if (table.owner === 'Unassigned') deductions += 10;

  const score = Math.max(100 - deductions, 0);

  let status = 'Healthy';
  if (score < 50) status = 'Critical';
  else if (score < 85) status = 'Unstable';

  return { score, status };
};

const getSurgicalSuggestion = async (table, issue) => {
  try {
    const prompt = `You are a Senior Data Observability AI. Analyze this data issue and provide a surgical remediation plan in JSON format.
    Table: ${table.name}
    Issue: ${issue}
    Telemetry: ${JSON.stringify(table.pipeline)}
    
    Return ONLY JSON with fields: root_cause, suggestion, action (2-3 words).`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // Simple JSON extraction
    const jsonStr = text.match(/\{.*\}/s)?.[0] || text;
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini failed, falling back to mock:", error);
    return {
      root_cause: 'General drift detected in telemetry stream',
      suggestion: 'Trigger manual re-validation of node integrity.',
      action: 'Re-validate'
    };
  }
};

const generateExplanation = async (table, issueText) => {
  try {
    const prompt = `Explain this data observability issue in plain English for a data engineer. 
    Explain why it matters and what the likely impact is.
    Table: ${table}
    Issue: ${issueText}
    Keep it concise but technical.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("DEBUG: Gemini API Error:", error.message);
    return "The neural engine is currently synchronizing with the cluster. Default remediation is recommended.";
  }
};

const generateChatResponse = async (prompt) => {
  const modelsToTry = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];

  for (const modelName of modelsToTry) {
    try {
      const modelInstance = genAI.getGenerativeModel({ model: modelName });
      const result = await modelInstance.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error(`Gemini Error with ${modelName}:`, error.message);
      if (error.message.includes('503') || error.message.includes('404')) {
        continue; // Try next model
      }
      throw error;
    }
  }
  return "I'm currently recalibrating my neural pathways. Please try again in a moment.";
};

module.exports = { calculateHealth, getSurgicalSuggestion, generateExplanation, generateChatResponse };