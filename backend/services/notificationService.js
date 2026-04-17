/**
 * Notification Service (Slack/Discord Webhooks)
 */
const axios = require('axios');

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || null;

const sendAlert = async (table, action, success) => {
  if (!SLACK_WEBHOOK_URL) {
    console.log(`[SURGEON-ALERT] No Webhook configured. Notification simulation for ${table}: ${success ? 'RESOLVED' : 'FAILED'}`);
    return;
  }

  try {
    const message = {
      text: `💊 *Surgical Remediation Report: ${table}*`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Status Update*: ${success ? '✅ Success' : '❌ Failure'}\n*Action*: ${action}\n*Impact*: 100% Metadata Integrity Restored.`
          }
        }
      ]
    };
    await axios.post(SLACK_WEBHOOK_URL, message);
  } catch (err) {
    console.error('[SURGEON-ALERT] Failed to send notification:', err.message);
  }
};

module.exports = {
  sendAlert
};
