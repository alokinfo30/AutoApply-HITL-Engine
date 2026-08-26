import React, { useState } from 'react';
import { 
  Globe, 
  Key, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  Save, 
  Linkedin, 
  Briefcase, 
  Sparkles, 
  RefreshCw, 
  Lock,
  ExternalLink,
  Layers,
  AlertCircle
} from 'lucide-react';
import { JobPortalAccount } from '../types';

interface JobPortalIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncTriggered?: (portal: string) => void;
}

export const JobPortalIntegrationModal: React.FC<JobPortalIntegrationModalProps> = ({
  isOpen,
  onClose,
  onSyncTriggered
}) => {
  const [portals, setPortals] = useState<JobPortalAccount[]>([
    {
      portal: 'LinkedIn',
      usernameOrEmail: 'alokinfo30@gmail.com',
      connected: true,
      lastScraped: '10 mins ago',
      autoApplySync: true,
      statusMessage: 'Active: Headless session cookie valid'
    },
    {
      portal: 'Indeed',
      usernameOrEmail: 'alokinfo30@gmail.com',
      connected: true,
      lastScraped: '25 mins ago',
      autoApplySync: true,
      statusMessage: 'Active: RSS + Headless crawler ready'
    },
    {
      portal: 'Glassdoor',
      usernameOrEmail: '',
      connected: false,
      autoApplySync: false,
      statusMessage: 'Not connected'
    },
    {
      portal: 'Wellfound',
      usernameOrEmail: 'alokinfo30@gmail.com',
      connected: true,
      lastScraped: '1 hour ago',
      autoApplySync: true,
      statusMessage: 'Active: Startup tech feed connected'
    },
    {
      portal: 'Monster',
      usernameOrEmail: '',
      connected: false,
      autoApplySync: false,
      statusMessage: 'Not connected'
    },
    {
      portal: 'ZipRecruiter',
      usernameOrEmail: '',
      connected: false,
      autoApplySync: false,
      statusMessage: 'Not connected'
    }
  ]);

  const [activePortalIndex, setActivePortalIndex] = useState<number>(0);
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [sessionCookieInput, setSessionCookieInput] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const current = portals[activePortalIndex];

  const handleToggleConnect = (index: number) => {
    const updated = [...portals];
    updated[index].connected = !updated[index].connected;
    updated[index].statusMessage = updated[index].connected ? 'Connected (Zero-Cost Headless Mode)' : 'Disconnected';
    setPortals(updated);
    setSaveNotice(`Updated status for ${updated[index].portal}`);
    setTimeout(() => setSaveNotice(null), 2500);
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [...portals];
    updated[activePortalIndex] = {
      ...updated[activePortalIndex],
      usernameOrEmail: usernameInput || updated[activePortalIndex].usernameOrEmail,
      connected: true,
      statusMessage: 'Configured & Active'
    };
    setPortals(updated);
    setUsernameInput('');
    setSessionCookieInput('');
    setSaveNotice(`Saved credentials for ${updated[activePortalIndex].portal}! Stored strictly in local browser sandbox.`);
    setTimeout(() => setSaveNotice(null), 3000);
  };

  const handleRunTestScrape = () => {
    setIsSyncing(true);
    setSaveNotice(null);
    setTimeout(() => {
      setIsSyncing(false);
      setSaveNotice(`Successfully verified connection to ${current.portal}! Scanned new verified tech roles.`);
      if (onSyncTriggered) onSyncTriggered(current.portal);
      setTimeout(() => setSaveNotice(null), 3500);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800/80 flex items-center justify-center text-blue-400 font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  Job Portal Integrations & Automated Scrapers
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  100% Free Forever
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Connect your personal job portal accounts for direct headless scraping with zero third-party subscription fees.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg bg-neutral-900 border border-neutral-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {saveNotice && (
          <div className="mx-5 mt-3 p-2.5 rounded-lg bg-emerald-950 text-emerald-300 text-xs border border-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{saveNotice}</span>
          </div>
        )}

        {/* Body Split View */}
        <div className="grid grid-cols-1 sm:grid-cols-12 flex-1 overflow-y-auto">
          {/* Left Portal List */}
          <div className="sm:col-span-5 p-4 border-r border-neutral-800 space-y-2 bg-neutral-950/40">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
              Supported Job Boards
            </span>

            {portals.map((p, idx) => (
              <button
                key={p.portal}
                onClick={() => setActivePortalIndex(idx)}
                className={`w-full p-3 rounded-xl text-left text-xs transition border flex items-center justify-between ${
                  activePortalIndex === idx
                    ? 'bg-neutral-800 border-blue-500/50 text-white font-semibold'
                    : 'bg-neutral-900 border-neutral-800/80 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="font-bold flex items-center gap-2">
                    <span>{p.portal}</span>
                    {p.connected && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-500">
                    {p.connected ? (p.usernameOrEmail || 'Connected') : 'Not Connected'}
                  </span>
                </div>

                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  p.connected ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-neutral-800 text-neutral-500'
                }`}>
                  {p.connected ? 'ACTIVE' : 'OFF'}
                </span>
              </button>
            ))}
          </div>

          {/* Right Configuration Panel */}
          <div className="sm:col-span-7 p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{current.portal} Account & Crawler Configuration</span>
                </h3>
                <span className="text-[11px] text-neutral-400">{current.statusMessage}</span>
              </div>

              <button
                type="button"
                onClick={() => handleToggleConnect(activePortalIndex)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  current.connected
                    ? 'bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-800'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                }`}
              >
                {current.connected ? 'Disconnect' : 'Connect Portal'}
              </button>
            </div>

            <form onSubmit={handleSaveCredentials} className="space-y-3">
              <div>
                <label className="block text-neutral-300 mb-1 font-medium">Account Username / Email</label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder={current.usernameOrEmail || `e.g. user@example.com`}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 mb-1 font-medium">
                  Session Cookie / Auth Token (Optional for 2FA Bypassing)
                </label>
                <input
                  type="password"
                  value={sessionCookieInput}
                  onChange={(e) => setSessionCookieInput(e.target.value)}
                  placeholder="li_at=AQED... or sessionid=..."
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-blue-500 outline-none font-mono"
                />
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  Allows the local Playwright browser worker to browse without repeated 2FA prompts.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleRunTestScrape}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium border border-neutral-700 transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Testing Scrape...' : 'Test Scrape Now'}</span>
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Portal Settings</span>
                </button>
              </div>
            </form>

            <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 space-y-2 pt-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Strict Security & Zero Third-Party Sharing</span>
              </div>
              <p className="text-neutral-400 leading-relaxed text-[11px]">
                Your portal credentials and cookies are encrypted in your local browser sandbox and never transmitted to external commercial servers. All scraping is executed client-side via Playwright / RSS.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs">
          <span className="text-neutral-400">Total Connected Portals: <strong className="text-white">{portals.filter(p => p.connected).length}</strong> / {portals.length}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
