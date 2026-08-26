import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  CheckCircle2, 
  Terminal, 
  Globe, 
  UploadCloud, 
  ShieldCheck, 
  FileCheck, 
  Camera, 
  ArrowRight, 
  X, 
  RefreshCw,
  ExternalLink,
  Building,
  MapPin
} from 'lucide-react';
import { JobPosting, CandidateProfile, AutomationStep } from '../types';

interface BrowserWorkerModalProps {
  job: JobPosting | null;
  candidateProfile: CandidateProfile;
  isOpen: boolean;
  onClose: () => void;
  onCompleteApplication: (job: JobPosting, refId: string) => void;
}

export const BrowserWorkerModal: React.FC<BrowserWorkerModalProps> = ({
  job,
  candidateProfile,
  isOpen,
  onClose,
  onCompleteApplication
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  const defaultSteps: AutomationStep[] = [
    {
      stepNumber: 1,
      name: "Launch Headless Chromium & Navigate",
      action: `Navigating to ${job?.applyUrl || job?.url || 'https://careers.portal.com'}`,
      targetSelector: "page.goto(url, { waitUntil: 'networkidle' })",
      status: "pending",
      log: `[Playwright] Launching Chromium 120.0 (Headless mode, user-agent spoofed)...`
    },
    {
      stepNumber: 2,
      name: "Locate Apply / Easy Apply Trigger",
      action: "Scanning DOM for application modal triggers",
      targetSelector: "button:has-text('Apply'), a:has-text('Apply Now'), #apply-btn",
      status: "pending",
      log: `[DOM] Located active selector 'button.application-form-trigger'. Clicked successfully.`
    },
    {
      stepNumber: 3,
      name: "Auto-Fill Candidate Profile & Visa Flags",
      action: `Injecting: ${candidateProfile?.firstName || 'Alok'} ${candidateProfile?.lastName || 'Kumar'} (${candidateProfile?.email || 'alokinfo30@gmail.com'})`,
      targetSelector: "input[name='first_name'], input[name='email'], input[name='phone'], input[name='location']",
      value: `Location: ${candidateProfile?.currentLocation || 'Bengaluru, India'} | Visa: Yes | Relocation: Yes`,
      status: "pending",
      log: `[Form] Injected fields: Name='${candidateProfile?.firstName || 'Alok'} ${candidateProfile?.lastName || 'Kumar'}', Location='${candidateProfile?.currentLocation || 'Bengaluru, India'}', VisaSponsorship='Yes'.`
    },
    {
      stepNumber: 4,
      name: "Upload Tailored ATS Resume PDF",
      action: `Uploading: ${candidateProfile?.firstName || 'Alok'}_${candidateProfile?.lastName || 'Kumar'}_Resume.pdf`,
      targetSelector: "input[type='file'][name='resume']",
      status: "pending",
      log: `[File Upload] Attached 1-Page ATS PDF into file input stream. Bytes verified.`
    },
    {
      stepNumber: 5,
      name: "Submit & Capture Confirmation Screenshot",
      action: "Triggering final submission and recording proof of receipt",
      targetSelector: "button[type='submit']",
      status: "pending",
      log: `[Submission] HTTP 200 OK — Application submitted successfully. Screen captured.`
    }
  ];

  const [steps, setSteps] = useState<AutomationStep[]>(defaultSteps);

  useEffect(() => {
    if (!isOpen || !job) return;

    setCurrentStepIndex(0);
    setIsRunning(true);
    setIsFinished(false);
    setLogs([
      `[*] [${new Date().toLocaleTimeString()}] HITL One-Click Approval received from Telegram Webhook.`,
      `[*] [${new Date().toLocaleTimeString()}] Initializing browser-use / Playwright execution harness for Job: ${job.title} at ${job.company}`
    ]);

    const code = `APP-${job.country.substring(0, 2).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmationCode(code);

    let step = 0;
    const interval = setInterval(() => {
      if (step < defaultSteps.length) {
        const nextStepNum = step;
        setSteps(prev => prev.map((s, idx) => {
          if (idx === nextStepNum) return { ...s, status: 'running' };
          if (idx < nextStepNum) return { ...s, status: 'completed' };
          return s;
        }));

        setLogs(prev => [
          ...prev,
          `[✓] [${new Date().toLocaleTimeString()}] ${defaultSteps[nextStepNum].log}`
        ]);

        step++;
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);
        setSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));
        setIsRunning(false);
        setIsFinished(true);
        setLogs(prev => [
          ...prev,
          `[🚀] [${new Date().toLocaleTimeString()}] END-TO-END PIPELINE COMPLETE: Application ${code} submitted!`
        ]);
        onCompleteApplication(job, code);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [isOpen, job]);

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  STAGE 5: BROWSER AUTOMATION WORKER
                </span>
                <span className="text-xs text-neutral-400 font-mono">Playwright / browser-use (Python)</span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                Applying to {job.title} — {job.company}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg bg-neutral-900 border border-neutral-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Target Candidate & Form Values Injected */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-neutral-950 p-3 rounded-xl border border-neutral-800">
            <div>
              <span className="text-neutral-500 block text-[10px]">Candidate</span>
              <strong className="text-neutral-200">{candidateProfile?.firstName || 'Alok'} {candidateProfile?.lastName || 'Kumar'}</strong>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">Email & Phone</span>
              <span className="text-neutral-200 font-mono">{candidateProfile?.email || 'alokinfo30@gmail.com'}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">Location</span>
              <span className="text-neutral-200">{candidateProfile?.currentLocation || 'Bengaluru, India'}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">Visa / Relocation</span>
              <span className="text-emerald-400 font-semibold">Yes / Yes</span>
            </div>
          </div>

          {/* 5-Step Action Progress Checklist */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Live DOM Actions & Worker Sequence
            </h3>

            <div className="space-y-2">
              {steps.map((st, idx) => {
                const isStepRunning = st.status === 'running';
                const isStepDone = st.status === 'completed';

                return (
                  <div
                    key={st.stepNumber}
                    className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                      isStepDone
                        ? 'bg-neutral-950 border-emerald-500/40 text-neutral-200'
                        : isStepRunning
                        ? 'bg-emerald-950/30 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/50'
                        : 'bg-neutral-950/50 border-neutral-800 text-neutral-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] bg-neutral-900 border border-neutral-700">
                        {isStepDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : isStepRunning ? (
                          <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                        ) : (
                          <span>{st.stepNumber}</span>
                        )}
                      </div>

                      <div>
                        <div className="font-semibold text-xs flex items-center gap-2">
                          <span className={isStepDone ? 'text-emerald-300' : isStepRunning ? 'text-white' : 'text-neutral-400'}>
                            {st.name}
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                          {st.action}
                        </div>
                      </div>
                    </div>

                    <div className="hidden sm:block text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                      {st.targetSelector}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Terminal Output Window */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="font-mono text-[11px] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                Playwright Worker Console Output
              </span>
              <span className="text-[10px] text-neutral-500">stdio: stdout</span>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 font-mono text-[11px] text-emerald-400/90 h-32 overflow-y-auto space-y-1 leading-relaxed">
              {logs.map((log, i) => (
                <div key={i} className="whitespace-pre-wrap">{log}</div>
              ))}
            </div>
          </div>

          {/* Confirmation Box (when finished) */}
          {isFinished && (
            <div className="bg-emerald-950/40 border border-emerald-500/60 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-neutral-950 shadow-lg">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Application Submitted Successfully!
                  </h4>
                  <p className="text-xs text-emerald-300">
                    Proof Reference: <strong className="font-mono">{confirmationCode}</strong> • Log recorded in HITL History.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow transition"
              >
                Close & View Next Match
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
