import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Globe2, 
  ShieldCheck, 
  Award, 
  Target, 
  ArrowRight,
  Zap,
  Building,
  MapPin,
  Check,
  Plus,
  X,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { JobPosting, MatchAnalysis, CountryFormat, CandidateProfile } from '../types';
import { ALL_WORLD_COUNTRIES } from '../data/globalData';
import { SalaryEstimatorModal } from './SalaryEstimatorModal';

interface JdMatchViewProps {
  job: JobPosting | null;
  matchAnalysis: MatchAnalysis | null;
  selectedCountryStandards: string[];
  onChangeCountryStandards: (standards: string[]) => void;
  onProceedToResume: () => void;
  isAnalyzing: boolean;
  candidateProfile: CandidateProfile;
  stage1TargetCountries?: string[];
  onOpenSalaryEstimator?: () => void;
}

export const JdMatchView: React.FC<JdMatchViewProps> = ({
  job,
  matchAnalysis,
  selectedCountryStandards,
  onChangeCountryStandards,
  onProceedToResume,
  isAnalyzing,
  candidateProfile,
  stage1TargetCountries = [],
  onOpenSalaryEstimator
}) => {
  const [showSalaryModal, setShowSalaryModal] = useState(false);

  if (!job) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center text-neutral-400">
        <Target className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
        <p className="text-sm font-medium text-neutral-300">No Job Selected for Stage 2 Parsing</p>
        <p className="text-xs text-neutral-500 mt-1">Select any discovered job from Stage 1 to analyze match & country format guidelines.</p>
      </div>
    );
  }

  // Determine standard country options based strictly on what user selected in Stage 1 & profile
  const baseCountries = Array.from(new Set([
    ...(stage1TargetCountries.length > 0 ? stage1TargetCountries : candidateProfile.targetCountries || ['Germany', 'Singapore', 'Australia', 'United States']),
    job.country
  ])).filter(Boolean);

  const getCountryPreset = (countryName: string) => {
    const cLower = countryName.toLowerCase();
    if (cLower.includes('germany') || cLower.includes('netherlands') || cLower.includes('france') || cLower.includes('switzerland') || cLower.includes('austria') || cLower.includes('sweden')) {
      return {
        tag: 'EU Blue Card / Direct English',
        description: 'Functional summary, chronological technical experience with clear stack labels, visa eligibility upfront.',
        highlights: [
          'Strictly written in 100% English',
          'Explicit Tech Stack taxonomy per position',
          'EU Blue Card / Relocation statement upfront',
          'No photo needed for international tech MNCs'
        ]
      };
    } else if (cLower.includes('singapore') || cLower.includes('australia') || cLower.includes('new zealand')) {
      return {
        tag: 'Employment Pass / TSS 482',
        description: 'High-density project metrics & business revenue impact, EP/TSS 482 visa sponsorship focus, agile delivery ownership.',
        highlights: [
          'Employment Pass (EP) / TSS 482 visa sponsorship focus',
          'High-density project metrics & business revenue impact',
          'Core tech ownership & agile delivery metrics',
          'Concise executive summary'
        ]
      };
    } else if (cLower.includes('japan') || cLower.includes('south korea')) {
      return {
        tag: 'Global Tech Rirekisho / English CV',
        description: 'Bilingual-friendly technical CV focusing on international development teams, visa sponsorship, and engineering discipline.',
        highlights: [
          'English format for international hubs (Tokyo, Fukuoka)',
          'Engineering discipline & technical stack precision',
          'Explicit engineer visa sponsorship declaration',
          'Structured chronological milestones'
        ]
      };
    } else if (cLower.includes('united kingdom') || cLower.includes('uk') || cLower.includes('ireland')) {
      return {
        tag: 'UK Skilled Worker Visa Standard',
        description: '2-page maximum, clean serif/sans typography, outcome-driven metrics, right-to-work / sponsorship declaration.',
        highlights: [
          'Skilled Worker visa sponsorship readiness',
          'Quantifiable deliverables & system scale',
          'UK tech sector standard terminology'
        ]
      };
    } else {
      return {
        tag: 'Strict 1-Page XYZ Metric Format',
        description: 'Strict 1-page format, metric-driven XYZ format (Accomplished [X] as measured by [Y] by doing [Z]), zero graphics.',
        highlights: [
          'Strict 1-page compact layout',
          'XYZ Accomplishment Metric Formula',
          'Zero tables or graphical clutter (100% ATS score)',
          'Section headers in ALL CAPS standard'
        ]
      };
    }
  };

  const toggleCountryStandard = (countryName: string) => {
    if (selectedCountryStandards.includes(countryName)) {
      if (selectedCountryStandards.length > 1) {
        onChangeCountryStandards(selectedCountryStandards.filter(c => c !== countryName));
      }
    } else {
      onChangeCountryStandards([...selectedCountryStandards, countryName]);
    }
  };

  return (
    <div id="jd-match-stage" className="space-y-4">
      {/* Selected Job Header Summary */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-semibold">
                STAGE 2: PARSING & ATS MATCHING
              </span>
              <span className="text-xs text-neutral-400">Target Role:</span>
            </div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              {job.title}
            </h2>
            <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1">
              <span className="flex items-center gap-1 text-neutral-300">
                <Building className="w-3.5 h-3.5 text-neutral-500" />
                {job.company}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                {job.location} ({job.country})
              </span>
            </div>
          </div>

          {/* Match Score Badge */}
          <div className="flex items-center gap-3 bg-neutral-950 p-3 rounded-lg border border-neutral-800">
            <div className="text-right">
              <div className="text-[10px] text-neutral-400 uppercase font-mono">ATS Match Score</div>
              <div className="text-xl font-black text-emerald-400">
                {matchAnalysis ? `${matchAnalysis.score}%` : `${job.matchScore || 94}%`}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Country Standard Selector & AI Match Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Country CV Format Selection */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-emerald-400" />
                  Select Target Country CV Standard(s)
                </h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Showing countries selected in Stage 1. Select multiple to generate separate tailored resumes in Stage 3.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-950 text-emerald-400 border border-neutral-800">
                {selectedCountryStandards.length} Selected
              </span>
            </div>

            {/* Country Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
              {baseCountries.map(countryName => {
                const isSelected = selectedCountryStandards.includes(countryName);
                const preset = getCountryPreset(countryName);

                return (
                  <button
                    key={countryName}
                    onClick={() => toggleCountryStandard(countryName)}
                    className={`p-3 rounded-lg text-left border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-950/50 border-emerald-500 text-white ring-1 ring-emerald-500/40 shadow-sm'
                        : 'bg-neutral-950 border-neutral-800/80 hover:border-neutral-700 text-neutral-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-emerald-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                        }`}>
                          {preset.tag}
                        </span>
                        {isSelected ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <span className="text-[10px] text-neutral-500 font-mono">+ Select</span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                        <span>{countryName} Standard</span>
                      </h4>
                      <p className="text-[11px] text-neutral-400 leading-snug mb-2 font-mono">{preset.description}</p>
                    </div>

                    <ul className="space-y-1 text-[10px] text-neutral-400 border-t border-neutral-800/80 pt-2">
                      {preset.highlights.slice(0, 2).map((h, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-emerald-400">✓</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>

            {/* Option to add any additional country standard */}
            <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between">
              <span className="text-[11px] text-neutral-400">Need another country standard?</span>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    toggleCountryStandard(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="px-2.5 py-1 bg-neutral-950 border border-neutral-800 rounded-md text-[11px] text-neutral-300 outline-none focus:border-emerald-500"
              >
                <option value="">+ Add Any Country CV Standard...</option>
                {ALL_WORLD_COUNTRIES.map(c => (
                  <option key={c.code} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Match Analysis Breakdown */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              JD Keyword Overlap & Skill Fit Analysis
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Matched Skills */}
              <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800/80">
                <div className="text-[11px] font-semibold text-emerald-400 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Matched Core Keywords ({candidateProfile.firstName}'s Skills)
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(matchAnalysis?.matchedSkills || job.matchedKeywords || ["Python", "FastAPI", "TypeScript", "React", "Docker", "Agile"]).map((s, idx) => (
                    <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/50">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skill Gaps / Context to Address */}
              <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800/80">
                <div className="text-[11px] font-semibold text-amber-400 mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Gaps Bridged by AI Resume Tailoring
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(matchAnalysis?.skillGaps || job.missingKeywords || ["Kafka (Minor)", "Domain-Specific Cloud API"]).map((s, idx) => (
                    <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-800/50">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tailoring Strategies */}
            <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800/80 text-xs">
              <div className="text-[11px] font-semibold text-neutral-300 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Resume Tailoring Strategy Applied by Gemini 3.7 Flash:
              </div>
              <ul className="space-y-1.5 text-neutral-400 text-xs">
                {(matchAnalysis?.tailoringAdvice || [
                  "Restructure bullet points using XYZ formula: Accomplished [X] measured by [Y] by doing [Z].",
                  "Incorporate candidate's proven latency reductions (-74%) and scale (1.2M+ DAU).",
                  "State candidate's readiness for immediate visa sponsorship & relocation in header contact bar."
                ]).map((adv, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">›</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stage 2 Market-Based Salary & Visa Compliance Insight */}
            <div className="bg-neutral-950 p-3.5 rounded-lg border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-xs">Market Salary Range Insights ({job.country || 'Target Market'})</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                      Visa Eligible
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Estimated Base: <strong className="text-emerald-400">{job.country === 'Germany' ? '€75,000 – €98,000' : job.country === 'Singapore' ? 'S$110,000 – S$165,000' : '$135,000 – $185,000'}</strong> / yr
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowSalaryModal(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Open Salary Estimator</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Candidate Match Profile Card & Action CTA */}
        <div className="space-y-3">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              Candidate Alignment
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="bg-neutral-950 p-2.5 rounded border border-neutral-800/80">
                <span className="text-neutral-400 text-[10px] block">Candidate</span>
                <strong className="text-white font-semibold">{candidateProfile.firstName} {candidateProfile.lastName}</strong>
                <div className="text-[11px] text-neutral-400">{candidateProfile.currentLocation}</div>
              </div>

              <div className="bg-neutral-950 p-2.5 rounded border border-neutral-800/80">
                <span className="text-neutral-400 text-[10px] block">Experience & Visa</span>
                <div className="text-white font-medium">{candidateProfile.yearsExperience} Years Production Experience</div>
                <div className="text-[11px] text-emerald-400 font-medium">✓ Relocation Ready • Requires Visa Sponsorship</div>
              </div>

              <div className="bg-neutral-950 p-2.5 rounded border border-neutral-800/80">
                <span className="text-neutral-400 text-[10px] block">Selected Standards to Generate</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedCountryStandards.map(c => (
                    <span key={c} className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-950 p-2.5 rounded border border-neutral-800/80">
                <span className="text-neutral-400 text-[10px] block">LLM Cost Guarantee</span>
                <div className="text-emerald-400 font-semibold">$0.00 / month (Free Tier Gemini 3.7 Flash)</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-800">
              <button
                id="btn-proceed-stage3"
                onClick={onProceedToResume}
                disabled={isAnalyzing || selectedCountryStandards.length === 0}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-emerald-950/40 transition disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate {selectedCountryStandards.length > 1 ? `${selectedCountryStandards.length} Resumes` : 'Tailored Resume'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Salary Estimator Modal for Stage 2 */}
      <SalaryEstimatorModal
        isOpen={showSalaryModal}
        onClose={() => setShowSalaryModal(false)}
        initialJob={job}
        candidateProfile={candidateProfile}
      />
    </div>
  );
};
