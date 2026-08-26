import React, { useState } from 'react';
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
  UserCheck
} from 'lucide-react';
import { JobPosting, CandidateProfile } from '../types';
import { ALL_WORLD_COUNTRIES, SOFTWARE_INDUSTRY_ROLES, ALL_FLATTENED_ROLES } from '../data/globalData';

interface JobDiscoveryViewProps {
  jobs: JobPosting[];
  selectedJob: JobPosting | null;
  onSelectJob: (job: JobPosting) => void;
  onAnalyzeJob: (job: JobPosting) => void;
  onRefreshLiveFeed: () => void;
  onAddCustomJob: (job: Partial<JobPosting>) => void;
  isDiscovering: boolean;
  candidateProfile: CandidateProfile;
  onOpenProfileModal?: () => void;
  onOpenPortalsModal?: () => void;
}

export const JobDiscoveryView: React.FC<JobDiscoveryViewProps> = ({
  jobs,
  selectedJob,
  onSelectJob,
  onAnalyzeJob,
  onRefreshLiveFeed,
  onAddCustomJob,
  isDiscovering,
  candidateProfile,
  onOpenProfileModal,
  onOpenPortalsModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    candidateProfile.targetCountries?.length ? candidateProfile.targetCountries : ['Germany', 'Singapore', 'Australia', 'United Kingdom', 'United States']
  );
  const [cityFilter, setCityFilter] = useState<string>('');
  const [selectedRoleCategory, setSelectedRoleCategory] = useState<string>('All');
  const [visaOnly, setVisaOnly] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRoleKeywordsDropdown, setShowRoleKeywordsDropdown] = useState(false);

  // New Custom Job form state
  const [customTitle, setCustomTitle] = useState('');
  const [customCompany, setCustomCompany] = useState('');
  const [customLocation, setCustomLocation] = useState('Berlin, Germany');
  const [customCountry, setCustomCountry] = useState('Germany');
  const [customCity, setCustomCity] = useState('Berlin');
  const [customDescription, setCustomDescription] = useState('');
  const [customUrl, setCustomUrl] = useState('https://careers.example.com/job/123');

  const toggleCountrySelection = (countryName: string) => {
    if (selectedCountries.includes(countryName)) {
      if (selectedCountries.length > 1) {
        setSelectedCountries(selectedCountries.filter(c => c !== countryName));
      }
    } else {
      setSelectedCountries([...selectedCountries, countryName]);
    }
  };

  const handleSelectRoleKeyword = (roleName: string) => {
    setSearchQuery(roleName);
    setShowRoleKeywordsDropdown(false);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      !searchQuery.trim() ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCountry = 
      selectedCountries.length === 0 ||
      selectedCountries.some(sc => job.country.toLowerCase().includes(sc.toLowerCase()) || job.location.toLowerCase().includes(sc.toLowerCase()));

    const matchesCity = 
      !cityFilter.trim() ||
      job.location.toLowerCase().includes(cityFilter.toLowerCase()) ||
      (job.city && job.city.toLowerCase().includes(cityFilter.toLowerCase()));

    const matchesVisa = !visaOnly || job.visaSponsorship === 'Verified Sponsored' || job.relocationAssistance;

    return matchesSearch && matchesCountry && matchesCity && matchesVisa;
  });

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
      visaSponsorship: 'Verified Sponsored',
      relocationAssistance: true,
      description: customDescription,
      url: customUrl,
      applyUrl: customUrl,
      source: 'RSS Feed',
      tags: ['Custom Verified Entry', 'Visa Sponsored', 'Software Engineering']
    });

    setShowAddModal(false);
    setCustomTitle('');
    setCustomCompany('');
    setCustomCity('');
    setCustomDescription('');
  };

  return (
    <div id="job-discovery-stage" className="space-y-4">
      {/* Top Query & Role Keyword Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Query Input with Software Industry Autocomplete */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search software roles: "AI Engineer", "FastAPI", "Node.js", "Scrum Master", "Cloud SRE"...'
              className="w-full pl-9 pr-24 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition"
            />
            <button
              type="button"
              onClick={() => setShowRoleKeywordsDropdown(!showRoleKeywordsDropdown)}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-[10px] font-medium border border-neutral-700 flex items-center gap-1 transition"
            >
              <span>Roles List</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onRefreshLiveFeed}
              disabled={isDiscovering}
              className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium border border-neutral-700 transition"
              title="Query free public job APIs (Arbeitnow, Remotive, JSearch)"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isDiscovering ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isDiscovering ? 'Scanning Feeds...' : 'Fetch Open Feeds'}</span>
            </button>

            {onOpenPortalsModal && (
              <button
                onClick={onOpenPortalsModal}
                className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium border border-neutral-700 transition"
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>Job Portals (Free)</span>
              </button>
            )}

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition"
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
                  Software Industry Role Catalog (Click to Auto-Filter)
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
                        className="text-[10px] px-2 py-0.5 rounded bg-neutral-950 hover:bg-emerald-950 hover:text-emerald-300 text-neutral-300 border border-neutral-800 transition text-left"
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

        {/* Stage 1: Global Target Market Multi-Country & City Selectors */}
        <div className="space-y-2 pt-2 border-t border-neutral-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
            {/* Multi-Country Picker */}
            <div className="flex items-center gap-2 flex-wrap flex-1">
              <span className="text-neutral-400 font-medium flex items-center gap-1">
                <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
                Target Countries:
              </span>

              {/* Selected Country Badges */}
              {selectedCountries.map(c => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-medium text-[11px]"
                >
                  {c}
                  <button
                    type="button"
                    onClick={() => toggleCountrySelection(c)}
                    className="hover:text-rose-400 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {/* Add Country from World Catalog */}
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    toggleCountrySelection(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="px-2.5 py-1 bg-neutral-950 border border-neutral-800 rounded-md text-[11px] text-neutral-300 outline-none focus:border-emerald-500"
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
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                <input
                  type="text"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  placeholder="Optional City (e.g. Berlin, London, Singapore)"
                  className="px-2.5 py-1 bg-neutral-950 border border-neutral-800 rounded-md text-[11px] text-white placeholder-neutral-500 outline-none focus:border-emerald-500 w-48"
                />
              </div>

              <label className="flex items-center gap-1.5 cursor-pointer select-none text-neutral-300 text-xs shrink-0">
                <input
                  type="checkbox"
                  checked={visaOnly}
                  onChange={(e) => setVisaOnly(e.target.checked)}
                  className="rounded bg-neutral-950 border-neutral-700 text-emerald-500 focus:ring-0 w-3.5 h-3.5"
                />
                <span className="text-emerald-400 font-medium">Visa Spons. / Relo</span>
              </label>
            </div>
          </div>
        </div>

        {/* Autonomous Daily Pipeline Scheduler Setup Card (One-Time Setup in Stage 1) */}
        <div className="pt-2 border-t border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs bg-neutral-950/60 p-3 rounded-lg border border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">Daily Pipeline Automation Active:</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Runs Daily @ 09:00 AM
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Configured once in Stage 1. Scans {selectedCountries.length} countries, parses matches with Gemini 3.7 Flash, and pushes HITL approvals to Telegram automatically.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-neutral-400 font-mono">Status: <strong>Autonomous Loop</strong></span>
          </div>
        </div>
      </div>

      {/* Discovered Jobs List */}
      <div className="grid grid-cols-1 gap-3">
        {filteredJobs.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center">
            <Briefcase className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-neutral-300">No jobs matched your selected countries ({selectedCountries.join(', ')}) or role query</p>
            <p className="text-xs text-neutral-500 mt-1">Try adding more target countries or clicking "Fetch Open Feeds" to discover live postings.</p>
          </div>
        ) : (
          filteredJobs.map(job => {
            const isSelected = selectedJob?.id === job.id;
            return (
              <div
                key={job.id}
                id={`job-card-${job.id}`}
                className={`bg-neutral-900 border rounded-xl p-4 transition-all ${
                  isSelected
                    ? 'border-emerald-500/80 ring-1 ring-emerald-500/30 bg-neutral-900/95 shadow-md'
                    : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  {/* Job Overview */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-white hover:text-emerald-300 transition">
                        {job.title}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                        {job.visaSponsorship}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                        {job.country} ({job.countryFormat})
                      </span>
                      {job.matchScore && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-800 text-amber-300 border border-neutral-700">
                          ⭐ {job.matchScore}% Match
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

                  {/* Right Action buttons */}
                  <div className="flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-neutral-800">
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-neutral-400 hover:text-neutral-200 bg-neutral-950 rounded-lg border border-neutral-800 transition"
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
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Proceed to Stage 2 (JD Match)</span>
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
      </div>

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
                  placeholder="e.g. Senior Full Stack Engineer / AI Specialist"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-300 mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={customCompany}
                    onChange={(e) => setCustomCompany(e.target.value)}
                    placeholder="e.g. Tech Corp"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-300 mb-1">Country</label>
                  <select
                    value={customCountry}
                    onChange={(e) => setCustomCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 outline-none"
                  >
                    {ALL_WORLD_COUNTRIES.map(c => (
                      <option key={c.code} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-300 mb-1">City (Optional)</label>
                <input
                  type="text"
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  placeholder="e.g. Berlin, Munich, London"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-300 mb-1">Job URL</label>
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://company.com/careers/job-123"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-300 mb-1">Job Description</label>
                <textarea
                  required
                  rows={4}
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Paste the full job requirements, tech stack, and responsibilities here..."
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow"
                >
                  Save & Ingest to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
