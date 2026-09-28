import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Github, 
  Linkedin, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Star, 
  GitFork, 
  Code, 
  Check, 
  X, 
  Send, 
  Eye, 
  Copy, 
  Sliders, 
  Globe, 
  ShieldCheck, 
  Database, 
  Zap, 
  ArrowUpRight,
  UserCheck,
  Palette,
  Terminal,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuthUser, CandidateProfile, UserPortfolio, PortfolioProject, PortfolioAgentReview } from '../types';

interface PortfolioAgentStudioProps {
  authUser: AuthUser | null;
  candidateProfile: CandidateProfile;
  onOpenAuthModal: () => void;
  onUpdateProfileLinks?: (githubUrl: string, linkedinUrl: string) => void;
}

export const PortfolioAgentStudio: React.FC<PortfolioAgentStudioProps> = ({
  authUser,
  candidateProfile,
  onOpenAuthModal,
  onUpdateProfileLinks,
}) => {
  // Links Input State
  const [githubUrl, setGithubUrl] = useState(
    authUser?.githubUrl || candidateProfile?.githubUrl || 'https://github.com/alokinfo30/AutoApply-HITL-Engine'
  );
  const [linkedinUrl, setLinkedinUrl] = useState(
    authUser?.linkedinUrl || candidateProfile?.linkedInUrl || 'https://www.linkedin.com/in/alok-kumar-tech'
  );
  const [linkedinRawText, setLinkedinRawText] = useState(candidateProfile?.summary || '');
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

  // Portfolio & Reviews State
  const [portfolio, setPortfolio] = useState<UserPortfolio | null>(null);
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<'modern' | 'minimal' | 'cyberpunk' | 'executive'>('modern');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [activeHITLFeedback, setActiveHITLFeedback] = useState<Record<number, string>>({});
  const [syncStatusNotice, setSyncStatusNotice] = useState<string | null>(null);

  // Load User Portfolio from Cloud SQL upon mount or user change
  useEffect(() => {
    if (authUser?.idToken) {
      loadUserPortfolio();
    }
  }, [authUser?.idToken]);

  const loadUserPortfolio = async () => {
    if (!authUser?.idToken) return;
    setIsLoadingPortfolio(true);
    try {
      const res = await fetch('/api/portfolio/me', {
        headers: {
          'Authorization': `Bearer ${authUser.idToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.portfolio) {
          // Parse stringified JSON fields if necessary
          const p = data.portfolio;
          const parsedFeaturedSkills = typeof p.featuredSkills === 'string' ? JSON.parse(p.featuredSkills) : (p.featuredSkills || []);
          const parsedSocialLinks = typeof p.socialLinks === 'string' ? JSON.parse(p.socialLinks) : p.socialLinks;
          const parsedProjects = (p.projects || []).map((proj: any) => ({
            ...proj,
            technologies: typeof proj.technologies === 'string' ? JSON.parse(proj.technologies) : (proj.technologies || []),
            highlightBullets: typeof proj.highlightBullets === 'string' ? JSON.parse(proj.highlightBullets) : (proj.highlightBullets || []),
          }));

          setPortfolio({
            ...p,
            featuredSkills: parsedFeaturedSkills,
            socialLinks: parsedSocialLinks,
            projects: parsedProjects,
            reviews: p.reviews || []
          });
          if (p.theme) setSelectedTheme(p.theme);
        }
        if (data.user) {
          if (data.user.githubUrl) setGithubUrl(data.user.githubUrl);
          if (data.user.linkedinUrl) setLinkedinUrl(data.user.linkedinUrl);
          if (data.user.autoSyncEnabled !== undefined) setAutoSyncEnabled(data.user.autoSyncEnabled);
        }
      }
    } catch (err) {
      console.warn('Failed to load portfolio from Cloud SQL:', err);
    } finally {
      setIsLoadingPortfolio(false);
    }
  };

  // Run Autonomous Portfolio Agent to Curate Standout Projects
  const handleGeneratePortfolio = async () => {
    if (!authUser?.idToken) {
      onOpenAuthModal();
      return;
    }

    setIsGenerating(true);
    setGenerationStep('Fetching public GitHub repositories...');

    try {
      setTimeout(() => setGenerationStep('LLM Agent analyzing LinkedIn career highlights & skills...'), 1200);
      setTimeout(() => setGenerationStep('Portfolio Agent autonomously curating top architectural projects...'), 2400);
      setTimeout(() => setGenerationStep('Persisting curated schema to Cloud SQL database...'), 3600);

      const res = await fetch('/api/portfolio/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authUser.idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          githubUrl,
          linkedinUrl,
          linkedinRawText,
          theme: selectedTheme,
          candidateProfile: {
            displayName: authUser.name,
            email: authUser.email,
            skills: candidateProfile.skills,
            experience: candidateProfile.experience,
            summary: candidateProfile.summary,
            currentLocation: candidateProfile.currentLocation
          }
        })
      });

      const data = await res.json();
      if (data.success && data.portfolio) {
        const p = data.portfolio;
        const parsedFeaturedSkills = typeof p.featuredSkills === 'string' ? JSON.parse(p.featuredSkills) : (p.featuredSkills || []);
        const parsedProjects = (p.projects || []).map((proj: any) => ({
          ...proj,
          technologies: typeof proj.technologies === 'string' ? JSON.parse(proj.technologies) : (proj.technologies || []),
          highlightBullets: typeof proj.highlightBullets === 'string' ? JSON.parse(proj.highlightBullets) : (proj.highlightBullets || []),
        }));

        setPortfolio({
          ...p,
          featuredSkills: parsedFeaturedSkills,
          projects: parsedProjects,
          reviews: p.reviews || []
        });

        confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
        setSyncStatusNotice('Portfolio curated and saved to Cloud SQL successfully!');
        if (onUpdateProfileLinks) {
          onUpdateProfileLinks(githubUrl, linkedinUrl);
        }
      } else {
        setSyncStatusNotice(data.error || 'Failed to generate portfolio');
      }
    } catch (err: any) {
      console.error('Error generating portfolio:', err);
      setSyncStatusNotice('An error occurred during portfolio generation');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
      setTimeout(() => setSyncStatusNotice(null), 5000);
    }
  };

  // Instant GitHub & LinkedIn Synchronize Engine
  const handleSyncNow = async () => {
    if (!authUser?.idToken) {
      onOpenAuthModal();
      return;
    }

    setIsSyncing(true);
    setSyncStatusNotice('Polling GitHub API & analyzing LinkedIn updates...');

    try {
      const res = await fetch('/api/portfolio/sync-now', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authUser.idToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      if (data.success) {
        if (data.portfolio) {
          const p = data.portfolio;
          const parsedFeaturedSkills = typeof p.featuredSkills === 'string' ? JSON.parse(p.featuredSkills) : (p.featuredSkills || []);
          const parsedProjects = (p.projects || []).map((proj: any) => ({
            ...proj,
            technologies: typeof proj.technologies === 'string' ? JSON.parse(proj.technologies) : (proj.technologies || []),
            highlightBullets: typeof proj.highlightBullets === 'string' ? JSON.parse(proj.highlightBullets) : (proj.highlightBullets || []),
          }));

          setPortfolio({
            ...p,
            featuredSkills: parsedFeaturedSkills,
            projects: parsedProjects,
            reviews: p.reviews || []
          });
        }
        setSyncStatusNotice(data.message || 'Synchronization complete.');
      } else {
        setSyncStatusNotice(data.error || 'Sync failed.');
      }
    } catch (err) {
      console.error('Error syncing:', err);
      setSyncStatusNotice('Failed to synchronize with GitHub/LinkedIn');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatusNotice(null), 6000);
    }
  };

  // Handle Human-in-the-Loop Proposal Feedback (Approve / Reject)
  const handleResolveReview = async (reviewId: number, action: 'approve' | 'reject') => {
    if (!authUser?.idToken) return;

    try {
      const feedback = activeHITLFeedback[reviewId] || '';
      const res = await fetch(`/api/portfolio/reviews/${reviewId}/resolve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authUser.idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action, feedback })
      });

      const data = await res.json();
      if (data.success && data.portfolio) {
        const p = data.portfolio;
        const parsedFeaturedSkills = typeof p.featuredSkills === 'string' ? JSON.parse(p.featuredSkills) : (p.featuredSkills || []);
        const parsedProjects = (p.projects || []).map((proj: any) => ({
          ...proj,
          technologies: typeof proj.technologies === 'string' ? JSON.parse(proj.technologies) : (proj.technologies || []),
          highlightBullets: typeof proj.highlightBullets === 'string' ? JSON.parse(proj.highlightBullets) : (proj.highlightBullets || []),
        }));

        setPortfolio({
          ...p,
          featuredSkills: parsedFeaturedSkills,
          projects: parsedProjects,
          reviews: p.reviews || []
        });

        if (action === 'approve') {
          confetti({ particleCount: 45, spread: 55, origin: { y: 0.6 } });
        }
        setSyncStatusNotice(data.message);
      }
    } catch (err) {
      console.error('Error resolving review:', err);
    }
  };

  // Change Portfolio Theme
  const handleThemeChange = async (theme: 'modern' | 'minimal' | 'cyberpunk' | 'executive') => {
    setSelectedTheme(theme);
    if (!authUser?.idToken || !portfolio) return;

    try {
      await fetch('/api/portfolio/update', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authUser.idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ theme })
      });
      setPortfolio(prev => prev ? { ...prev, theme } : null);
    } catch (e) {
      console.warn('Error updating theme:', e);
    }
  };

  // Copy Public Portfolio Link
  const handleCopyPublicLink = () => {
    const slug = portfolio?.slug || authUser?.name?.toLowerCase().replace(/\s+/g, '-') || 'developer';
    const link = `${window.location.origin}/portfolio/${slug}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Filter pending review proposals
  const pendingReviews = (portfolio?.reviews || []).filter(r => r.status === 'pending');

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* 1. Header Banner: Cloud SQL & Portfolio Agent Status */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-emerald-950/40 border border-neutral-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                Cloud SQL (PostgreSQL) Live
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/25">
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
                Portfolio Agent Active
              </span>
              {authUser ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-neutral-800 text-neutral-300 border border-neutral-700">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Logged In: {authUser.name}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/25">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  Sign-In required to persist
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              Automated Portfolio Generator
            </h2>
            <p className="text-sm text-neutral-300 mt-1 max-w-3xl">
              The autonomous <strong className="text-white">Portfolio Agent</strong> ingests your GitHub repositories, parses LinkedIn accomplishments via LLM agents, curates your best work with quantified XYZ metrics, and keeps your live portfolio 100% synchronized with Human-in-the-Loop review.
            </p>
          </div>

          {/* Action Button Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {authUser ? (
              <>
                <button
                  onClick={handleSyncNow}
                  disabled={isSyncing || isGenerating}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 hover:border-neutral-600 transition flex items-center gap-2 shadow-sm disabled:opacity-50"
                  title="Check GitHub and LinkedIn for new updates"
                >
                  <RefreshCw className={`w-4 h-4 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Syncing...' : 'Sync Now'}
                </button>
                <button
                  onClick={() => setShowLivePreview(true)}
                  disabled={!portfolio}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition flex items-center gap-2 disabled:opacity-40"
                >
                  <Eye className="w-4 h-4 text-emerald-400" />
                  Preview Live
                </button>
                <button
                  onClick={handleCopyPublicLink}
                  disabled={!portfolio}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-2 shadow-lg shadow-emerald-950/40 disabled:opacity-40"
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedLink ? 'Link Copied!' : 'Copy Share Link'}
                </button>
              </>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-neutral-950 hover:brightness-110 transition flex items-center gap-2 shadow-lg shadow-emerald-900/40"
              >
                <ShieldCheck className="w-4 h-4" />
                Sign In with Google to Connect Cloud SQL
              </button>
            )}
          </div>
        </div>

        {/* Sync Notice Alert */}
        {syncStatusNotice && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncStatusNotice}</span>
          </div>
        )}
      </div>

      {/* 2. Synchronized Links & LLM Ingestion Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Input URLs & Auto-Sync Toggle */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-md space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-emerald-400">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Connected Platforms & Ingestion</h3>
                <p className="text-xs text-neutral-400">GitHub repositories fetched automatically; LinkedIn parsed via LLM</p>
              </div>
            </div>
            
            {/* Auto-Sync Toggle Switch */}
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-neutral-300">
              <span className="hidden sm:inline">Auto-Reflect Changes:</span>
              <div 
                onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${
                  autoSyncEnabled ? 'bg-emerald-500' : 'bg-neutral-800 border border-neutral-700'
                }`}
              >
                <div 
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                    autoSyncEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
              <span className="text-[11px] font-bold text-emerald-400">
                {autoSyncEnabled ? 'ON (Live Auto)' : 'HITL Review'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* GitHub URL */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-neutral-400" />
                GitHub Profile / Repository URL
              </label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition"
              />
              <span className="text-[11px] text-neutral-500 mt-1 block">
                Public repos, stars, forks, and tech languages fetched automatically
              </span>
            </div>

            {/* LinkedIn URL */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                LinkedIn Profile URL
              </label>
              <input
                type="text"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://www.linkedin.com/in/username"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition"
              />
              <span className="text-[11px] text-neutral-500 mt-1 block">
                Parsed by LLM agent to extract leadership, metrics, and core skills
              </span>
            </div>
          </div>

          {/* Raw LinkedIn Text / Career Narrative Ingestion (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                LinkedIn Career Highlights & Bio (LLM Context)
              </span>
              <span className="text-[11px] text-neutral-500 font-normal">Optional deep context</span>
            </label>
            <textarea
              rows={3}
              value={linkedinRawText}
              onChange={(e) => setLinkedinRawText(e.target.value)}
              placeholder="Paste your LinkedIn 'About', summary, or key career achievements for high-precision LLM parsing..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition resize-none"
            />
          </div>

          {/* Trigger Curation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-xs text-neutral-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Real PostgreSQL persistence via Cloud SQL Auth Proxy</span>
            </div>
            <button
              onClick={handleGeneratePortfolio}
              disabled={isGenerating}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-neutral-950 hover:brightness-110 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 disabled:opacity-50"
            >
              <Bot className={`w-4 h-4 ${isGenerating ? 'animate-bounce' : ''}`} />
              {isGenerating ? generationStep || 'Portfolio Agent Curating...' : 'Run Portfolio Agent & Curate'}
            </button>
          </div>
        </div>

        {/* Right: Theme Selector & Stats Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Portfolio Design Theme</h3>
            </div>
            <p className="text-xs text-neutral-400 mb-4">
              Select the visual style curated for tech hiring managers and client presentations.
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'modern', name: 'Modern Glow', desc: 'Glassmorphism & Emerald accents', color: 'from-emerald-500 to-teal-600' },
                { id: 'cyberpunk', name: 'Cyberpunk', desc: 'High-contrast neon cyan & purple', color: 'from-cyan-500 to-purple-600' },
                { id: 'executive', name: 'Executive', desc: 'Minimal slate & corporate navy', color: 'from-blue-600 to-indigo-800' },
                { id: 'minimal', name: 'Minimal Mono', desc: 'Crisp typography & clean borders', color: 'from-neutral-200 to-neutral-400' }
              ].map(th => (
                <button
                  key={th.id}
                  onClick={() => handleThemeChange(th.id as any)}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    selectedTheme === th.id 
                      ? 'border-emerald-500 bg-emerald-500/10 shadow-sm' 
                      : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{th.name}</span>
                    <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${th.color}`} />
                  </div>
                  <span className="text-[10px] text-neutral-400 leading-tight">{th.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="bg-neutral-950 border border-neutral-800/80 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">Database Record:</span>
              <span className="font-semibold text-emerald-400">PostgreSQL (Drizzle ORM)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">Curated Projects:</span>
              <span className="font-semibold text-white">{portfolio?.projects?.length || 0} Standouts</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">Total Views:</span>
              <span className="font-semibold text-white">{portfolio?.viewsCount || 0} visits</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Human-in-the-Loop (HITL) Review Feed */}
      {pendingReviews.length > 0 && (
        <div className="bg-neutral-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Human-in-the-Loop Agent Suggestions ({pendingReviews.length} Pending)
                </h3>
                <p className="text-xs text-neutral-400">
                  The Portfolio Agent detected new GitHub code activity or metrics. Review and approve before updating your public portfolio.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 animate-pulse">
              Requires Approval
            </span>
          </div>

          <div className="space-y-3">
            {pendingReviews.map((review) => {
              let diffData: any = {};
              try { diffData = JSON.parse(review.diffPayload); } catch {}

              return (
                <div 
                  key={review.id} 
                  className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-300 border border-neutral-700">
                        {review.reviewType === 'sync_update' ? '🔄 Live Sync' : '✨ Curation'}
                      </span>
                      <h4 className="text-sm font-bold text-white">{review.title}</h4>
                    </div>
                    <p className="text-xs text-neutral-300">{review.changeSummary}</p>
                    
                    {diffData.proposedRepos && diffData.proposedRepos.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {diffData.proposedRepos.map((repo: any) => (
                          <span key={repo.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <Code className="w-3 h-3" />
                            {repo.name} ({repo.stars} ★)
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleResolveReview(review.id, 'approve')}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5 shadow"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve & Publish
                    </button>
                    <button
                      onClick={() => handleResolveReview(review.id, 'reject')}
                      className="px-3.5 py-2 rounded-xl text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition flex items-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      Dismiss
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Curated Showcase: The Portfolio Agent's Standouts */}
      {portfolio ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-8">
          {/* Portfolio Header Bar */}
          <div className="border-b border-neutral-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Published & Live
                </span>
                <span className="text-xs text-neutral-500">
                  Theme: <strong className="text-neutral-300 capitalize">{selectedTheme}</strong>
                </span>
              </div>
              <h3 className="text-2xl font-black text-white">{portfolio.headline || portfolio.title}</h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-2xl">{portfolio.bio || portfolio.curatedSummary}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLivePreview(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                Fullscreen View
              </button>
              <button
                onClick={handleCopyPublicLink}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition flex items-center gap-1.5"
              >
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                {copiedLink ? 'Copied!' : 'Share Portfolio'}
              </button>
            </div>
          </div>

          {/* Curated Standout Projects Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h4 className="text-base font-bold text-white">
                  Curated Standout Projects ({portfolio.projects?.length || 0})
                </h4>
              </div>
              <span className="text-xs text-neutral-500">
                Selected autonomously by Portfolio Agent
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {portfolio.projects?.map((proj, idx) => (
                <div 
                  key={proj.id || idx}
                  className="bg-neutral-950 border border-neutral-800 hover:border-neutral-700 rounded-xl p-5 transition flex flex-col justify-between space-y-4 group relative"
                >
                  <div>
                    {/* Top Row: Title, Stars, Links */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h5 className="text-base font-bold text-white group-hover:text-emerald-400 transition flex items-center gap-2">
                          {proj.title}
                          {proj.isFeatured && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Top Pick
                            </span>
                          )}
                        </h5>
                        <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                          {proj.description || 'Production software engineering repository'}
                        </p>
                      </div>

                      {/* GitHub / Demo Link */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {proj.starsCount > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-900 text-amber-400 border border-neutral-800">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {proj.starsCount}
                          </span>
                        )}
                        {proj.githubRepoUrl && (
                          <a
                            href={proj.githubRepoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
                            title="View on GitHub"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {proj.liveDemoUrl && (
                          <a
                            href={proj.liveDemoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
                            title="Live Demo"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Agent Curation Rationale Box */}
                    {proj.agentCurationReason && (
                      <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-lg p-2.5 my-3 text-[11px] text-emerald-300 flex items-start gap-2">
                        <Bot className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-semibold text-emerald-200">Agent Rationale:</strong> {proj.agentCurationReason}
                        </div>
                      </div>
                    )}

                    {/* Quantifiable XYZ Achievement Bullets */}
                    {proj.highlightBullets && proj.highlightBullets.length > 0 && (
                      <ul className="space-y-1.5 my-2">
                        {proj.highlightBullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="text-xs text-neutral-300 flex items-start gap-2">
                            <span className="text-emerald-400 mt-1">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Tech Stack Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-neutral-900">
                    {proj.primaryLanguage && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-200 border border-neutral-700">
                        {proj.primaryLanguage}
                      </span>
                    )}
                    {proj.technologies?.slice(0, 4).map((tech, tIdx) => (
                      <span 
                        key={tIdx} 
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-900 text-neutral-400 border border-neutral-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Skills Matrix */}
          {portfolio.featuredSkills && portfolio.featuredSkills.length > 0 && (
            <div className="border-t border-neutral-800 pt-6">
              <h4 className="text-sm font-bold text-neutral-300 mb-3 flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-400" />
                Verified Competencies & Stack (Curated from GitHub & LinkedIn)
              </h4>
              <div className="flex flex-wrap gap-2">
                {portfolio.featuredSkills.map((skill, sIdx) => (
                  <span 
                    key={sIdx}
                    className="px-3 py-1 rounded-xl text-xs font-medium bg-neutral-950 border border-neutral-800 text-neutral-200 shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center mx-auto text-emerald-400">
            <Bot className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-bold text-white">No Portfolio Generated Yet</h3>
            <p className="text-xs text-neutral-400 mt-1">
              Provide your GitHub profile and LinkedIn link above, then click <strong className="text-neutral-200">"Run Portfolio Agent & Curate"</strong> to ingest your repositories and generate your portfolio into Cloud SQL.
            </p>
          </div>
          <button
            onClick={handleGeneratePortfolio}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-500 text-neutral-950 hover:bg-emerald-400 transition inline-flex items-center gap-2 shadow-lg shadow-emerald-950/40"
          >
            <Sparkles className="w-4 h-4" />
            Curate My Portfolio Now
          </button>
        </div>
      )}

      {/* 5. Live Fullscreen Portfolio Preview Modal */}
      {showLivePreview && portfolio && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className={`w-full max-w-5xl rounded-3xl border p-6 sm:p-10 shadow-2xl relative max-h-[90vh] overflow-y-auto ${
            selectedTheme === 'cyberpunk'
              ? 'bg-neutral-950 border-cyan-500/40 text-neutral-100 selection:bg-cyan-500'
              : selectedTheme === 'executive'
              ? 'bg-slate-950 border-slate-700 text-slate-100 selection:bg-blue-600'
              : selectedTheme === 'minimal'
              ? 'bg-neutral-900 border-neutral-700 text-neutral-100'
              : 'bg-neutral-950 border-neutral-800 text-neutral-100 selection:bg-emerald-500'
          }`}>
            {/* Close Button */}
            <button
              onClick={() => setShowLivePreview(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Public Portfolio Header */}
            <div className="space-y-4 border-b border-neutral-800/80 pb-8">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                  {authUser?.name?.[0] || 'A'}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                    {authUser?.name || 'Senior Software Engineer'}
                  </h1>
                  <p className="text-sm sm:text-base font-medium text-emerald-400 mt-0.5">
                    {portfolio.headline || portfolio.title}
                  </p>
                </div>
              </div>

              <p className="text-sm text-neutral-300 max-w-3xl leading-relaxed">
                {portfolio.bio || portfolio.curatedSummary}
              </p>

              {/* Social Link Badges */}
              <div className="flex flex-wrap gap-3 pt-2">
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs text-neutral-200 border border-neutral-800 transition"
                  >
                    <Github className="w-3.5 h-3.5 text-neutral-300" />
                    GitHub
                  </a>
                )}
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs text-neutral-200 border border-neutral-800 transition"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                    LinkedIn Verified
                  </a>
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Cloud SQL Verified Credentials
                </span>
              </div>
            </div>

            {/* Standout Work */}
            <div className="py-8 space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Featured Engineering Projects
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {portfolio.projects?.map((proj, idx) => (
                  <div 
                    key={proj.id || idx}
                    className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-base font-bold text-white">{proj.title}</h3>
                        {proj.starsCount > 0 && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-950 text-amber-400 border border-neutral-800">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            {proj.starsCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        {proj.description}
                      </p>

                      {proj.highlightBullets && proj.highlightBullets.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {proj.highlightBullets.map((b, bIdx) => (
                            <div key={bIdx} className="text-xs text-neutral-300 flex items-start gap-2">
                              <span className="text-emerald-400">•</span>
                              <span>{b}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-neutral-800/80">
                      <div className="flex flex-wrap gap-1.5">
                        {proj.technologies?.slice(0, 3).map((tech, tIdx) => (
                          <span key={tIdx} className="px-2 py-0.5 rounded text-[10px] bg-neutral-950 text-neutral-400 border border-neutral-800">
                            {tech}
                          </span>
                        ))}
                      </div>
                      {proj.githubRepoUrl && (
                        <a
                          href={proj.githubRepoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                        >
                          Source Code <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Competencies */}
            {portfolio.featuredSkills && portfolio.featuredSkills.length > 0 && (
              <div className="border-t border-neutral-800/80 pt-6">
                <h3 className="text-sm font-bold text-white mb-3">Core Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {portfolio.featuredSkills.map((s, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl text-xs bg-neutral-900 border border-neutral-800 text-neutral-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
