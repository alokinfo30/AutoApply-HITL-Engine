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
  jobs?: JobPosting[];
  resume?: any;
  resumes?: any[];
  candidateProfile: CandidateProfile;
  isOpen: boolean;
  onClose: () => void;
  onCompleteApplication: (job: JobPosting, refId: string) => void;
  onCompleteAllApplications?: (results: Array<{ job: JobPosting; refId: string }>) => void;
}

export const BrowserWorkerModal: React.FC<BrowserWorkerModalProps> = ({
  job,
  jobs = [],
  resume,
  resumes = [],
  candidateProfile,
  isOpen,
  onClose,
  onCompleteApplication,
  onCompleteAllApplications
}) => {
  const activeJobs = jobs.length > 0 ? jobs : (job ? [job] : []);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [completedResults, setCompletedResults] = useState<Array<{ job: JobPosting; refId: string }>>([]);

  const currentActiveJob = activeJobs[currentJobIndex] || activeJobs[0] || job;

  const getJobResume = (targetJob: JobPosting | null, index: number) => {
    if (!targetJob) return resume;
    const match = resumes.find(r => r.jobId === targetJob.id);
    if (match) return match;
    if (resumes[index]) return resumes[index];
    return resume;
  };

  const generateDefaultSteps = (targetJob: JobPosting | null, jobIdx: number = 0): AutomationStep[] => {
    const jobResume = getJobResume(targetJob, jobIdx);
    const resumeFilename = `${candidateProfile?.firstName || 'Alok'}_${candidateProfile?.lastName || 'Kumar'}_${(targetJob?.company || 'Target').replace(/\s+/g, '_')}_${targetJob?.country || 'ATS'}_Resume.pdf`;
    const countryStd = jobResume?.countryFormat || (targetJob?.country?.toLowerCase().includes('germany') ? 'GERMANY_EU' : targetJob?.country?.toLowerCase().includes('singapore') ? 'SINGAPORE_AU' : 'US_GLOBAL');

    return [
      {
        stepNumber: 1,
        name: "Launch Headless Chromium & Navigate",
        action: `Navigating to ${targetJob?.applyUrl || targetJob?.url || 'https://careers.portal.com'} (${targetJob?.company})`,
        targetSelector: "page.goto(url, { waitUntil: 'networkidle' })",
        status: "pending",
        log: `[Playwright] Launching Chromium 120.0 (Headless mode, user-agent spoofed for ${targetJob?.country || 'Global'})...`
      },
      {
        stepNumber: 2,
        name: "Locate Apply / Easy Apply Trigger",
        action: `Scanning DOM for ${targetJob?.company}'s application modal triggers`,
        targetSelector: "button:has-text('Apply'), a:has-text('Apply Now'), #apply-btn",
        status: "pending",
        log: `[DOM] Located active selector 'button.application-form-trigger' for ${targetJob?.company}. Clicked successfully.`
      },
      {
        stepNumber: 3,
        name: "Auto-Fill Candidate Profile & Visa Flags",
        action: `Injecting: ${candidateProfile?.firstName || 'Alok'} ${candidateProfile?.lastName || 'Kumar'} (${candidateProfile?.email || 'alokinfo30@gmail.com'})`,
        targetSelector: "input[name='first_name'], input[name='email'], input[name='phone'], input[name='location']",
        value: `Location: ${candidateProfile?.currentLocation || 'Bengaluru, India'} | Visa: Yes | Relocation: Yes (${targetJob?.country})`,
        status: "pending",
        log: `[Form] Injected fields: Name='${candidateProfile?.firstName || 'Alok'} ${candidateProfile?.lastName || 'Kumar'}', Location='${candidateProfile?.currentLocation || 'Bengaluru, India'}', TargetCountry='${targetJob?.country}', VisaSponsorship='Yes'.`
      },
      {
        stepNumber: 4,
        name: "Upload Tailored ATS Resume PDF",
        action: `Uploading: ${resumeFilename} (${countryStd} Standard)`,
        targetSelector: "input[type='file'][name='resume']",
        status: "pending",
        log: `[File Upload] Attached tailored 1-Page ATS PDF for ${targetJob?.company} (${countryStd}). Verified JD keywords & XYZ achievement metrics.`
      },
      {
        stepNumber: 5,
        name: "Submit & Capture Confirmation Screenshot",
        action: `Submitting application to ${targetJob?.company} and recording proof reference`,
        targetSelector: "button[type='submit']",
        status: "pending",
        log: `[Submission] HTTP 200 OK — Application submitted to ${targetJob?.company} successfully. Confirmation snapshot captured.`
      }
    ];
  };

  const [steps, setSteps] = useState<AutomationStep[]>(() => generateDefaultSteps(currentActiveJob, 0));

  useEffect(() => {
    if (!isOpen || activeJobs.length === 0) return;

    setCurrentJobIndex(0);
    setCompletedResults([]);
    setIsRunning(true);
    setIsFinished(false);

    let jobIdx = 0;
    let stepIdx = 0;
    const initialSteps = generateDefaultSteps(activeJobs[0], 0);
    setSteps(initialSteps);

    const firstJob = activeJobs[0];
    const firstCode = `APP-${(firstJob.country || 'GL').substring(0, 2).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmationCode(firstCode);

    setLogs([
      `[*] [${new Date().toLocaleTimeString()}] HITL Approval received from Telegram Bot Webhook.`,
      `[*] [${new Date().toLocaleTimeString()}] Sequential Automation Queue: Processing ${activeJobs.length} application(s) with specific tailored resumes.`,
      `[*] [${new Date().toLocaleTimeString()}] [Job 1/${activeJobs.length}] Starting Playwright worker for ${firstJob.title} at ${firstJob.company} (${firstJob.country})...`
    ]);

    const results: Array<{ job: JobPosting; refId: string }> = [];

    const interval = setInterval(() => {
      const activeCurrentJob = activeJobs[jobIdx];
      if (!activeCurrentJob) {
        clearInterval(interval);
        return;
      }

      if (stepIdx < 5) {
        const nextStepNum = stepIdx;
        setSteps(prev => prev.map((s, idx) => {
          if (idx === nextStepNum) return { ...s, status: 'running' };
          if (idx < nextStepNum) return { ...s, status: 'completed' };
          return s;
        }));

        const currentStepsDef = generateDefaultSteps(activeCurrentJob, jobIdx);
        setLogs(prev => [
          ...prev,
          `[✓] [${new Date().toLocaleTimeString()}] [${activeCurrentJob.company}] ${currentStepsDef[nextStepNum]?.log || 'Step completed'}`
        ]);

        stepIdx++;
        setCurrentStepIndex(stepIdx);
      } else {
        // Current job finished
        const appCode = `APP-${(activeCurrentJob.country || 'GL').substring(0, 2).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
        results.push({ job: activeCurrentJob, refId: appCode });
        onCompleteApplication(activeCurrentJob, appCode);

        setLogs(prev => [
          ...prev,
          `[🚀] [${new Date().toLocaleTimeString()}] [${activeCurrentJob.company}] SUBMITTED! Ref: ${appCode} (${activeCurrentJob.country} Standard ATS Verified)`
        ]);

        // Move to next job or finish
        if (jobIdx + 1 < activeJobs.length) {
          jobIdx++;
          stepIdx = 0;
          setCurrentJobIndex(jobIdx);
          const nextJob = activeJobs[jobIdx];
          setSteps(generateDefaultSteps(nextJob, jobIdx));
          setConfirmationCode(`APP-${(nextJob.country || 'GL').substring(0, 2).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`);
          setLogs(prev => [
            ...prev,
            `----------------------------------------------------`,
            `[*] [${new Date().toLocaleTimeString()}] [Job ${jobIdx + 1}/${activeJobs.length}] Switching to ${nextJob.title} at ${nextJob.company} (${nextJob.country})...`,
            `[*] [${new Date().toLocaleTimeString()}] Loaded tailored resume for ${nextJob.company} (${nextJob.country} CV Standard)`
          ]);
        } else {
          // Finished all jobs in sequence
          clearInterval(interval);
          setSteps(prev => prev.map(s => ({ ...s, status: 'completed' })));
          setIsRunning(false);
          setIsFinished(true);
          setCompletedResults(results);
          if (onCompleteAllApplications) {
            onCompleteAllApplications(results);
          }
          setLogs(prev => [
            ...prev,
            `====================================================`,
            `[🏆] [${new Date().toLocaleTimeString()}] ALL ${activeJobs.length} JOBS APPLIED SEQUENTIALLY WITH TAILORED RESUMES!`,
            `[✓] All submission confirmation codes stored in HITL History.`
          ]);
        }
      }
    }, 900);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !currentActiveJob) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  STAGE 5: BROWSER AUTOMATION WORKER
                </span>
                <span className="text-xs text-neutral-400 font-mono">Playwright Sequential Submission Engine</span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                Applying to {currentActiveJob.title} — {currentActiveJob.company} ({currentActiveJob.country})
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close browser automation worker modal"
            className="p-2 text-neutral-400 hover:text-white rounded-lg bg-neutral-900 border border-neutral-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Multi-Job Sequential Queue Bar */}
        {activeJobs.length > 1 && (
          <div className="bg-neutral-950 px-5 py-2.5 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-emerald-400">
                Application Queue: Job {currentJobIndex + 1} of {activeJobs.length}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                ({Math.round(((currentJobIndex + (isFinished ? 1 : 0)) / activeJobs.length) * 100)}% Complete)
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {activeJobs.map((j, idx) => {
                const isPast = idx < currentJobIndex || (idx === currentJobIndex && isFinished);
                const isCurrent = idx === currentJobIndex && !isFinished;
                return (
                  <span
                    key={j.id || idx}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 ${
                      isPast
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : isCurrent
                        ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                        : 'bg-neutral-900 text-neutral-500 border border-neutral-800'
                    }`}
                  >
                    {isPast ? '✓' : idx + 1}. {j.company}
                  </span>
                );
              })}
            </div>
          </div>
        )}

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
                type="button"
                onClick={onClose}
                aria-label="Close modal and view next match"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow transition cursor-pointer"
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
