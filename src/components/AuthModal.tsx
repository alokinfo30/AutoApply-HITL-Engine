import React, { useState } from 'react';
import { 
  User, 
  Linkedin, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  Key,
  Globe
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuthUser, CandidateProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser, updatedProfile?: Partial<CandidateProfile>) => void;
  currentProfile: CandidateProfile;
  redirectNotice?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentProfile,
  redirectNotice
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'linkedin_sync'>('signin');
  const [email, setEmail] = useState(currentProfile?.email || 'alokinfo30@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState(`${currentProfile?.firstName || 'Alok'} ${currentProfile?.lastName || 'Kumar'}`);
  const [linkedInUrl, setLinkedInUrl] = useState(currentProfile?.linkedInUrl || 'https://www.linkedin.com/in/alok-kumar-tech');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLinkedInAutoSync = () => {
    setIsLoading(true);
    setTimeout(() => {
      const user: AuthUser = {
        id: `user-li-${Date.now()}`,
        name: name || "Alok Kumar",
        email: email || "alokinfo30@gmail.com",
        provider: 'linkedin',
        linkedInVerified: true,
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
        registeredAt: new Date().toISOString()
      };

      const updatedProfile: Partial<CandidateProfile> = {
        firstName: name.split(' ')[0] || currentProfile?.firstName || 'Alok',
        lastName: name.split(' ').slice(1).join(' ') || currentProfile?.lastName || 'Kumar',
        email: email || currentProfile?.email || 'alokinfo30@gmail.com',
        linkedInUrl: linkedInUrl || currentProfile?.linkedInUrl || '',
        summary: currentProfile?.summary || "Senior Full Stack & AI Systems Engineer specializing in high-throughput distributed microservices, FastAPI, and automated LLM orchestration."
      };

      setIsLoading(false);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      onLoginSuccess(user, updatedProfile);
      onClose();
    }, 1000);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const user: AuthUser = {
        id: `user-${Date.now()}`,
        name: name || "Engineering Candidate",
        email: email || "candidate@example.com",
        provider: 'credentials',
        linkedInVerified: true,
        registeredAt: new Date().toISOString()
      };

      setIsLoading(false);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      onLoginSuccess(user);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold shadow">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {mode === 'signin' ? 'Sign In to Continue' : mode === 'signup' ? 'Create Account' : 'LinkedIn Auto-Sync Login'}
              </h2>
              <p className="text-[11px] text-neutral-400">
                Authentication required to unlock Stage 2 & Auto-Pipeline
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg bg-neutral-900 border border-neutral-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notice if redirected from Stage 2 */}
        {redirectNotice && (
          <div className="mx-5 mt-4 p-3 bg-amber-950/70 border border-amber-800/80 rounded-xl text-[11px] text-amber-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{redirectNotice}</span>
          </div>
        )}

        <div className="p-5 space-y-4 text-xs">
          {/* 1-Click LinkedIn Auto-Sync Login (Primary Feature) */}
          <button
            type="button"
            onClick={handleLinkedInAutoSync}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-xl font-bold shadow-lg shadow-blue-950/50 transition cursor-pointer"
          >
            <Linkedin className="w-4 h-4" />
            <span>{isLoading ? 'Synchronizing with LinkedIn...' : '1-Click Auto-Sync with LinkedIn'}</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-neutral-800 w-full"></div>
            <span className="bg-neutral-900 px-3 text-[10px] uppercase tracking-wider text-neutral-500 font-mono">
              Or with credentials
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3">
            {mode === 'signup' && (
              <div>
                <label className="block text-neutral-300 mb-1 font-medium">Full Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alok Kumar"
                    className="w-full pl-8 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none focus:border-blue-500 text-xs"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-neutral-300 mb-1 font-medium">Email Address</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alokinfo30@gmail.com"
                  className="w-full pl-8 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none focus:border-blue-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 mb-1 font-medium">Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none focus:border-blue-500 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition shadow mt-2 cursor-pointer"
            >
              <span>{mode === 'signin' ? 'Sign In & Proceed to Stage 2' : 'Create Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Toggle Sign In / Sign Up */}
          <div className="pt-2 text-center text-neutral-400 text-[11px] flex items-center justify-center gap-1">
            <span>{mode === 'signin' ? "Don't have an account?" : "Already registered?"}</span>
            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-blue-400 hover:underline font-semibold cursor-pointer"
            >
              {mode === 'signin' ? 'Register here' : 'Sign in'}
            </button>
          </div>

          <div className="p-2.5 bg-neutral-950/80 rounded-xl border border-neutral-800/80 text-[10px] text-neutral-400 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Strict data isolation guarantee: Your credentials remain private and localized.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
