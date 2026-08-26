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
  CheckCircle2
} from 'lucide-react';
import { CandidateProfile } from '../types';
import { DEFAULT_CANDIDATE_PROFILE } from '../data/defaultData';

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

  const handleAddRole = () => {
    if (!newRole.trim()) return;
    if (!formData.targetRoles.includes(newRole.trim())) {
      setFormData(prev => ({
        ...prev,
        targetRoles: [...prev.targetRoles, newRole.trim()]
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

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Candidate Profile & Visa Settings
              </h2>
              <p className="text-xs text-neutral-400">
                Data used for automated JD match scoring, resume tailoring, and Playwright form filling
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Section 1: Basic Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              1. Basic Credentials & Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-400 mb-1 font-medium">First Name</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Last Name</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-400 mb-1 font-medium">Current Location</label>
                <input
                  type="text"
                  required
                  value={formData.currentLocation}
                  onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                  placeholder="e.g. Lucknow, India"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Visa & Relocation Preferences */}
          <div className="space-y-3 pt-3 border-t border-neutral-800">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              2. Visa Sponsorship & Relocation Flags
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-3 p-3 bg-neutral-950 rounded-lg border border-neutral-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requireVisaSponsorship}
                  onChange={(e) => setFormData({ ...formData, requireVisaSponsorship: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-500 bg-neutral-900 border-neutral-700"
                />
                <div>
                  <span className="text-neutral-200 font-semibold block">Require Visa Sponsorship</span>
                  <span className="text-[11px] text-neutral-400">Filters for verified sponsored roles & flags in CV</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-neutral-950 rounded-lg border border-neutral-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.openToRelocation}
                  onChange={(e) => setFormData({ ...formData, openToRelocation: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-500 bg-neutral-900 border-neutral-700"
                />
                <div>
                  <span className="text-neutral-200 font-semibold block">Open to Global Relocation</span>
                  <span className="text-[11px] text-neutral-400">Singapore, Germany, Australia, Netherlands, Japan, US</span>
                </div>
              </label>
            </div>
          </div>

          {/* Section 3: Target Roles & Core Skills */}
          <div className="space-y-3 pt-3 border-t border-neutral-800">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
              3. Target Roles & Technical Skills
            </h3>

            {/* Target Roles */}
            <div>
              <label className="block text-neutral-400 mb-1 font-medium">Target Job Titles</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {formData.targetRoles.map(role => (
                  <span key={role} className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 text-neutral-200 border border-neutral-700">
                    {role}
                    <button type="button" onClick={() => handleRemoveRole(role)} className="text-neutral-400 hover:text-rose-400">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="Add role e.g. 'Scrum Master'..."
                  className="flex-1 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddRole}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg"
                >
                  Add Role
                </button>
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-neutral-400 mb-1 font-medium">Core Technical Stack</label>
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
                  placeholder="Add skill e.g. 'Playwright', 'FastAPI'..."
                  className="flex-1 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg"
                >
                  Add Skill
                </button>
              </div>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-neutral-400 mb-1 font-medium">Candidate Base Summary</label>
              <textarea
                rows={3}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* Footer Save */}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
