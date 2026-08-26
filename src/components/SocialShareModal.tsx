import React, { useState } from 'react';
import { 
  Share2, 
  Linkedin, 
  Facebook, 
  MessageCircle, 
  Instagram, 
  Twitter, 
  Copy, 
  Check, 
  Sparkles, 
  X, 
  ExternalLink,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);

  if (!isOpen) return null;

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://autoapply-hitl-engine.aistudio.app';
  const shareTitle = "AutoApply HITL Engine — 100% Free AI Job Application & Interview Engine";
  const shareSummary = "I just explored the AutoApply HITL Engine: an automated 7-stage job application pipeline with Human-in-the-Loop 1-click approval on Telegram, multi-country ATS resume generator, and real-time AI mock interview prep. 100% free forever!";

  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(appUrl)}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}`;
  const whatsAppShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle}\n\n${shareSummary}\n\nCheck it out here: ${appUrl}`)}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareTitle}\n${appUrl}`)}&hashtags=JobSearch,AI,FullStack,TechJobs,AutoApply`;

  const instagramCaption = `🚀 Automated End-to-End Job Search Engine with 1-Click Human Approval!\n\n✨ Features:\n• 7-Stage Interactive Pipeline\n• Multi-Country ATS Resumes (DIN 5008, MOM, W3C)\n• Telegram / Discord 1-Click HITL Alerts\n• Playwright Browser Automation Worker\n• AI Voice Mock Interview Prep & Salary Estimator\n\n🔗 Link in Bio or visit: ${appUrl}\n\n#SoftwareEngineer #TechJobs #AI #ResumeBuilder #JobSearch #FullStack #Developer`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedLink(true);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(instagramCaption);
    setCopiedCaption(true);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-bold shadow">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  Share & Viral Rank AutoApply Engine
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-950 text-pink-300 border border-pink-800">
                  Top SEO & Socials
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Share on LinkedIn, WhatsApp, Facebook, Instagram & X with 1 click.
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

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Quick Social Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* LinkedIn */}
            <a
              href={linkedInShareUrl}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-[#0A66C2]/15 hover:bg-[#0A66C2]/30 border border-[#0A66C2]/40 text-white transition group"
            >
              <Linkedin className="w-5 h-5 text-[#0A66C2] group-hover:scale-110 transition-transform" />
              <span className="font-bold text-[11px]">LinkedIn</span>
            </a>

            {/* WhatsApp */}
            <a
              href={whatsAppShareUrl}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-white transition group"
            >
              <MessageCircle className="w-5 h-5 text-[#25D366] group-hover:scale-110 transition-transform" />
              <span className="font-bold text-[11px]">WhatsApp</span>
            </a>

            {/* Facebook */}
            <a
              href={facebookShareUrl}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-[#1877F2]/15 hover:bg-[#1877F2]/30 border border-[#1877F2]/40 text-white transition group"
            >
              <Facebook className="w-5 h-5 text-[#1877F2] group-hover:scale-110 transition-transform" />
              <span className="font-bold text-[11px]">Facebook</span>
            </a>

            {/* Twitter / X */}
            <a
              href={twitterShareUrl}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white transition group"
            >
              <Twitter className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-[11px]">X / Twitter</span>
            </a>
          </div>

          {/* Copy Direct Link */}
          <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between gap-3">
            <span className="text-neutral-300 font-mono text-[11px] truncate flex-1">{appUrl}</span>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-semibold transition shrink-0 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied Link!' : 'Copy Link'}</span>
            </button>
          </div>

          {/* Instagram Post & Story Ready Caption Generator */}
          <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Instagram className="w-4 h-4 text-pink-400" />
                Instagram Story & Caption Template:
              </span>
              <button
                onClick={handleCopyCaption}
                className="flex items-center gap-1 px-2.5 py-1 bg-pink-600 hover:bg-pink-500 text-white rounded text-xs font-semibold transition cursor-pointer"
              >
                {copiedCaption ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCaption ? 'Copied Caption!' : 'Copy Instagram Caption'}</span>
              </button>
            </div>
            <textarea
              readOnly
              rows={4}
              value={instagramCaption}
              className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-300 text-[11px] font-mono leading-relaxed outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 flex items-center justify-between bg-neutral-950">
          <span className="text-[11px] text-neutral-500">
            SEO structured tags & OpenGraph metadata active for all social search engines.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
