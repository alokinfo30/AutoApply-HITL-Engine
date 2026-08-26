import React, { useState } from 'react';
import { 
  History, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink, 
  Search, 
  FileSpreadsheet, 
  Trash2,
  Building,
  MapPin,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { JobPosting } from '../types';

export interface HistoryRecord {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  country: string;
  countryFormat: string;
  matchScore: number;
  visaSponsorship: string;
  hitlAction: 'APPROVED_AND_APPLIED' | 'SKIPPED';
  confirmationCode?: string;
  timestamp: string;
  url: string;
}

interface ApplicationHistoryViewProps {
  history: HistoryRecord[];
  onClearHistory: () => void;
}

export const ApplicationHistoryView: React.FC<ApplicationHistoryViewProps> = ({
  history,
  onClearHistory
}) => {
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'APPLIED' | 'SKIPPED'>('ALL');
  const [search, setSearch] = useState('');

  const filtered = history.filter(item => {
    const matchesSearch = 
      item.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      item.company.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = 
      filterStatus === 'ALL' ||
      (filterStatus === 'APPLIED' && item.hitlAction === 'APPROVED_AND_APPLIED') ||
      (filterStatus === 'SKIPPED' && item.hitlAction === 'SKIPPED');

    return matchesSearch && matchesStatus;
  });

  return (
    <div id="application-history-view" className="space-y-4 text-xs">
      {/* Top Controls */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" />
            Human-in-the-Loop Application History & Trace Audit
          </h2>
          <p className="text-xs text-neutral-400">
            Immutable log of all job discovery scans, ATS tailored resumes, Telegram approvals, and Playwright executions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClearHistory}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-rose-950/60 text-neutral-400 hover:text-rose-300 rounded-lg text-xs font-medium border border-neutral-800 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Trace Logs</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by job title or company..."
            className="w-full pl-9 pr-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1 rounded text-xs font-medium transition ${
              filterStatus === 'ALL' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            All ({history.length})
          </button>
          <button
            onClick={() => setFilterStatus('APPLIED')}
            className={`px-3 py-1 rounded text-xs font-medium transition ${
              filterStatus === 'APPLIED' ? 'bg-emerald-950 text-emerald-300 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Applied ({history.filter(h => h.hitlAction === 'APPROVED_AND_APPLIED').length})
          </button>
          <button
            onClick={() => setFilterStatus('SKIPPED')}
            className={`px-3 py-1 rounded text-xs font-medium transition ${
              filterStatus === 'SKIPPED' ? 'bg-neutral-800 text-neutral-300 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Skipped ({history.filter(h => h.hitlAction === 'SKIPPED').length})
          </button>
        </div>
      </div>

      {/* History Items List */}
      {filtered.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-500 mx-auto">
            <History className="w-6 h-6" />
          </div>
          <p className="text-sm text-neutral-300 font-medium">No application records found</p>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Run the 7-stage interactive pipeline or approve an application in Stage 4 to record verification traces.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(record => (
            <div 
              key={record.id}
              className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl p-4 transition space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 p-1.5 rounded-lg ${
                    record.hitlAction === 'APPROVED_AND_APPLIED'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                  }`}>
                    {record.hitlAction === 'APPROVED_AND_APPLIED' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{record.jobTitle}</span>
                      <span className="text-neutral-400 font-normal">@ {record.company}</span>
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-neutral-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-neutral-500" />
                        {record.location} ({record.country})
                      </span>
                      <span>•</span>
                      <span className="text-emerald-400 font-medium">
                        Match Score: {record.matchScore}%
                      </span>
                      <span>•</span>
                      <span className="font-mono text-neutral-400">
                        Standard: {record.countryFormat}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 text-right">
                  <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                    record.hitlAction === 'APPROVED_AND_APPLIED'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {record.hitlAction === 'APPROVED_AND_APPLIED' ? 'SUBMITTED VIA BROWSER' : 'SKIPPED IN HITL'}
                  </span>
                  {record.confirmationCode && (
                    <span className="text-[10px] text-neutral-400 font-mono">
                      Ref: <strong className="text-neutral-200">{record.confirmationCode}</strong>
                    </span>
                  )}
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {new Date(record.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>All audit traces are securely recorded with zero external telemetry.</span>
        </div>
      </div>
    </div>
  );
};
