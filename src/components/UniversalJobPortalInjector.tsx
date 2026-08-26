import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Smartphone, 
  Laptop, 
  Zap, 
  Check, 
  Copy, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  ArrowRight, 
  RefreshCw,
  Send,
  Layers,
  X,
  Radio,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  Play,
  Code2,
  Monitor
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { JobPosting, CandidateProfile, UniversalPortalScrapedJob } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface UniversalJobPortalInjectorProps {
  candidateProfile: CandidateProfile;
  onImportJob: (job: JobPosting) => void;
}

export const UniversalJobPortalInjector: React.FC<UniversalJobPortalInjectorProps> = ({
  candidateProfile,
  onImportJob
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'bookmarklet' | 'userscript' | 'simulator' | 'direct_import'>('bookmarklet');
  const [portalUrlInput, setPortalUrlInput] = useState('');
  const [portalRawTextInput, setPortalRawTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedBookmarklet, setCopiedBookmarklet] = useState(false);
  const [copiedUserscript, setCopiedUserscript] = useState(false);
  const [detectedToast, setDetectedToast] = useState<{ portal: string; title: string; url: string } | null>(null);

  // Simulated portal interactive tester state
  const [selectedSimulatedPortal, setSelectedSimulatedPortal] = useState<'linkedin' | 'greenhouse' | 'stepstone' | 'seek' | 'naukri'>('linkedin');
  
  const [scrapedHistory, setScrapedHistory] = useState<UniversalPortalScrapedJob[]>(() => {
    const saved = localStorage.getItem('autoapply_universal_scrapes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('autoapply_universal_scrapes', JSON.stringify(scrapedHistory));
  }, [scrapedHistory]);

  // Active Clipboard Listener for job portals when user focuses window
  useEffect(() => {
    const handleWindowFocus = async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.readText) {
          const text = await navigator.clipboard.readText();
          if (
            text && 
            (text.includes('linkedin.com/jobs') || 
             text.includes('indeed.com') || 
             text.includes('greenhouse.io') || 
             text.includes('lever.co') || 
             text.includes('wellfound.com') ||
             text.includes('myworkdayjobs.com') ||
             text.includes('stepstone.de') ||
             text.includes('seek.com.au') ||
             text.includes('naukri.com') ||
             text.includes('glassdoor.com'))
          ) {
            const portal = text.includes('linkedin') ? 'LinkedIn' :
                           text.includes('indeed') ? 'Indeed' :
                           text.includes('greenhouse') ? 'Greenhouse' :
                           text.includes('lever') ? 'Lever' : 
                           text.includes('stepstone') ? 'StepStone DE' :
                           text.includes('seek') ? 'SEEK AU' :
                           text.includes('naukri') ? 'Naukri' : 'World Job Portal';

            if (!scrapedHistory.some(s => s.url === text)) {
              setDetectedToast({
                portal,
                title: `Detected ${portal} Opportunity from Clipboard`,
                url: text
              });
            }
          }
        }
      } catch (err) {
        // Clipboard read permission might be restricted in some browsers
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    return () => window.removeEventListener('focus', handleWindowFocus);
  }, [scrapedHistory]);

  // Listen for PostMessage from external bookmarklet or extension
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'AUTOAPPLY_SCRAPED_JOB') {
        const jobData = event.data.payload;
        if (jobData && jobData.title) {
          handleProcessExtractedJob(jobData);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleProcessExtractedJob = async (extracted: any) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/universal-scraper/parse-portal-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: extracted.url || portalUrlInput,
          rawText: extracted.rawText || portalRawTextInput,
          sourcePortal: extracted.sourcePortal || extracted.portalName
        })
      });
      const data = await res.json();
      if (data.success && data.job) {
        onImportJob(data.job);
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });

        const historyItem: UniversalPortalScrapedJob = {
          id: `scrape-${Date.now()}`,
          portalName: data.portal || 'Global Portal',
          url: data.job.url || extracted.url || 'https://jobs.example.com',
          title: data.job.title,
          company: data.job.company,
          location: data.job.location,
          scrapedVia: extracted.scrapedVia || 'Bookmarklet 1-Click',
          timestamp: new Date().toISOString(),
          status: 'ready_to_apply'
        };

        setScrapedHistory(prev => [historyItem, ...prev]);
        setPortalUrlInput('');
        setPortalRawTextInput('');
        setDetectedToast(null);
        setIsOpen(false);
      }
    } catch (e) {
      console.error('Failed to parse universal portal job', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const bookmarkletCode = `javascript:(function(){
  var pageUrl = window.location.href;
  var title = document.querySelector('h1, .job-title, .topcard__title, [data-automation="job-detail-title"]')?.innerText || document.title;
  var company = document.querySelector('.job-details-jobs-unified-top-card__company-name, .topcard__org-name-link, [data-company-name="true"], [data-automation="advertiser-name"]')?.innerText || 'Company';
  var location = document.querySelector('.job-details-jobs-unified-top-card__bullet, .topcard__flavor--bullet, [data-automation="job-detail-location"]')?.innerText || 'Global';
  var targetAppUrl = window.location.origin.includes('localhost') ? window.location.origin : 'https://ais-dev-y2nxrz4cpr2ovginipzbvr-440468285390.asia-east1.run.app';
  
  var existing = document.getElementById('autoapply-injected-widget');
  if(existing) existing.remove();

  var btn = document.createElement('div');
  btn.id = 'autoapply-injected-widget';
  btn.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:999999999;background:linear-gradient(135deg,#059669,#0d9488);color:#ffffff;padding:14px 24px;border-radius:16px;box-shadow:0 12px 35px rgba(0,0,0,0.45);font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;font-weight:700;font-size:14px;cursor:pointer;display:flex;align-items:center;gap:10px;border:2px solid #34d399;transition:all 0.2s ease;';
  btn.innerHTML = '<svg style="width:20px;height:20px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg><span>⚡ 1-Click Auto-Apply (AutoApply HITL)</span>';
  
  btn.onmouseover = function(){ btn.style.transform = 'scale(1.05)'; };
  btn.onmouseout = function(){ btn.style.transform = 'scale(1)'; };
  btn.onclick = function(){
    var redirect = targetAppUrl + '/?importUrl=' + encodeURIComponent(pageUrl) + '&title=' + encodeURIComponent(title) + '&company=' + encodeURIComponent(company) + '&location=' + encodeURIComponent(location) + '&autoApply=true';
    window.open(redirect, '_blank');
  };
  document.body.appendChild(btn);
})();`;

  const userscriptCode = `// ==UserScript==
// @name         Universal 1-Click Auto-Apply Job Portal Hook
// @namespace    https://autoapply-hitl.ai
// @version      2.0.0
// @description  Automatically detects any world job portal and injects a 1-Click Auto-Apply button directing to Stage 1
// @author       AutoApply HITL Engine
// @match        *://*.linkedin.com/jobs/*
// @match        *://*.indeed.com/*
// @match        *://*.glassdoor.com/*
// @match        *://*.greenhouse.io/*
// @match        *://*.lever.co/*
// @match        *://*.myworkdayjobs.com/*
// @match        *://*.stepstone.de/*
// @match        *://*.seek.com.au/*
// @match        *://*.naukri.com/*
// @match        *://*.bayt.com/*
// @match        *://*.wellfound.com/*
// @match        *://*.ziprecruiter.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    function injectAutoApplyButton() {
        if (document.getElementById('autoapply-universal-button')) return;
        var btn = document.createElement('div');
        btn.id = 'autoapply-universal-button';
        btn.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:999999999;background:linear-gradient(135deg,#059669,#0d9488);color:#fff;padding:14px 22px;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,0.5);font-family:sans-serif;font-weight:bold;font-size:14px;cursor:pointer;display:flex;align-items:center;gap:8px;border:2px solid #34d399;';
        btn.innerHTML = '⚡ 1-Click Auto-Apply via AutoApply HITL';
        btn.onclick = function() {
            var url = window.location.href;
            var target = 'https://ais-dev-y2nxrz4cpr2ovginipzbvr-440468285390.asia-east1.run.app/?importUrl=' + encodeURIComponent(url) + '&autoApply=true';
            window.open(target, '_blank');
        };
        document.body.appendChild(btn);
    }
    window.addEventListener('load', injectAutoApplyButton);
    setInterval(injectAutoApplyButton, 2000);
})();`;

  const handleCopyBookmarklet = () => {
    navigator.clipboard.writeText(bookmarkletCode);
    setCopiedBookmarklet(true);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    setTimeout(() => setCopiedBookmarklet(false), 2000);
  };

  const handleCopyUserscript = () => {
    navigator.clipboard.writeText(userscriptCode);
    setCopiedUserscript(true);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    setTimeout(() => setCopiedUserscript(false), 2000);
  };

  const simulatedPortals = {
    linkedin: {
      name: 'LinkedIn Jobs',
      title: 'Senior Distributed Systems & AI Engineer',
      company: 'Datadog Europe',
      location: 'Munich, Germany (Hybrid / Visa Sponsored)',
      salary: '€115,000 - €140,000',
      description: 'We are seeking a Senior Systems Engineer with deep expertise in Python, FastAPI, and Kubernetes to lead our distributed telemetry ingestion pipeline. Full Visa Sponsorship and Relocation Package provided to Germany.',
      url: 'https://linkedin.com/jobs/view/9871234567'
    },
    greenhouse: {
      name: 'Greenhouse.io (Zalando)',
      title: 'Principal Cloud & Microservices Architect',
      company: 'Zalando SE',
      location: 'Berlin, Germany (EU Blue Card Eligible)',
      salary: '€130,000 - €155,000',
      description: 'Lead the architecture of our next-generation logistics microservices using TypeScript, Node.js, Go, and AWS. Direct relocation support provided.',
      url: 'https://boards.greenhouse.io/zalando/jobs/456789'
    },
    stepstone: {
      name: 'StepStone DE',
      title: 'Lead Full Stack Engineer (Python / React)',
      company: 'Siemens Energy',
      location: 'Frankfurt, Germany',
      salary: '€105,000 - €125,000',
      description: 'Development of real-time energy grid management systems. Python, FastAPI, React, Docker. English-speaking agile team with German work permit sponsorship.',
      url: 'https://www.stepstone.de/stellenangebote--Lead-Full-Stack-Engineer--12345'
    },
    seek: {
      name: 'SEEK Australia',
      title: 'Staff AI Solutions Engineer',
      company: 'Canva',
      location: 'Sydney, Australia (TSS 482 Visa Sponsor)',
      salary: 'A$185,000 - A$220,000',
      description: 'Drive generative AI integrations across Canva design suite. TypeScript, Python, LLM fine-tuning, AWS. Full sponsorship for candidate and dependents.',
      url: 'https://www.seek.com.au/job/78912345'
    },
    naukri: {
      name: 'Naukri Global',
      title: 'Senior Backend & ML Infrastructure Lead',
      company: 'Grab Singapore',
      location: 'Singapore (EP Visa Sponsorship)',
      salary: 'S$160,000 - S$195,000',
      description: 'Scale Grab ride-hailing core dispatch engine. High concurrency Go/Python microservices. Employment Pass (EP) visa processed directly by company.',
      url: 'https://www.naukri.com/job-listings-grab-singapore-ep-sponsor'
    }
  };

  const currentSim = simulatedPortals[selectedSimulatedPortal];

  return (
    <>
      {/* Floating Detection Toast when clipboard has a job link */}
      {detectedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 border border-emerald-500/60 rounded-2xl p-4 shadow-2xl max-w-sm w-full animate-bounce-short">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 font-bold">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{detectedToast.portal} Job Detected</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                    Multi-Device Active
                  </span>
                </div>
                <p className="text-[11px] text-neutral-300 truncate max-w-[200px]">
                  {detectedToast.url}
                </p>
              </div>
            </div>

            <button
              onClick={() => setDetectedToast(null)}
              className="text-neutral-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => handleProcessExtractedJob({ url: detectedToast.url, sourcePortal: detectedToast.portal, scrapedVia: 'Clipboard Listener' })}
              disabled={isProcessing}
              className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow transition cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Tailoring CV...' : '⚡ 1-Click Auto-Apply'}</span>
            </button>

            <button
              onClick={() => setDetectedToast(null)}
              className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Pill on Main App Layout */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 px-3.5 py-2 rounded-xl bg-neutral-900/95 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs font-semibold transition hover:scale-105 group cursor-pointer"
        title="Universal Cross-Site Job Portal Listener & Injector"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <Zap className="w-3.5 h-3.5 text-emerald-400" />
        <span>Universal 1-Click Portal Hook</span>
        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 group-hover:text-white">
          Active
        </span>
      </button>

      {/* Main Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-6">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-950/40">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">
                      Universal 1-Click Auto-Apply Portal Injector
                    </h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Worldwide Portals
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Auto-detects when you browse LinkedIn, Indeed, Greenhouse, Lever, StepStone, SEEK, Workday & loads details into Stage 1 in 1 click.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg bg-neutral-900 border border-neutral-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sub Nav Tabs */}
            <div className="flex border-b border-neutral-800 bg-neutral-950/60 px-5 gap-4 shrink-0 text-xs">
              <button
                onClick={() => setActiveTab('bookmarklet')}
                className={`py-3 font-semibold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'bookmarklet'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>1-Click Bookmarklet</span>
              </button>

              <button
                onClick={() => setActiveTab('userscript')}
                className={`py-3 font-semibold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'userscript'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Tampermonkey Auto-Script</span>
              </button>

              <button
                onClick={() => setActiveTab('simulator')}
                className={`py-3 font-semibold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'simulator'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Live Portal Tester & Sandbox</span>
              </button>

              <button
                onClick={() => setActiveTab('direct_import')}
                className={`py-3 font-semibold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'direct_import'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Paste Portal URL</span>
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              {activeTab === 'bookmarklet' && (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-emerald-950/60 to-neutral-950 rounded-2xl border border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white flex items-center gap-2 text-sm">
                          <Zap className="w-4 h-4 text-emerald-400" />
                          <span>Universal 1-Click Bookmarklet</span>
                        </h4>
                        <p className="text-neutral-300 text-xs mt-1 leading-relaxed">
                          Drag the green button below into your browser's Bookmarks Toolbar (Chrome, Safari, Firefox, Edge, Brave). Whenever you are on ANY job site in the world, simply click the bookmark to inject our floating 1-Click Auto-Apply button.
                        </p>
                      </div>

                      <button
                        onClick={handleCopyBookmarklet}
                        className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-neutral-700 transition cursor-pointer shrink-0"
                      >
                        {copiedBookmarklet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedBookmarklet ? 'Copied to Clipboard!' : 'Copy Code'}</span>
                      </button>
                    </div>

                    <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <a
                        href={bookmarkletCode}
                        onClick={(e) => {
                          e.preventDefault();
                          handleCopyBookmarklet();
                        }}
                        className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-950/50 inline-flex items-center gap-2 cursor-grab select-none"
                        title="Drag me to your Bookmarks Toolbar!"
                      >
                        <Zap className="w-4 h-4 fill-white" />
                        <span>⚡ [1-Click AutoApply HITL]</span>
                      </a>

                      <span className="text-[11px] text-neutral-400 font-mono text-center sm:text-right">
                        Drag this button to Bookmarks bar, or copy & save as bookmark URL.
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-neutral-300">
                    <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1">
                      <strong className="text-white block">Step 1: Save Bookmark</strong>
                      <p className="text-[11px] text-neutral-400">Add the bookmarklet to your browser bookmarks bar once.</p>
                    </div>
                    <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1">
                      <strong className="text-white block">Step 2: Browse Any Job</strong>
                      <p className="text-[11px] text-neutral-400">Open LinkedIn, Indeed, Greenhouse, Lever, StepStone, or SEEK.</p>
                    </div>
                    <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1">
                      <strong className="text-white block">Step 3: Click to Auto-Apply</strong>
                      <p className="text-[11px] text-neutral-400">Click bookmarklet, then click the injected button to land straight in Stage 1.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'userscript' && (
                <div className="space-y-4">
                  <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white text-sm flex items-center gap-2">
                          <Code2 className="w-4 h-4 text-teal-400" />
                          <span>Tampermonkey / Violentmonkey Auto-Inject Script</span>
                        </h4>
                        <p className="text-neutral-400 text-xs mt-0.5">
                          Runs automatically in the background without needing to click a bookmarklet. The 1-Click button appears on every job portal you visit automatically.
                        </p>
                      </div>

                      <button
                        onClick={handleCopyUserscript}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        {copiedUserscript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedUserscript ? 'Userscript Copied!' : 'Copy Userscript'}</span>
                      </button>
                    </div>

                    <pre className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 text-[11px] text-neutral-300 font-mono overflow-x-auto max-h-56">
                      {userscriptCode}
                    </pre>
                  </div>
                </div>
              )}

              {activeTab === 'simulator' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-200">
                      Select World Job Portal Simulation:
                    </span>
                    <div className="flex gap-1.5 flex-wrap">
                      {Object.keys(simulatedPortals).map((key) => (
                        <button
                          key={key}
                          onClick={() => setSelectedSimulatedPortal(key as any)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition cursor-pointer ${
                            selectedSimulatedPortal === key
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                              : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                          }`}
                        >
                          {simulatedPortals[key as keyof typeof simulatedPortals].name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Simulated Webpage Browser Frame */}
                  <div className="relative bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl">
                    {/* Browser Address Bar */}
                    <div className="bg-neutral-900 px-4 py-2 border-b border-neutral-800 flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                      </div>
                      <div className="flex-1 bg-neutral-950 px-3 py-1 rounded-lg text-[10px] text-neutral-400 font-mono truncate border border-neutral-800">
                        {currentSim.url}
                      </div>
                    </div>

                    {/* Simulated Job Page Content */}
                    <div className="p-5 space-y-3 bg-neutral-950/80 min-h-[220px]">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                            {currentSim.name} Verified Posting
                          </span>
                          <h3 className="text-base font-bold text-white mt-0.5">{currentSim.title}</h3>
                          <div className="text-xs text-neutral-400 mt-0.5">
                            <strong className="text-neutral-200">{currentSim.company}</strong> • {currentSim.location} • <span className="text-teal-300 font-semibold">{currentSim.salary}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-neutral-300 leading-relaxed border-t border-neutral-800/80 pt-3">
                        {currentSim.description}
                      </p>

                      {/* INJECTED 1-CLICK BUTTON OVERLAY */}
                      <div className="pt-4 flex justify-end">
                        <button
                          onClick={() => {
                            handleProcessExtractedJob({
                              url: currentSim.url,
                              rawText: `${currentSim.title}\n${currentSim.company}\n${currentSim.location}\n${currentSim.description}`,
                              sourcePortal: currentSim.name,
                              scrapedVia: 'Injected Portal Simulator'
                            });
                          }}
                          disabled={isProcessing}
                          className="py-3 px-5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl font-bold text-xs shadow-2xl shadow-emerald-950/80 flex items-center gap-2 border-2 border-emerald-400 hover:scale-105 transition-all cursor-pointer animate-pulse"
                        >
                          <Zap className="w-4 h-4 fill-white" />
                          <span>{isProcessing ? 'Importing to Stage 1...' : '⚡ 1-Click Auto-Apply to Stage 1'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'direct_import' && (
                <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-3">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-neutral-200 block">
                      Direct Job URL from Any Portal
                    </label>
                    <input
                      type="url"
                      value={portalUrlInput}
                      onChange={(e) => setPortalUrlInput(e.target.value)}
                      placeholder="Paste job posting URL (e.g., https://linkedin.com/jobs/view/...)"
                      className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-xs outline-none focus:border-emerald-500 font-mono"
                    />

                    <label className="text-xs font-semibold text-neutral-200 block pt-1">
                      Or Raw Job Description Text
                    </label>
                    <textarea
                      rows={3}
                      value={portalRawTextInput}
                      onChange={(e) => setPortalRawTextInput(e.target.value)}
                      placeholder="Paste full job description copied from any app or mobile screen..."
                      className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-white text-xs outline-none focus:border-emerald-500 leading-relaxed"
                    />

                    <button
                      onClick={() => handleProcessExtractedJob({ url: portalUrlInput, rawText: portalRawTextInput, scrapedVia: 'Direct Input' })}
                      disabled={isProcessing || (!portalUrlInput && !portalRawTextInput)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow transition cursor-pointer disabled:opacity-50 mt-2"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                      <span>{isProcessing ? 'Processing Job Details...' : '⚡ Parse & Transfer to Stage 1'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Supported Multi-Device Job Portals */}
              <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-3">
                <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" />
                  Recognized Global Job Portals & ATS Engines:
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { name: 'LinkedIn Jobs', status: 'Universal Hook', color: 'text-blue-400' },
                    { name: 'Indeed Worldwide', status: 'Auto-Detect', color: 'text-indigo-400' },
                    { name: 'Greenhouse.io', status: 'Direct ATS', color: 'text-teal-400' },
                    { name: 'Lever.co', status: 'Direct ATS', color: 'text-amber-400' },
                    { name: 'Workday Jobs', status: 'Multi-Step', color: 'text-blue-300' },
                    { name: 'StepStone DE', status: 'DIN 5008 Ready', color: 'text-purple-400' },
                    { name: 'SEEK Australia', status: 'TSS 482 Ready', color: 'text-emerald-400' },
                    { name: 'Naukri Global', status: 'EP / Visa Ready', color: 'text-pink-400' }
                  ].map((p, idx) => (
                    <div key={idx} className="p-2.5 bg-neutral-900 rounded-xl border border-neutral-800 space-y-0.5">
                      <span className={`font-bold block text-xs ${p.color}`}>{p.name}</span>
                      <span className="text-[10px] text-neutral-400 font-mono flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-800 flex items-center justify-between bg-neutral-950 shrink-0">
              <span className="text-[11px] text-neutral-400">
                1-Click Universal Auto-Apply transfers genuine applicants straight to Stage 1.
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-semibold text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
