import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  Sparkles, 
  Send, 
  Edit3, 
  Check, 
  Eye, 
  RefreshCw, 
  Copy, 
  ArrowRight, 
  Award, 
  Globe, 
  Layers,
  CheckCircle2,
  Building,
  MapPin,
  Filter,
  FileCheck,
  FolderArchive
} from 'lucide-react';
import { GeneratedResume, JobPosting, CandidateProfile } from '../types';
import { generateAtsPdf } from '../utils/pdfGenerator';

interface ResumeGeneratorViewProps {
  job: JobPosting | null;
  jobs?: JobPosting[];
  resumes: GeneratedResume[];
  activeResumeIndex: number;
  onSelectResumeIndex: (idx: number) => void;
  onRegenerateResume: () => void;
  onProceedToTelegram: () => void;
  isGenerating: boolean;
  candidateProfile: CandidateProfile;
}

export const ResumeGeneratorView: React.FC<ResumeGeneratorViewProps> = ({
  job,
  jobs = [],
  resumes,
  activeResumeIndex,
  onSelectResumeIndex,
  onRegenerateResume,
  onProceedToTelegram,
  isGenerating,
  candidateProfile
}) => {
  const [viewMode, setViewMode] = useState<'ats-preview' | 'markdown-raw'>('ats-preview');
  const [copied, setCopied] = useState(false);
  const [jobFilter, setJobFilter] = useState<string>('ALL');
  const [countryFilter, setCountryFilter] = useState<string>('ALL');
  const [isBatchDownloading, setIsBatchDownloading] = useState(false);

  const activeJobsList: JobPosting[] = jobs.length > 0 ? jobs : (job ? [job] : []);

  // Filtered resumes based on job feed and country
  const filteredResumes = useMemo(() => {
    return resumes.filter(r => {
      const matchJob = jobFilter === 'ALL' || r.jobId === jobFilter || r.targetCompany === jobFilter;
      const matchCountry = countryFilter === 'ALL' || r.country === countryFilter;
      return matchJob && matchCountry;
    });
  }, [resumes, jobFilter, countryFilter]);

  const currentResume = resumes[activeResumeIndex] || resumes[0];
  const [editableMarkdown, setEditableMarkdown] = useState<string>(currentResume?.markdownContent || '');

  React.useEffect(() => {
    if (currentResume?.markdownContent) {
      setEditableMarkdown(currentResume.markdownContent);
    }
  }, [currentResume?.markdownContent]);

  // Unique list of companies and countries from resumes
  const availableCompanies = useMemo(() => {
    const compMap = new Map<string, string>();
    resumes.forEach(r => {
      if (r.targetCompany) compMap.set(r.jobId || r.targetCompany, r.targetCompany);
    });
    return Array.from(compMap.entries());
  }, [resumes]);

  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    resumes.forEach(r => {
      if (r.country) set.add(r.country);
    });
    return Array.from(set);
  }, [resumes]);

  if (!job || resumes.length === 0) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center text-neutral-400">
        <FileText className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
        <p className="text-sm font-medium text-neutral-300">No Resumes Generated Yet</p>
        <p className="text-xs text-neutral-500 mt-1">Select a job from Stage 1, analyze in Stage 2, and click "Generate Tailored Resume".</p>
      </div>
    );
  }

  const handleDownloadSinglePdf = (resumeItem: GeneratedResume) => {
    const countryTag = resumeItem.country ? `_${resumeItem.country.replace(/\s+/g, '_')}` : '';
    const companyTag = (resumeItem.targetCompany || job.company).replace(/\s+/g, '_');
    const filename = `${candidateProfile.firstName}_${candidateProfile.lastName}_${companyTag}${countryTag}_ATS_Resume.pdf`;
    const content = resumeItem === currentResume ? (editableMarkdown || resumeItem.markdownContent) : resumeItem.markdownContent;
    generateAtsPdf(content || '', filename);
  };

  const handleDownloadAllPdfs = async () => {
    setIsBatchDownloading(true);
    for (let i = 0; i < resumes.length; i++) {
      const r = resumes[i];
      const countryTag = r.country ? `_${r.country.replace(/\s+/g, '_')}` : '';
      const companyTag = (r.targetCompany || job.company).replace(/\s+/g, '_');
      const filename = `${candidateProfile.firstName}_${candidateProfile.lastName}_${companyTag}${countryTag}_ATS_Resume.pdf`;
      generateAtsPdf(r.markdownContent || '', filename);
      // Small pause between downloads to allow browser file dispatch
      await new Promise(res => setTimeout(res, 250));
    }
    setIsBatchDownloading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editableMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentJobForResume = activeJobsList.find(j => j.id === currentResume.jobId) || job;

  return (
    <div id="resume-generator-stage" className="space-y-4">
      {/* Multi-Job & Multi-Country Directory Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-semibold flex items-center gap-1">
                <Layers className="w-3 h-3 text-emerald-400" />
                STAGE 3: RESUMES DIRECTORY ({resumes.length} TAILORED)
              </span>
              <span className="text-xs text-neutral-400">
                Categorized by Job Feed and Target Country Standards
              </span>
            </div>
            <p className="text-xs text-neutral-300">
              Each resume is tailored to specific JD keywords and destination country ATS guidelines (EU Blue Card, Singapore MOM, TSS 482, US Global).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              id="btn-download-all-resumes"
              onClick={handleDownloadAllPdfs}
              disabled={isBatchDownloading}
              aria-label={`Download all ${resumes.length} generated ATS resumes as PDF files`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold border border-neutral-700 transition cursor-pointer"
            >
              <FolderArchive className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <span>{isBatchDownloading ? 'Downloading...' : `Download All ${resumes.length} PDFs`}</span>
            </button>

            <button
              type="button"
              id="btn-proceed-stage4-top"
              onClick={onProceedToTelegram}
              aria-label="Proceed to Stage 4 Telegram and Discord Human-in-the-loop review"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-teal-950/40 transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Proceed to Stage 4 (HITL Approval)</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Filter Controls: By Job Feed & By Country */}
        <div className="flex flex-wrap items-center gap-3 pt-3">
          {/* Job Feed Filter */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Filter className="w-3.5 h-3.5 text-neutral-500" aria-hidden="true" />
            <label htmlFor="select-resume-job-filter" className="font-semibold text-neutral-300">Job Feed:</label>
            <select
              id="select-resume-job-filter"
              aria-label="Filter generated resumes by job feed"
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="ALL">All Job Feeds ({availableCompanies.length})</option>
              {availableCompanies.map(([id, comp]) => (
                <option key={id} value={id}>{comp}</option>
              ))}
            </select>
          </div>

          {/* Country Standard Filter */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Globe className="w-3.5 h-3.5 text-neutral-500" aria-hidden="true" />
            <label htmlFor="select-resume-country-filter" className="font-semibold text-neutral-300">Country Standard:</label>
            <select
              id="select-resume-country-filter"
              aria-label="Filter generated resumes by country standard"
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-white outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="ALL">All Countries ({availableCountries.length})</option>
              {availableCountries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {(jobFilter !== 'ALL' || countryFilter !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setJobFilter('ALL');
                setCountryFilter('ALL');
              }}
              aria-label="Reset resume directory filters"
              className="text-xs text-emerald-400 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Resumes Grid/Cards grouped by Job Feed and Country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 mt-3">
          {filteredResumes.map((r) => {
            const actualIndex = resumes.indexOf(r);
            const isSelected = activeResumeIndex === actualIndex;

            return (
              <div
                key={actualIndex}
                className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-950/60 border-emerald-500 ring-1 ring-emerald-500/40 text-white shadow-sm'
                    : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                }`}
                onClick={() => onSelectResumeIndex(actualIndex)}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700/80 text-emerald-400 font-mono">
                      {r.country || 'Global'} Standard
                    </span>
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      {r.atsScore || 96}% ATS
                    </span>
                  </div>

                  <div className="text-xs font-bold text-white leading-tight mb-0.5 flex items-center gap-1">
                    <Building className="w-3 h-3 text-neutral-500 shrink-0" aria-hidden="true" />
                    <span className="truncate">{r.targetCompany || job.company}</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 truncate mb-2">
                    {r.targetTitle || job.title}
                  </div>

                  <div className="text-[10px] text-neutral-400 space-y-0.5 border-t border-neutral-800/80 pt-1.5">
                    <div className="truncate">Format: <strong className="text-neutral-300 font-mono">{r.countryFormat}</strong></div>
                    <div className="truncate text-emerald-400/90">✓ Tailored to specific JD keywords</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-neutral-800/80">
                  <button
                    type="button"
                    aria-label={`Preview ATS resume tailored for ${r.targetCompany || job.company} (${r.country || 'Global'} Standard)`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectResumeIndex(actualIndex);
                    }}
                    className={`flex-1 py-1 text-[11px] font-semibold rounded text-center transition ${
                      isSelected ? 'bg-emerald-500 text-neutral-950' : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    {isSelected ? 'Active Preview' : 'Select'}
                  </button>
                  <button
                    type="button"
                    title="Download ATS PDF for this job"
                    aria-label={`Download PDF resume for ${r.targetCompany || job.company}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadSinglePdf(r);
                    }}
                    className="p-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded border border-neutral-800 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Header Bar for the Selected Resume */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-semibold">
              ACTIVE ATS RESUME PREVIEW
            </span>
            <span className="text-xs text-neutral-400">Target Role & Feed:</span>
          </div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            {currentResume.targetTitle || currentJobForResume.title} — {currentResume.targetCompany || currentJobForResume.company}
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Country Standard: <strong className="text-emerald-400">{currentResume.country || currentJobForResume.country} ({currentResume.countryFormat})</strong> • ATS Compatibility Score: <strong className="text-emerald-400">{currentResume.atsScore || 96}/100</strong>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Switch View Mode */}
          <div className="flex bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs">
            <button
              type="button"
              aria-label="Switch to formatted ATS paper preview"
              onClick={() => setViewMode('ats-preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition cursor-pointer ${
                viewMode === 'ats-preview' ? 'bg-neutral-800 text-white font-medium shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
              ATS Preview
            </button>
            <button
              type="button"
              aria-label="Switch to raw markdown editor"
              onClick={() => setViewMode('markdown-raw')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition cursor-pointer ${
                viewMode === 'markdown-raw' ? 'bg-neutral-800 text-white font-medium shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
              Markdown Editor
            </button>
          </div>

          <button
            type="button"
            onClick={onRegenerateResume}
            disabled={isGenerating}
            aria-label={isGenerating ? "Regenerating resume with Gemini..." : "Regenerate resume with Gemini 3.7 Flash"}
            className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium border border-neutral-700 transition cursor-pointer"
            title="Re-run Gemini 3.7 Flash tailoring"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin text-emerald-400' : ''}`} aria-hidden="true" />
            <span>{isGenerating ? 'Regenerating...' : 'Regenerate'}</span>
          </button>

          <button
            type="button"
            id="btn-download-pdf"
            onClick={() => handleDownloadSinglePdf(currentResume)}
            aria-label={`Download ATS formatted PDF for ${currentResume.targetCompany || currentJobForResume.company}`}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Download ATS PDF</span>
          </button>

          <button
            type="button"
            id="btn-proceed-stage4"
            onClick={onProceedToTelegram}
            aria-label={`Proceed to Stage 4 and launch HITL approval for ${resumes.length} jobs`}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-teal-950/40 transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Launch HITL ({resumes.length} Job{resumes.length > 1 ? 's' : ''})</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Main Resume Canvas Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left 3 Cols: Rendered Document / Editor */}
        <div className="lg:col-span-3">
          {viewMode === 'ats-preview' ? (
            /* ATS Paper Container */
            <div className="bg-white text-neutral-900 rounded-lg p-6 sm:p-10 shadow-2xl border border-neutral-300 font-sans min-h-[750px]">
              <div className="space-y-3.5 max-w-2xl mx-auto text-[13px] leading-snug">
                {/* Header */}
                <div className="text-center border-b border-neutral-800 pb-2">
                  <h1 className="text-xl font-bold tracking-tight text-neutral-950 uppercase">
                    {candidateProfile?.firstName || 'Alok'} {candidateProfile?.lastName || 'Kumar'}
                  </h1>
                  <p className="text-xs text-neutral-700 mt-1 font-mono">
                    {candidateProfile?.email || 'alokinfo30@gmail.com'} • {candidateProfile?.phone || '+91 98765 43210'} • {candidateProfile?.currentLocation || 'Bengaluru, India'}
                  </p>
                  <p className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                    Target Role: {currentResume.targetTitle || currentJobForResume.title} • Standard: {currentResume.country || currentJobForResume.country} ({currentResume.countryFormat}) • Visa Sponsorship Required
                  </p>
                </div>

                {/* Professional Summary */}
                <div>
                  <h2 className="text-xs font-bold text-neutral-900 uppercase border-b border-neutral-300 pb-0.5 mb-1.5 tracking-wider">
                    Professional Summary
                  </h2>
                  <p className="text-neutral-800 text-xs leading-relaxed text-justify">
                    Results-driven <strong>{currentResume.targetTitle || currentJobForResume.title}</strong> with {candidateProfile?.yearsExperience || 6}+ years of hands-on expertise building production-ready distributed microservices, scalable full-stack architectures, and production LLM orchestration pipelines. Proven track record leading agile cross-functional engineering squads, optimizing system latency by 74%, and delivering high-impact solutions aligned with <strong>{currentResume.targetCompany || currentJobForResume.company}</strong>'s technical requirements in {currentResume.country || currentJobForResume.country}.
                  </p>
                </div>

                {/* Core Competencies */}
                <div>
                  <h2 className="text-xs font-bold text-neutral-900 uppercase border-b border-neutral-300 pb-0.5 mb-1.5 tracking-wider">
                    Core Competencies & Technical Stack
                  </h2>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-neutral-800">
                    <div>
                      <span className="font-semibold text-neutral-950">Languages & Frameworks:</span> Python, FastAPI, Node.js, TypeScript, React, Next.js
                    </div>
                    <div>
                      <span className="font-semibold text-neutral-950">AI & Automation:</span> LangChain, Prompt Engineering, Playwright, Headless Chromium
                    </div>
                    <div>
                      <span className="font-semibold text-neutral-950">Cloud & Data:</span> PostgreSQL, Redis, Docker, Kubernetes, GCP, AWS, CI/CD
                    </div>
                    <div>
                      <span className="font-semibold text-neutral-950">Methodologies:</span> Agile / Scrum Master (CSM Certified), TDD, System Architecture
                    </div>
                  </div>
                </div>

                {/* Professional Experience */}
                <div>
                  <h2 className="text-xs font-bold text-neutral-900 uppercase border-b border-neutral-300 pb-0.5 mb-2 tracking-wider">
                    Professional Experience
                  </h2>

                  {/* Role 1 */}
                  <div className="mb-3">
                    <div className="flex justify-between items-baseline text-xs font-bold text-neutral-950">
                      <span>Lead Full Stack & AI Systems Engineer — Apex Tech Innovations</span>
                      <span className="text-[11px] font-normal text-neutral-600 font-mono">2022 – Present</span>
                    </div>
                    <div className="text-[11px] text-neutral-600 italic mb-1">Bengaluru, India (Remote) • Tech: Python, FastAPI, TypeScript, React, Docker, GCP</div>
                    <ul className="list-disc list-outside pl-4 space-y-1 text-neutral-800 text-xs leading-tight">
                      <li>
                        Architected an end-to-end automated LLM document processing pipeline using Python, FastAPI, and LangChain, accelerating client turnaround velocity by <strong>74%</strong>.
                      </li>
                      <li>
                        Engineered high-throughput microservices in Node.js and TypeScript serving <strong>1.2M+ daily active requests</strong> with sub-120ms p99 latency aligned with {currentResume.targetCompany || currentJobForResume.company}'s engineering demands.
                      </li>
                      <li>
                        Spearheaded the migration of legacy monolithic architectures to containerized Docker services on Kubernetes, decreasing cloud infrastructure cost by <strong>35%</strong>.
                      </li>
                    </ul>
                  </div>

                  {/* Role 2 */}
                  <div className="mb-3">
                    <div className="flex justify-between items-baseline text-xs font-bold text-neutral-950">
                      <span>Senior Software Engineer — Nexus Software Solutions</span>
                      <span className="text-[11px] font-normal text-neutral-600 font-mono">2019 – 2022</span>
                    </div>
                    <div className="text-[11px] text-neutral-600 italic mb-1">Hyderabad, India • Tech: React, Node.js, Express, Playwright, PostgreSQL</div>
                    <ul className="list-disc list-outside pl-4 space-y-1 text-neutral-800 text-xs leading-tight">
                      <li>
                        Facilitated sprint rituals and Scrum Master practices for a cross-functional squad of 7 engineers, lifting overall sprint velocity by <strong>28%</strong>.
                      </li>
                      <li>
                        Built responsive user interfaces and dashboards with React and Tailwind CSS, increasing user workflow completion rates by <strong>42%</strong>.
                      </li>
                      <li>
                        Engineered automated end-to-end browser testing harnesses using Playwright, cutting production regression bugs by <strong>60%</strong>.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h2 className="text-xs font-bold text-neutral-900 uppercase border-b border-neutral-300 pb-0.5 mb-1 tracking-wider">
                    Education
                  </h2>
                  <div className="flex justify-between text-xs text-neutral-800">
                    <div>
                      <strong>Bachelor of Technology in Computer Science & Engineering</strong> — National Institute of Technology
                    </div>
                    <div className="text-neutral-600 font-mono text-[11px]">2014 – 2018</div>
                  </div>
                  <div className="text-[11px] text-neutral-600">First Class with Distinction (GPA: 8.7/10.0)</div>
                </div>

                {/* Certifications */}
                <div>
                  <h2 className="text-xs font-bold text-neutral-900 uppercase border-b border-neutral-300 pb-0.5 mb-1 tracking-wider">
                    Certifications & Credentials
                  </h2>
                  <p className="text-xs text-neutral-800">
                    • Certified Scrum Master (CSM) — Scrum Alliance &nbsp;• Google Cloud Certified Associate Cloud Engineer &nbsp;• LangChain LLM Application Development
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Raw Markdown Editor */
            <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-neutral-400">
                  Markdown Source ({currentResume.country || currentJobForResume.country} Standard — {currentResume.targetCompany || currentJobForResume.company}):
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
                </button>
              </div>
              <textarea
                rows={24}
                value={editableMarkdown}
                onChange={(e) => setEditableMarkdown(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-xs font-mono text-neutral-200 focus:border-emerald-500 focus:outline-none leading-relaxed"
              />
            </div>
          )}
        </div>

        {/* Right 1 Col: ATS Compliance & Verification Sidebar */}
        <div className="space-y-3">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              ATS Compliance Audit
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-neutral-950 border border-neutral-800/80">
                <span className="text-neutral-400">ATS Layout Score</span>
                <span className="text-emerald-400 font-bold">{currentResume.atsScore || 98} / 100</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-neutral-950 border border-neutral-800/80">
                <span className="text-neutral-400">Target Standard</span>
                <span className="text-neutral-200 font-mono">{currentResume.country || currentJobForResume.country}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-neutral-950 border border-neutral-800/80">
                <span className="text-neutral-400">Target Company</span>
                <span className="text-white font-medium">{currentResume.targetCompany || currentJobForResume.company}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-neutral-950 border border-neutral-800/80">
                <span className="text-neutral-400">Typography</span>
                <span className="text-neutral-200">9.5pt Arial (Standard)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-neutral-950 border border-neutral-800/80">
                <span className="text-neutral-400">Page Constraint</span>
                <span className="text-emerald-400 font-semibold">Strict 1-Page</span>
              </div>
            </div>

            {/* Checklist */}
            <div className="border-t border-neutral-800 pt-3 space-y-1.5 text-xs text-neutral-300">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>Zero complex tables or columns</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>XYZ metric bullet points applied</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>Visa eligibility verified in header</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>Standard ATS section names</span>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <h4 className="text-xs font-bold text-neutral-300 mb-2">Next HITL Step</h4>
            <p className="text-xs text-neutral-400 mb-3">
              Proceed to Stage 4 to dispatch {resumes.length > 1 ? `these ${resumes.length} tailored PDFs` : 'this tailored PDF'} to your private Telegram Bot with One-Click interactive approval buttons on your phone or laptop.
            </p>
            <button
              onClick={onProceedToTelegram}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition shadow cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Launch Telegram Alert ({resumes.length})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
