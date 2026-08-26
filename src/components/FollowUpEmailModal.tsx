import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  X, 
  ExternalLink, 
  Building, 
  User, 
  CheckCircle2,
  Clock,
  FileText,
  Bookmark,
  Trash2,
  Edit3,
  ListFilter,
  CheckCheck,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { JobPosting, CandidateProfile, FollowUpEmailDraft, SavedFollowUpEmailDraft } from '../types';

interface FollowUpEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  job?: JobPosting | null;
  candidateProfile: CandidateProfile;
  initialDiscussionHighlights?: string[];
}

export const FollowUpEmailModal: React.FC<FollowUpEmailModalProps> = ({
  isOpen,
  onClose,
  job,
  candidateProfile,
  initialDiscussionHighlights
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'saved'>('create');
  const [interviewerName, setInterviewerName] = useState('Hiring Team');
  const [interviewRound, setInterviewRound] = useState('Technical & System Design Round');
  const [tone, setTone] = useState<'Professional & High Impact' | 'Startup & Enthusiastic' | 'Deep Technical Architecture Focus' | 'Executive & Concise'>('Professional & High Impact');
  const [customDiscussionPoints, setCustomDiscussionPoints] = useState(
    initialDiscussionHighlights?.join("\n") || "Discussed scaling microservices with sub-100ms latency\nAddressed FastAPI concurrency and Redis cache invalidation\nAligned on team high-throughput engineering roadmap"
  );
  const [draft, setDraft] = useState<FollowUpEmailDraft | null>(null);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [editedSubject, setEditedSubject] = useState('');
  const [editedBody, setEditedBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Saved Follow-up Email Drafts List
  const [savedDrafts, setSavedDrafts] = useState<SavedFollowUpEmailDraft[]>(() => {
    const saved = localStorage.getItem('autoapply_saved_email_drafts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // Load server-side drafts on mount
  useEffect(() => {
    fetch('/api/user/email-drafts')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.drafts && data.drafts.length > 0) {
          setSavedDrafts(data.drafts);
        }
      })
      .catch(() => {});
  }, []);

  // Save to localStorage & Server
  useEffect(() => {
    localStorage.setItem('autoapply_saved_email_drafts', JSON.stringify(savedDrafts));
  }, [savedDrafts]);

  const generateEmail = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/gemini/generate-follow-up-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job: job || { title: "Senior Full Stack Engineer", company: "Apex Tech / Zalando" },
          candidateName: `${candidateProfile?.firstName || 'Alok'} ${candidateProfile?.lastName || 'Kumar'}`,
          interviewerName,
          interviewRound,
          tone,
          discussionHighlights: customDiscussionPoints.split("\n").filter(Boolean)
        })
      });
      const data = await res.json();
      if (data.success && data.emailDraft) {
        setDraft(data.emailDraft);
        setEditedSubject(data.emailDraft.subject);
        setEditedBody(data.emailDraft.emailBody);
      }
    } catch (e) {
      console.error("Follow-up email error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !draft) {
      generateEmail();
    }
  }, [isOpen, job]);

  if (!isOpen) return null;

  const handleSaveToReviewList = (customStatus: 'DRAFT' | 'REVIEWED' | 'READY_TO_SEND' = 'REVIEWED') => {
    if (!draft) return;
    const newRecord: SavedFollowUpEmailDraft = {
      id: `draft-${Date.now()}`,
      jobId: job?.id,
      jobTitle: job?.title || "Senior Software Engineer",
      company: job?.company || "Target Company",
      interviewerName,
      interviewRound,
      tone,
      subject: editedSubject || draft.subject,
      salutation: draft.salutation,
      emailBody: editedBody || draft.emailBody,
      signOff: draft.signOff,
      keyHighlightsReinforced: draft.keyHighlightsReinforced,
      sendTimingTip: draft.sendTimingTip,
      status: customStatus,
      createdAt: new Date().toISOString()
    };

    setSavedDrafts(prev => [newRecord, ...prev.filter(d => d.id !== newRecord.id)]);

    fetch('/api/user/email-drafts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ draft: newRecord })
    }).catch(() => {});

    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    setActiveTab('saved');
  };

  const handleUpdateDraftStatus = (id: string, newStatus: 'DRAFT' | 'REVIEWED' | 'READY_TO_SEND' | 'SENT') => {
    setSavedDrafts(prev => prev.map(d => {
      if (d.id === id) {
        const updated = { ...d, status: newStatus, updatedAt: new Date().toISOString() };
        fetch('/api/user/email-drafts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ draft: updated })
        }).catch(() => {});
        return updated;
      }
      return d;
    }));
  };

  const handleDeleteDraft = (id: string) => {
    setSavedDrafts(prev => prev.filter(d => d.id !== id));
    fetch(`/api/user/email-drafts/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const handleCopyDraft = (targetDraft: { subject: string; salutation: string; emailBody: string; signOff: string }) => {
    const fullText = `Subject: ${targetDraft.subject}\n\n${targetDraft.salutation}\n\n${targetDraft.emailBody}\n\n${targetDraft.signOff}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenMailto = (targetDraft: { subject: string; salutation: string; emailBody: string; signOff: string }) => {
    const subject = encodeURIComponent(targetDraft.subject);
    const body = encodeURIComponent(`${targetDraft.salutation}\n\n${targetDraft.emailBody}\n\n${targetDraft.signOff}`);
    window.open(`mailto:recruiter@company.com?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center text-white font-bold shadow">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  Automated Post-Interview Follow-Up Email Generator
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  AI Crafted & Review Queue
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Leverages the job description and interview feedback to draft company-tailored follow-ups.
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

        {/* View Mode Switcher Tabs */}
        <div className="flex items-center gap-2 px-5 pt-3 bg-neutral-950/80 border-b border-neutral-800 text-xs">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-1.5 pb-2.5 font-medium border-b-2 transition ${
              activeTab === 'create'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate & Edit Draft</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-1.5 pb-2.5 font-medium border-b-2 transition ${
              activeTab === 'saved'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Drafts for Review ({savedDrafts.length})</span>
          </button>
        </div>

        {/* TAB 1: GENERATE & EDIT DRAFT */}
        {activeTab === 'create' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Form Controls */}
            <div className="p-4 bg-neutral-950/80 border-b border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Interviewer / Recruiter Name</label>
                <input
                  type="text"
                  value={interviewerName}
                  onChange={(e) => setInterviewerName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Interview Round</label>
                <select
                  value={interviewRound}
                  onChange={(e) => setInterviewRound(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white outline-none focus:border-indigo-500"
                >
                  <option value="Round 1: Recruiter Screen">Round 1: Recruiter Screen</option>
                  <option value="Technical & System Design Round">Technical & System Design Round</option>
                  <option value="Live Coding & Architecture Session">Live Coding & Architecture</option>
                  <option value="Final Hiring Manager & Culture Round">Final Hiring Manager Round</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-medium">Tone of Email</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white outline-none focus:border-indigo-500"
                >
                  <option value="Professional & High Impact">Professional & High Impact</option>
                  <option value="Startup & Enthusiastic">Startup & Enthusiastic</option>
                  <option value="Deep Technical Architecture Focus">Deep Technical Focus</option>
                  <option value="Executive & Concise">Executive & Concise</option>
                </select>
              </div>
            </div>

            {/* Discussion points input */}
            <div className="px-4 py-2.5 bg-neutral-950/40 border-b border-neutral-800 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-neutral-400 font-medium">Interview Discussion Highlights (Topics Covered):</span>
                <button
                  onClick={generateEmail}
                  disabled={isLoading}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Regenerate Draft with AI</span>
                </button>
              </div>
              <textarea
                rows={2}
                value={customDiscussionPoints}
                onChange={(e) => setCustomDiscussionPoints(e.target.value)}
                className="w-full p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-xs outline-none focus:border-indigo-500"
                placeholder="e.g. Discussed distributed caching, sub-100ms API response latency, and team engineering roadmap"
              />
            </div>

            {/* Content Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-neutral-400">
                  <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Synthesizing company-tailored follow-up draft...</span>
                </div>
              ) : draft ? (
                <div className="space-y-4">
                  {/* Timing Tip Pill */}
                  <div className="p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between gap-2 text-neutral-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span><strong>Optimal Timing:</strong> {draft.sendTimingTip}</span>
                    </div>
                    <button
                      onClick={() => setIsEditingDraft(!isEditingDraft)}
                      className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white px-2 py-1 bg-neutral-900 rounded border border-neutral-800"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{isEditingDraft ? 'View Preview' : 'Edit Draft'}</span>
                    </button>
                  </div>

                  {/* Email Window */}
                  <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden shadow">
                    <div className="p-3 bg-neutral-900/90 border-b border-neutral-800 font-mono text-[11px] text-neutral-300 flex items-center justify-between">
                      {isEditingDraft ? (
                        <div className="w-full mr-2">
                          <label className="block text-[10px] text-neutral-400 mb-0.5">Subject Line:</label>
                          <input
                            type="text"
                            value={editedSubject}
                            onChange={(e) => setEditedSubject(e.target.value)}
                            className="w-full p-1.5 bg-neutral-950 border border-neutral-700 rounded text-white text-xs font-mono"
                          />
                        </div>
                      ) : (
                        <span className="font-bold text-white">Subject: {editedSubject || draft.subject}</span>
                      )}
                      
                      <button
                        onClick={() => handleCopyDraft({ subject: editedSubject || draft.subject, salutation: draft.salutation, emailBody: editedBody || draft.emailBody, signOff: draft.signOff })}
                        className="flex items-center gap-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-xs transition shrink-0 ml-2"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="p-4 space-y-3 font-mono text-xs text-neutral-200 leading-relaxed whitespace-pre-wrap">
                      <p className="text-neutral-400">{draft.salutation}</p>
                      {isEditingDraft ? (
                        <textarea
                          rows={6}
                          value={editedBody}
                          onChange={(e) => setEditedBody(e.target.value)}
                          className="w-full p-2.5 bg-neutral-900 border border-neutral-700 rounded text-white text-xs font-mono leading-relaxed outline-none"
                        />
                      ) : (
                        <p>{editedBody || draft.emailBody}</p>
                      )}
                      <p className="text-neutral-400">{draft.signOff}</p>
                    </div>
                  </div>

                  {/* Key Highlights Reinforced */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block font-mono">
                      Key Technical & Strategic Highlights Reinforced:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {draft.keyHighlightsReinforced.map((h, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[11px]">
                          <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-neutral-800 flex items-center justify-between bg-neutral-950">
              <button
                onClick={() => handleSaveToReviewList('REVIEWED')}
                disabled={!draft}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs shadow transition cursor-pointer disabled:opacity-50"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save to Review List</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => draft && handleCopyDraft({ subject: editedSubject || draft.subject, salutation: draft.salutation, emailBody: editedBody || draft.emailBody, signOff: draft.signOff })}
                  disabled={!draft}
                  className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-semibold text-xs transition disabled:opacity-50"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </button>

                <button
                  onClick={() => draft && handleOpenMailto({ subject: editedSubject || draft.subject, salutation: draft.salutation, emailBody: editedBody || draft.emailBody, signOff: draft.signOff })}
                  disabled={!draft}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-semibold text-xs border border-neutral-700 transition cursor-pointer disabled:opacity-50"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Open in Mail Client</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SAVED DRAFTS FOR REVIEW */}
        {activeTab === 'saved' && (
          <div className="flex-1 flex flex-col overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Saved Follow-Up Email Review Queue</span>
                  <span className="text-xs text-neutral-400 font-normal">({savedDrafts.length} drafts)</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Review and approve company-specific follow-ups before sending to hiring managers.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('create')}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+ Draft New Email</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 text-xs">
              {savedDrafts.length === 0 ? (
                <div className="py-12 bg-neutral-950 rounded-xl border border-neutral-800 text-center space-y-2 text-neutral-400">
                  <Bookmark className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p className="font-semibold text-neutral-300">No Follow-Up Drafts Saved Yet</p>
                  <p className="text-xs text-neutral-500">Generate a new follow-up email from the previous tab and click 'Save to Review List'.</p>
                </div>
              ) : (
                savedDrafts.map((d) => (
                  <div key={d.id} className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-white text-sm">{d.company}</span>
                          <span className="text-neutral-400 text-xs">({d.jobTitle})</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            d.status === 'SENT' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                            d.status === 'READY_TO_SEND' ? 'bg-teal-950 text-teal-300 border-teal-800' :
                            d.status === 'REVIEWED' ? 'bg-indigo-950 text-indigo-300 border-indigo-800' :
                            'bg-neutral-900 text-neutral-400 border-neutral-800'
                          }`}>
                            {d.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-neutral-400 text-[11px]">
                          Interviewer: <strong className="text-neutral-200">{d.interviewerName}</strong> • {d.interviewRound} • Tone: {d.tone}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <select
                          value={d.status}
                          onChange={(e) => handleUpdateDraftStatus(d.id, e.target.value as any)}
                          className="bg-neutral-900 border border-neutral-800 text-neutral-300 px-2 py-1 rounded text-xs outline-none"
                        >
                          <option value="DRAFT">Status: Draft</option>
                          <option value="REVIEWED">Status: Reviewed</option>
                          <option value="READY_TO_SEND">Status: Ready to Send</option>
                          <option value="SENT">Status: Sent</option>
                        </select>

                        <button
                          onClick={() => handleDeleteDraft(d.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-400 bg-neutral-900 rounded border border-neutral-800 transition"
                          title="Delete draft"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Email Subject & Snippet */}
                    <div className="bg-neutral-900/70 p-3 rounded-lg border border-neutral-850 font-mono text-[11px] text-neutral-300 space-y-1.5">
                      <div className="font-bold text-white">Subject: {d.subject}</div>
                      <div className="text-neutral-400 line-clamp-3 whitespace-pre-wrap">{d.emailBody}</div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-neutral-500 font-mono">
                        Saved: {new Date(d.createdAt).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyDraft(d)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 rounded border border-neutral-800 text-xs transition"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy Email</span>
                        </button>

                        <button
                          onClick={() => {
                            handleOpenMailto(d);
                            handleUpdateDraftStatus(d.id, 'SENT');
                          }}
                          className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold shadow transition"
                        >
                          <Send className="w-3 h-3" />
                          <span>Open in Gmail & Mark Sent</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
              <span>All drafts are saved and isolated to your user session.</span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
