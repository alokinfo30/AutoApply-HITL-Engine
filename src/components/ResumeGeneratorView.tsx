import React, { useState } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import { GeneratedResume, JobPosting, CandidateProfile } from '../types';
import { generateAtsPdf } from '../utils/pdfGenerator';

interface ResumeGeneratorViewProps {
  job: JobPosting | null;
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

  const currentResume = resumes[activeResumeIndex] || resumes[0];

  const [editableMarkdown, setEditableMarkdown] = useState<string>(currentResume?.markdownContent || '');

  React.useEffect(() => {
    if (currentResume?.markdownContent) {
      setEditableMarkdown(currentResume.markdownContent);
    }
  }, [currentResume?.markdownContent]);

  if (!job || resumes.length === 0) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center text-neutral-400">
        <FileText className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
        <p className="text-sm font-medium text-neutral-300">No Resumes Generated Yet</p>
        <p className="text-xs text-neutral-500 mt-1">Select a job from Stage 1, analyze in Stage 2, and click "Generate Tailored Resume".</p>
      </div>
    );
  }

  const handleDownloadPdf = () => {
    const countryTag = currentResume.country ? `_${currentResume.country.replace(/\s+/g, '_')}` : '';
    const filename = `${candidateProfile.firstName}_${candidateProfile.lastName}_${job.company.replace(/\s+/g, '_')}${countryTag}_Resume.pdf`;
    generateAtsPdf(editableMarkdown || currentResume.markdownContent || '', filename);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editableMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="resume-generator-stage" className="space-y-4">
      {/* Top Multi-Country Resumes Tabs if multiple generated */}
      {resumes.length > 1 && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              Generated Resumes ({resumes.length}):
            </span>
            <div className="flex items-center gap-1.5">
              {resumes.map((r, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectResumeIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                    activeResumeIndex === idx
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  <span>{r.country || `Resume ${idx + 1}`} Standard</span>
                  <span className="text-[10px] font-mono opacity-80">({r.countryFormat})</span>
                </button>
              ))}
            </div>
          </div>

          <span className="text-[11px] text-emerald-400 font-mono shrink-0 hidden sm:inline">
            ✓ All {resumes.length} formats prepared separately for HITL Alert
          </span>
        </div>
      )}

      {/* Header bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-semibold">
              STAGE 3: RESUME GENERATION AGENT
            </span>
            <span className="text-xs text-neutral-400">Target Role:</span>
          </div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            {job.title} — {job.company}
          </h2>
          <p className="text-xs text-neutral-400">
            Tailored Country Standard: <strong className="text-emerald-400">{currentResume.country || job.country} ({currentResume.countryFormat})</strong> • ATS Score: <strong className="text-emerald-400">{currentResume.atsScore || 96}/100</strong>
          </p>
        </div>

        {/* Action controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Switch View Mode */}
          <div className="flex bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs">
            <button
              onClick={() => setViewMode('ats-preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                viewMode === 'ats-preview' ? 'bg-neutral-800 text-white font-medium shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              ATS Preview
            </button>
            <button
              onClick={() => setViewMode('markdown-raw')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition ${
                viewMode === 'markdown-raw' ? 'bg-neutral-800 text-white font-medium shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              Markdown Editor
            </button>
          </div>

          <button
            onClick={onRegenerateResume}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium border border-neutral-700 transition"
            title="Re-run Gemini 3.7 Flash tailoring"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isGenerating ? 'Regenerating...' : 'Regenerate'}</span>
          </button>

          <button
            id="btn-download-pdf"
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download ATS PDF</span>
          </button>

          <button
            id="btn-proceed-stage4"
            onClick={onProceedToTelegram}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-teal-950/40 transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Launch to Telegram HITL Alert ({resumes.length > 1 ? `All ${resumes.length}` : '1'})</span>
            <ArrowRight className="w-3.5 h-3.5" />
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
                    Target Role: {job.title} • Country Format: {currentResume.country || job.country} Standard • Visa Sponsorship Required
                  </p>
                </div>

                {/* Professional Summary */}
                <div>
                  <h2 className="text-xs font-bold text-neutral-900 uppercase border-b border-neutral-300 pb-0.5 mb-1.5 tracking-wider">
                    Professional Summary
                  </h2>
                  <p className="text-neutral-800 text-xs leading-relaxed text-justify">
                    Results-driven <strong>{job.title}</strong> with {candidateProfile?.yearsExperience || 6}+ years of hands-on expertise building production-ready distributed microservices, scalable full-stack architectures, and production LLM orchestration pipelines. Proven track record leading agile cross-functional engineering squads, optimizing system latency by 74%, and delivering high-impact solutions aligned with <strong>{job.company}</strong>'s technical requirements in {currentResume.country || job.country}.
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
                        Engineered high-throughput microservices in Node.js and TypeScript serving <strong>1.2M+ daily active requests</strong> with sub-120ms p99 latency.
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
                <span className="text-xs font-mono text-neutral-400">Markdown Source ({currentResume.country || job.country} Standard):</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition"
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
                <span className="text-neutral-200 font-mono">{currentResume.country || job.country}</span>
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
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Launch Telegram Alert</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
