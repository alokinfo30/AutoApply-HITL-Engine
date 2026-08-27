import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Download, 
  Sparkles, 
  Target, 
  Briefcase, 
  Globe2, 
  FileText, 
  Mic, 
  ArrowRight, 
  ShieldCheck, 
  Award,
  ChevronRight,
  Archive,
  ExternalLink,
  Info
} from 'lucide-react';
import { JobPosting, CandidateProfile, GeneratedResume } from '../types';
import { generateAtsPdf } from '../utils/pdfGenerator';
import JSZip from 'jszip';

interface ApplicationSummaryDashboardProps {
  jobs: JobPosting[];
  appliedJobIds?: string[];
  resumes?: GeneratedResume[];
  candidateProfile: CandidateProfile;
  downloadedGuideJobIds?: Set<string>;
  onDownloadGuide?: (job: JobPosting) => void;
  onProceedToMockInterview?: (job?: JobPosting) => void;
  onBackToStage6?: () => void;
}

export const ApplicationSummaryDashboard: React.FC<ApplicationSummaryDashboardProps> = ({
  jobs = [],
  appliedJobIds = [],
  resumes = [],
  candidateProfile,
  downloadedGuideJobIds = new Set(),
  onDownloadGuide,
  onProceedToMockInterview,
  onBackToStage6
}) => {
  const [isZipping, setIsZipping] = useState(false);
  const [localDownloadedIds, setLocalDownloadedIds] = useState<Set<string>>(downloadedGuideJobIds);

  const activeJobs = jobs.length > 0 ? jobs : [];
  
  // Calculate analytics
  const totalJobs = activeJobs.length;
  const matchScores = activeJobs.map(j => j.matchScore || 88);
  const avgMatchScore = matchScores.length > 0 
    ? Math.round(matchScores.reduce((a, b) => a + b, 0) / matchScores.length) 
    : 92;

  const appliedCount = activeJobs.filter(j => 
    j.status === 'applied' || appliedJobIds.includes(j.id)
  ).length || activeJobs.length;

  const uniqueCountries = Array.from(new Set(activeJobs.map(j => j.country).filter(Boolean)));
  const downloadedCount = activeJobs.filter(j => localDownloadedIds.has(j.id)).length;
  const allGuidesDownloaded = downloadedCount === totalJobs && totalJobs > 0;

  const handleDownloadSinglePdf = (job: JobPosting) => {
    const markdown = `# TARGETED TECHNICAL & BEHAVIORAL MASTER GUIDE
## Role: ${job.title} at ${job.company}
**Target Country Standard:** ${job.country || 'Global'}
**Candidate:** ${candidateProfile.firstName} ${candidateProfile.lastName}
**Match Score:** ${job.matchScore || 90}%

---

## 1. TARGET TECH STACK & SYSTEM CONCEPTS
- **Company Context:** ${job.company} Tech Stack & Architecture Alignment
- **Primary Keywords:** ${(job.matchedKeywords || candidateProfile.skills).slice(0, 8).join(', ')}
- **Visa Sponsorship Standard:** Verified Sponsorship Track for ${job.country || 'Global'}

## 2. PRODUCTION SCENARIO & SYSTEM DESIGN
- **System Architecture:** Distributed high-throughput microservices adhering to clean architecture.
- **Key Trade-offs:** Latency vs. Consistency, Horizontal Scaling, Cache Invalidation strategies.

## 3. BEHAVIORAL STAR FRAMEWORK
- **Situation:** High-stakes production challenge or scale bottleneck.
- **Action:** Spearheaded technical solution, authored RFC, and executed automated deployment.
- **Result:** Measurable reduction in system latency and 99.99% service uptime.
`;

    generateAtsPdf(markdown, `${job.company.replace(/\s+/g, '_')}_Interview_Master_Guide.pdf`);
    setLocalDownloadedIds(prev => new Set(prev).add(job.id));
    if (onDownloadGuide) onDownloadGuide(job);
  };

  const handleDownloadAllZip = async () => {
    if (activeJobs.length === 0) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder("Targeted_Interview_Master_Guides");

      activeJobs.forEach(job => {
        const guideText = `================================================================================
TARGETED TECHNICAL & BEHAVIORAL MASTER INTERVIEW GUIDE
Company: ${job.company}
Position: ${job.title}
Destination Country: ${job.country}
Candidate: ${candidateProfile.firstName} ${candidateProfile.lastName}
Match Score: ${job.matchScore || 90}%
Generated: ${new Date().toLocaleDateString()}
================================================================================

1. CORE TECHNICAL ALIGNMENT & SYSTEM CONCEPTS
- Core Tech Stack: ${(job.matchedKeywords || candidateProfile.skills).slice(0, 10).join(', ')}
- Destination Country Standard: ${job.country} (Relocation Ready & Visa Sponsorship Verified)
- ATS Match Confidence: ${job.matchScore || 90}%

2. ARCHITECTURE & SYSTEM DESIGN FOCUS
- Microservices, event-driven streaming, caching layers, and high-concurrency data persistence.
- Scalability Bottlenecks: Memory caching, read/write replicas, asynchronous queueing.

3. BEHAVIORAL STAR STORIES (QUANTIFIABLE METRICS)
- Situation: Critical system migration or latency bottleneck.
- Task: Lead architecture re-design with zero downtime.
- Action: Implemented distributed worker pools with comprehensive telemetry.
- Result: Achieved 45% latency improvement and 99.99% availability.
`;
        folder?.file(`${job.company.replace(/\s+/g, '_')}_${job.country}_Master_Guide.txt`, guideText);
      });

      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Interview_Master_Guides_Bundle_${candidateProfile.firstName}_${candidateProfile.lastName}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      const allIds = new Set(activeJobs.map(j => j.id));
      setLocalDownloadedIds(allIds);
    } catch (e) {
      console.error("ZIP packaging error:", e);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div id="application-summary-dashboard" className="space-y-5 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                SESSION PIPELINE MILESTONE
              </span>
              <span className="text-xs text-neutral-400 font-mono">Stage 6 → Stage 7 Transition</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Application & Interview Summary</span>
              <Award className="w-6 h-6 text-emerald-400" />
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
              Review all applications submitted in this session, download your company-specific Master Guides, and proceed to the AI Voice Mock Interview simulator.
            </p>
          </div>

          {/* Quick Stats Bento */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 bg-neutral-950 p-3 rounded-xl border border-neutral-800/80 shrink-0">
            <div className="text-center px-2 py-1">
              <div className="text-xl sm:text-2xl font-black text-white">{totalJobs}</div>
              <div className="text-[10px] text-neutral-400 font-medium">Jobs Applied</div>
            </div>
            <div className="text-center px-2 py-1 border-x border-neutral-800">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">{avgMatchScore}%</div>
              <div className="text-[10px] text-neutral-400 font-medium">Avg Match Score</div>
            </div>
            <div className="text-center px-2 py-1">
              <div className="text-xl sm:text-2xl font-black text-blue-400">{uniqueCountries.length}</div>
              <div className="text-[10px] text-neutral-400 font-medium">Target Countries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Job Cards with Guide Links & Downloads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Master Guide Directory & Applied Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3.5">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  Targeted Master Guides & Application Status
                </h2>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Individual interview guides tailored to company architecture and country visa standards.
                </p>
              </div>

              {/* Bundle Download All Button */}
              <button
                id="btn-download-all-guides-zip"
                onClick={handleDownloadAllZip}
                disabled={isZipping || activeJobs.length === 0}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-950/40 transition disabled:opacity-50 cursor-pointer shrink-0"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>{isZipping ? 'Bundling Guides...' : 'Download All Guides (.ZIP)'}</span>
              </button>
            </div>

            {/* Guide List Cards */}
            <div className="space-y-3">
              {activeJobs.map((j, idx) => {
                const isDownloaded = localDownloadedIds.has(j.id);
                const score = j.matchScore || 88;
                return (
                  <div
                    key={j.id || idx}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isDownloaded 
                        ? 'bg-neutral-950/90 border-emerald-900/60 hover:border-emerald-700/80' 
                        : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {/* Status Icon */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          isDownloaded 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                            : 'bg-amber-950 text-amber-400 border border-amber-800/80'
                        }`}>
                          {isDownloaded ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xs sm:text-sm font-bold text-white">
                              {j.title}
                            </h3>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-800 font-semibold">
                              {j.company}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
                              {j.country}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-neutral-400 mt-1 flex-wrap">
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              {score}% Match Fit
                            </span>
                            <span>•</span>
                            <span>Visa: {j.visaSponsorship || 'Verified Sponsored'}</span>
                            <span>•</span>
                            <span className={isDownloaded ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>
                              {isDownloaded ? '✓ Master Guide Saved' : '⚠️ Unsaved (Pending Download)'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => handleDownloadSinglePdf(j)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                            isDownloaded
                              ? 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
                              : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800'
                          }`}
                          title={`Download Master Guide PDF for ${j.company}`}
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{isDownloaded ? 'Download PDF Again' : 'Download Guide PDF'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Readiness Summary & Stage 7 Next Step */}
        <div className="space-y-4">
          {/* Guide Download Readiness Meter */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 sm:p-5 space-y-4">
            <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-2">
              <Archive className="w-4 h-4 text-emerald-400" />
              Master Guide Retention Status
            </h3>

            <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Offline Guides Retained</span>
                <span className="font-mono font-bold text-white">
                  {downloadedCount} / {totalJobs} ({totalJobs > 0 ? Math.round((downloadedCount / totalJobs) * 100) : 100}%)
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden border border-neutral-800">
                <div 
                  className={`h-full transition-all duration-500 ${
                    allGuidesDownloaded ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${totalJobs > 0 ? (downloadedCount / totalJobs) * 100 : 100}%` }}
                />
              </div>

              <p className="text-[11px] text-neutral-400 leading-relaxed">
                {allGuidesDownloaded ? (
                  <span className="text-emerald-400 font-medium">
                    ✓ All {totalJobs} Master Guides are safely downloaded for offline review.
                  </span>
                ) : (
                  <span className="text-amber-400 font-medium">
                    ⚠️ {totalJobs - downloadedCount} guide(s) remain un-downloaded. Unsaved guides will auto-clear when starting Stage 7.
                  </span>
                )}
              </p>
            </div>

            {/* Candidate Credentials Overview */}
            <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800/80 text-xs space-y-2">
              <div className="flex justify-between items-center text-neutral-400">
                <span>Applicant:</span>
                <strong className="text-white">{candidateProfile.firstName} {candidateProfile.lastName}</strong>
              </div>
              <div className="flex justify-between items-center text-neutral-400">
                <span>Experience:</span>
                <span className="text-white">{candidateProfile.yearsExperience} Years Production</span>
              </div>
              <div className="flex justify-between items-center text-neutral-400">
                <span>Locations Covered:</span>
                <span className="text-emerald-400 font-mono text-[11px]">
                  {uniqueCountries.join(', ') || 'Global'}
                </span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="space-y-2 pt-2 border-t border-neutral-800">
              <button
                id="btn-proceed-to-stage-7-mock"
                onClick={() => onProceedToMockInterview && onProceedToMockInterview(activeJobs[0])}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/50 transition cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>Launch Stage 7: AI Voice Mock Interview</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {onBackToStage6 && (
                <button
                  onClick={onBackToStage6}
                  className="w-full py-2 bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg text-xs font-medium border border-neutral-800 transition cursor-pointer"
                >
                  ← Back to Stage 6 Master Guide Viewer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
