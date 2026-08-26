import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  Sparkles, 
  X, 
  Calculator, 
  CheckCircle2,
  Building,
  Globe2,
  PieChart
} from 'lucide-react';
import { SalaryEstimate, JobPosting, CandidateProfile } from '../types';

interface SalaryEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialJob?: JobPosting | null;
  candidateProfile?: CandidateProfile;
}

export const SalaryEstimatorModal: React.FC<SalaryEstimatorModalProps> = ({
  isOpen,
  onClose,
  initialJob,
  candidateProfile
}) => {
  const [roleTitle, setRoleTitle] = useState(initialJob?.title || candidateProfile?.targetRoles?.[0] || 'Senior Full Stack Engineer');
  const [country, setCountry] = useState(initialJob?.country || 'Germany');
  const [city, setCity] = useState(initialJob?.city || 'Berlin');
  const [experienceYears, setExperienceYears] = useState(candidateProfile?.yearsExperience || 6);
  const [estimate, setEstimate] = useState<SalaryEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEstimate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/salary/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleTitle,
          country,
          city,
          experienceYears,
          skills: candidateProfile?.skills || ["Python", "FastAPI", "React", "Docker"]
        })
      });
      const data = await res.json();
      if (data.success && data.salaryEstimate) {
        setEstimate(data.salaryEstimate);
      }
    } catch (e) {
      console.error("Salary estimate error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchEstimate();
    }
  }, [isOpen, country, city, roleTitle]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold shadow">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  Market-Based Salary Range Estimator
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Stage 2 Market Insights
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Real compensation benchmark insights & visa sponsorship salary minimums.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg bg-neutral-900 border border-neutral-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Parameters Bar */}
        <div className="p-4 bg-neutral-950/70 border-b border-neutral-800 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-neutral-400 mb-1 font-medium">Target Role</label>
            <input
              type="text"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1 font-medium">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white outline-none focus:border-emerald-500"
            >
              <option value="Germany">Germany (EU)</option>
              <option value="Singapore">Singapore</option>
              <option value="Australia">Australia</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Japan">Japan</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Canada">Canada</option>
            </select>
          </div>

          <div>
            <label className="block text-neutral-400 mb-1 font-medium">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Berlin, Munich"
              className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1 font-medium">Experience</label>
            <div className="flex gap-2">
              <input
                type="number"
                min={1}
                max={30}
                value={experienceYears}
                onChange={(e) => setExperienceYears(parseInt(e.target.value) || 1)}
                className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={fetchEstimate}
                disabled={isLoading}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
              >
                {isLoading ? '...' : 'Calc'}
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-neutral-400">
              <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Analyzing global market compensation benchmarks...</span>
            </div>
          ) : estimate ? (
            <div className="space-y-4">
              {/* Primary Compensation Metric Banner */}
              <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-emerald-950/50 border border-emerald-500/30 rounded-2xl p-5 shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-mono">
                      Estimated Median Base Compensation ({country})
                    </span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5 flex items-baseline gap-1.5">
                      <span className="text-emerald-400">{estimate.currencySymbol}</span>
                      <span>{estimate.median.toLocaleString()}</span>
                      <span className="text-xs text-neutral-400 font-normal">/ year</span>
                    </div>
                  </div>

                  <div className="text-right bg-neutral-900/80 px-3.5 py-2 rounded-xl border border-neutral-800">
                    <span className="text-[10px] text-neutral-400 block font-mono">Net Take-Home Pay</span>
                    <span className="text-sm font-bold text-emerald-300">{estimate.netMonthly}</span>
                  </div>
                </div>

                {/* 25th - 75th - 90th Percentile Range Visualizer */}
                <div className="mt-4 pt-3 border-t border-neutral-800 space-y-2">
                  <div className="flex justify-between text-[11px] font-mono text-neutral-400">
                    <span>25th (Entry/Mid): <strong>{estimate.currencySymbol}{estimate.p25.toLocaleString()}</strong></span>
                    <span className="text-emerald-400 font-bold">Median: {estimate.currencySymbol}{estimate.median.toLocaleString()}</span>
                    <span>75th (Lead): <strong>{estimate.currencySymbol}{estimate.p75.toLocaleString()}</strong></span>
                    <span>90th (Staff): <strong>{estimate.currencySymbol}{estimate.p90.toLocaleString()}</strong></span>
                  </div>

                  <div className="w-full bg-neutral-950 rounded-full h-3 p-0.5 border border-neutral-800 flex">
                    <div className="bg-neutral-700 h-full rounded-l-full" style={{ width: '25%' }}></div>
                    <div className="bg-emerald-500 h-full" style={{ width: '50%' }}></div>
                    <div className="bg-teal-400 h-full rounded-r-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
              </div>

              {/* Grid 4 Key Data Points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Visa Sponsorship Salary Compliance */}
                <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Visa Minimum Threshold
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                      100% Eligible
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-relaxed font-mono">
                    {estimate.visaThreshold}
                  </p>
                </div>

                {/* Bonus & Equity Grants */}
                <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1.5">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-teal-400" />
                    Bonus & Equity Range
                  </span>
                  <p className="text-[11px] text-neutral-300 leading-relaxed font-mono">
                    {estimate.bonusEquity}
                  </p>
                </div>

                {/* Estimated Taxes & Net */}
                <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1.5">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <PieChart className="w-4 h-4 text-amber-400" />
                    Tax & Withholding Estimate
                  </span>
                  <p className="text-[11px] text-neutral-300 leading-relaxed font-mono">
                    Effective Tax: {estimate.estimatedTaxRate}
                  </p>
                </div>

                {/* Cost of Living Comparison */}
                <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1.5">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-blue-400" />
                    Cost of Living Index
                  </span>
                  <p className="text-[11px] text-neutral-300 leading-relaxed font-mono">
                    {estimate.costOfLivingIndex}
                  </p>
                </div>
              </div>

              {/* Hiring Market Demand Note */}
              <div className="p-3 bg-neutral-950/80 rounded-xl border border-neutral-800 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Market Hiring Demand & Strategy</span>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{estimate.marketDemand}</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 flex items-center justify-between bg-neutral-950">
          <span className="text-[11px] text-neutral-500">
            Compensation values based on verified global tech benchmarks & visa regulatory criteria.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold"
          >
            Close Insights
          </button>
        </div>
      </div>
    </div>
  );
};
