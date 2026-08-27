import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Globe2, 
  Briefcase, 
  Sparkles, 
  ExternalLink, 
  Plus, 
  RefreshCw,
  CheckCircle,
  Building,
  MapPin,
  Tag,
  X,
  ChevronDown,
  Globe,
  Layers,
  Settings,
  UserCheck,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  SlidersHorizontal,
  Home,
  CheckSquare,
  Square,
  Check,
  ListChecks,
  Zap
} from 'lucide-react';
import { JobPosting, CandidateProfile } from '../types';
import { ALL_WORLD_COUNTRIES, SOFTWARE_INDUSTRY_ROLES, ALL_FLATTENED_ROLES } from '../data/globalData';
import { calculateProfileCompletion, isCandidateNativeCountry } from '../utils/profileValidation';

interface JobDiscoveryViewProps {
  jobs: JobPosting[];
  selectedJob: JobPosting | null;
  onSelectJob: (job: JobPosting) => void;
  onAnalyzeJob: (job: JobPosting) => void;
  onBatchAnalyzeJobs?: (jobs: JobPosting[]) => void;
  onRefreshLiveFeed: () => void;
  onAddCustomJob: (job: Partial<JobPosting>) => void;
  isDiscovering: boolean;
  candidateProfile: CandidateProfile;
  onOpenProfileModal?: () => void;
  onOpenPortalsModal?: () => void;
  onUpdateProfile?: (updated: CandidateProfile) => void;
  authUser?: { email: string; name?: string } | null;
}

const POPULAR_SUGGESTED_ROLES = [
  'Senior Full Stack Engineer',
  'AI Systems Engineer',
  'Node.js Architect',
  'Python Backend Lead',
  'DevOps / SRE Lead',
  'Distributed Systems Engineer',
  'Scrum Master / Agile PM',
  'Frontend Architect (React / Next.js)'
];

const POPULAR_DESTINATIONS = [
  { name: 'India', label: 'India (Native / Domestic)', region: 'Asia' },
  { name: 'Germany', label: 'Germany (EU Blue Card)', region: 'Europe' },
  { name: 'Singapore', label: 'Singapore (EP / ONE Pass)', region: 'Asia-Pacific' },
  { name: 'Australia', label: 'Australia (TSS 482 / PR)', region: 'Oceania' },
  { name: 'United States', label: 'United States (H-1B / O-1 / Global Remote)', region: 'Americas' },
  { name: 'United Kingdom', label: 'United Kingdom (Skilled Worker)', region: 'Europe' },
  { name: 'Netherlands', label: 'Netherlands (Highly Skilled Migrant)', region: 'Europe' },
  { name: 'Japan', label: 'Japan (Engineer Visa / HSP)', region: 'Asia' }
];

export const JobDiscoveryView: React.FC<JobDiscoveryViewProps> = ({
  jobs,
  selectedJob,
  onSelectJob,
  onAnalyzeJob,
  onBatchAnalyzeJobs,
  onRefreshLiveFeed,
  onAddCustomJob,
  isDiscovering,
  candidateProfile,
  onOpenProfileModal,
  onOpenPortalsModal,
  onUpdateProfile,
  authUser
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    candidateProfile.targetCountries && candidateProfile.targetCountries.length > 0
      ? candidateProfile.targetCountries
      : []
  );
  const [cityFilter, setCityFilter] = useState<string>('');
  const [visaOnly, setVisaOnly] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRoleKeywordsDropdown, setShowRoleKeywordsDropdown] = useState(false);
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);

  // New Custom Job form state
  const [customTitle, setCustomTitle] = useState('');
  const [customCompany, setCustomCompany] = useState('');
  const [customLocation, setCustomLocation] = useState('Berlin, Germany');
  const [customCountry, setCustomCountry] = useState('Germany');
  const [customCity, setCustomCity] = useState('Berlin');
  const [customDescription, setCustomDescription] = useState('');
  const [customUrl, setCustomUrl] = useState('https://careers.example.com/job/123');

  // Keep selectedCountries in sync if candidateProfile updates externally
  useEffect(() => {
    if (candidateProfile.targetCountries && candidateProfile.targetCountries.length > 0) {
      setSelectedCountries(prev => {
        const merged = Array.from(new Set([...prev, ...candidateProfile.targetCountries]));
        if (merged.length !== prev.length || !prev.every(c => candidateProfile.targetCountries.includes(c))) {
          console.log('[JobDiscovery] Synchronizing candidateProfile targetCountries into selectedCountries:', merged);
          return candidateProfile.targetCountries;
        }
        return prev;
      });
    }
  }, [candidateProfile.targetCountries]);

  // Diagnostic logging for country selection and jobs
  useEffect(() => {
    console.log('[JobDiscovery] selectedCountries state updated:', selectedCountries);
  }, [selectedCountries]);

  useEffect(() => {
    console.log('[JobDiscovery] jobs state count:', jobs.length);
  }, [jobs.length]);

  const candidateNative = candidateProfile.nativeCountry || 'India';
  const isSearchingInNativeCountry = selectedCountries.some(c => isCandidateNativeCountry(c, candidateProfile));

  // Determine if roles and countries are configured
  const hasConfiguredRoles = (candidateProfile.targetRoles && candidateProfile.targetRoles.length > 0) || Boolean(searchQuery.trim());
  const hasConfiguredCountries = selectedCountries.length > 0 || (candidateProfile.targetCountries && candidateProfile.targetCountries.length > 0);
  const isFeedConfigured = hasConfiguredRoles && hasConfiguredCountries;

  const handleAddCountry = (countryName: string) => {
    if (!countryName) return;
    const current = selectedCountries.length > 0 ? selectedCountries : (candidateProfile.targetCountries || []);
    if (!current.includes(countryName)) {
      const next = Array.from(new Set([...current, countryName]));
      console.log('[JobDiscovery] handleAddCountry -> selectedCountries:', next);
      setSelectedCountries(next);
      if (onUpdateProfile) {
        onUpdateProfile({
          ...candidateProfile,
          targetCountries: next
        });
      }
    }
  };

  const handleRemoveCountry = (countryName: string) => {
    const current = selectedCountries.length > 0 ? selectedCountries : (candidateProfile.targetCountries || []);
    const next = current.filter(c => c !== countryName);
    console.log('[JobDiscovery] handleRemoveCountry -> selectedCountries:', next);
    setSelectedCountries(next);
    if (onUpdateProfile) {
      onUpdateProfile({
        ...candidateProfile,
        targetCountries: next
      });
    }
  };

  const toggleCountrySelection = (countryName: string) => {
    const current = selectedCountries.length > 0 ? selectedCountries : (candidateProfile.targetCountries || []);
    if (current.includes(countryName)) {
      handleRemoveCountry(countryName);
    } else {
      handleAddCountry(countryName);
    }
  };

  // Automatically generate live matching jobs when roles & countries are set but feed is empty
  const handleAutoPopulateLiveFeed = async () => {
    const activeRoles = candidateProfile.targetRoles?.length ? candidateProfile.targetRoles : [searchQuery || "Full Stack Engineer"];
    const activeCountries = selectedCountries.length ? selectedCountries : (candidateProfile.targetCountries?.length ? candidateProfile.targetCountries : ["Germany", "Singapore", "United States"]);

    console.log('[JobDiscovery] autoPopulateLiveFeed requested for roles:', activeRoles, 'countries:', activeCountries);

    try {
      const res = await fetch("/api/jobs/portal-scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          portal: "Global Tech Aggregator",
          targetRoles: activeRoles,
          targetCountries: activeCountries
        })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.jobs) && data.jobs.length > 0) {
        data.jobs.forEach((jb: any, idx: number) => {
          onAddCustomJob({
            ...jb,
            id: jb.id || `custom-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 7)}`
          });
        });
      }
    } catch (e) {
      console.warn("Auto job generation:", e);
    }
  };

  // Fix race condition: only fetch or populate after candidateProfile confirms target roles and countries
  useEffect(() => {
    if (isFeedConfigured && jobs.length === 0 && !isDiscovering) {
      console.log('[JobDiscovery] Target roles & countries confirmed with empty feed. Triggering initial feed populate.');
      handleAutoPopulateLiveFeed();
    }
  }, [isFeedConfigured, jobs.length, isDiscovering]);

  const handleSelectRoleKeyword = (roleName: string) => {
    const currentRoles = candidateProfile.targetRoles || [];
    if (!currentRoles.includes(roleName)) {
      const nextRoles = [...currentRoles, roleName];
      if (onUpdateProfile) {
        onUpdateProfile({
          ...candidateProfile,
          targetRoles: nextRoles
        });
      }
    }
    setSearchQuery(roleName);
    setShowRoleKeywordsDropdown(false);
  };

  const handleAddQuickRole = (roleName: string) => {
    const currentRoles = candidateProfile.targetRoles || [];
    if (!currentRoles.includes(roleName)) {
      const next = [...currentRoles, roleName];
      if (onUpdateProfile) {
        onUpdateProfile({
          ...candidateProfile,
          targetRoles: next
        });
      }
    }
    setSearchQuery(roleName);
  };

  const handleRemoveRole = (roleName: string) => {
    const currentRoles = candidateProfile.targetRoles || [];
    const next = currentRoles.filter(r => r !== roleName);
    if (onUpdateProfile) {
      onUpdateProfile({
        ...candidateProfile,
        targetRoles: next
      });
    }
  };

  // Job Feeds must be empty until user sets roles and country
  const filteredJobs = useMemo(() => {
    if (!isFeedConfigured) return [];
    return jobs.filter(job => {
      // 1. Roles matching
      const activeRoles = candidateProfile.targetRoles || [];
      const query = searchQuery.trim().toLowerCase();
      
      let matchesSearch = true;
      if (query) {
        matchesSearch = 
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.tags.some(t => t.toLowerCase().includes(query));
      } else if (activeRoles.length > 0) {
        matchesSearch = activeRoles.some(role => {
          const words = role.toLowerCase().split(/\s+/).filter(w => w.length > 2);
          return words.some(w => job.title.toLowerCase().includes(w) || job.tags.some(t => t.toLowerCase().includes(w)));
        });
      }

      // 2. Country matching
      const effectiveCountries = selectedCountries.length > 0 
        ? selectedCountries 
        : (candidateProfile.targetCountries || []);

      const matchesCountry = effectiveCountries.length === 0 || effectiveCountries.some(sc => {
        const target = sc.toLowerCase();
        return job.country.toLowerCase().includes(target) || 
               target.includes(job.country.toLowerCase()) || 
               job.location.toLowerCase().includes(target);
      });

      // 3. City matching
      const matchesCity = 
        !cityFilter.trim() ||
        job.location.toLowerCase().includes(cityFilter.toLowerCase()) ||
        (job.city && job.city.toLowerCase().includes(cityFilter.toLowerCase()));

      // 4. Visa matching: If searching in native country, visa requirement is disabled!
      const jobIsNative = isCandidateNativeCountry(job.country, candidateProfile) || isCandidateNativeCountry(job.location, candidateProfile);
      const matchesVisa = !visaOnly || jobIsNative || job.visaSponsorship === 'Verified Sponsored' || job.relocationAssistance;

      return matchesSearch && matchesCountry && matchesCity && matchesVisa;
    }).filter((job, index, self) => self.findIndex(j => j.id === job.id) === index);
  }, [jobs, isFeedConfigured, searchQuery, candidateProfile.targetRoles, selectedCountries, candidateProfile.targetCountries, cityFilter, candidateProfile, visaOnly]);

  // Multiple job feeds MUST be selected automatically, but user has option to deselect any job feed
  useEffect(() => {
    if (filteredJobs.length > 0) {
      setSelectedJobIds(prev => {
        const currentFilteredIds = filteredJobs.map(j => j.id);
        if (prev.length === 0) {
          return currentFilteredIds;
        }
        const validSelections = prev.filter(id => currentFilteredIds.includes(id));
        if (validSelections.length === 0) {
          return currentFilteredIds;
        }
        return validSelections;
      });
    } else {
      setSelectedJobIds([]);
    }
  }, [filteredJobs]);

  const toggleJobSelection = (jobId: string) => {
    setSelectedJobIds(prev => {
      if (prev.includes(jobId)) {
        return prev.filter(id => id !== jobId);
      } else {
        return [...prev, jobId];
      }
    });
  };

  const handleSelectAllJobs = () => {
    setSelectedJobIds(filteredJobs.map(j => j.id));
  };

  const handleDeselectAllJobs = () => {
    setSelectedJobIds([]);
  };

  const handleProceedWithSelectedBatch = () => {
    const selectedObjects = filteredJobs.filter(j => selectedJobIds.includes(j.id));
    if (selectedObjects.length === 0) return;

    if (onBatchAnalyzeJobs) {
      onBatchAnalyzeJobs(selectedObjects);
    } else {
      onSelectJob(selectedObjects[0]);
      onAnalyzeJob(selectedObjects[0]);
    }
  };

  const handleCreateCustomJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle || !customCompany || !customDescription) return;

    onAddCustomJob({
      title: customTitle,
      company: customCompany,
      location: customCity ? `${customCity}, ${customCountry}` : customCountry,
      city: customCity,
      country: customCountry,
      countryFormat: customCountry.toLowerCase().includes('germany') || customCountry.toLowerCase().includes('netherlands') ? 'GERMANY_EU' : customCountry.toLowerCase().includes('singapore') || customCountry.toLowerCase().includes('australia') ? 'SINGAPORE_AU' : customCountry.toLowerCase().includes('japan') ? 'JAPAN' : 'US_GLOBAL',
      visaSponsorship: isCandidateNativeCountry(customCountry, candidateProfile) ? 'Native / Domestic' : 'Verified Sponsored',
      relocationAssistance: !isCandidateNativeCountry(customCountry, candidateProfile),
      description: customDescription,
      url: customUrl,
      applyUrl: customUrl,
      source: 'RSS Feed',
      tags: ['Custom Verified Entry', isCandidateNativeCountry(customCountry, candidateProfile) ? 'Domestic Market' : 'Visa Sponsored', 'Software Engineering']
    });

    setShowAddModal(false);
    setCustomTitle('');
    setCustomCompany('');
    setCustomCity('');
    setCustomDescription('');
  };

  const validation = calculateProfileCompletion(candidateProfile);

  return (
    <div id="job-discovery-stage" className="space-y-4">
      {/* Top Header & Search Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3 shadow-lg">
        {/* Search & Action Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Query Input with Software Industry Autocomplete */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search software roles: "AI Engineer", "Senior Full Stack", "FastAPI", "Node.js", "Scrum Master"...'
              className="w-full pl-9 pr-24 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition"
            />
            <button
              type="button"
              onClick={() => setShowRoleKeywordsDropdown(!showRoleKeywordsDropdown)}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-[10px] font-medium border border-neutral-700 flex items-center gap-1 transition cursor-pointer"
            >
              <span>Roles Catalog</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onRefreshLiveFeed}
              disabled={isDiscovering}
              className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium border border-neutral-700 transition cursor-pointer"
              title="Query free public job APIs (Arbeitnow, Remotive, JSearch)"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isDiscovering ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isDiscovering ? 'Scanning Feeds...' : 'Fetch Open Feeds'}</span>
            </button>

            {onOpenPortalsModal && (
              <button
                onClick={onOpenPortalsModal}
                className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium border border-neutral-700 transition cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>Job Portals (Free)</span>
              </button>
            )}

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Paste Custom JD</span>
            </button>
          </div>
        </div>

        {/* Software Industry Role Keywords Dropdown / Browser */}
        {showRoleKeywordsDropdown && (
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Software Industry Role Catalog (Click to Auto-Filter & Add to Target Roles)
                </h4>
              </div>
              <button 
                onClick={() => setShowRoleKeywordsDropdown(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Role Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-1">
              {SOFTWARE_INDUSTRY_ROLES.map((cat, idx) => (
                <div key={idx} className="bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800 space-y-1.5">
                  <span className="text-[11px] font-bold text-emerald-400 block border-b border-neutral-800 pb-1">
                    {cat.category}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {cat.roles.map((role) => (
                      <button
                        key={role}
                        onClick={() => handleSelectRoleKeyword(role)}
                        className="text-[10px] px-2 py-0.5 rounded bg-neutral-950 hover:bg-emerald-950 hover:text-emerald-300 text-neutral-300 border border-neutral-800 transition text-left cursor-pointer"
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Configured Target Roles Bar */}
        <div className="pt-2 border-t border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap flex-1">
            <span className="text-neutral-400 font-medium flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-teal-400" />
              Configured Target Roles:
            </span>
            {(candidateProfile.targetRoles || []).length === 0 ? (
              <span className="text-[11px] text-amber-400/90 italic">
                None set yet (required to activate job feeds)
              </span>
            ) : (
              (candidateProfile.targetRoles || []).map(role => (
                <span
                  key={role}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-teal-950/80 text-teal-300 border border-teal-800 font-medium text-[11px]"
                >
                  {role}
                  <button
                    type="button"
                    onClick={() => handleRemoveRole(role)}
                    className="hover:text-rose-400 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>

          <button
            onClick={onOpenProfileModal}
            className="text-[11px] text-emerald-400 hover:text-emerald-300 underline shrink-0 cursor-pointer"
          >
            Edit Roles in Profile
          </button>
        </div>

        {/* Global Target Market Multi-Country & City Selectors */}
        <div className="space-y-2 pt-2 border-t border-neutral-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
            {/* Multi-Country Picker */}
            <div className="flex items-center gap-2 flex-wrap flex-1">
              <span className="text-neutral-400 font-medium flex items-center gap-1">
                <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
                Target Countries:
              </span>

              {/* Selected Country Badges */}
              {selectedCountries.length === 0 ? (
                <span className="text-[11px] text-amber-400/90 italic">
                  None selected (required to activate job feeds)
                </span>
              ) : (
                selectedCountries.map(c => {
                  const isNative = isCandidateNativeCountry(c, candidateProfile);
                  return (
                    <span
                      key={c}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-medium text-[11px] ${
                        isNative 
                          ? 'bg-blue-950/90 text-blue-300 border border-blue-700' 
                          : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {isNative ? <Home className="w-3 h-3 text-blue-400" /> : null}
                      <span>{c} {isNative ? '(Native Country)' : ''}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCountry(c)}
                        className="hover:text-rose-400 transition cursor-pointer"
                        title={`Remove ${c}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })
              )}

              {/* Add Country from World Catalog */}
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddCountry(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="px-2.5 py-1 bg-neutral-950 border border-neutral-800 rounded-md text-[11px] text-neutral-300 outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="">+ Add Any Country in the World...</option>
                {ALL_WORLD_COUNTRIES.map(c => (
                  <option key={c.code} value={c.name}>
                    {c.name} ({c.region})
                  </option>
                ))}
              </select>
            </div>

            {/* Optional City Input & Visa Checkbox */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                <input
                  type="text"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  placeholder="Optional City (e.g. Berlin, London)"
                  className="px-2.5 py-1 bg-neutral-950 border border-neutral-800 rounded-md text-[11px] text-white placeholder-neutral-500 outline-none focus:border-emerald-500 w-44"
                />
              </div>

              {/* Visa Requirement Checkbox & Native Country Indicator */}
              {isSearchingInNativeCountry ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-950/60 border border-blue-800 text-blue-300 text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-medium text-[11px]">Native Country Search — Visa Sponsorship Not Required (Disabled)</span>
                </div>
              ) : (
                <label className="flex items-center gap-1.5 cursor-pointer select-none text-neutral-300 text-xs shrink-0">
                  <input
                    type="checkbox"
                    checked={visaOnly}
                    onChange={(e) => setVisaOnly(e.target.checked)}
                    className="rounded bg-neutral-950 border-neutral-700 text-emerald-500 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                  />
                  <span className="text-emerald-400 font-medium">Visa Spons. / Relo Required</span>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Active Native Country search notice */}
        {isSearchingInNativeCountry && (
          <div className="p-2.5 bg-blue-950/40 border border-blue-800/60 rounded-lg text-xs flex items-center justify-between text-blue-200">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-blue-400 shrink-0" />
              <span>
                Searching in your native country (<strong>{candidateNative}</strong>). Visa sponsorship restrictions are automatically waived for domestic positions.
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900/60 border border-blue-700 text-blue-300">
              Domestic Mode Active
            </span>
          </div>
        )}
      </div>

      {/* Discovered Jobs List or Empty Configuration State */}
      {!isFeedConfigured ? (
        // Empty State when Roles or Countries are not set
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl text-center">
          <div className="max-w-xl mx-auto space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              Configure Target Roles & Countries to Activate Job Feeds
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Job feeds are held empty until you configure your target roles and destination or domestic countries. Select your preferences below or complete your profile to immediately stream matching verified opportunities.
            </p>
          </div>

          {/* Quick Setup Step 1: Target Roles */}
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-left space-y-3 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                Step 1: Choose Your Desired Target Role(s)
              </span>
              <span className="text-[11px] text-neutral-500">
                {(candidateProfile.targetRoles || []).length} Selected
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {POPULAR_SUGGESTED_ROLES.map(role => {
                const isSelected = (candidateProfile.targetRoles || []).includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleAddQuickRole(role)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition font-medium cursor-pointer ${
                      isSelected
                        ? 'bg-teal-950 text-teal-300 border-teal-700 shadow'
                        : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {role}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Setup Step 2: Target Countries */}
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-left space-y-3 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5" />
                Step 2: Choose Target Countries (Native & Global)
              </span>
              <span className="text-[11px] text-neutral-500">
                {selectedCountries.length} Selected
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {POPULAR_DESTINATIONS.map(dest => {
                const isSelected = selectedCountries.includes(dest.name);
                const isNative = isCandidateNativeCountry(dest.name, candidateProfile);
                return (
                  <button
                    key={dest.name}
                    type="button"
                    onClick={() => toggleCountrySelection(dest.name)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition font-medium cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? (isNative 
                            ? 'bg-blue-950 text-blue-300 border-blue-700 shadow' 
                            : 'bg-emerald-950 text-emerald-300 border-emerald-700 shadow')
                        : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {dest.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Action to Open Profile */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenProfileModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg transition cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Open Master Profile & Setup (100% Form)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        // Active Job Feed List with Multi-Job Selection and Batch Stage 2 Trigger
        <div className="space-y-3">
          {/* Feed Batch Controls & Selection Toolbar */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={filteredJobs.length > 0 && selectedJobIds.length === filteredJobs.length ? handleDeselectAllJobs : handleSelectAllJobs}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 text-xs font-medium transition cursor-pointer"
                >
                  {filteredJobs.length > 0 && selectedJobIds.length === filteredJobs.length ? (
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-neutral-500" />
                  )}
                  <span>{filteredJobs.length > 0 && selectedJobIds.length === filteredJobs.length ? 'Deselect All' : 'Select All'}</span>
                </button>

                <span className="text-xs text-neutral-400">
                  <strong className="text-emerald-400 font-bold">{selectedJobIds.length}</strong> of {filteredJobs.length} job feeds selected
                </span>
              </div>

              <span className="text-[11px] text-neutral-500 hidden md:inline">
                • Multiple job feeds are selected automatically. Deselect any feed you wish to exclude.
              </span>
            </div>

            {/* Common Proceed to Stage 2 Button when 1 or more jobs are selected */}
            {selectedJobIds.length > 0 && (
              <button
                type="button"
                id="btn-batch-proceed-stage-2"
                onClick={handleProceedWithSelectedBatch}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/50 transition cursor-pointer animate-in fade-in duration-200"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Proceed to Stage 2 ({selectedJobIds.length} Selected Job{selectedJobIds.length > 1 ? 's' : ''})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {filteredJobs.length === 0 ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 text-center space-y-3">
              <Briefcase className="w-8 h-8 text-neutral-500 mx-auto" />
              <p className="text-sm font-medium text-neutral-200">
                No jobs currently displayed for {selectedCountries.join(', ') || 'selected criteria'}
              </p>
              <button
                type="button"
                onClick={handleAutoPopulateLiveFeed}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Stream Verified Postings for Selected Countries</span>
              </button>
            </div>
          ) : (
            filteredJobs.map(job => {
              const isChecked = selectedJobIds.includes(job.id);
              const isSelected = selectedJob?.id === job.id;
              const isNative = isCandidateNativeCountry(job.country, candidateProfile) || isCandidateNativeCountry(job.location, candidateProfile);

              return (
                <div
                  key={job.id}
                  id={`job-card-${job.id}`}
                  className={`bg-neutral-900 border rounded-xl p-4 transition-all relative ${
                    isChecked
                      ? 'border-emerald-500/80 ring-1 ring-emerald-500/30 bg-neutral-900/95 shadow-md'
                      : 'border-neutral-800 hover:border-neutral-700 opacity-80'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                    {/* Left: Selection Checkbox & Job Details */}
                    <div className="flex items-start gap-3 flex-1">
                      {/* Interactive Selection Checkbox */}
                      <button
                        type="button"
                        onClick={() => toggleJobSelection(job.id)}
                        className={`mt-0.5 p-1 rounded-md transition cursor-pointer shrink-0 ${
                          isChecked 
                            ? 'text-emerald-400 bg-emerald-950/80 border border-emerald-600' 
                            : 'text-neutral-500 bg-neutral-950 border border-neutral-800 hover:border-neutral-700'
                        }`}
                        title={isChecked ? "Click to Deselect this job feed" : "Click to Select this job feed"}
                      >
                        {isChecked ? <Check className="w-4 h-4" /> : <div className="w-4 h-4" />}
                      </button>

                      {/* Job Overview */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 
                            onClick={() => toggleJobSelection(job.id)}
                            className="text-sm font-bold text-white hover:text-emerald-300 transition cursor-pointer"
                          >
                            {job.title}
                          </h3>
                          {isNative ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800">
                              <Home className="w-3 h-3 text-blue-400" />
                              Domestic Market (Native)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                              {job.visaSponsorship}
                            </span>
                          )}
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                            {job.country} ({job.countryFormat})
                          </span>
                          {job.matchScore && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-800 text-amber-300 border border-neutral-700">
                              ⭐ {job.matchScore}% Match
                            </span>
                          )}
                          {isChecked && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 hidden sm:inline-flex items-center gap-1">
                              ✓ Queued for Stage 2
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400">
                          <span className="flex items-center gap-1 text-neutral-300 font-medium">
                            <Building className="w-3.5 h-3.5 text-neutral-500" />
                            {job.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                            {job.location}
                          </span>
                          <span className="text-neutral-500">
                            Source: <strong className="text-neutral-400">{job.source}</strong>
                          </span>
                          {job.salary && (
                            <span className="text-emerald-400 font-medium">
                              {job.salary}
                            </span>
                          )}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {job.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-950 text-neutral-400 border border-neutral-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Action buttons */}
                    <div className="flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-neutral-800 shrink-0">
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-neutral-400 hover:text-neutral-200 bg-neutral-950 rounded-lg border border-neutral-800 transition cursor-pointer"
                        title="Open Original Job Link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      <button
                        id={`btn-analyze-${job.id}`}
                        onClick={() => {
                          onSelectJob(job);
                          onAnalyzeJob(job);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Proceed (Single)</span>
                      </button>
                    </div>
                  </div>

                  {/* Excerpt */}
                  <p className="text-xs text-neutral-400 mt-2.5 line-clamp-2 leading-relaxed bg-neutral-950/40 p-2 rounded border border-neutral-800/40 font-mono">
                    {job.description.replace(/\n/g, ' ')}
                  </p>
                </div>
              );
            })
          )}

          {/* Sticky floating bottom bar when multiple jobs are selected */}
          {selectedJobIds.length > 1 && (
            <div className="sticky bottom-3 z-30 bg-neutral-950/95 backdrop-blur-md border border-emerald-600/60 rounded-2xl p-3.5 shadow-2xl flex items-center justify-between gap-4 animate-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <ListChecks className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>{selectedJobIds.length} Job Feeds Selected</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Ready for Multi-Country Parsing</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Click Proceed to run JD Parsing & ATS standard alignment across all selected jobs.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDeselectAllJobs}
                  className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-xl text-xs font-medium transition cursor-pointer"
                >
                  Clear Selection
                </button>
                <button
                  type="button"
                  id="btn-sticky-batch-proceed"
                  onClick={handleProceedWithSelectedBatch}
                  className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950 transition cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Proceed to Stage 2</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Custom Job Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 max-w-lg w-full shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              Add Custom Job Description for Pipeline
            </h3>
            <p className="text-xs text-neutral-400 mb-4">
              Paste any external job posting to analyze with Gemini and generate an ATS-ready resume.
            </p>

            <form onSubmit={handleCreateCustomJob} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-neutral-300 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-neutral-300 mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={customCompany}
                    onChange={(e) => setCustomCompany(e.target.value)}
                    placeholder="e.g. Acme Cloud"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-300 mb-1">Country</label>
                  <select
                    value={customCountry}
                    onChange={(e) => setCustomCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {ALL_WORLD_COUNTRIES.map(c => (
                      <option key={c.code} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-300 mb-1">Job Description / Requirements</label>
                <textarea
                  required
                  rows={4}
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Paste the full JD text with required skills..."
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer"
                >
                  Add to Discovery Feed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
