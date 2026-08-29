import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Cpu, 
  User, 
  Play, 
  History, 
  CheckCircle2, 
  ShieldCheck, 
  DollarSign,
  Layers,
  Globe,
  UserCheck,
  TrendingUp,
  Clock,
  Award,
  Share2,
  Lock,
  LogIn,
  Zap,
  ChevronDown
} from 'lucide-react';
import { PipelineStats, CandidateProfile, AuthUser } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  activeTab: 'pipeline' | 'architecture' | 'history' | 'self-healing';
  setActiveTab: (tab: 'pipeline' | 'architecture' | 'history' | 'self-healing') => void;
  onOpenProfile: () => void;
  onOpenPortals: () => void;
  onOpenTracker: () => void;
  onOpenNotifications: () => void;
  onOpenSalaryEstimator: () => void;
  onOpenSocialShare: () => void;
  onOpenAuthModal: () => void;
  onOpenAutoPilot: () => void;
  onRunAutoPipeline: () => void;
  isProcessing: boolean;
  stats: PipelineStats;
  candidateProfile: CandidateProfile;
  authUser: AuthUser | null;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenProfile,
  onOpenPortals,
  onOpenTracker,
  onOpenNotifications,
  onOpenSalaryEstimator,
  onOpenSocialShare,
  onOpenAuthModal,
  onOpenAutoPilot,
  onRunAutoPipeline,
  isProcessing,
  stats,
  candidateProfile,
  authUser
}) => {
  const { language, setLanguage, t, currentLanguageOption, allLanguages } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);

  return (
    <header id="main-header" className="bg-neutral-900 border-b border-neutral-800 text-neutral-100 sticky top-0 z-40">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Branding & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-950/40 text-white font-bold">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                AutoApply HITL Engine
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <DollarSign className="w-3 h-3 -mr-1" />
                100% Free Forever
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              {t('app_subtitle')}
            </p>
          </div>
        </div>

        {/* Center: Live Stats Pill */}
        <div className="hidden xl:flex items-center gap-3.5 text-xs bg-neutral-950/80 px-3.5 py-1.5 rounded-lg border border-neutral-800">
          <div className="flex items-center gap-1.5 text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Jobs: <strong className="text-white">{stats.jobsScanned}</strong></span>
          </div>
          <div className="h-3 w-px bg-neutral-800"></div>
          <div className="text-neutral-300">
            Resumes: <strong className="text-white">{stats.resumesGenerated}</strong>
          </div>
          <div className="h-3 w-px bg-neutral-800"></div>
          <div className="text-neutral-300">
            Pending HITL: <strong className="text-amber-400">{stats.pendingApproval}</strong>
          </div>
          <div className="h-3 w-px bg-neutral-800"></div>
          <div className="text-neutral-300">
            Applied: <strong className="text-emerald-400">{stats.appliedCount}</strong>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Autonomous 1-Click Auto-Pilot Button */}
          <button
            type="button"
            onClick={onOpenAutoPilot}
            aria-label="Open 1-Click Autonomous Auto-Pilot daily automation settings"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-950/40 border border-emerald-400/40 transition cursor-pointer"
            title="1-Click Zero-Human-Interaction Daily Auto-Pilot"
          >
            <Zap className="w-3.5 h-3.5 fill-white animate-pulse" aria-hidden="true" />
            <span>{t('autopilot_title')}</span>
          </button>

          <button
            type="button"
            id="btn-run-pipeline"
            onClick={onRunAutoPipeline}
            disabled={isProcessing}
            aria-label={isProcessing ? "Running pipeline automation..." : "Run pipeline automation across discovered jobs"}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all shadow cursor-pointer ${
              isProcessing
                ? 'bg-neutral-800 text-neutral-400 cursor-not-allowed'
                : 'bg-emerald-700 hover:bg-emerald-600 text-white shadow-emerald-950/30'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} aria-hidden="true" />
            <span>{isProcessing ? 'Running Automation...' : 'Run Automation'}</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              id="btn-language-menu"
              aria-label="Select system display language"
              aria-expanded={showLangMenu}
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition cursor-pointer"
              title="Change System Language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <span>{currentLanguageOption.flag}</span>
              <span className="hidden md:inline font-mono">{currentLanguageOption.code.toUpperCase()}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" aria-hidden="true" />
            </button>

            {showLangMenu && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl z-50 py-1 max-h-80 overflow-y-auto"
                onMouseLeave={() => setShowLangMenu(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-800">
                  {t('language')} (Auto-Detected)
                </div>
                {allLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    aria-label={`Switch language to ${lang.name}`}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-neutral-800 transition cursor-pointer ${
                      language === lang.code ? 'text-emerald-400 bg-emerald-950/30 font-bold' : 'text-neutral-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.nativeName} ({lang.name})</span>
                    </span>
                    {language === lang.code && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            id="btn-open-tracker"
            onClick={onOpenTracker}
            aria-label="Open application success funnel and badges tracker"
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-emerald-300 border border-neutral-700 transition cursor-pointer"
            title="Success Rate & Badges Tracker"
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <span className="hidden sm:inline">Progress</span>
          </button>

          <button
            type="button"
            id="btn-open-notifications"
            onClick={onOpenNotifications}
            aria-label="Open 4-hour scheduled notification pulse settings"
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-neutral-700 transition cursor-pointer"
            title="4-Hour Scheduled Telegram Notification Summary"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span className="hidden sm:inline">4h Pulse</span>
          </button>

          <button
            type="button"
            id="btn-open-salary"
            onClick={onOpenSalaryEstimator}
            aria-label="Open global market salary range estimator"
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-teal-300 border border-neutral-700 transition cursor-pointer"
            title="Market Salary Range Estimator"
          >
            <TrendingUp className="w-3.5 h-3.5 text-teal-400" aria-hidden="true" />
            <span className="hidden sm:inline">Salary</span>
          </button>

          <button
            type="button"
            id="btn-open-share"
            onClick={onOpenSocialShare}
            aria-label="Open social sharing and community referral modal"
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 transition cursor-pointer"
            title="Share & Earn Community Access"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {authUser ? (
            <button
              type="button"
              id="btn-open-profile"
              onClick={onOpenProfile}
              aria-label={`Open candidate profile for ${candidateProfile.firstName || authUser.name}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 transition cursor-pointer"
              title="Edit Profile"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <span>{candidateProfile.firstName || authUser.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              type="button"
              id="btn-open-auth-login"
              onClick={onOpenAuthModal}
              aria-label="Sign in or register candidate account"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-neutral-800 text-white border border-neutral-700 hover:bg-neutral-700 transition cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <span>{t('auth_login')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between border-t border-neutral-800/80 bg-neutral-950/40">
        <nav className="flex space-x-1 -mb-px" aria-label="Main Application Views" role="tablist">
          <button
            type="button"
            id="tab-pipeline"
            role="tab"
            aria-selected={activeTab === 'pipeline'}
            aria-controls="main-content-region"
            onClick={() => setActiveTab('pipeline')}
            aria-label="Switch to 7-Stage Pipeline View"
            className={`flex items-center gap-2 py-2.5 px-3.5 text-xs font-medium border-b-2 transition cursor-pointer ${
              activeTab === 'pipeline'
                ? 'border-emerald-500 text-emerald-400 bg-neutral-800/30 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" aria-hidden="true" />
            {t('tab_pipeline')}
          </button>

          <button
            type="button"
            id="tab-architecture"
            role="tab"
            aria-selected={activeTab === 'architecture'}
            aria-controls="main-content-region"
            onClick={() => setActiveTab('architecture')}
            aria-label="Switch to Open Source Architecture and Code Hub View"
            className={`flex items-center gap-2 py-2.5 px-3.5 text-xs font-medium border-b-2 transition cursor-pointer ${
              activeTab === 'architecture'
                ? 'border-emerald-500 text-emerald-400 bg-neutral-800/30 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" aria-hidden="true" />
            {t('tab_architecture')}
          </button>

          <button
            type="button"
            id="tab-history"
            role="tab"
            aria-selected={activeTab === 'history'}
            aria-controls="main-content-region"
            onClick={() => setActiveTab('history')}
            aria-label="Switch to Application Audit History View"
            className={`flex items-center gap-2 py-2.5 px-3.5 text-xs font-medium border-b-2 transition cursor-pointer ${
              activeTab === 'history'
                ? 'border-emerald-500 text-emerald-400 bg-neutral-800/30 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
            }`}
          >
            <History className="w-3.5 h-3.5" aria-hidden="true" />
            {t('tab_history')}
          </button>

          <button
            type="button"
            id="tab-self-healing"
            role="tab"
            aria-selected={activeTab === 'self-healing'}
            aria-controls="main-content-region"
            onClick={() => setActiveTab('self-healing')}
            aria-label="Switch to AI Self-Healing and Auto-Debugging Studio"
            className={`flex items-center gap-2 py-2.5 px-3.5 text-xs font-medium border-b-2 transition cursor-pointer ${
              activeTab === 'self-healing'
                ? 'border-teal-500 text-teal-400 bg-neutral-800/30 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" aria-hidden="true" />
            <span>AI Self-Healing SaaS</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-teal-950 text-teal-300 border border-teal-800 font-mono">3-Agent Pipeline</span>
          </button>
        </nav>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Strict Server-Side Isolation • 100% Free Forever</span>
        </div>
      </div>
    </header>
  );
};
