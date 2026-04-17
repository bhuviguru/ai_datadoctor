import axios from 'axios';
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

/**
 * Metadata Diagnostic Asset Interface
 */
export type MetadataAsset = {
  id: string;
  name: string;
  service: string;
  last_updated: string;
  status: string;
  owner?: string;
  classification?: string;
  history: number[];
  pipeline: {
    status: string;
    last_run: string;
    latency: string;
    history: string[];
  };
  predictive_health?: number;
  tags: { tagFQN: string }[];
  schema_version?: string;
}


export interface Issue {
  table: string;
  tableId?: string;
  type: string;
  status: 'Critical' | 'Warning';
  issue: string;
}

/**
 * Scan Result Interface
 */
export interface ScanResult {
  healthScore: number;
  issues: Issue[];
}

/**
 * Remediation Result Interface
 */
export interface FixResult {
  status: 'success' | 'failure';
  message: string;
}

/**
 * Lineage Node Interface
 */
export interface LineageNode {
  id: string;
  name: string;
  type: string;
}

/**
 * Lineage Graph Interface
 */
export interface LineageData {
  tableId: string;
  upstream: LineageNode[];
  downstream: LineageNode[];
}

export interface SystemLog {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

export interface HistoryEntry {
  timestamp: string;
  health: number;
  status: string;
  event: string;
}

/**
 * Shared API request handler to unify error handling and reduce boilerplate.
 */
async function apiRequest<T>(request: Promise<{ data: T }>, fallback: T): Promise<T> {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    console.error('API Surveillance Error:', error);
    return fallback;
  }
}

/**
 * Fetches all monitored data assets.
 */
export const fetchTables = () => apiRequest<MetadataAsset[]>(api.get('/tables'), []);

/**
 * Initiates a global metadata audit scan.
 */
export const scanData = () => apiRequest<ScanResult>(api.get('/scan'), { healthScore: 0, issues: [] });

/**
 * Synthesizes an AI explanation for a specific issue.
 */
export const explainIssue = (tableName: string, issueText: string) => 
  apiRequest<{ explanation: string }>(
    api.post('/explain', { table: tableName, issue: issueText }), 
    { explanation: 'Unable to generate analysis at this time.' }
  );

/**
 * Deploys an autonomous fix for a metadata asset.
 */
export const fixIssue = (tableName: string, issueType: string, tableId?: string) => 
  apiRequest<{status: string, message: string}>(
    api.post('/fix', { table: tableName, type: issueType, tableId }),
    { status: 'error', message: 'Failed to deploy fix' }
  );

export interface GitHubSummary {
  username: string;
  name: string;
  avatar: string;
  public_repos: number;
  latest_activity: {
    name: string;
    description: string;
    updated_at: string;
    stars: number;
    url: string;
  }[];
}

/**
 * Communicates with the AI Chat Assistant.
 */
export const askAI = (message: string) => 
  apiRequest<{ response: string }>(
    api.post('/chat', { message }),
    { response: 'Protocol synchronization failure. The AI core is temporarily offline.' }
  );

/**
 * Retrieves the GitHub project summary.
 */
export const fetchGitHubSummary = () => 
  apiRequest<GitHubSummary | null>(api.get('/github/summary'), null);

/**
 * Retrieves simulated security logs from the backend.
 */
export const fetchLogs = () => 
  apiRequest<SystemLog[]>(api.get('/logs'), []);


/**
 * Retrieves historical snapshots for an asset (Time Machine).
 */
export const fetchHistory = (tableId: string) => 
  apiRequest<HistoryEntry[]>(api.get(`/history/${tableId}`), []);

/**
 * Retrieves the relational lineage graph for an asset.
 */
export const fetchLineage = (tableId: string) => 
  apiRequest<LineageData>(
    api.get(`/lineage/${tableId}`), 
    { tableId, upstream: [], downstream: [] }
  );
