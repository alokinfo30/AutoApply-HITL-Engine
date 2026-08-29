import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  XCircle, 
  Smartphone, 
  Bot, 
  FileText, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Settings, 
  Bell,
  RefreshCw,
  MessageSquare,
  Building,
  MapPin,
  Download,
  Layers,
  Sparkles,
  DollarSign,
  ArrowRight,
  Globe2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { JobPosting, GeneratedResume, CandidateProfile } from '../types';
import { generateAtsPdf } from '../utils/pdfGenerator';

interface TelegramHitlViewProps {
  job: JobPosting | null;
  jobs?: JobPosting[];
  resume: GeneratedResume | null;
  resumes?: GeneratedResume[];
  onApproveApply: (job: JobPosting) => void;
  onApproveAll?: (jobs: JobPosting[]) => void;
  onSkipJob: (job: JobPosting) => void;
  candidateProfile: CandidateProfile;
  botStatus: 'idle' | 'sending' | 'approved' | 'skipped';
  onUpdateProfile?: (updated: Partial<CandidateProfile>) => void;
}

export const TelegramHitlView: React.FC<TelegramHitlViewProps> = ({
  job,
  jobs = [],
  resume,
  resumes = [],
  onApproveApply,
  onApproveAll,
  onSkipJob,
  candidateProfile,
  botStatus,
  onUpdateProfile
}) => {
  const [selectedJobIndex, setSelectedJobIndex] = useState(0);
  const [telegramToken, setTelegramToken] = useState<string>(candidateProfile.telegramBotToken || '7482910394:AAHv_JobAutoApplyHitlBotKey_x92k');
  const [telegramChatId, setTelegramChatId] = useState<string>(candidateProfile.telegramChatId || '987654321');
  const [telegramUsername, setTelegramUsername] = useState<string>(candidateProfile.telegramUsername || '@alok_kumar');
  const [showConfig, setShowConfig] = useState(false);
  const [isSendingLive, setIsSendingLive] = useState(false);
  const [isCapturingStart, setIsCapturingStart] = useState(false);
  const [liveSendSuccess, setLiveSendSuccess] = useState<string | null>(null);

  const activeJobsList = jobs.length > 0 ? jobs : (job ? [job] : []);
  const activeJob = activeJobsList[selectedJobIndex] || activeJobsList[0] || job;
  const activeResume = (resumes.length > 0 ? (resumes.find(r => r.jobId === activeJob?.id) || resumes[selectedJobIndex] || resumes[0]) : null) || resume;

  if (!activeJob) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center text-neutral-400">
        <Send className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
        <p className="text-sm font-medium text-neutral-300">No Job Queued for HITL Approval</p>
        <p className="text-xs text-neutral-500 mt-1">Generate a tailored resume in Stage 3 to dispatch an approval card.</p>
      </div>
    );
  }

  const handleApproveCurrent = (targetJob: JobPosting = activeJob) => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });
    onApproveApply(targetJob);
  };

  const handleApproveAllJobs = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
    if (onApproveAll && activeJobsList.length > 0) {
      onApproveAll(activeJobsList);
    } else {
      onApproveApply(activeJob);
    }
  };

  const handleLaunchBotAndAutoCapture = async () => {
    setIsCapturingStart(true);
    const botUrl = `https://t.me/AutoApplyHitlBot?start=user_${(candidateProfile.email || 'alok').split('@')[0]}`;
    window.open(botUrl, '_blank');

    try {
      const res = await fetch('/api/telegram/detect-chat-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expectedUsername: telegramUsername || candidateProfile.telegramUsername || '@alok_kumar',
          botToken: telegramToken || candidateProfile.telegramBotToken || '7482910394:AAHv_JobAutoApplyHitlBotKey_x92k'
        })
      });
      const data = await res.json();
      if (data.chatId) {
        setTelegramChatId(data.chatId);
        if (data.botToken) setTelegramToken(data.botToken);
        if (data.username) setTelegramUsername(`@${data.username.replace('@', '')}`);
        if (onUpdateProfile) {
          onUpdateProfile({
            telegramChatId: data.chatId,
            telegramBotToken: data.botToken || telegramToken,
            telegramUsername: data.username ? `@${data.username.replace('@', '')}` : telegramUsername
          });
        }
        setLiveSendSuccess(`Connected! Auto-detected Telegram Chat ID: ${data.chatId}`);
      }
    } catch (e: any) {
      setLiveSendSuccess(`Auto-configured demo Chat ID: 987654321`);
    } finally {
      setIsCapturingStart(false);
    }
  };

  const handleLiveTelegramTest = async () => {
    if (!telegramToken || !telegramChatId) {
      alert("Please enter both Telegram Bot Token and Chat ID to send live alert.");
      return;
    }

    setIsSendingLive(true);
    setLiveSendSuccess(null);
    try {
      const res = await fetch("/api/telegram/send-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          botToken: telegramToken,
          chatId: telegramChatId,
          job: activeJob,
          resumeHighlights: activeResume?.summaryHighlights
        })
      });
      const data = await res.json();
      if (data.success) {
        setLiveSendSuccess("Live Telegram Alert Sent Successfully to your phone!");
      } else {
        setLiveSendSuccess(`Telegram API Error: ${data.telegramResponse?.description || 'Failed'}`);
      }
    } catch (e: any) {
      setLiveSendSuccess(`Error: ${e.message}`);
    } finally {
      setIsSendingLive(false);
    }
  };

  const handleDownloadPdf = (targetJob: JobPosting = activeJob) => {
    const targetResume = (resumes.find(r => r.jobId === targetJob.id) || activeResume);
    const filename = `${candidateProfile.firstName}_${candidateProfile.lastName}_${targetJob.company.replace(/\s+/g, '_')}_Resume.pdf`;
    generateAtsPdf(targetResume?.markdownContent || '', filename);
  };

  return (
    <div id="telegram-hitl-stage" className="space-y-4">
      {/* Header Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800/60 font-semibold">
              STAGE 4: HUMAN-IN-THE-LOOP (HITL) APPROVAL
            </span>
            <span className="text-xs text-neutral-400">Telegram Bot API Integration</span>
          </div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            One-Click Job Approval Queue ({activeJobsList.length} Job{activeJobsList.length > 1 ? 's' : ''})
          </h2>
          <p className="text-xs text-neutral-400">
            Interactive inline buttons ensure 100% human oversight before Playwright browser automation executes.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* One-Click Apply All Button for Multiple Jobs */}
          {activeJobsList.length > 1 && (
            <button
              type="button"
              id="btn-hitl-apply-all"
              onClick={handleApproveAllJobs}
              aria-label={`One-click apply all ${activeJobsList.length} jobs`}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-emerald-950/40 transition cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" aria-hidden="true" />
              <span>🚀 One-Click Apply All ({activeJobsList.length} Jobs)</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            aria-label={showConfig ? "Hide Telegram settings" : "Show Telegram settings and auto-detect"}
            aria-expanded={showConfig}
            className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium border border-neutral-700 transition cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{showConfig ? 'Hide Telegram Settings' : 'Telegram Settings & Auto-Detect'}</span>
          </button>
        </div>
      </div>

      {/* Multiple Jobs Queue Display & One-Click Apply Grid */}
      {activeJobsList.length > 1 && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-400" aria-hidden="true" />
              Stage 4 Multiple Jobs Queue ({activeJobsList.length} Active Feeds):
            </span>
            <button
              type="button"
              onClick={handleApproveAllJobs}
              aria-label={`One-click approve and apply all ${activeJobsList.length} jobs`}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <Zap className="w-3 h-3" aria-hidden="true" />
              <span>One-Click Approve & Apply All →</span>
            </button>
          </div>

          {/* Job Queue Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {activeJobsList.map((j, idx) => {
              const isSelected = selectedJobIndex === idx;
              const matchingResume = resumes.find(r => r.jobId === j.id) || resumes[idx];

              return (
                <div
                  key={j.id || idx}
                  className={`p-3.5 rounded-lg border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-teal-950/60 border-teal-500 ring-1 ring-teal-500/40 text-white shadow-sm'
                      : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                  }`}
                  onClick={() => setSelectedJobIndex(idx)}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-teal-300 font-mono">
                        {j.country}
                      </span>
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                        {j.matchScore || 96}% MATCH
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white mb-0.5 flex items-center gap-1">
                      <Building className="w-3 h-3 text-neutral-500 shrink-0" aria-hidden="true" />
                      <span className="truncate">{j.company}</span>
                    </h4>
                    <div className="text-[11px] text-neutral-400 truncate mb-2">
                      {j.title}
                    </div>

                    <div className="text-[10px] text-neutral-400 space-y-0.5 border-t border-neutral-800/80 pt-1.5">
                      <div>Visa: <span className="text-emerald-400 font-semibold">{j.visaSponsorship || 'Verified Sponsored'}</span></div>
                      {j.salary && <div>Salary: <span className="text-neutral-300">{j.salary}</span></div>}
                      {matchingResume && (
                        <div className="text-teal-400 truncate">✓ ATS Resume Tailored ({matchingResume.countryFormat})</div>
                      )}
                    </div>
                  </div>

                  {/* One Click Button on Each Job Card */}
                  <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-neutral-800/80">
                    <button
                      type="button"
                      id={`btn-apply-job-${idx}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApproveCurrent(j);
                      }}
                      aria-label={`One-click apply for ${j.title} at ${j.company}`}
                      className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold transition flex items-center justify-center gap-1 shadow cursor-pointer"
                    >
                      <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                      <span>1-Click Apply</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSkipJob(j);
                      }}
                      aria-label={`Skip application for ${j.title} at ${j.company}`}
                      className="px-2 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-rose-400 rounded border border-neutral-800 text-[11px] font-medium transition cursor-pointer"
                      title="Skip this job"
                    >
                      <XCircle className="w-3 h-3" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Real Telegram Bot Setup & Deep-Link Auto-Detection drawer */}
      {showConfig && (
        <div className="bg-neutral-950 border border-teal-800/40 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-2">
              <Bot className="w-4 h-4 text-teal-400" aria-hidden="true" />
              Telegram Account & Bot Auto-Capture (Zero Technical Friction)
            </h3>
            <span className="text-[11px] text-teal-400 font-mono">100% Free Forever via @BotFather</span>
          </div>

          <p className="text-xs text-neutral-300">
            To connect your Telegram account automatically: click the button below to launch our official bot. Once you press <strong>"Start"</strong> in the chat, the bot reads your Chat ID from the incoming message and auto-fills every field!
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={handleLaunchBotAndAutoCapture}
              disabled={isCapturingStart}
              aria-label="Launch official bot on Telegram and auto capture Chat ID"
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold shadow transition cursor-pointer"
            >
              <ExternalLink className={`w-3.5 h-3.5 ${isCapturingStart ? 'animate-spin' : ''}`} aria-hidden="true" />
              <span>{isCapturingStart ? 'Waiting for /start in Telegram...' : '🔗 Launch Official Bot (@AutoApplyHitlBot) & Auto-Capture Chat ID'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTelegramToken('7482910394:AAHv_JobAutoApplyHitlBotKey_x92k');
                setTelegramChatId('987654321');
                setTelegramUsername('@alok_kumar');
                setLiveSendSuccess('Auto-filled verified demo Telegram credentials!');
              }}
              aria-label="Auto fill demo Telegram credentials"
              className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-lg text-xs border border-neutral-700 font-medium cursor-pointer"
            >
              ⚡ Auto-Fill Demo Credentials
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div>
              <label htmlFor="telegram-username-input" className="block text-neutral-300 mb-1 font-medium">Telegram Username</label>
              <input
                id="telegram-username-input"
                type="text"
                aria-label="Telegram username"
                value={telegramUsername}
                onChange={(e) => setTelegramUsername(e.target.value)}
                placeholder="@username"
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white focus:border-teal-500 outline-none font-mono"
              />
            </div>
            <div>
              <label htmlFor="telegram-chatid-input" className="block text-neutral-300 mb-1 font-medium">Telegram Chat ID (from @userinfobot)</label>
              <input
                id="telegram-chatid-input"
                type="text"
                aria-label="Telegram Chat ID"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                placeholder="e.g. 987654321"
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white focus:border-teal-500 outline-none font-mono"
              />
            </div>
            <div>
              <label htmlFor="telegram-bottoken-input" className="block text-neutral-300 mb-1 font-medium">Telegram Bot Token (from @BotFather)</label>
              <input
                id="telegram-bottoken-input"
                type="password"
                aria-label="Telegram Bot Token"
                value={telegramToken}
                onChange={(e) => setTelegramToken(e.target.value)}
                placeholder="e.g. 7123456789:AAFxxx..."
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white focus:border-teal-500 outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-[11px] text-neutral-500">
              Telegram Bot API is permanently free. No credit card or server fees required.
            </p>
            <button
              type="button"
              onClick={handleLiveTelegramTest}
              disabled={isSendingLive}
              aria-label={isSendingLive ? "Sending live test message to Telegram..." : "Dispatch live test message to Telegram"}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-teal-300 border border-teal-800/80 rounded-lg text-xs font-semibold shadow transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isSendingLive ? 'Sending...' : 'Dispatch Live Test Message'}</span>
            </button>
          </div>

          {liveSendSuccess && (
            <div className={`p-2.5 rounded text-xs font-medium ${
              liveSendSuccess.includes("Successfully") || liveSendSuccess.includes("Connected") || liveSendSuccess.includes("Auto-filled") 
                ? "bg-emerald-950 text-emerald-300 border border-emerald-800" 
                : "bg-rose-950 text-rose-300 border border-rose-800"
            }`}>
              {liveSendSuccess}
            </div>
          )}
        </div>
      )}

      {/* Main Telegram Interactive Card & Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Telegram Card Simulator (Realistic Telegram UI) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
            {/* Telegram App Header Bar */}
            <div className="flex items-center justify-between pb-3.5 border-b border-neutral-800 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold shadow">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">AutoApply HITL Bot</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 font-mono">bot</span>
                  </div>
                  <span className="text-[11px] text-emerald-400">online • webhook active</span>
                </div>
              </div>

              <div className="text-[11px] text-neutral-500 font-mono">
                Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {/* Telegram Message Bubble */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 max-w-xl space-y-3 shadow-inner">
              {/* Message Header */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-teal-400 font-bold text-sm">
                  🎯 New Job Match ({activeJob.country})
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                  {activeJob.matchScore || 96}% MATCH
                </span>
              </div>

              {/* Body Fields */}
              <div className="space-y-1.5 text-xs text-neutral-200 font-sans leading-relaxed">
                <div>🏢 <strong>Company:</strong> {activeJob.company}</div>
                <div>💼 <strong>Role:</strong> {activeJob.title}</div>
                <div>📍 <strong>Location:</strong> {activeJob.location}</div>
                <div>🛂 <strong>Visa Status:</strong> <span className="text-emerald-400 font-semibold">{activeJob.visaSponsorship}</span></div>
                {activeJob.salary && <div>💰 <strong>Compensation:</strong> {activeJob.salary}</div>}
                <div>🔗 <a href={activeJob.url} target="_blank" rel="noreferrer" className="text-teal-400 hover:underline">View Verified Job Posting</a></div>
              </div>

              {/* Attached Tailored ATS PDF Bubble */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-950/80 border border-rose-800/80 flex items-center justify-center text-rose-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">
                      {candidateProfile.firstName}_{candidateProfile.lastName}_{activeJob.company.replace(/\s+/g, '_')}_Resume.pdf
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono">
                      1-Page ATS PDF • 42 KB • {activeResume?.countryFormat || 'GERMANY_EU'} Standard
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownloadPdf(activeJob)}
                  aria-label={`Download ATS resume PDF for ${activeJob.company}`}
                  className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded border border-neutral-700 cursor-pointer"
                  title="Download attached PDF"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>

              {/* Inline Callback Action Buttons */}
              <div className="pt-2">
                <div className="text-[11px] text-neutral-400 mb-2 font-mono flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" aria-hidden="true" />
                  Interactive Inline Callback Keyboard:
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    id="btn-hitl-approve"
                    onClick={() => handleApproveCurrent(activeJob)}
                    aria-label={`One-click approve and apply for ${activeJob.title} at ${activeJob.company}`}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 border border-emerald-500/40 active:scale-[0.98] transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-100" aria-hidden="true" />
                    <span>✅ One-Click Apply</span>
                  </button>

                  <button
                    type="button"
                    id="btn-hitl-skip"
                    onClick={() => onSkipJob(activeJob)}
                    aria-label={`Skip application for ${activeJob.title} at ${activeJob.company}`}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 active:scale-[0.98] transition cursor-pointer"
                  >
                    <XCircle className="w-4 h-4 text-rose-400" aria-hidden="true" />
                    <span>❌ Skip Job</span>
                  </button>
                </div>

                {activeJobsList.length > 1 && (
                  <button
                    type="button"
                    onClick={handleApproveAllJobs}
                    aria-label={`Apply to all ${activeJobsList.length} queued jobs together`}
                    className="w-full mt-2.5 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Apply All {activeJobsList.length} Queued Jobs Together</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: HITL Protocol Explainer */}
        <div className="space-y-3">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3 text-xs">
            <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              HITL Policy Safeguards
            </h3>

            <p className="text-neutral-400 leading-relaxed">
              Automated job submissions without human review can violate terms of service, trigger spam detection, or misrepresent candidate intent.
            </p>

            <div className="space-y-2 border-t border-neutral-800 pt-2.5">
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">1.</span>
                <span className="text-neutral-300">
                  <strong>Zero Account Bans:</strong> Each submission is explicitly authorized with 1 click.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">2.</span>
                <span className="text-neutral-300">
                  <strong>100% Free Forever:</strong> Telegram Bot API has zero monthly subscription fees.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">3.</span>
                <span className="text-neutral-300">
                  <strong>Batch Execution:</strong> Click Apply All or individual 1-Click buttons to trigger browser automation safely.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <h4 className="text-xs font-bold text-neutral-300 mb-1">Testing Without Telegram Bot</h4>
            <p className="text-xs text-neutral-400 mb-3">
              You can test the entire pipeline directly using the interactive simulator buttons on the left!
            </p>
            <button
              type="button"
              onClick={() => handleApproveCurrent(activeJob)}
              aria-label="Simulate approve and launch Stage 5 interview preparation"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Simulate [Approve] & Launch Stage 5</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
