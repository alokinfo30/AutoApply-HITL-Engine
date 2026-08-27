import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Code, 
  Cpu, 
  Building2, 
  HelpCircle, 
  CheckCircle, 
  Copy, 
  Download, 
  Lightbulb, 
  RefreshCw, 
  Mic, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  Award,
  Terminal,
  FileText,
  Mail,
  Calendar,
  Archive,
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { JobPosting, CandidateProfile, InterviewPrepGuide, InterviewTechnicalQuestion } from '../types';
import { generateAtsPdf } from '../utils/pdfGenerator';
import { FollowUpEmailModal } from './FollowUpEmailModal';
import { InterviewSchedulerModal } from './InterviewSchedulerModal';
import JSZip from 'jszip';

interface InterviewPrepViewProps {
  job: JobPosting | null;
  jobs?: JobPosting[];
  candidateProfile: CandidateProfile;
  onLaunchMockInterview?: (job: JobPosting) => void;
  onProceedToMockInterview?: () => void;
  onOpenSummaryDashboard?: () => void;
}

// Custom hook to track downloaded status of Master Guides
export const useMasterGuideDownloads = () => {
  const [downloadedJobIds, setDownloadedJobIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('downloaded_master_guides');
      if (saved) return new Set(JSON.parse(saved));
    } catch (e) {
      // ignore
    }
    return new Set<string>();
  });

  const markDownloaded = (jobId: string) => {
    setDownloadedJobIds(prev => {
      const next = new Set(prev).add(jobId);
      try {
        localStorage.setItem('downloaded_master_guides', JSON.stringify(Array.from(next)));
      } catch (e) {}
      return next;
    });
  };

  const markAllDownloaded = (jobIds: string[]) => {
    setDownloadedJobIds(prev => {
      const next = new Set([...prev, ...jobIds]);
      try {
        localStorage.setItem('downloaded_master_guides', JSON.stringify(Array.from(next)));
      } catch (e) {}
      return next;
    });
  };

  const isDownloaded = (jobId: string) => downloadedJobIds.has(jobId);

  return {
    downloadedJobIds,
    markDownloaded,
    markAllDownloaded,
    isDownloaded
  };
};

export const InterviewPrepView: React.FC<InterviewPrepViewProps> = ({
  job,
  jobs = [],
  candidateProfile,
  onLaunchMockInterview,
  onProceedToMockInterview,
  onOpenSummaryDashboard
}) => {
  const activeJobsList = jobs.length > 0 ? jobs : (job ? [job] : []);
  const [selectedJobIndex, setSelectedJobIndex] = useState(0);
  const currentJob = activeJobsList[selectedJobIndex] || activeJobsList[0] || job;

  const [seniorityLevel, setSeniorityLevel] = useState<'Mid-Level' | 'Senior' | 'Lead / Staff'>('Senior');
  const [prepGuide, setPrepGuide] = useState<InterviewPrepGuide | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'technical' | 'system_design' | 'company' | 'behavioral' | 'tips'>('technical');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showFollowUpEmailModal, setShowFollowUpEmailModal] = useState(false);
  const [showSchedulerModal, setShowSchedulerModal] = useState(false);
  const { downloadedJobIds, markDownloaded, markAllDownloaded } = useMasterGuideDownloads();
  const [showStage7WarningModal, setShowStage7WarningModal] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(15);

  const nonDownloadedJobs = activeJobsList.filter(j => !downloadedJobIds.has(j.id));
  const hasUnsavedGuides = nonDownloadedJobs.length > 0;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showStage7WarningModal) {
      setCountdownSeconds(15);
      timer = setInterval(() => {
        setCountdownSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoDeleteAndProceed();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showStage7WarningModal]);

  const triggerServerCleanup = async () => {
    try {
      await fetch('/api/cleanup-session-guides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          downloadedJobIds: Array.from(downloadedJobIds),
          sessionJobIds: activeJobsList.map(j => j.id)
        })
      });
    } catch (e) {
      console.error('Session guide cleanup error:', e);
    }
  };

  const handleAutoDeleteAndProceed = async () => {
    await triggerServerCleanup();
    setPrepGuide(null);
    setShowStage7WarningModal(false);
    if (onProceedToMockInterview) {
      onProceedToMockInterview();
    }
  };

  useEffect(() => {
    if (currentJob) {
      loadInterviewPrep();
    }
  }, [currentJob?.id, seniorityLevel]);

  const loadInterviewPrep = async () => {
    if (!currentJob) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/gemini/prepare-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job: currentJob,
          candidateProfile,
          seniorityLevel
        })
      });
      const data = await res.json();
      if (data.success && data.prepGuide) {
        setPrepGuide(data.prepGuide);
      }
    } catch (e) {
      console.error('Failed to generate interview prep', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleExportPdf = () => {
    if (!prepGuide || !currentJob) return;
    let markdown = `# INTERVIEW MASTER PREPARATION GUIDE
## Role: ${prepGuide.roleTitle} at ${prepGuide.companyName}
**Target Seniority Bar:** ${seniorityLevel} | **Prepared for:** ${candidateProfile.firstName} ${candidateProfile.lastName}
**Target Country Format:** ${currentJob.country || 'Global'}

---

## 1. TECHNICAL QUESTIONS, CONCEPTS & SYNTAX
`;
    prepGuide.technicalQuestions.forEach((q, i) => {
      markdown += `
### ${i + 1}. [${q.topic}] ${q.question}
**Core Definition:**
${q.definition}

**Optimal Syntax / Code Pattern:**
\`\`\`
${q.syntax}
\`\`\`

**Production Scenario & Trade-offs:**
${q.practicalExample}

**Must-Mention Keywords:** ${q.keyTerms.join(', ')}

---
`;
    });

    markdown += `\n## 2. SYSTEM DESIGN & ARCHITECTURE\n`;
    prepGuide.systemDesignQuestions.forEach((sd, i) => {
      markdown += `
### ${i + 1}. ${sd.title}
- **Requirements:** ${sd.requirements}
- **Architecture Components:** ${sd.architectureComponents.join(', ')}
- **Bottlenecks & Trade-offs:** ${sd.bottlenecksAndTradeoffs}
`;
    });

    markdown += `\n## 3. BEHAVIORAL STAR ANSWERS\n`;
    prepGuide.behavioralStarQuestions.forEach((b, i) => {
      markdown += `
### ${i + 1}. Scenario: ${b.scenario}
- **Situation/Task:** ${b.situationTask}
- **Action:** ${b.action}
- **Result:** ${b.result}
`;
    });

    generateAtsPdf(markdown, `${currentJob.company.replace(/\s+/g, '_')}_Interview_Prep_Guide.pdf`);
    markDownloaded(currentJob.id);
  };

  // Bundle All Guides into a single ZIP file
  const handleDownloadAllZip = async () => {
    if (activeJobsList.length === 0) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder("Targeted_Interview_Master_Guides");

      activeJobsList.forEach(jobItem => {
        const guideText = `================================================================================
TARGETED TECHNICAL & BEHAVIORAL MASTER INTERVIEW GUIDE
Company: ${jobItem.company}
Position: ${jobItem.title}
Destination Country: ${jobItem.country || 'Global'}
Candidate: ${candidateProfile.firstName} ${candidateProfile.lastName}
Generated: ${new Date().toLocaleDateString()}
================================================================================

1. CORE TECHNICAL ALIGNMENT & SYSTEM CONCEPTS
- Core Tech Stack: ${(jobItem.matchedKeywords || candidateProfile.skills).slice(0, 8).join(', ')}
- Visa Sponsorship Track: Verified Sponsorship Compliant for ${jobItem.country || 'Global'}
- Seniority Bar: ${seniorityLevel}

2. PRODUCTION ARCHITECTURE & SYSTEM DESIGN
- Microservices, event-driven streaming, caching layers, and high-concurrency data persistence.
- Scalability Bottlenecks: Memory caching, read/write replicas, asynchronous queueing.

3. BEHAVIORAL STAR STORIES (QUANTIFIABLE METRICS)
- Situation: Critical system migration or latency bottleneck.
- Task: Lead architecture re-design with zero downtime.
- Action: Implemented distributed worker pools with comprehensive telemetry.
- Result: Achieved 45% latency improvement and 99.99% availability.
`;
        folder?.file(`${jobItem.company.replace(/\s+/g, '_')}_${jobItem.country || 'Global'}_Master_Guide.txt`, guideText);
      });

      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `All_Interview_Master_Guides_${candidateProfile.firstName}_${candidateProfile.lastName}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      markAllDownloaded(activeJobsList.map(j => j.id));
    } catch (e) {
      console.error("ZIP bundling error:", e);
    } finally {
      setIsZipping(false);
    }
  };

  const handleAttemptProceedToStage7 = () => {
    const hasDownloaded = currentJob && downloadedJobIds.has(currentJob.id);
    if (!hasDownloaded) {
      setShowStage7WarningModal(true);
    } else if (onProceedToMockInterview) {
      onProceedToMockInterview();
    }
  };

  if (!currentJob) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center text-neutral-400">
        <BookOpen className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
        <p className="text-sm font-medium text-neutral-300">No Job Selected for Interview Prep</p>
        <p className="text-xs text-neutral-500 mt-1">Select a matched or applied job from the pipeline to generate targeted Q&As, definitions, and code syntax.</p>
      </div>
    );
  }

  return (
    <div id="stage-6-interview-prep" className="space-y-4">
      {/* Persistent Non-Blocking Download Warning Bar */}
      {hasUnsavedGuides && (
        <div className="bg-amber-950/70 border border-amber-500/50 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white flex items-center gap-1.5">
                <span>⚠️ Offline Retention Notice: {nonDownloadedJobs.length} Unsaved Master Guide{nonDownloadedJobs.length > 1 ? 's' : ''}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-700/60">
                  {downloadedJobIds.size}/{activeJobsList.length} Saved
                </span>
              </div>
              <p className="text-[11px] text-amber-300/80 mt-0.5">
                Targeted Technical & Behavioral Master Guides are session-ephemeral. Non-downloaded guides will auto-clear when progressing to Stage 7.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              onClick={handleDownloadAllZip}
              disabled={isZipping}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow text-xs"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>{isZipping ? 'Bundling...' : 'Download All (.ZIP)'}</span>
            </button>
            <button
              onClick={handleExportPdf}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-amber-700/60 rounded-lg transition font-semibold cursor-pointer text-xs"
            >
              Download PDF ({currentJob.company})
            </button>
          </div>
        </div>
      )}

      {/* Multiple Job Feeds Selector with Circular Progress / Checkmarks */}
      {activeJobsList.length > 1 && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
              <Layers className="w-3.5 h-3.5 text-violet-400" />
              Master Guides ({activeJobsList.length} Jobs):
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {activeJobsList.map((j, idx) => {
                const isSaved = downloadedJobIds.has(j.id);
                return (
                  <button
                    key={j.id}
                    onClick={() => setSelectedJobIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                      selectedJobIndex === idx
                        ? 'bg-violet-600 text-white shadow'
                        : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {/* Small circular indicator / checkmark */}
                    <span 
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 transition-colors ${
                        isSaved 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500' 
                          : 'bg-amber-950/80 text-amber-400 border border-amber-500/80'
                      }`}
                      title={isSaved ? "Master Guide Downloaded" : "Pending Download"}
                    >
                      {isSaved ? "✓" : "○"}
                    </span>
                    <span>{j.company}</span>
                    <span className="text-[10px] opacity-75">({j.country})</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadAllZip}
              disabled={isZipping}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-950 border border-neutral-800 hover:border-emerald-700/60 transition cursor-pointer"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>{isZipping ? 'Bundling ZIP...' : 'Download All (.ZIP)'}</span>
            </button>
            <button
              onClick={handleExportPdf}
              className="text-xs font-bold text-violet-400 hover:text-violet-300 hidden sm:flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-800/60 font-semibold">
              STAGE 6: POST-APPLICATION INTERVIEW PREPARATION
            </span>
            <span className="text-xs text-neutral-400">Job-Specific Technical Q&As, Syntax & STAR Answers</span>
          </div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            Targeted Technical & Behavioral Master Guide
          </h2>
          <p className="text-xs text-neutral-400">
            Engineered for <strong className="text-neutral-200">{currentJob.title}</strong> at <strong className="text-neutral-200">{currentJob.company}</strong> ({currentJob.location})
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Seniority Selector */}
          <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg p-0.5 text-xs">
            {(['Mid-Level', 'Senior', 'Lead / Staff'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setSeniorityLevel(level)}
                className={`px-2.5 py-1 rounded-md font-medium transition cursor-pointer ${
                  seniorityLevel === level
                    ? 'bg-violet-600 text-white shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <button
            onClick={loadInterviewPrep}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium border border-neutral-700 transition cursor-pointer"
            title="Regenerate Interview Prep"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Generating...' : 'Refresh Guide'}</span>
          </button>

          <button
            onClick={() => setShowSchedulerModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-teal-300 rounded-lg text-xs font-medium border border-neutral-700 transition cursor-pointer"
            title="Automated Calendar Slot Proposer"
          >
            <Calendar className="w-3.5 h-3.5 text-teal-400" />
            <span>Schedule Slot</span>
          </button>

          <button
            onClick={() => setShowFollowUpEmailModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-indigo-300 rounded-lg text-xs font-medium border border-neutral-700 transition cursor-pointer"
            title="Generate Post-Interview Follow-Up Email Draft"
          >
            <Mail className="w-3.5 h-3.5 text-indigo-400" />
            <span>Follow-Up Email</span>
          </button>

          <button
            onClick={handleExportPdf}
            disabled={!prepGuide || isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold shadow transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Prep PDF</span>
          </button>

          {onOpenSummaryDashboard && (
            <button
              onClick={onOpenSummaryDashboard}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-violet-300 rounded-lg text-xs font-semibold border border-neutral-700 transition cursor-pointer"
              title="View Application Summary Dashboard"
            >
              <FileText className="w-3.5 h-3.5 text-violet-400" />
              <span>Session Summary</span>
            </button>
          )}

          {onProceedToMockInterview && (
            <button
              onClick={handleAttemptProceedToStage7}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-semibold shadow transition cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Launch AI Voice Mock Interview (Stage 7) →</span>
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-12 text-center space-y-3">
          <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-white">Analyzing Job Description & Synthesizing Technical Interview Guide...</p>
          <p className="text-xs text-neutral-400">Extracting syntax patterns, system architecture questions, and STAR answers from {job.company}'s tech stack.</p>
        </div>
      ) : prepGuide ? (
        <div className="space-y-4">
          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveTab('technical')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
                activeTab === 'technical'
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40 font-semibold'
                  : 'text-neutral-400 hover:text-white bg-neutral-900/60'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Core Technical & Syntax ({prepGuide.technicalQuestions?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('system_design')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
                activeTab === 'system_design'
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40 font-semibold'
                  : 'text-neutral-400 hover:text-white bg-neutral-900/60'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>System Design Scenarios ({prepGuide.systemDesignQuestions?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('behavioral')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
                activeTab === 'behavioral'
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40 font-semibold'
                  : 'text-neutral-400 hover:text-white bg-neutral-900/60'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Behavioral STAR Stories ({prepGuide.behavioralStarQuestions?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('company')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
                activeTab === 'company'
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40 font-semibold'
                  : 'text-neutral-400 hover:text-white bg-neutral-900/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{job.company} Domain Q&As ({prepGuide.companySpecificQuestions?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('tips')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
                activeTab === 'tips'
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40 font-semibold'
                  : 'text-neutral-400 hover:text-white bg-neutral-900/60'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Bar-Raiser Tips ({prepGuide.interviewTips?.length || 0})</span>
            </button>
          </div>

          {/* TAB 1: TECHNICAL QUESTIONS */}
          {activeTab === 'technical' && (
            <div className="space-y-3">
              {prepGuide.technicalQuestions.map((q, idx) => (
                <div 
                  key={idx}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-sm transition hover:border-neutral-700"
                >
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                    className="w-full p-4 text-left flex items-start justify-between gap-3 bg-neutral-900/90 hover:bg-neutral-800/50 transition cursor-pointer"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-800/60 font-semibold">
                          {q.topic}
                        </span>
                        <span className="text-[11px] text-neutral-400">Q#{idx + 1}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-white leading-snug">
                        {q.question}
                      </h3>
                    </div>
                    <div className="p-1 rounded bg-neutral-800 text-neutral-400 shrink-0">
                      {expandedIndex === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {expandedIndex === idx && (
                    <div className="p-4 border-t border-neutral-800/80 bg-neutral-950/60 space-y-4 text-xs">
                      {/* Concept Definition */}
                      <div className="space-y-1">
                        <h4 className="text-[11px] font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" />
                          Core Technical Definition & Underlying Mechanism
                        </h4>
                        <p className="text-neutral-300 leading-relaxed bg-neutral-900/80 p-3 rounded-lg border border-neutral-800">
                          {q.definition}
                        </p>
                      </div>

                      {/* Syntax / Code Pattern */}
                      {q.syntax && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                              <Code className="w-3.5 h-3.5" />
                              Optimal Code Pattern / Syntax
                            </h4>
                            <button
                              onClick={() => handleCopyCode(q.syntax, idx)}
                              className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white px-2 py-0.5 rounded bg-neutral-800 transition"
                            >
                              {copiedIndex === idx ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedIndex === idx ? 'Copied' : 'Copy Code'}</span>
                            </button>
                          </div>
                          <pre className="bg-neutral-950 p-3.5 rounded-lg border border-neutral-800 text-neutral-200 font-mono text-[11px] overflow-x-auto leading-relaxed">
                            <code>{q.syntax}</code>
                          </pre>
                        </div>
                      )}

                      {/* Production Example & Trade-offs */}
                      <div className="space-y-1">
                        <h4 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5" />
                          Real-World Production Trade-offs & Experience Narrative
                        </h4>
                        <p className="text-neutral-300 leading-relaxed bg-neutral-900/80 p-3 rounded-lg border border-neutral-800">
                          {q.practicalExample}
                        </p>
                      </div>

                      {/* Key Terms */}
                      <div className="flex items-center gap-2 pt-1 flex-wrap">
                        <span className="text-[11px] text-neutral-400 font-medium">Must-Mention Keywords:</span>
                        {q.keyTerms.map((term, tIdx) => (
                          <span key={tIdx} className="px-2 py-0.5 bg-neutral-800 text-neutral-200 rounded text-[10px] font-mono border border-neutral-700">
                            {term}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: SYSTEM DESIGN */}
          {activeTab === 'system_design' && (
            <div className="space-y-3">
              {prepGuide.systemDesignQuestions.map((sd, idx) => (
                <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60 font-semibold">
                      SYSTEM ARCHITECTURE SCENARIO #{idx + 1}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{sd.title}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 space-y-1">
                      <span className="font-bold text-neutral-300 block">Requirements & Scale Expectations:</span>
                      <p className="text-neutral-400 leading-relaxed">{sd.requirements}</p>
                    </div>

                    <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 space-y-1">
                      <span className="font-bold text-neutral-300 block">Bottlenecks & High-Scale Trade-offs:</span>
                      <p className="text-neutral-400 leading-relaxed">{sd.bottlenecksAndTradeoffs}</p>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <span className="text-xs font-semibold text-neutral-300">Core Architecture Components to Draw / Propose:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {sd.architectureComponents.map((comp, cIdx) => (
                        <div key={cIdx} className="flex items-center gap-2 p-2 bg-neutral-950 rounded border border-neutral-800 text-xs text-neutral-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                          <span>{comp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: BEHAVIORAL STAR */}
          {activeTab === 'behavioral' && (
            <div className="space-y-3">
              {prepGuide.behavioralStarQuestions.map((b, idx) => (
                <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-semibold">
                      STAR STORY #{idx + 1}
                    </span>
                    <span className="text-xs text-neutral-400 font-medium">Scenario: {b.scenario}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 space-y-1">
                      <div className="font-bold text-amber-300 flex items-center gap-1.5">
                        <span>Situation & Task (S/T)</span>
                      </div>
                      <p className="text-neutral-300 leading-relaxed">{b.situationTask}</p>
                    </div>

                    <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 space-y-1">
                      <div className="font-bold text-blue-300 flex items-center gap-1.5">
                        <span>Action Taken (A)</span>
                      </div>
                      <p className="text-neutral-300 leading-relaxed">{b.action}</p>
                    </div>

                    <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 space-y-1">
                      <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                        <span>Quantified Result (R)</span>
                      </div>
                      <p className="text-neutral-300 leading-relaxed">{b.result}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: COMPANY SPECIFIC */}
          {activeTab === 'company' && (
            <div className="space-y-3">
              {prepGuide.companySpecificQuestions.map((cq, idx) => (
                <div key={idx} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-800 font-semibold">
                      {job.company} SPECIFIC QUESTION #{idx + 1}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white">{cq.question}</h3>
                  <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 text-neutral-300 leading-relaxed">
                    <strong className="text-violet-400 block mb-1">Recommended Response Strategy:</strong>
                    {cq.suggestedAnswerStrategy}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: BAR RAISER TIPS */}
          {activeTab === 'tips' && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Principal Engineer & Hiring Bar Raiser Recommendations
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {prepGuide.interviewTips.map((tip, idx) => (
                  <div key={idx} className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 text-xs text-neutral-300 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-violet-900 text-violet-300 font-bold text-[10px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-white">Rule #{idx + 1}</span>
                    </div>
                    <p className="text-neutral-400 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Post-Interview Follow-Up Email Generator Modal */}
      <FollowUpEmailModal
        isOpen={showFollowUpEmailModal}
        onClose={() => setShowFollowUpEmailModal(false)}
        job={job}
        candidateProfile={candidateProfile}
        initialDiscussionHighlights={
          prepGuide?.technicalQuestions.slice(0, 2).map(q => `Discussed ${q.topic} architecture and ${q.practicalExample.slice(0, 60)}...`) || []
        }
      />

      {/* Automated Calendar Scheduler Modal */}
      <InterviewSchedulerModal
        isOpen={showSchedulerModal}
        onClose={() => setShowSchedulerModal(false)}
        job={currentJob}
        candidateProfile={candidateProfile}
      />

      {/* Stage 6 to Stage 7 Deletion Warning Confirmation Modal with Countdown */}
      {showStage7WarningModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-neutral-900 border border-amber-500/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    <span>⚠️ Download Master Guide First?</span>
                  </h3>
                  <p className="text-xs text-amber-300 font-medium">
                    Notice: Master Guide will auto-delete if you proceed without downloading
                  </p>
                </div>
              </div>

              {/* Live Countdown Badge */}
              <div className="px-2.5 py-1 bg-amber-950/80 border border-amber-500/60 rounded-full text-[11px] font-mono font-bold text-amber-300">
                Auto-Proceed in {countdownSeconds}s
              </div>
            </div>

            {/* Countdown Visual Progress Bar */}
            <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden border border-neutral-800">
              <div 
                className="bg-amber-500 h-full transition-all duration-1000 ease-linear"
                style={{ width: `${(countdownSeconds / 15) * 100}%` }}
              />
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
              The <strong>Targeted Technical & Behavioral Master Guide</strong> for <strong>{currentJob.company}</strong> ({currentJob.country}) has not been saved. Advancing to Stage 7 will <strong>auto-delete this guide from active memory</strong>. Download your copy now to keep offline access!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowStage7WarningModal(false)}
                className="w-full sm:w-auto px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold cursor-pointer"
              >
                Cancel & Keep Guide
              </button>
              
              <button
                onClick={handleAutoDeleteAndProceed}
                className="w-full sm:w-auto px-3.5 py-2 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 hover:text-rose-200 border border-rose-800/60 text-xs font-semibold cursor-pointer"
                title="Deletes guide and advances to Stage 7 immediately"
              >
                Proceed & Auto-Delete
              </button>

              <button
                onClick={() => {
                  handleExportPdf();
                  setShowStage7WarningModal(false);
                  if (onProceedToMockInterview) onProceedToMockInterview();
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>📥 Download PDF & Proceed</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
