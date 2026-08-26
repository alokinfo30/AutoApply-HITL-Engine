import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  ShieldCheck, 
  DollarSign, 
  Sparkles, 
  GitBranch, 
  Server, 
  Workflow, 
  Bot, 
  Activity, 
  CheckCircle2, 
  Zap, 
  Database,
  Globe2,
  Lock
} from 'lucide-react';

export const OpenSourceCodeHub: React.FC = () => {
  const [selectedService, setSelectedService] = useState<'orchestrator' | 'jd_parser' | 'resume_engine' | 'hitl_gateway' | 'browser_worker'>('orchestrator');

  const microservices = [
    {
      id: 'orchestrator',
      name: 'Stage 1: Job Discovery & Stream Ingestion Node',
      runtime: 'FastAPI / Async Worker (Python 3.11+ / Node)',
      status: 'OPERATIONAL',
      cost: '$0.00 (Public Feeds)',
      description: 'Autonomous worker polling Arbeitnow, Remotive, JSearch and RSS endpoints with rate-limit throttling and zero subscription overhead.',
      capabilities: ['Dynamic Rate-Limiting', 'Deduplication Cache', 'Multi-Country Filters', 'Visa Sponsorship Detection']
    },
    {
      id: 'jd_parser',
      name: 'Stage 2: Gemini 3.7 Flash JD Semantic Filter',
      runtime: 'Google GenAI SDK (Server-Side)',
      status: 'OPERATIONAL',
      cost: '$0.00 (Gemini Free 1,500 RPD)',
      description: 'Computes deep semantic matching, extracts core software skills, identifies ATS keyword gaps, and produces DIN 5008 / MOM compliance vectors.',
      capabilities: ['Structured JSON Schema', 'ATS Scoring Matrix', 'Gap Analysis', 'Country Standard Validator']
    },
    {
      id: 'resume_engine',
      name: 'Stage 3: Multi-Country ATS Document Synthesizer',
      runtime: 'ATS Compiler Engine',
      status: 'OPERATIONAL',
      cost: '$0.00 (Local Compiler)',
      description: 'Generates tailored single-page resumes formatted for German DIN 5008, Singapore MOM, and US Global ATS systems with zero watermark.',
      capabilities: ['ATS High-Contrast Typography', 'Tailored Impact Bullet Generation', 'Single-Page Fit Constraints', 'Multi-Country Parallel Synthesis']
    },
    {
      id: 'hitl_gateway',
      name: 'Stage 4: Telegram / Discord HITL Notification Gateway',
      runtime: 'Telegram Bot API / Webhooks',
      status: 'OPERATIONAL',
      cost: '$0.00 (Free BotFather API)',
      description: 'Dispatches real-time interactive notification cards with inline 1-click [Approve & Apply] and [Skip] callbacks to candidate mobile and desktop.',
      capabilities: ['Inline Keyboard Callbacks', '4-Hour Scheduled Summary Pulse', 'Direct Document Attachment', 'Mobile 1-Tap Trigger']
    },
    {
      id: 'browser_worker',
      name: 'Stage 5: Playwright / Browser-Use Autonomous Worker',
      runtime: 'Headless Browser Cluster',
      status: 'OPERATIONAL',
      cost: '$0.00 (Local Container)',
      description: 'Automated headless worker executing portal navigation, field auto-fill, resume upload, and confirmation proof capture.',
      capabilities: ['Anti-Bot Evasion Profiles', 'Smart Portal Form Mapping', 'Proof of Submission Snapshot', 'Audit Trail Recording']
    }
  ];

  const current = microservices.find(m => m.id === selectedService) || microservices[0];

  return (
    <div id="open-source-architecture-hub" className="space-y-6">
      {/* 100% Free Forever Guarantee Card */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-emerald-950/40 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  100% Free of Cost Architecture (5 to 10+ Years Guarantee)
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  $0.00 / MONTH
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-1 max-w-2xl leading-relaxed">
                Zero paid SaaS dependencies. Employs Google Gemini 3.7 Flash Free Tier (1,500 daily requests free), Telegram BotFather Free API, open-source headless browser automation, and public open job endpoints.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-neutral-800 border border-neutral-700 text-emerald-400 flex items-center gap-2 shadow">
              <Lock className="w-3.5 h-3.5" />
              <span>IP & Execution Isolated Server-Side</span>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Zero Cost */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-neutral-800 text-xs">
          <div className="bg-neutral-950/60 p-2.5 rounded-lg border border-neutral-800/80">
            <span className="text-emerald-400 font-semibold block">1. Free LLM Engine</span>
            <span className="text-neutral-400 text-[11px]">Gemini 3.7 Flash (Free Server-Side API)</span>
          </div>
          <div className="bg-neutral-950/60 p-2.5 rounded-lg border border-neutral-800/80">
            <span className="text-emerald-400 font-semibold block">2. Free HITL Alerting</span>
            <span className="text-neutral-400 text-[11px]">Telegram BotFather API (Unlimited Free)</span>
          </div>
          <div className="bg-neutral-950/60 p-2.5 rounded-lg border border-neutral-800/80">
            <span className="text-emerald-400 font-semibold block">3. Free Browser Worker</span>
            <span className="text-neutral-400 text-[11px]">Headless Playwright Automation (Self-Hosted)</span>
          </div>
          <div className="bg-neutral-950/60 p-2.5 rounded-lg border border-neutral-800/80">
            <span className="text-emerald-400 font-semibold block">4. Free Job Feeds</span>
            <span className="text-neutral-400 text-[11px]">Arbeitnow, Remotive & Open RSS</span>
          </div>
        </div>
      </div>

      {/* Microservices Architecture Diagram & Nodes */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Workflow className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Autonomous 5-Stage Microservices Cluster</h3>
          </div>
          <span className="text-xs text-neutral-400 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            All Microservice Nodes Active
          </span>
        </div>

        {/* Node Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {microservices.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedService(m.id as any)}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                selectedService === m.id
                  ? 'bg-neutral-950 border-emerald-500 shadow-md'
                  : 'bg-neutral-950/50 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                  {m.id.replace('_', ' ')}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>
              <p className="text-xs font-semibold text-white truncate">{m.name.split(':')[1] || m.name}</p>
              <span className="text-[10px] text-neutral-400 block mt-1">{m.cost}</span>
            </button>
          ))}
        </div>

        {/* Selected Service Detail Panel */}
        <div className="p-5 bg-neutral-950 rounded-xl border border-neutral-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                {current.name}
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">{current.runtime}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono font-bold">
                {current.status}
              </span>
              <span className="text-[10px] px-2.5 py-1 rounded bg-neutral-900 text-neutral-300 border border-neutral-800 font-mono">
                {current.cost}
              </span>
            </div>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed">
            {current.description}
          </p>

          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block font-mono">
              Node Capabilities & Guarantees:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {current.capabilities.map((c, i) => (
                <div key={i} className="p-2.5 bg-neutral-900 rounded-lg border border-neutral-800 flex items-center gap-2 text-xs text-neutral-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Zero Cost & Security Framework Guarantee */}
      <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Strict Enterprise Security: All algorithms run securely in private serverless containers without exposing backend execution code to browser clients.
          </span>
        </div>
        <span className="text-[11px] text-emerald-400 font-semibold shrink-0">
          5–10 Year Free Stack
        </span>
      </div>
    </div>
  );
};
