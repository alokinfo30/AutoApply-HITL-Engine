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
  Calendar
} from 'lucide-react';
import { JobPosting, CandidateProfile, InterviewPrepGuide, InterviewTechnicalQuestion } from '../types';
import { generateAtsPdf } from '../utils/pdfGenerator';
import { FollowUpEmailModal } from './FollowUpEmailModal';
import { InterviewSchedulerModal } from './InterviewSchedulerModal';

interface InterviewPrepViewProps {
  job: JobPosting | null;
  candidateProfile: CandidateProfile;
  onLaunchMockInterview?: (job: JobPosting) => void;
  onProceedToMockInterview?: () => void;
}

export const InterviewPrepView: React.FC<InterviewPrepViewProps> = ({
  job,
  candidateProfile,
  onLaunchMockInterview,
  onProceedToMockInterview
}) => {
  const [seniorityLevel, setSeniorityLevel] = useState<'Mid-Level' | 'Senior' | 'Lead / Staff'>('Senior');
  const [prepGuide, setPrepGuide] = useState<InterviewPrepGuide | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'technical' | 'system_design' | 'company' | 'behavioral' | 'tips'>('technical');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showFollowUpEmailModal, setShowFollowUpEmailModal] = useState(false);
  const [showSchedulerModal, setShowSchedulerModal] = useState(false);

  useEffect(() => {
    if (job) {
      loadInterviewPrep();
    }
  }, [job?.id, seniorityLevel]);

  const loadInterviewPrep = async () => {
    if (!job) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/gemini/prepare-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job,
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
    if (!prepGuide || !job) return;
    let markdown = `# INTERVIEW MASTER PREPARATION GUIDE
## Role: ${prepGuide.roleTitle} at ${prepGuide.companyName}
**Target Seniority Bar:** ${seniorityLevel} | **Prepared for:** ${candidateProfile.firstName} ${candidateProfile.lastName}

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

    generateAtsPdf(markdown, `${job.company.replace(/\s+/g, '_')}_Interview_Prep_Guide.pdf`);
  };

  if (!job) {
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
            Engineered for <strong className="text-neutral-200">{job.title}</strong> at <strong className="text-neutral-200">{job.company}</strong> ({job.location})
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Seniority Selector */}
          <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg p-0.5 text-xs">
            {(['Mid-Level', 'Senior', 'Lead / Staff'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setSeniorityLevel(level)}
                className={`px-2.5 py-1 rounded-md font-medium transition ${
                  seniorityLevel === level
                    ? 'bg-violet-600 text-white shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <button
            onClick={loadInterviewPrep}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium border border-neutral-700 transition"
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
            disabled={!prepGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold shadow transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Prep PDF</span>
          </button>

          {(onProceedToMockInterview || onLaunchMockInterview) && (
            <button
              onClick={() => onProceedToMockInterview ? onProceedToMockInterview() : onLaunchMockInterview && onLaunchMockInterview(job)}
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
        job={job}
        candidateProfile={candidateProfile}
      />
    </div>
  );
};
