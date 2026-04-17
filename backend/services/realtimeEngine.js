/**
 * Real-time Anomaly Engine
 * Broadcasts live metadata events and health metrics to connected clients.
 */

let io;

const init = (socketIoInstance) => {
  io = socketIoInstance;
  console.log('[REALTIME] Anomaly Engine initialized.');

  io.on('connection', (socket) => {
    console.log('[REALTIME] New client connected:', socket.id);
    
    socket.on('disconnect', () => {
      console.log('[REALTIME] Client disconnected:', socket.id);
    });
  });

  // Cycle: Emit live metrics every 5 seconds
  setInterval(() => {
    emitMetrics();
  }, 5000);

  // Cycle: Random Anomaly Event every 15-30 seconds
  setInterval(() => {
    if (Math.random() > 0.7) {
       emitAnomaly();
    }
  }, 20000);
};

const emitMetrics = () => {
  const metrics = {
    timestamp: new Date().toISOString(),
    globalHealth: 80 + Math.floor(Math.random() * 15),
    latency: 35 + Math.floor(Math.random() * 20),
    activeUsers: 5 + Math.floor(Math.random() * 3)
  };
  io.emit('metrics_update', metrics);
};

const emitAnomaly = () => {
  const anomalies = [
    { table: 'ecommerce_customer_raw', issue: 'Unexplained Schema Drift detected in column [user_id]' },
    { table: 'fact_order_transactions', issue: 'Latency spike: 1.2s detected in upstream snowflake pipe' },
    { table: 'analytics_daily_cube', issue: 'Missing partition found for current UTC day' }
  ];
  const anomaly = anomalies[Math.floor(Math.random() * anomalies.length)];
  
  io.emit('anomaly_detected', {
    ...anomaly,
    timestamp: new Date().toISOString(),
    severity: 'Critical'
  });
};

module.exports = { init };
