/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Cpu, 
  Bug, 
  Wrench, 
  FlaskConical, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  RotateCcw, 
  Play, 
  FileCode, 
  Terminal, 
  Layers, 
  Zap, 
  ExternalLink, 
  Lock, 
  Eye, 
  Sparkles, 
  Activity, 
  ArrowRight,
  Code2,
  Check,
  X,
  Sliders,
  Send,
  Database,
  Search,
  Filter,
  CheckSquare
} from 'lucide-react';
import { 
  SelfHealingIncident, 
  SelfHealingConfig, 
  CapturedErrorPayload,
  ErrorSeverity 
} from '../types';
import { 
  fetchIncidents, 
  executeHealingPipeline, 
  rollbackHotfix, 
  injectDemoBug, 
  fetchCodebaseASTIndex,
  subscribeToSelfHealing 
} from '../utils/selfHealingInterceptor';

export const SelfHealingStudioView: React.FC = () => {
  const [incidents, setIncidents] = useState<SelfHealingIncident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<SelfHealingIncident | null>(null);
  const [config, setConfig] = useState<SelfHealingConfig>({
    autoDeployEnabled: true,
    sandboxStrictness: 'STRICT',
    llmGuardrailsEnabled: true,
    requireHumanApprovalForCritical: false,
    notifyOnTelegram: true,
    notifyOnDiscord: true,
    maxAutoFixesPerHour: 10,
    activeHotfixesCount: 0
  });

  const [codebaseIndex, setCodebaseIndex] = useState<{ totalFilesIndexed: number; totalSymbolsTracked: number; files: any[] }>({
    totalFilesIndexed: 0,
    totalSymbolsTracked: 0,
    files: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isInjecting, setIsInjecting] = useState(false);
  const [isHealing, setIsHealing] = useState(false);
  const [activeTab, setActiveTab] = useState<'terminal' | 'ast' | 'config'>('terminal');
  const [diffViewMode, setDiffViewMode] = useState<'unified' | 'split'>('unified');
  const [customErrorModalOpen, setCustomErrorModalOpen] = useState(false);
  const [customErrorForm, setCustomErrorForm] = useState({
    message: 'TypeError: Cannot read properties of null (reading \'permissions\')',
    file: 'src/components/CandidateProfileModal.tsx',
    line: 95,
    severity: 'HIGH' as ErrorSeverity,
    type: 'frontend' as const
  });

  // Load incidents and codebase index
  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchIncidents();
      setIncidents(data.incidents);
      setConfig(data.config);
      if (data.incidents.length > 0 && !selectedIncident) {
        setSelectedIncident(data.incidents[0]);
      } else if (selectedIncident) {
        const updated = data.incidents.find(i => i.id === selectedIncident.id);
        if (updated) setSelectedIncident(updated);
      }

      const astData = await fetchCodebaseASTIndex();
      setCodebaseIndex(astData);
    } catch (e) {
      console.warn('Failed to load self-healing data', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToSelfHealing((newIncident) => {
      setIncidents(prev => [newIncident, ...prev.filter(i => i.id !== newIncident.id)]);
      setSelectedIncident(newIncident);
    });
    return () => unsubscribe();
  }, []);

  // Trigger healing pipeline
  const handleTriggerHeal = async (incidentId: string) => {
    setIsHealing(true);
    try {
      const updated = await executeHealingPipeline(incidentId);
      if (updated) {
        setSelectedIncident(updated);
        setIncidents(prev => prev.map(i => i.id === updated.id ? updated : i));
      }
    } catch (err: any) {
      alert(`Healing Pipeline Notice: ${err.message || 'Execution failed'}`);
    } finally {
      setIsHealing(false);
    }
  };

  // Rollback hotfix
  const handleRollback = async (incidentId: string) => {
    try {
      const rolledBack = await rollbackHotfix(incidentId);
      if (rolledBack) {
        setSelectedIncident(rolledBack);
        setIncidents(prev => prev.map(i => i.id === rolledBack.id ? rolledBack : i));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Inject bug preset
  const handleInjectBug = async (bugType: string) => {
    setIsInjecting(true);
    try {
      const newInc = await injectDemoBug(bugType);
      if (newInc) {
        setSelectedIncident(newInc);
        setIncidents(prev => [newInc, ...prev.filter(i => i.id !== newInc.id)]);
      }
    } finally {
      setIsInjecting(false);
    }
  };

  // Inject custom bug
  const handleInjectCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/self-healing/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customErrorForm)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.incident) {
          setSelectedIncident(data.incident);
          setIncidents(prev => [data.incident, ...prev]);
          setCustomErrorModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const activeHotfixes = incidents.filter(i => i.hotfixActive).length;
  const resolvedCount = incidents.filter(i => i.status === 'HOTFIX_ACTIVE' || i.status === 'TEST_PASSED').length;

  return (
    <div id="self-healing-studio-view" className="space-y-6">
      {/* 1. Hero & Control Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-teal-500/10 via-emerald-500/5 to-transparent pointer-events-none rounded-full blur-3xl -mr-20 -mt-20"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Self-Healing (Auto-Debugging) Agentic Engine</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    ACTIVE GUARDIAN
                  </span>
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Autonomous 3-Agent error diagnosis, unified patch generation, and sandboxed test execution without security compromises.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800 text-xs">
              <span className="text-neutral-400">Total Incidents:</span>
              <strong className="text-white font-mono">{incidents.length}</strong>
              <span className="text-neutral-700">|</span>
              <span className="text-neutral-400">Active Hotfixes:</span>
              <strong className="text-teal-400 font-mono">{activeHotfixes}</strong>
              <span className="text-neutral-700">|</span>
              <span className="text-neutral-400">AST Symbols:</span>
              <strong className="text-emerald-400 font-mono">{codebaseIndex.totalSymbolsTracked}</strong>
            </div>

            <button
              type="button"
              onClick={loadData}
              disabled={isLoading}
              className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl transition cursor-pointer"
              title="Refresh Incidents & AST Index"
              aria-label="Refresh self healing data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 2. Visual 3-Agent Workflow Flowchart */}
        <div className="mt-5 pt-4 border-t border-neutral-800/80 grid grid-cols-1 md:grid-cols-5 gap-2.5 text-xs">
          {/* Node 1: Error Capture Layer */}
          <div className="p-3 bg-neutral-950/70 border border-neutral-800 rounded-xl flex flex-col justify-between relative group hover:border-neutral-700 transition">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Capture Layer</span>
              <Terminal className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-neutral-200 font-semibold mb-1">Global Interceptors</div>
            <div className="text-[11px] text-neutral-400 leading-tight">
              window.onerror, promises & backend Express middleware
            </div>
          </div>

          {/* Node 2: Agent 1 Root Cause Analyzer */}
          <div className="p-3 bg-teal-950/20 border border-teal-800/40 rounded-xl flex flex-col justify-between relative group hover:border-teal-700/60 transition">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider">Agent 1</span>
              <Cpu className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <div className="text-teal-200 font-semibold mb-1">Root Cause Analyzer</div>
            <div className="text-[11px] text-neutral-400 leading-tight">
              Gemini 3.7 Flash maps stack trace to codebase AST context
            </div>
          </div>

          {/* Node 3: Agent 2 Patch Generator */}
          <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-xl flex flex-col justify-between relative group hover:border-emerald-700/60 transition">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Agent 2</span>
              <Wrench className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-emerald-200 font-semibold mb-1">Patch Generator</div>
            <div className="text-[11px] text-neutral-400 leading-tight">
              Unified diff generation with strict LLM security guardrails
            </div>
          </div>

          {/* Node 4: Agent 3 Sandbox Test Runner */}
          <div className="p-3 bg-indigo-950/20 border border-indigo-800/40 rounded-xl flex flex-col justify-between relative group hover:border-indigo-700/60 transition">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Agent 3</span>
              <FlaskConical className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-indigo-200 font-semibold mb-1">Sandbox Test Runner</div>
            <div className="text-[11px] text-neutral-400 leading-tight">
              Automated Vitest assertions & AST security static scan
            </div>
          </div>

          {/* Node 5: Auto-Deploy / Escalate */}
          <div className="p-3 bg-neutral-950/70 border border-neutral-800 rounded-xl flex flex-col justify-between relative group hover:border-neutral-700 transition">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Deployment</span>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-neutral-200 font-semibold mb-1">Hotfix or Alert</div>
            <div className="text-[11px] text-neutral-400 leading-tight">
              Zero-downtime hotfix with instant 1-click rollback snapshot
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Bug Injection Lab / Playground */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Bug className="w-4 h-4 text-amber-400" />
              <span>Interactive Error Injection Lab (Simulate Real Incidents)</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Click any real-world runtime bug below to inject it into the live capture buffer and watch the 3-Agent pipeline heal it.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCustomErrorModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700 transition cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-teal-400" />
            <span>Inject Custom Bug</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
          <button
            type="button"
            onClick={() => handleInjectBug('null_pointer')}
            disabled={isInjecting}
            className="p-3 bg-neutral-950/80 hover:bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 rounded-xl text-left transition group cursor-pointer"
          >
            <div className="flex items-center justify-between font-semibold text-neutral-200 group-hover:text-amber-300 mb-1">
              <span>1. Frontend Null Pointer</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">CRITICAL</span>
            </div>
            <div className="text-[11px] font-mono text-neutral-400 truncate mb-1">
              TypeError: Cannot read properties of undefined (.filter)
            </div>
            <div className="text-[10px] text-neutral-500">Target: src/components/JobDiscoveryView.tsx:184</div>
          </button>

          <button
            type="button"
            onClick={() => handleInjectBug('unhandled_promise')}
            disabled={isInjecting}
            className="p-3 bg-neutral-950/80 hover:bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 rounded-xl text-left transition group cursor-pointer"
          >
            <div className="flex items-center justify-between font-semibold text-neutral-200 group-hover:text-amber-300 mb-1">
              <span>2. Unhandled Promise Rejection</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">MEDIUM</span>
            </div>
            <div className="text-[11px] font-mono text-neutral-400 truncate mb-1">
              UnhandledPromiseRejection: HTTP 503 Service Unavailable
            </div>
            <div className="text-[10px] text-neutral-500">Target: src/utils/apiClient.ts:88</div>
          </button>

          <button
            type="button"
            onClick={() => handleInjectBug('backend_crash_500')}
            disabled={isInjecting}
            className="p-3 bg-neutral-950/80 hover:bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 rounded-xl text-left transition group cursor-pointer"
          >
            <div className="flex items-center justify-between font-semibold text-neutral-200 group-hover:text-amber-300 mb-1">
              <span>3. Backend 500 DB Crash</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">CRITICAL</span>
            </div>
            <div className="text-[11px] font-mono text-neutral-400 truncate mb-1">
              Error: connect ECONNREFUSED in /api/jobs/sync
            </div>
            <div className="text-[10px] text-neutral-500">Target: server.ts:320</div>
          </button>

          <button
            type="button"
            onClick={() => handleInjectBug('json_parse_syntax')}
            disabled={isInjecting}
            className="p-3 bg-neutral-950/80 hover:bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 rounded-xl text-left transition group cursor-pointer"
          >
            <div className="flex items-center justify-between font-semibold text-neutral-200 group-hover:text-amber-300 mb-1">
              <span>4. JSON Parse SyntaxError</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">HIGH</span>
            </div>
            <div className="text-[11px] font-mono text-neutral-400 truncate mb-1">
              SyntaxError: Unexpected token '&lt;', '&lt;!DOCTYPE '...
            </div>
            <div className="text-[10px] text-neutral-500">Target: src/utils/apiClient.ts:45</div>
          </button>

          <button
            type="button"
            onClick={() => handleInjectBug('state_race_condition')}
            disabled={isInjecting}
            className="p-3 bg-neutral-950/80 hover:bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 rounded-xl text-left transition group cursor-pointer"
          >
            <div className="flex items-center justify-between font-semibold text-neutral-200 group-hover:text-amber-300 mb-1">
              <span>5. React State Infinite Loop</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">CRITICAL</span>
            </div>
            <div className="text-[11px] font-mono text-neutral-400 truncate mb-1">
              Invariant Violation: Maximum update depth exceeded
            </div>
            <div className="text-[10px] text-neutral-500">Target: src/components/InterviewPrepView.tsx:76</div>
          </button>

          <button
            type="button"
            onClick={() => handleInjectBug('auth_token_undefined')}
            disabled={isInjecting}
            className="p-3 bg-neutral-950/80 hover:bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 rounded-xl text-left transition group cursor-pointer"
          >
            <div className="flex items-center justify-between font-semibold text-neutral-200 group-hover:text-amber-300 mb-1">
              <span>6. Auth Header Missing (401)</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">HIGH</span>
            </div>
            <div className="text-[11px] font-mono text-neutral-400 truncate mb-1">
              JsonWebTokenError: jwt must be provided
            </div>
            <div className="text-[10px] text-neutral-500">Target: server.ts:612</div>
          </button>
        </div>
      </div>

      {/* 4. Main Two-Column Incident Inspector & Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Incidents Stream (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 shadow">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-teal-400" />
                <span>Captured Error Buffer</span>
              </h4>
              <span className="text-[11px] font-mono text-neutral-400">{incidents.length} logs</span>
            </div>

            <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
              {incidents.length === 0 ? (
                <div className="p-8 text-center text-neutral-500 text-xs">
                  No errors captured yet. Inject a demo error above to test.
                </div>
              ) : (
                incidents.map(inc => {
                  const isSelected = selectedIncident?.id === inc.id;
                  const isHotfix = inc.hotfixActive;
                  const isFailed = inc.status === 'TEST_FAILED' || inc.status === 'ESCALATED';

                  return (
                    <button
                      key={inc.id}
                      type="button"
                      onClick={() => setSelectedIncident(inc)}
                      className={`w-full text-left p-3 rounded-xl border transition cursor-pointer flex flex-col gap-1.5 ${
                        isSelected 
                          ? 'bg-neutral-800 border-teal-500 shadow-md' 
                          : 'bg-neutral-950/60 border-neutral-800/80 hover:bg-neutral-800/50 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-mono text-neutral-400">
                          {new Date(inc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                        <div className="flex items-center gap-1">
                          {isHotfix ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              HOTFIX ACTIVE
                            </span>
                          ) : isFailed ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              TEST FAILED
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                              {inc.status}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-xs font-semibold text-white line-clamp-1">
                        {inc.error.message}
                      </div>

                      <div className="text-[11px] text-neutral-400 flex items-center gap-1 font-mono">
                        <FileCode className="w-3 h-3 text-neutral-500 shrink-0" />
                        <span className="truncate">{inc.error.file}:{inc.error.line}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Active Incident Remediation Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedIncident ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xl space-y-5">
              {/* Incident Header & Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-950 text-neutral-300 border border-neutral-800">
                      ID: {selectedIncident.id}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                      {selectedIncident.error.severity}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                      Type: {selectedIncident.error.type}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1.5">
                    {selectedIncident.error.message}
                  </h3>
                  <div className="text-xs text-neutral-400 font-mono mt-0.5">
                    Location: {selectedIncident.error.file} (Line {selectedIncident.error.line})
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="flex items-center gap-2">
                  {selectedIncident.hotfixActive ? (
                    <button
                      type="button"
                      onClick={() => handleRollback(selectedIncident.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-900/60 hover:bg-rose-800 text-rose-100 text-xs font-bold border border-rose-700 shadow transition cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Rollback Hotfix</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleTriggerHeal(selectedIncident.id)}
                      disabled={isHealing}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold shadow-lg shadow-teal-950/40 border border-teal-400/40 transition cursor-pointer"
                    >
                      <Sparkles className={`w-4 h-4 ${isHealing ? 'animate-spin' : ''}`} />
                      <span>{isHealing ? 'Agents Healing...' : 'Auto-Heal with 3-Agent Pipeline'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Stack Trace & Code Slice Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-neutral-400 font-semibold">
                  <span className="flex items-center gap-1.5 text-neutral-300">
                    <Terminal className="w-3.5 h-3.5 text-rose-400" />
                    Stack Trace & Codebase AST Slice
                  </span>
                  <span className="font-mono text-[11px] text-neutral-500">{selectedIncident.codeContext?.filePath}</span>
                </div>

                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 font-mono text-[11px] text-neutral-300 overflow-x-auto max-h-48 leading-relaxed">
                  <pre className="text-rose-300 font-semibold mb-2">{selectedIncident.error.stack?.split('\n').slice(0, 3).join('\n')}</pre>
                  <div className="border-t border-neutral-800/80 pt-2 text-neutral-400">
                    <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">AST Surrounding Code Context:</div>
                    <pre className="text-neutral-200">{selectedIncident.codeContext?.surroundingSnippet}</pre>
                  </div>
                </div>
              </div>

              {/* Agent 1: Root Cause Analysis Output */}
              {selectedIncident.analysis && (
                <div className="bg-teal-950/20 border border-teal-800/50 rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/20">
                        <Cpu className="w-4 h-4" />
                      </span>
                      <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                        Agent 1: Forensic Root Cause Analysis
                      </span>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                      Confidence: {selectedIncident.analysis.confidenceScore}%
                    </span>
                  </div>

                  <div className="text-xs text-neutral-200 font-medium">
                    {selectedIncident.analysis.rootCause}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-teal-900/40 text-[11px]">
                    <div>
                      <span className="text-neutral-400 block mb-0.5">Failure Mechanism:</span>
                      <span className="text-neutral-300">{selectedIncident.analysis.failureMechanism}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block mb-0.5">Recommended Fix Strategy:</span>
                      <span className="text-teal-200 font-medium">{selectedIncident.analysis.suggestedFixStrategy}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Agent 2: Patch Generator & Diff Viewer */}
              {selectedIncident.patch && (
                <div className="bg-emerald-950/20 border border-emerald-800/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        <Wrench className="w-4 h-4" />
                      </span>
                      <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                        Agent 2: Unified Code Patch & Diff
                      </span>
                    </div>

                    <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setDiffViewMode('unified')}
                        className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                          diffViewMode === 'unified' ? 'bg-emerald-800 text-white' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Unified Diff
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiffViewMode('split')}
                        className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                          diffViewMode === 'split' ? 'bg-emerald-800 text-white' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Before / After
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-300">
                    {selectedIncident.patch.patchExplanation}
                  </p>

                  {/* Diff Box */}
                  {diffViewMode === 'unified' ? (
                    <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 font-mono text-[11px] overflow-x-auto">
                      <pre className="text-neutral-300 leading-relaxed">
                        {selectedIncident.patch.unifiedDiff.split('\n').map((line, i) => {
                          const isAdd = line.startsWith('+') && !line.startsWith('+++');
                          const isDel = line.startsWith('-') && !line.startsWith('---');
                          const isHdr = line.startsWith('@@') || line.startsWith('---') || line.startsWith('+++');

                          return (
                            <div 
                              key={i} 
                              className={
                                isAdd 
                                  ? 'bg-emerald-950/60 text-emerald-300 px-1 rounded' 
                                  : isDel 
                                  ? 'bg-rose-950/60 text-rose-300 px-1 rounded' 
                                  : isHdr 
                                  ? 'text-cyan-400' 
                                  : 'text-neutral-400'
                              }
                            >
                              {line}
                            </div>
                          );
                        })}
                      </pre>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                      <div className="p-3 bg-neutral-950 border border-rose-900/50 rounded-xl">
                        <div className="text-[10px] text-rose-400 font-bold uppercase mb-1">Original Code (Crash-Prone)</div>
                        <pre className="text-rose-200 overflow-x-auto">{selectedIncident.patch.originalSnippet}</pre>
                      </div>
                      <div className="p-3 bg-neutral-950 border border-emerald-900/50 rounded-xl">
                        <div className="text-[10px] text-emerald-400 font-bold uppercase mb-1">Patched Code (Defensive)</div>
                        <pre className="text-emerald-200 overflow-x-auto">{selectedIncident.patch.patchedSnippet}</pre>
                      </div>
                    </div>
                  )}

                  {/* Security Guardrails Compliance Box */}
                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 text-xs flex items-center justify-between flex-wrap gap-2">
                    <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      LLM Security Guardrails Audit:
                    </span>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> No Auth Bypass
                      </span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Zero Secret Leaks
                      </span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Sanitized Inputs
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Agent 3: Sandbox Vitest & AST Verification Runner */}
              {selectedIncident.verification && (
                <div className="bg-indigo-950/20 border border-indigo-800/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        <FlaskConical className="w-4 h-4" />
                      </span>
                      <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                        Agent 3: Sandboxed Automated Test Runner
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-mono">
                      <span className="text-neutral-400">Worker ID: {selectedIncident.verification.sandboxId.slice(0, 14)}</span>
                      <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                        {selectedIncident.verification.sandboxExecutionTimeMs}ms
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-neutral-300 flex items-center justify-between font-mono bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
                    <span>Suite: {selectedIncident.verification.testSuiteName}</span>
                    <span className="text-emerald-400 font-bold">
                      {selectedIncident.verification.testsPassed} / {selectedIncident.verification.testsPassed + selectedIncident.verification.testsFailed} Tests Passed
                    </span>
                  </div>

                  {/* Individual Test Assertions */}
                  <div className="space-y-1.5">
                    {selectedIncident.verification.testResults.map((t, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between p-2 rounded-lg bg-neutral-950/80 border border-neutral-800/80 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          {t.passed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          )}
                          <span className="text-neutral-200">{t.testName}</span>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-500">{t.durationMs}ms</span>
                      </div>
                    ))}
                  </div>

                  {/* AST Static Scan Verdict */}
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between text-xs">
                    <div className="text-neutral-400">
                      <strong>Static Security Audit:</strong> {selectedIncident.verification.astSecurityScan.staticAuditVerdict}
                    </div>
                    <span className="text-[11px] font-bold text-emerald-400">
                      Score: {selectedIncident.verification.astSecurityScan.memorySafetyScore}/100
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center text-neutral-400">
              <Bug className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
              <p className="text-sm font-semibold">Select an incident from the left buffer or inject a bug to begin.</p>
            </div>
          )}
        </div>
      </div>

      {/* 5. Codebase AST Index Explorer */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Code2 className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Codebase AST Symbol Map (AI Context Directory)
              </h3>
              <p className="text-xs text-neutral-400">
                All indexed files, functions, and symbols mapped into prompt context for Agent 1 and Agent 2.
              </p>
            </div>
          </div>

          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-neutral-950 text-neutral-300 border border-neutral-800">
            {codebaseIndex.totalFilesIndexed} Source Files Indexed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {codebaseIndex.files.slice(0, 9).map((f, idx) => (
            <div key={idx} className="p-3 bg-neutral-950/80 border border-neutral-800/80 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-teal-300 truncate">{f.path}</span>
                <span className="text-[10px] text-neutral-500 font-mono">{f.lines} lines</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {f.functions.map((fn: string, fi: number) => (
                  <span key={fi} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-800">
                    ƒ {fn}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Error Injection Modal */}
      {customErrorModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-teal-400" />
                <span>Inject Custom Application Bug</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setCustomErrorModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1"
                aria-label="Close custom bug modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInjectCustom} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">Error Message *</label>
                <input
                  type="text"
                  required
                  value={customErrorForm.message}
                  onChange={(e) => setCustomErrorForm({ ...customErrorForm, message: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono text-xs outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">File Path *</label>
                  <input
                    type="text"
                    required
                    value={customErrorForm.file}
                    onChange={(e) => setCustomErrorForm({ ...customErrorForm, file: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono text-xs outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Line Number *</label>
                  <input
                    type="number"
                    required
                    value={customErrorForm.line}
                    onChange={(e) => setCustomErrorForm({ ...customErrorForm, line: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono text-xs outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Severity</label>
                  <select
                    value={customErrorForm.severity}
                    onChange={(e) => setCustomErrorForm({ ...customErrorForm, severity: e.target.value as ErrorSeverity })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-xs outline-none focus:border-teal-500"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Source Layer</label>
                  <select
                    value={customErrorForm.type}
                    onChange={(e) => setCustomErrorForm({ ...customErrorForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-xs outline-none focus:border-teal-500"
                  >
                    <option value="frontend">Frontend (window.onerror)</option>
                    <option value="backend">Backend (Express Catch)</option>
                    <option value="network">Network (API Promise)</option>
                    <option value="syntax">Syntax (JSON/Parser)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setCustomErrorModalOpen(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Inject into Buffer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
