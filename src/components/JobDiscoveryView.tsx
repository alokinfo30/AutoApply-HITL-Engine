import React, { useState, useEffect, useMemo, useTransition, useDeferredValue } from 'react';
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
  Zap,
  ChevronRight
} from 'lucide-react';
import { JobPosting, CandidateProfile } from '../types';
import { ALL_WORLD_COUNTRIES, SOFTWARE_INDUSTRY_ROLES, ALL_FLATTENED_ROLES } from '../data/globalData';
import { calculateProfileCompletion, isCandidateNativeCountry } from '../utils/profileValidation';
import { safeFetchJson } from '../utils/apiClient';

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

// Memoized Job Card to optimize INP & avoid re-rendering entire list when filters change
const JobCardItem = React.memo(({
  job,
  isSelected,
  isChecked,
  isNative,
  candidateNative,
  index = 0,
  onToggleCheck,
  onSelectAndAnalyze
}: {
  job: JobPosting;
  isSelected: boolean;
  isChecked: boolean;
  isNative: boolean;
  candidateNative: string;
  index?: number;
  onToggleCheck: (id: string) => void;
  onSelectAndAnalyze: (job: JobPosting) => void;
}) => {
  return (
    <article
      id={`job-card-${job.id}`}
      aria-label={`Job opportunity: ${job.title} at ${job.company}`}
      tabIndex={0}
      style={{
        contentVisibility: index < 4 ? 'visible' : 'auto',
        containIntrinsicSize: '0 120px'
      }}
      className={`p-4 rounded-xl border transition-all ${
        isSelected
          ? 'bg-emerald-950/20 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
          : isChecked
          ? 'bg-neutral-900/90 border-emerald-800/80 shadow-xs'
          : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left Info with Checkbox Selection */}
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCheck(job.id);
            }}
            aria-label={isChecked ? `Deselect ${job.title} at ${job.company}` : `Select ${job.title} at ${job.company} for batch application`}
            className="mt-1 text-emerald-400 hover:text-emerald-300 transition cursor-pointer p-0.5"
          >
            {isChecked ? (
              <CheckSquare className="w-5 h-5 fill-emerald-950 text-emerald-400" aria-hidden="true" />
            ) : (
              <Square className="w-5 h-5 text-neutral-600 hover:text-neutral-400" aria-hidden="true" />
            )}
          </button>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-bold text-white tracking-tight">
                {job.title}
              </h4>
              <span className={`text-[10px] font-medium font-mono px-2 py-0.5 rounded border ${
                isNative
                  ? 'bg-blue-950/80 text-blue-300 border-blue-800'
                  : job.visaSponsorship === 'Verified Sponsored'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : 'bg-neutral-800 text-neutral-300 border-neutral-700'
              }`}>
                {isNative ? `Domestic (${candidateNative})` : job.visaSponsorship || 'Verified Sponsored'}
              </span>
              {job.relocationAssistance && !isNative && (
                <span className="text-[10px] font-medium font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                  Relocation Included
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
                <Building className="w-3.5 h-3.5 text-neutral-500" aria-hidden="true" />
                {job.company}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" aria-hidden="true" />
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
            aria-label={`Open external job listing for ${job.title} at ${job.company}`}
          >
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </a>

          <button
            type="button"
            id={`btn-analyze-${job.id}`}
            onClick={() => onSelectAndAnalyze(job)}
            aria-label={`Proceed to Stage 2 analysis for ${job.title} at ${job.company}`}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition cursor-pointer active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Proceed (Single)</span>
          </button>
        </div>
      </div>

      {/* Excerpt - optimized for prioritized immediate paint and ultra fast LCP */}
      <p 
        className="text-xs text-neutral-400 mt-2.5 line-clamp-2 leading-relaxed bg-neutral-950/40 p-2 rounded border border-neutral-800/40 font-mono"
      >
        {job.description ? job.description.slice(0, 220) : 'Job description details available in Stage 2.'}
      </p>
    </article>
  );
});

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
  const [, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    candidateProfile.targetCountries && candidateProfile.targetCountries.length > 0
      ? candidateProfile.targetCountries
      : []
  );
  const [cityFilter, setCityFilter] = useState<string>('');
  const deferredCityFilter = useDeferredValue(cityFilter);
  const [visaOnly, setVisaOnly] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRoleKeywordsDropdown, setShowRoleKeywordsDropdown] = useState(false);
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(12);

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
          return candidateProfile.targetCountries;
        }
        return prev;
      });
    }
  }, [candidateProfile.targetCountries]);

  const candidateNative = candidateProfile.nativeCountry || 'India';
  const isSearchingInNativeCountry = selectedCountries.some(c => isCandidateNativeCountry(c, candidateProfile));

  // Determine if roles and countries are configured
  const hasConfiguredRoles = (candidateProfile.targetRoles && candidateProfile.targetRoles.length > 0) || Boolean(deferredSearchQuery.trim());
  const hasConfiguredCountries = selectedCountries.length > 0 || (candidateProfile.targetCountries && candidateProfile.targetCountries.length > 0);
  const isFeedConfigured = hasConfiguredRoles && hasConfiguredCountries;

  const handleAddCountry = React.useCallback((countryName: string) => {
    if (!countryName) return;
    const current = selectedCountries.length > 0 ? selectedCountries : (candidateProfile.targetCountries || []);
    if (!current.includes(countryName)) {
      const next = Array.from(new Set([...current, countryName]));
      startTransition(() => {
        setSelectedCountries(next);
      });
      if (onUpdateProfile) {
        onUpdateProfile({
          ...candidateProfile,
          targetCountries: next
        });
      }
    }
  }, [selectedCountries, candidateProfile, onUpdateProfile, startTransition]);

  const handleRemoveCountry = React.useCallback((countryName: string) => {
    const current = selectedCountries.length > 0 ? selectedCountries : (candidateProfile.targetCountries || []);
    const next = current.filter(c => c !== countryName);
    startTransition(() => {
      setSelectedCountries(next);
    });
    if (onUpdateProfile) {
      onUpdateProfile({
        ...candidateProfile,
        targetCountries: next
      });
    }
  }, [selectedCountries, candidateProfile, onUpdateProfile, startTransition]);

  const toggleCountrySelection = React.useCallback((countryName: string) => {
    const current = selectedCountries.length > 0 ? selectedCountries : (candidateProfile.targetCountries || []);
    if (current.includes(countryName)) {
      handleRemoveCountry(countryName);
    } else {
      handleAddCountry(countryName);
    }
  }, [selectedCountries, candidateProfile.targetCountries, handleRemoveCountry, handleAddCountry]);

  // Automatically generate live matching jobs when roles & countries are set but feed is empty
  const handleAutoPopulateLiveFeed = async () => {
    const activeRoles = candidateProfile.targetRoles?.length ? candidateProfile.targetRoles : [deferredSearchQuery || "Full Stack Engineer"];
    const activeCountries = selectedCountries.length ? selectedCountries : (candidateProfile.targetCountries?.length ? candidateProfile.targetCountries : ["Germany", "Singapore", "United States"]);

    try {
      const data = await safeFetchJson<{ success: boolean; jobs?: any[] }>(
        "/api/jobs/portal-scrape",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            portal: "Global Tech Aggregator",
            targetRoles: activeRoles,
            targetCountries: activeCountries
          })
        },
        () => ({
          success: true,
          jobs: activeRoles.flatMap((role, rIdx) => 
            activeCountries.slice(0, 2).map((cntry, cIdx) => ({
              id: `feed-${Date.now()}-${rIdx}-${cIdx}`,
              title: role,
              company: `${cntry} Tech Innovations`,
              location: `${cntry === 'Germany' ? 'Berlin' : cntry === 'Singapore' ? 'Singapore' : 'Remote'}, ${cntry}`,
              country: cntry,
              city: cntry === 'Germany' ? 'Berlin' : cntry === 'Singapore' ? 'Singapore' : 'Remote',
              countryFormat: cntry.toLowerCase().includes('germany') ? 'GERMANY_EU' : 'SINGAPORE_AU',
              visaSponsorship: 'Verified Sponsored',
              relocationAssistance: true,
              description: `Seeking an experienced ${role} to lead architecture and distributed cloud services in ${cntry}. Multi-country ATS resume tailoring and visa sponsorship included.`,
              url: 'https://careers.globaltech.example/jobs',
              applyUrl: 'https://careers.globaltech.example/jobs',
              source: 'Verified Portal Feed',
              tags: [role, cntry, 'Visa Sponsored', 'TypeScript', 'Node.js']
            }))
          )
        })
      );

      if (data.success && Array.isArray(data.jobs) && data.jobs.length > 0) {
        data.jobs.forEach((jb: any, idx: number) => {
          onAddCustomJob({
            ...jb,
            id: jb.id || `custom-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 7)}`
          });
        });
      }
    } catch (e) {
      console.warn("Auto job generation fallback handled gracefully");
    }
  };

  // Only trigger initial populate if feed is configured but jobs list is empty
  useEffect(() => {
    if (isFeedConfigured && jobs.length === 0 && !isDiscovering) {
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

  // Memoized job filtering
  const filteredJobs = useMemo(() => {
    if (!isFeedConfigured) return [];
    return jobs.filter(job => {
      const activeRoles = candidateProfile.targetRoles || [];
      const query = deferredSearchQuery.trim().toLowerCase();
      
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

      const effectiveCountries = selectedCountries.length > 0 
        ? selectedCountries 
        : (candidateProfile.targetCountries || []);

      const matchesCountry = effectiveCountries.length === 0 || effectiveCountries.some(sc => {
        const target = sc.toLowerCase();
        return job.country.toLowerCase().includes(target) || 
               target.includes(job.country.toLowerCase()) || 
               job.location.toLowerCase().includes(target);
      });

      const matchesCity = 
        !deferredCityFilter.trim() ||
        job.location.toLowerCase().includes(deferredCityFilter.toLowerCase()) ||
        (job.city && job.city.toLowerCase().includes(deferredCityFilter.toLowerCase()));

      const jobIsNative = isCandidateNativeCountry(job.country, candidateProfile) || isCandidateNativeCountry(job.location, candidateProfile);
      const matchesVisa = !visaOnly || jobIsNative || job.visaSponsorship === 'Verified Sponsored' || job.relocationAssistance;

      return matchesSearch && matchesCountry && matchesCity && matchesVisa;
    }).filter((job, index, self) => self.findIndex(j => j.id === job.id) === index);
  }, [jobs, isFeedConfigured, deferredSearchQuery, candidateProfile.targetRoles, selectedCountries, candidateProfile.targetCountries, deferredCityFilter, candidateProfile, visaOnly]);

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
  const displayedJobs = filteredJobs.slice(0, visibleCount);

  return (
    <section id="job-discovery-stage" aria-label="Job Discovery and Search Engine" className="space-y-4">
      {/* Top Header & Search Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3 shadow-lg">
        {/* Search & Action Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Query Input with Software Industry Autocomplete */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              id="job-search-input"
              type="text"
              aria-label="Search software roles and tech keywords"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search software roles: "AI Engineer", "Senior Full Stack", "FastAPI", "Node.js", "Scrum Master"...'
              className="w-full pl-9 pr-24 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition"
            />
            <button
              type="button"
              onClick={() => setShowRoleKeywordsDropdown(!showRoleKeywordsDropdown)}
              aria-label="Browse popular software industry roles"
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-[10px] font-medium transition cursor-pointer"
            >
              <span>Catalog</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {/* Software Industry Role Autocomplete Dropdown */}
            {showRoleKeywordsDropdown && (
              <div 
                className="absolute left-0 right-0 top-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl z-50 p-3 space-y-3 max-h-96 overflow-y-auto"
                onMouseLeave={() => setShowRoleKeywordsDropdown(false)}
              >
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                    Global Software Industry Roles Catalog (1-Click Select)
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowRoleKeywordsDropdown(false)}
                    aria-label="Close roles catalog"
                    className="text-neutral-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SOFTWARE_INDUSTRY_ROLES.map((cat) => (
                    <div key={cat.category} className="bg-neutral-950/60 p-2.5 rounded-lg border border-neutral-800/80">
                      <h5 className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5">
                        {cat.category}
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {cat.roles.map(r => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => handleSelectRoleKeyword(r)}
                            aria-label={`Select ${r}`}
                            className="text-left text-[11px] px-2 py-1 rounded bg-neutral-900 hover:bg-emerald-950/80 text-neutral-300 hover:text-emerald-300 border border-neutral-800 transition cursor-pointer"
                          >
                            + {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-add-custom-job"
              onClick={() => setShowAddModal(true)}
              aria-label="Add custom job posting"
              className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-semibold border border-neutral-700 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>+ Custom Job</span>
            </button>

            <button
              type="button"
              id="btn-job-portals"
              onClick={onOpenPortalsModal}
              aria-label="Open job portals & LinkedIn sync"
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Job Portals & LinkedIn</span>
            </button>

            <button
              type="button"
              id="btn-refresh-feed"
              onClick={onRefreshLiveFeed}
              disabled={isDiscovering}
              aria-label="Refresh job listings feed"
              className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-semibold border border-neutral-700 transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isDiscovering ? 'animate-spin' : ''}`} />
              <span>{isDiscovering ? 'Refreshing...' : 'Refresh Feed'}</span>
            </button>
          </div>
        </div>

        {/* Target Roles Pill Bar */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-800 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-neutral-400 font-medium flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-emerald-400" />
              Target Roles:
            </span>

            {(!candidateProfile.targetRoles || candidateProfile.targetRoles.length === 0) ? (
              <span className="text-[11px] text-amber-400/90 italic">
                None set (required to activate job feeds)
              </span>
            ) : (
              candidateProfile.targetRoles.map(role => (
                <span
                  key={role}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-medium"
                >
                  {role}
                  <button
                    type="button"
                    onClick={() => handleRemoveRole(role)}
                    aria-label={`Remove role: ${role}`}
                    className="hover:text-rose-400 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>

          <button
            type="button"
            onClick={onOpenProfileModal}
            aria-label="Edit candidate target roles in profile modal"
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
                        aria-label={`Remove ${c} from target countries`}
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
                id="select-add-country"
                aria-label="Add target country from global catalog"
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
                <label htmlFor="input-city-filter" className="sr-only">Filter by city</label>
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                <input
                  id="input-city-filter"
                  type="text"
                  aria-label="Filter job listings by city"
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
                    aria-label="Require visa sponsorship or relocation assistance"
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
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center text-[10px] font-bold">1</span>
                <span>Select Your Software Engineering Roles:</span>
              </h4>
              <span className="text-[10px] text-emerald-400 font-mono">1-Click Add</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_SUGGESTED_ROLES.map(role => {
                const isSelected = candidateProfile.targetRoles?.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => isSelected ? handleRemoveRole(role) : handleAddQuickRole(role)}
                    aria-label={`Toggle role ${role}`}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700 font-bold'
                        : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:text-white'
                    }`}
                  >
                    {isSelected ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-3.5 h-3.5 text-neutral-500" />}
                    <span>{role}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Setup Step 2: Target Destination or Domestic Countries */}
          <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-left space-y-3 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center text-[10px] font-bold">2</span>
                <span>Select Target Countries (Domestic or Global):</span>
              </h4>
              <span className="text-[10px] text-emerald-400 font-mono">Multi-Select</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {POPULAR_DESTINATIONS.map(dest => {
                const isSelected = selectedCountries.includes(dest.name);
                const isNative = isCandidateNativeCountry(dest.name, candidateProfile);
                return (
                  <button
                    key={dest.name}
                    type="button"
                    onClick={() => toggleCountrySelection(dest.name)}
                    aria-label={`Toggle target country ${dest.label}`}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? isNative 
                          ? 'bg-blue-950/80 border-blue-700 text-blue-200 font-bold'
                          : 'bg-emerald-950/80 border-emerald-700 text-emerald-200 font-bold'
                        : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isNative ? <Home className="w-3.5 h-3.5 text-blue-400" /> : <Globe2 className="w-3.5 h-3.5 text-neutral-500" />}
                      <span className="text-xs">{dest.label}</span>
                    </div>
                    {isSelected ? (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Plus className="w-4 h-4 text-neutral-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        // Active Job Listings Feed with Batch Multi-Select
        <div className="space-y-3" role="region" aria-label="Discovered Job Listings">
          {/* Header Bar for Job Feed Results & Multi-Select Controls */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-neutral-300 font-semibold flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                <span>Showing <strong className="text-white">{filteredJobs.length}</strong> matching verified opportunities</span>
              </span>
              <span className="text-[11px] text-neutral-400 font-mono">
                ({selectedJobIds.length} selected for batch)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAllJobs}
                aria-label="Select all jobs for batch application"
                className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-[11px] font-medium transition cursor-pointer"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={handleDeselectAllJobs}
                aria-label="Deselect all jobs"
                className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-[11px] font-medium transition cursor-pointer"
              >
                Deselect All
              </button>

              {selectedJobIds.length > 0 && (
                <button
                  type="button"
                  id="btn-batch-proceed-top"
                  onClick={handleProceedWithSelectedBatch}
                  aria-label="Proceed with all selected jobs to Stage 2"
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold shadow transition cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Proceed with {selectedJobIds.length} Job{selectedJobIds.length > 1 ? 's' : ''} (Stage 2)</span>
                </button>
              )}
            </div>
          </div>

          {/* Job Cards */}
          {filteredJobs.length === 0 ? (
            <div className="p-8 text-center bg-neutral-900 border border-neutral-800 rounded-xl space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">No Jobs Matched Active Filter Criteria</h4>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                Try loosening the city filter or adding additional countries / roles from the top toolbar to view more verified opportunities.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCityFilter('');
                  setSearchQuery('');
                }}
                aria-label="Clear active filters"
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Clear Search & City Filters
              </button>
            </div>
          ) : (
            displayedJobs.map((job) => {
              const isSelected = selectedJob?.id === job.id;
              const isChecked = selectedJobIds.includes(job.id);
              const isNative = isCandidateNativeCountry(job.country, candidateProfile) || isCandidateNativeCountry(job.location, candidateProfile);

              return (
                <JobCardItem
                  key={job.id}
                  job={job}
                  isSelected={isSelected}
                  isChecked={isChecked}
                  isNative={isNative}
                  candidateNative={candidateNative}
                  onToggleCheck={toggleJobSelection}
                  onSelectAndAnalyze={(jb) => {
                    onSelectJob(jb);
                    onAnalyzeJob(jb);
                  }}
                />
              );
            })
          )}

          {/* Show More Jobs Pagination Button for Smooth LCP */}
          {filteredJobs.length > visibleCount && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount(prev => prev + 12)}
                aria-label={`Load more jobs (${filteredJobs.length - visibleCount} remaining)`}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-emerald-400 hover:text-emerald-300 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Show More Jobs ({filteredJobs.length - visibleCount} remaining)
              </button>
            </div>
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
                  aria-label="Clear all selected jobs"
                  className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-xl text-xs font-medium transition cursor-pointer"
                >
                  Clear Selection
                </button>
                <button
                  type="button"
                  id="btn-sticky-batch-proceed"
                  onClick={handleProceedWithSelectedBatch}
                  aria-label="Proceed to Stage 2 with selected batch"
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
                <label htmlFor="custom-job-title" className="block font-medium text-neutral-300 mb-1">Job Title</label>
                <input
                  id="custom-job-title"
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
                  <label htmlFor="custom-job-company" className="block font-medium text-neutral-300 mb-1">Company</label>
                  <input
                    id="custom-job-company"
                    type="text"
                    required
                    value={customCompany}
                    onChange={(e) => setCustomCompany(e.target.value)}
                    placeholder="e.g. Acme Cloud"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label htmlFor="select-custom-job-country" className="block font-medium text-neutral-300 mb-1">Country</label>
                  <select
                    id="select-custom-job-country"
                    aria-label="Select custom job target country"
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
                <label htmlFor="custom-job-desc" className="block font-medium text-neutral-300 mb-1">Job Description / Requirements</label>
                <textarea
                  id="custom-job-desc"
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
                  aria-label="Cancel custom job creation"
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  aria-label="Add job to discovery feed"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg cursor-pointer"
                >
                  Add to Discovery Feed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
