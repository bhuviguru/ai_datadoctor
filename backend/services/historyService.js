/**
 * Historical Snapshot Data (Time Machine)
 */
const TABLE_HISTORY = {
  '1': [
    { timestamp: '2026-04-14T08:00:00Z', health: 100, status: 'Healthy', event: 'Registry Initialized' },
    { timestamp: '2026-04-14T12:00:00Z', health: 100, status: 'Healthy', event: 'Periodic Scan' },
    { timestamp: '2026-04-14T14:30:00Z', health: 95, status: 'Healthy', event: 'Network Flap' }
  ],
  '2': [
    { timestamp: '2026-04-14T08:00:00Z', health: 100, status: 'Healthy', event: 'Sync Start' },
    { timestamp: '2026-04-14T15:00:00Z', health: 70, status: 'Unstable', event: 'Schema Version Mismatch' },
    { timestamp: '2026-04-14T18:00:00Z', health: 42, status: 'Critical', event: 'Upstream Edge Rupture' }
  ]
};

const getSnapshots = (tableId) => {
  return TABLE_HISTORY[tableId] || [
    { timestamp: new Date().toISOString(), health: 98, status: 'Healthy', event: 'Synthetic Snapshot' }
  ];
};

module.exports = {
  getSnapshots
};
