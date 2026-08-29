/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CapturedErrorPayload, SelfHealingIncident, SelfHealingConfig } from '../types';

type ErrorListener = (incident: SelfHealingIncident) => void;
const listeners: Set<ErrorListener> = new Set();

let isInitialized = false;

export function subscribeToSelfHealing(listener: ErrorListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners(incident: SelfHealingIncident) {
  listeners.forEach(fn => {
    try {
      fn(incident);
    } catch (e) {
      console.warn('[Self-Healing Interceptor] Error in listener callback:', e);
    }
  });
}

/**
 * Initializes global runtime error capture layer on window and unhandled promise rejections
 */
export function initGlobalErrorCapture() {
  if (isInitialized || typeof window === 'undefined') return;
  isInitialized = true;

  // 1. Capture synchronous & runtime script exceptions
  const originalOnError = window.onerror;
  window.onerror = function (message, source, lineno, colno, error) {
    // Preserve any existing window.onerror
    if (typeof originalOnError === 'function') {
      try { originalOnError(message, source, lineno, colno, error); } catch (e) {}
    }

    const msgStr = typeof message === 'string' ? message : String(message);
    // Ignore harmless browser extension / dev server websockets noise
    if (msgStr.includes('ResizeObserver') || msgStr.includes('failed to connect to websocket')) {
      return false;
    }

    captureAndSendError({
      type: 'frontend',
      message: msgStr,
      file: source || 'window',
      line: lineno || 1,
      col: colno || 1,
      stack: error?.stack || msgStr,
      severity: 'HIGH',
      environment: 'production'
    });

    return false; // let error propagate to console as normal
  };

  // 2. Capture Unhandled Promise Rejections
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const message = reason instanceof Error ? reason.message : String(reason || 'Unhandled Promise Rejection');
    const stack = reason instanceof Error ? reason.stack : undefined;

    // Ignore known benign HMR websocket aborts
    if (message.includes('websocket') || message.includes('AbortError')) {
      return;
    }

    captureAndSendError({
      type: 'network',
      message: `UnhandledPromiseRejection: ${message}`,
      file: 'src/App.tsx',
      line: 1,
      col: 1,
      stack: stack || message,
      severity: 'MEDIUM',
      environment: 'production'
    });
  });

  console.log('[Self-Healing Layer] Global frontend error interceptors active (window.onerror + unhandledrejection)');
}

/**
 * Sends a captured error to the server-side Self-Healing queue
 */
export async function captureAndSendError(payload: Partial<CapturedErrorPayload>): Promise<SelfHealingIncident | null> {
  try {
    const res = await fetch('/api/self-healing/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: payload.type || 'frontend',
        message: payload.message || 'Unknown runtime error',
        file: payload.file || 'src/App.tsx',
        line: payload.line || 1,
        col: payload.col || 1,
        stack: payload.stack || '',
        severity: payload.severity || 'HIGH',
        environment: payload.environment || 'production'
      })
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && data.incident) {
      notifyListeners(data.incident);
      return data.incident;
    }
  } catch (err) {
    console.warn('[Self-Healing Interceptor] Failed to dispatch error to server buffer:', err);
  }
  return null;
}

/**
 * Triggers the Safe 3-Agent Pipeline on an existing captured incident
 */
export async function executeHealingPipeline(incidentId: string): Promise<SelfHealingIncident | null> {
  try {
    const res = await fetch('/api/self-healing/pipeline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ incidentId })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Failed with HTTP status ${res.status}`);
    }

    const data = await res.json();
    if (data.success && data.incident) {
      notifyListeners(data.incident);
      return data.incident;
    }
  } catch (err) {
    console.error('[Self-Healing Pipeline] Execution failed:', err);
    throw err;
  }
  return null;
}

/**
 * Rolls back an active hotfix
 */
export async function rollbackHotfix(incidentId: string): Promise<SelfHealingIncident | null> {
  try {
    const res = await fetch('/api/self-healing/rollback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ incidentId })
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && data.incident) {
      notifyListeners(data.incident);
      return data.incident;
    }
  } catch (err) {
    console.error('[Self-Healing Interceptor] Rollback error:', err);
  }
  return null;
}

/**
 * Injects a reproducible demo bug for live testing
 */
export async function injectDemoBug(bugType: string): Promise<SelfHealingIncident | null> {
  try {
    const res = await fetch('/api/self-healing/inject-demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bugType })
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && data.incident) {
      notifyListeners(data.incident);
      return data.incident;
    }
  } catch (err) {
    console.error('[Self-Healing Interceptor] Demo injection error:', err);
  }
  return null;
}

/**
 * Fetches all incidents
 */
export async function fetchIncidents(): Promise<{
  incidents: SelfHealingIncident[];
  activeHotfixesCount: number;
  config: SelfHealingConfig;
}> {
  try {
    const res = await fetch('/api/self-healing/incidents');
    if (res.ok) {
      const data = await res.json();
      return {
        incidents: data.incidents || [],
        activeHotfixesCount: data.activeHotfixesCount || 0,
        config: data.config || {
          autoDeployEnabled: true,
          sandboxStrictness: 'STRICT',
          llmGuardrailsEnabled: true,
          requireHumanApprovalForCritical: false,
          notifyOnTelegram: true,
          notifyOnDiscord: true,
          maxAutoFixesPerHour: 10,
          activeHotfixesCount: 0
        }
      };
    }
  } catch (e) {
    console.warn('[Self-Healing Interceptor] Error fetching incidents:', e);
  }
  return {
    incidents: [],
    activeHotfixesCount: 0,
    config: {
      autoDeployEnabled: true,
      sandboxStrictness: 'STRICT',
      llmGuardrailsEnabled: true,
      requireHumanApprovalForCritical: false,
      notifyOnTelegram: true,
      notifyOnDiscord: true,
      maxAutoFixesPerHour: 10,
      activeHotfixesCount: 0
    }
  };
}

/**
 * Fetches AST Codebase Index
 */
export async function fetchCodebaseASTIndex(): Promise<any> {
  try {
    const res = await fetch('/api/self-healing/codebase-index');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('[Self-Healing] Error fetching codebase index:', e);
  }
  return { totalFilesIndexed: 0, files: [] };
}
