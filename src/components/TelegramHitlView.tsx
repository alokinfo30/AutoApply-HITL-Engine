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
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { JobPosting, GeneratedResume, CandidateProfile } from '../types';
import { generateAtsPdf } from '../utils/pdfGenerator';

interface TelegramHitlViewProps {
  job: JobPosting | null;
  resume: GeneratedResume | null;
  onApproveApply: (job: JobPosting) => void;
  onSkipJob: (job: JobPosting) => void;
  candidateProfile: CandidateProfile;
  botStatus: 'idle' | 'sending' | 'approved' | 'skipped';
}

export const TelegramHitlView: React.FC<TelegramHitlViewProps> = ({
  job,
  resume,
  onApproveApply,
  onSkipJob,
  candidateProfile,
  botStatus
}) => {
  const [telegramToken, setTelegramToken] = useState<string>('');
  const [telegramChatId, setTelegramChatId] = useState<string>('');
  const [showConfig, setShowConfig] = useState(false);
  const [isSendingLive, setIsSendingLive] = useState(false);
  const [liveSendSuccess, setLiveSendSuccess] = useState<string | null>(null);

  if (!job) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center text-neutral-400">
        <Send className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
        <p className="text-sm font-medium text-neutral-300">No Job Queued for HITL Approval</p>
        <p className="text-xs text-neutral-500 mt-1">Generate a tailored resume in Stage 3 to dispatch an approval card.</p>
      </div>
    );
  }

  const handleApprove = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });
    onApproveApply(job);
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
          job,
          resumeHighlights: resume?.summaryHighlights
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

  const handleDownloadPdf = () => {
    const filename = `${candidateProfile.firstName}_${candidateProfile.lastName}_${job.company.replace(/\s+/g, '_')}_Resume.pdf`;
    generateAtsPdf(resume?.markdownContent || '', filename);
  };

  return (
    <div id="telegram-hitl-stage" className="space-y-4">
      {/* Header Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800/60 font-semibold">
              STAGE 4: HUMAN-IN-THE-LOOP (HITL) ALERT
            </span>
            <span className="text-xs text-neutral-400">Telegram Bot API (100% Free Forever)</span>
          </div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            One-Click Job Approval Dispatcher
          </h2>
          <p className="text-xs text-neutral-400">
            Interactive inline callback buttons ensure 100% human oversight before Playwright automation triggers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium border border-neutral-700 transition"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{showConfig ? 'Hide Bot Token Setup' : 'Real Telegram Bot Setup (Free)'}</span>
          </button>
        </div>
      </div>

      {/* Optional Real Telegram Bot Token Setup drawer */}
      {showConfig && (
        <div className="bg-neutral-950 border border-teal-800/40 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-2">
              <Bot className="w-4 h-4 text-teal-400" />
              Configure Real Telegram Bot (Zero Cost via @BotFather)
            </h3>
            <span className="text-[11px] text-neutral-400">Optional: Test live alerts directly on your smartphone</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-neutral-300 mb-1 font-medium">Telegram Bot Token (from @BotFather)</label>
              <input
                type="password"
                value={telegramToken}
                onChange={(e) => setTelegramToken(e.target.value)}
                placeholder="e.g. 7123456789:AAFxxx..."
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white focus:border-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-neutral-300 mb-1 font-medium">Your Telegram Chat ID (from @userinfobot)</label>
              <input
                type="text"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                placeholder="e.g. 987654321"
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-[11px] text-neutral-500">
              Telegram Bot API is permanently free. No credit card or server fees required.
            </p>
            <button
              onClick={handleLiveTelegramTest}
              disabled={isSendingLive}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold shadow transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSendingLive ? 'Sending...' : 'Dispatch Live Message to Telegram'}</span>
            </button>
          </div>

          {liveSendSuccess && (
            <div className={`p-2.5 rounded text-xs font-medium ${
              liveSendSuccess.includes("Successfully") ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-rose-950 text-rose-300 border border-rose-800"
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
                  🎯 New Job Match ({job.country})
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                  {job.matchScore || 96}% MATCH
                </span>
              </div>

              {/* Body Fields */}
              <div className="space-y-1.5 text-xs text-neutral-200 font-sans leading-relaxed">
                <div>🏢 <strong>Company:</strong> {job.company}</div>
                <div>💼 <strong>Role:</strong> {job.title}</div>
                <div>📍 <strong>Location:</strong> {job.location}</div>
                <div>🛂 <strong>Visa Status:</strong> <span className="text-emerald-400 font-semibold">{job.visaSponsorship}</span></div>
                {job.salary && <div>💰 <strong>Compensation:</strong> {job.salary}</div>}
                <div>🔗 <a href={job.url} target="_blank" rel="noreferrer" className="text-teal-400 hover:underline">View Verified Job Posting</a></div>
              </div>

              {/* Attached Tailored ATS PDF Bubble */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-950/80 border border-rose-800/80 flex items-center justify-center text-rose-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">
                      {candidateProfile.firstName}_{candidateProfile.lastName}_{job.company.replace(/\s+/g, '_')}_Resume.pdf
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono">
                      1-Page ATS PDF • 42 KB • {resume?.countryFormat || 'GERMANY_EU'} Standard
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDownloadPdf}
                  className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded border border-neutral-700"
                  title="Download attached PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Inline Callback Action Buttons */}
              <div className="pt-2">
                <div className="text-[11px] text-neutral-400 mb-2 font-mono flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  Interactive Inline Callback Keyboard:
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    id="btn-hitl-approve"
                    onClick={handleApprove}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 border border-emerald-500/40 active:scale-[0.98] transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-100" />
                    <span>✅ One-Click Apply</span>
                  </button>

                  <button
                    id="btn-hitl-skip"
                    onClick={() => onSkipJob(job)}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 active:scale-[0.98] transition cursor-pointer"
                  >
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>❌ Skip Job</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: HITL Protocol Explainer */}
        <div className="space-y-3">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3 text-xs">
            <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
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
                  <strong>Instant Trigger:</strong> Tapping "✅ One-Click Apply" invokes the Playwright browser worker immediately.
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
              onClick={handleApprove}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold transition"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simulate [Approve] & Launch Stage 5</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
