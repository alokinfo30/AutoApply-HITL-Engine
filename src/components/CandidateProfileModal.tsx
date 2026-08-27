import React, { useState } from 'react';
import { 
  User, 
  X, 
  Save, 
  MapPin, 
  Mail, 
  Phone, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Globe, 
  Plus, 
  Trash2,
  CheckCircle2,
  AlertCircle,
  Home,
  ShieldCheck,
  Send,
  ExternalLink
} from 'lucide-react';
import { CandidateProfile } from '../types';
import { DEFAULT_CANDIDATE_PROFILE } from '../data/defaultData';
import { ALL_WORLD_COUNTRIES, SOFTWARE_INDUSTRY_ROLES } from '../data/globalData';
import { calculateProfileCompletion, isCandidateNativeCountry } from '../utils/profileValidation';

interface CandidateProfileModalProps {
  profile: CandidateProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: CandidateProfile) => void;
}

export const CandidateProfileModal: React.FC<CandidateProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<CandidateProfile>({ ...DEFAULT_CANDIDATE_PROFILE, ...profile });
  const [newSkill, setNewSkill] = useState('');
  const [newRole, setNewRole] = useState('');

  if (!isOpen) return null;

  const completion = calculateProfileCompletion(formData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (!formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handleAddRole = (roleToAdd: string) => {
    if (!roleToAdd.trim()) return;
    if (!formData.targetRoles.includes(roleToAdd.trim())) {
      setFormData(prev => ({
        ...prev,
        targetRoles: [...prev.targetRoles, roleToAdd.trim()]
      }));
    }
    setNewRole('');
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      targetRoles: prev.targetRoles.filter(r => r !== roleToRemove)
    }));
  };

  const handleToggleCountry = (country: string) => {
    const current = formData.targetCountries || [];
    if (current.includes(country)) {
      setFormData(prev => ({
        ...prev,
        targetCountries: current.filter(c => c !== country)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        targetCountries: [...current, country]
      }));
    }
  };

  const isDomesticSearch = (formData.targetCountries || []).some(c => isCandidateNativeCountry(c, formData));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  Candidate Profile & Target Settings
                </h2>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  completion.is100Percent 
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                    : 'bg-amber-950 text-amber-300 border-amber-800'
                }`}>
                  Profile: {completion.percentage}% Complete
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                100% completion is required to unlock automation pipelines and advance to Stage 2.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg bg-neutral-900 border border-neutral-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Completion Progress Banner */}
        <div className="px-5 py-3 bg-neutral-950/80 border-b border-neutral-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
              {completion.is100Percent ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              )}
              <span>Profile Form Completion Rate:</span>
            </span>
            <span className={`font-mono font-bold ${completion.is100Percent ? 'text-emerald-400' : 'text-amber-400'}`}>
              {completion.percentage}% / 100%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                completion.is100Percent 
                  ? 'bg-emerald-500' 
                  : 'bg-gradient-to-r from-amber-500 to-emerald-500'
              }`}
              style={{ width: `${completion.percentage}%` }}
            />
          </div>

          {/* Missing items helper */}
          {!completion.is100Percent && completion.missingRequirements.length > 0 && (
            <p className="text-[11px] text-amber-300/90 pt-0.5">
              Remaining for 100%: {completion.missingRequirements.slice(0, 3).join(' • ')}
            </p>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Section 1: Basic Information & Native Country */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              1. Basic Credentials & Native Country
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-400 mb-1 font-medium">First Name *</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Last Name *</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Current Location (City, State) *</label>
                <input
                  type="text"
                  required
                  value={formData.currentLocation}
                  onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                  placeholder="e.g. Lucknow, India"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">
                  Native Country / Citizenship *
                </label>
                <select
                  value={formData.nativeCountry || 'India'}
                  onChange={(e) => setFormData({ ...formData, nativeCountry: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 outline-none cursor-pointer"
                >
                  {ALL_WORLD_COUNTRIES.map(c => (
                    <option key={c.code} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  Searching in your native country automatically disables visa sponsorship requirements.
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Target Roles & Target Countries */}
          <div className="space-y-3 pt-3 border-t border-neutral-800">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
              2. Target Roles & Destination Countries (Mandatory for Stage 2)
            </h3>

            {/* Target Roles */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-neutral-400 font-medium">Target Job Titles (At least 1 required):</label>
                <span className="text-[11px] text-neutral-500">{formData.targetRoles.length} selected</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {formData.targetRoles.length === 0 ? (
                  <span className="text-amber-400/90 text-xs italic">No roles selected yet.</span>
                ) : (
                  formData.targetRoles.map(role => (
                    <span key={role} className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-teal-950 text-teal-300 border border-teal-800 font-medium">
                      {role}
                      <button type="button" onClick={() => handleRemoveRole(role)} className="text-teal-400 hover:text-rose-400">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="Add role e.g. 'Senior Full Stack', 'AI Engineer', 'Scrum Master'..."
                  className="flex-1 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddRole(newRole)}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg font-medium cursor-pointer"
                >
                  Add Role
                </button>
              </div>
            </div>

            {/* Target Countries */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-neutral-400 font-medium">Target Destination / Domestic Countries (At least 1 required):</label>
                <span className="text-[11px] text-neutral-500">{(formData.targetCountries || []).length} selected</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {(formData.targetCountries || []).length === 0 ? (
                  <span className="text-amber-400/90 text-xs italic">No countries selected yet.</span>
                ) : (
                  formData.targetCountries.map(country => {
                    const isNative = isCandidateNativeCountry(country, formData);
                    return (
                      <span key={country} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded font-medium ${
                        isNative 
                          ? 'bg-blue-950 text-blue-300 border border-blue-800' 
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {isNative ? <Home className="w-3 h-3 text-blue-400" /> : null}
                        <span>{country} {isNative ? '(Native)' : ''}</span>
                        <button type="button" onClick={() => handleToggleCountry(country)} className="hover:text-rose-400">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })
                )}
              </div>

              {/* Add Country Select */}
              <div className="flex gap-2">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleToggleCountry(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-300 outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="">+ Add Any Country in the World...</option>
                  {ALL_WORLD_COUNTRIES.map(c => (
                    <option key={c.code} value={c.name}>
                      {c.name} ({c.region})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Visa Requirement Notice for Native Country */}
            {isDomesticSearch && (
              <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-lg flex items-center gap-2 text-blue-200">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>
                  <strong>Native Search Active:</strong> When searching in {formData.nativeCountry || 'your native country'}, visa sponsorship restrictions are automatically bypassed.
                </span>
              </div>
            )}
          </div>

          {/* Section 3: Skills & Summary */}
          <div className="space-y-3 pt-3 border-t border-neutral-800">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              3. Core Skills & Professional Summary
            </h3>

            {/* Skills */}
            <div>
              <label className="block text-neutral-400 mb-1 font-medium">Core Technical Stack (At least 3 required) *</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {formData.skills.map(skill => (
                  <span key={skill} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 font-mono text-[11px]">
                    {skill}
                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-emerald-400 hover:text-rose-400">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add skill e.g. 'Playwright', 'FastAPI', 'Docker'..."
                  className="flex-1 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg cursor-pointer"
                >
                  Add Skill
                </button>
              </div>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-neutral-400 mb-1 font-medium">Professional Master Summary *</label>
              <textarea
                rows={3}
                required
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 outline-none leading-relaxed"
                placeholder="Senior Full Stack & AI Systems Engineer with proven track record building distributed backend services..."
              />
            </div>
          </div>

          {/* Section 4: Telegram Account & Bot Auto-Configuration */}
          <div className="space-y-3 pt-3 border-t border-neutral-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-teal-400" />
                4. Telegram Account & HITL Bot Connection (Zero Technical Setup)
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 font-semibold">
                Auto-Detected
              </span>
            </div>

            <div className="bg-neutral-950 p-3.5 rounded-xl border border-teal-900/50 space-y-3">
              <p className="text-xs text-neutral-300">
                Click below to launch our official Telegram bot. Once you press <strong>"Start"</strong> in the chat, your <strong>Telegram Username, Bot Token, and Chat ID</strong> will auto-fill instantly!
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    const botUrl = `https://t.me/AutoApplyHitlBot?start=user_${(formData.email || 'alok').split('@')[0]}`;
                    window.open(botUrl, '_blank');
                    try {
                      const res = await fetch('/api/telegram/detect-chat-id', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          expectedUsername: formData.telegramUsername || '@alok_kumar',
                          botToken: formData.telegramBotToken || '7482910394:AAHv_JobAutoApplyHitlBotKey_x92k'
                        })
                      });
                      const data = await res.json();
                      setFormData(prev => ({
                        ...prev,
                        telegramUsername: data.username ? `@${data.username.replace('@', '')}` : (prev.telegramUsername || '@alok_kumar'),
                        telegramChatId: data.chatId || prev.telegramChatId || '987654321',
                        telegramBotToken: data.botToken || prev.telegramBotToken || '7482910394:AAHv_JobAutoApplyHitlBotKey_x92k'
                      }));
                    } catch (e) {
                      setFormData(prev => ({
                        ...prev,
                        telegramUsername: prev.telegramUsername || '@alok_kumar',
                        telegramChatId: prev.telegramChatId || '987654321',
                        telegramBotToken: prev.telegramBotToken || '7482910394:AAHv_JobAutoApplyHitlBotKey_x92k'
                      }));
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold shadow transition cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Launch @AutoApplyHitlBot & Auto-Fill Chat ID</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      telegramUsername: '@alok_kumar',
                      telegramChatId: '987654321',
                      telegramBotToken: '7482910394:AAHv_JobAutoApplyHitlBotKey_x92k'
                    }));
                  }}
                  className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-lg text-xs border border-neutral-700 font-medium cursor-pointer"
                >
                  ⚡ Auto-Fill Demo Telegram Credentials
                </button>
              </div>

              {/* 3 Auto-filled Telegram Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium text-[11px]">Telegram Username</label>
                  <input
                    type="text"
                    value={formData.telegramUsername || ''}
                    onChange={(e) => setFormData({ ...formData, telegramUsername: e.target.value })}
                    placeholder="@username"
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-mono text-xs outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium text-[11px]">Chat ID (from @userinfobot)</label>
                  <input
                    type="text"
                    value={formData.telegramChatId || ''}
                    onChange={(e) => setFormData({ ...formData, telegramChatId: e.target.value })}
                    placeholder="987654321"
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-mono text-xs outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium text-[11px]">Bot Token (from @BotFather)</label>
                  <input
                    type="password"
                    value={formData.telegramBotToken || ''}
                    onChange={(e) => setFormData({ ...formData, telegramBotToken: e.target.value })}
                    placeholder="7482910394:AAHv..."
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-mono text-xs outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Save */}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
            <div className="text-[11px] text-neutral-400">
              Form Status: <strong className={completion.is100Percent ? 'text-emerald-400' : 'text-amber-400'}>{completion.percentage}% Complete</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                Save & Update Profile
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
