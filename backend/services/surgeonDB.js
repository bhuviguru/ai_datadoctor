/**
 * SurgeonDB - High-Fidelity Standalone Metadata Store
 * Acts as the 'Realtime DB' for the AI Data Surgeon.
 */

let MOCK_DATA = [
  {
    id: 'om-pos-001',
    name: 'ecommerce_customer_raw',
    service: 'Postgres',
    last_updated: new Date().toISOString(),
    status: 'Healthy',
    owner: 'Customer 360 Team',
    classification: 'PII / Highly Sensitive',
    history: [98, 98, 95, 98, 97, 98, 96, 98, 97, 98],
    pipeline: { status: 'Success', last_run: '10 mins ago', latency: '45ms', history: ['Success', 'Success', 'Success', 'Success'] },
    schema_version: '4.2.1',
    upstream_node: 'shopify_webhook_node',
    predictive_health: 98,
    tags: [{ tagFQN: 'Tier1' }, { tagFQN: 'Compliance.GDPR' }]
  },
  {
    id: 'om-snw-002',
    name: 'fact_order_transactions',
    service: 'Snowflake',
    last_updated: new Date().toISOString(),
    status: 'Critical',
    owner: 'Revenue Analytics',
    classification: 'Financial Data',
    history: [82, 80, 75, 70, 65, 55, 50, 48, 45, 42],
    pipeline: { status: 'Failed', last_run: '14 mins ago', latency: '1.2s', history: ['Success', 'Success', 'Failed', 'Failed'] },
    schema_version: '3.1.0',
    upstream_node: 'ecommerce_customer_raw',
    predictive_health: 22,
    tags: [{ tagFQN: 'Tier4' }]
  },
  {
    id: 'om-bq-003',
    name: 'marketing_leads_curated',
    service: 'BigQuery',
    last_updated: new Date().toISOString(),
    status: 'Healthy',
    owner: 'Marketing Ops',
    classification: 'Internal Use',
    history: [95, 96, 95, 96, 97, 98, 97, 98, 97, 98],
    pipeline: { status: 'Success', last_run: '1 hour ago', latency: '89ms', history: ['Success', 'Success', 'Success', 'Success'] },
    schema_version: '1.0.4',
    upstream_node: 'salesforce_sync_job',
    predictive_health: 99,
    tags: [{ tagFQN: 'Tier1' }]
  },
  {
    id: 'om-red-004',
    name: 'usage_analytics_cube',
    service: 'Redshift',
    last_updated: new Date().toISOString(),
    status: 'Unstable',
    owner: 'Unassigned',
    classification: 'General',
    history: [88, 85, 82, 80, 78, 75, 72, 70, 75, 78],
    pipeline: { status: 'Success', last_run: '5 hours ago', latency: '2.5s', history: ['Success', 'Success', 'Success', 'Success'] },
    schema_version: '2.4.0',
    upstream_node: 'event_stream_processor',
    predictive_health: 58,
    tags: []
  },
  {
    id: 'om-ath-005',
    name: 'security_audit_vault',
    service: 'S3 / Athena',
    last_updated: new Date().toISOString(),
    status: 'Critical',
    owner: 'Unassigned',
    classification: 'Security / Critical',
    history: [100, 100, 100, 90, 80, 70, 60, 50, 45, 42],
    pipeline: { status: 'Failed', last_run: '2 mins ago', latency: '15s', history: ['Success', 'Success', 'Failed', 'Failed'] },
    schema_version: '5.0.0',
    upstream_node: 'iam_event_bridge',
    predictive_health: 18,
    tags: []
  },
  {
    id: 'om-db-006',
    name: 'gold_standard_revenue',
    service: 'Databricks',
    last_updated: new Date().toISOString(),
    status: 'Healthy',
    owner: 'Executive BI',
    classification: 'Highly Confidential',
    history: [99, 99, 99, 99, 99, 99, 99, 99, 99, 99],
    pipeline: { status: 'Success', last_run: 'Just now', latency: '120ms', history: ['Success', 'Success', 'Success', 'Success'] },
    schema_version: '1.0.0',
    upstream_node: 'fact_order_transactions',
    predictive_health: 100,
    tags: [{ tagFQN: 'Gold_Certified' }]
  },
  {
    id: 'om-af-007',
    name: 'airflow_dag_metrics',
    service: 'Airflow Metadata',
    last_updated: new Date().toISOString(),
    status: 'Unstable',
    owner: 'Platform Engineering',
    classification: 'System Info',
    history: [90, 88, 85, 80, 75, 70, 75, 78, 80, 82],
    pipeline: { status: 'Success', last_run: '5 mins ago', latency: '10ms', history: ['Success', 'Success', 'Success', 'Success'] },
    schema_version: '2.1.0',
    upstream_node: 'scheduler_db',
    predictive_health: 74,
    tags: [{ tagFQN: 'System' }]
  },
  {
    id: 'om-tr-008',
    name: 'trino_ad_hoc_queries',
    service: 'Trino',
    last_updated: new Date().toISOString(),
    status: 'Healthy',
    owner: 'Data Discovery',
    classification: 'General',
    history: [95, 95, 95, 95, 95, 95, 95, 95, 95, 95],
    pipeline: { status: 'Success', last_run: '4 hours ago', latency: '5s', history: ['Success', 'Success', 'Success', 'Success'] },
    schema_version: '1.0.0',
    upstream_node: 'hive_metastore',
    predictive_health: 95,
    tags: [{ tagFQN: 'Tier3' }]
  },
  {
    id: 'om-spk-009',
    name: 'spark_batch_telemetry',
    service: 'Spark',
    last_updated: new Date().toISOString(),
    status: 'Critical',
    owner: 'Unassigned',
    classification: 'None',
    history: [80, 70, 60, 50, 40, 30, 20, 10, 5, 2],
    pipeline: { status: 'Failed', last_run: '24 hours ago', latency: 'N/A', history: ['Failed', 'Failed', 'Failed', 'Failed'] },
    schema_version: '1.2.0',
    upstream_node: 'streaming_input',
    predictive_health: 5,
    tags: []
  },
  {
    id: 'om-dbt-010',
    name: 'dbt_transform_v3',
    service: 'dbt Cloud',
    last_updated: new Date().toISOString(),
    status: 'Healthy',
    owner: 'Analytics Engineering',
    classification: 'Curated',
    history: [98, 98, 98, 98, 98, 98, 98, 98, 98, 98],
    pipeline: { status: 'Success', last_run: '12 mins ago', latency: '500ms', history: ['Success', 'Success', 'Success', 'Success'] },
    schema_version: '3.40.2',
    upstream_node: 'dbt_source_raw',
    predictive_health: 98,
    tags: [{ tagFQN: 'Production' }]
  }
];

// Seed some life into the data
// Background drift cycle disabled for stability.
// Metadata now updates exclusively through user interventions.

module.exports = {
  getData: () => MOCK_DATA,
  updateTable: (name, updates) => {
    const idx = MOCK_DATA.findIndex(t => t.name === name);
    if (idx !== -1) {
      MOCK_DATA[idx] = { ...MOCK_DATA[idx], ...updates };
      return true;
    }
    return false;
  }
};
