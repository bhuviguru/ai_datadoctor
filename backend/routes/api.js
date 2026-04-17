const express = require('express');
const router = express.Router();
const metadataService = require('../services/metadataService');
const scanService = require('../services/scanService');
const aiService = require('../services/aiService');
const historyService = require('../services/historyService');
const notificationService = require('../services/notificationService');

// GET /tables - Fetch all tables
router.get('/tables', async (req, res) => {
  try {
    const tables = await metadataService.fetchTables();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /scan - Detect issues
router.get('/scan', async (req, res) => {
  try {
    const tables = await metadataService.fetchTables();
    const result = scanService.detectIssues(tables);
    res.json({ status: 'success', ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /explain - Get AI explanation
router.post('/explain', async (req, res) => {
  try {
    const explanation = await aiService.generateExplanation(req.body);
    res.json({ explanation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /chat - AI Chat Assistant
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await aiService.generateChatResponse(message);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /fix - Simulate or execute a fix
router.post('/fix', async (req, res) => {
  const { table, tableId } = req.body;
  try {
    const success = await metadataService.updateAssetStatus(table, 'Healthy', tableId);
    if (success) {
      await notificationService.sendAlert(table, 'AUTONOMOUS_PATCH', true);
      res.json({ status: 'success', message: `Remediation successful for ${table}. Asset state updated to 'Healthy'.` });
    } else {
      res.status(404).json({ status: 'failure', message: `Asset ${table} not found.` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// GET /lineage/:id - Fetch lineage for a specific table
router.get('/lineage/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const lineage = await metadataService.fetchLineage(id);
    res.json(lineage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /history/:id - Fetch historical snapshots (Time Machine)
router.get('/history/:id', (req, res) => {
  const { id } = req.params;
  const history = historyService.getSnapshots(id);
  res.json(history);
});

const githubService = require('../services/githubService');

// GET /github/summary - Fetch GitHub project metrics
router.get('/github/summary', async (req, res) => {
  try {
    const summary = await githubService.getProjectSummary();
    if (summary) {
      res.json(summary);
    } else {
      res.status(401).json({ error: 'GitHub Token missing or invalid.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /logs - System logs with intelligence
router.get('/logs', (req, res) => {
  const { type, search } = req.query;
  
  const allLogs = [
    { id: 1, type: 'Security', message: 'Vault accessed by Audit Manager', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { id: 2, type: 'Scan', message: 'Predictive scan completed for CoreDB', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
    { id: 3, type: 'Governance', message: 'New steward assigned to analytics_cube', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    { id: 4, type: 'Error', message: 'Handshake timeout on node Snw-002', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
    { id: 5, type: 'Info', message: 'Surgical HUD calibrated for ecommerce_tables', timestamp: new Date().toISOString() }
  ];

  let filtered = allLogs;
  if (type && type !== 'All') {
    filtered = filtered.filter(l => l.type === type);
  }
  if (search) {
    filtered = filtered.filter(l => l.message.toLowerCase().includes(search.toLowerCase()));
  }

  res.json(filtered);
});

module.exports = router;
