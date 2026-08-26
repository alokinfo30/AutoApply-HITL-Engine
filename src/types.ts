export interface CandidateProfile {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentLocation: string;
  targetRoles: string[];
  skills: string[];
  yearsExperience: number;
  openToRelocation: boolean;
  requireVisaSponsorship: boolean;
  targetCountries: string[];
  targetCities?: string[];
  summary: string;
  telegramUsername?: string;
  telegramBotToken?: string;
  telegramChatId?: string;
  linkedInUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  experience: {
    company: string;
    role: string;
    period: string;
    location: string;
    achievements: string[];
    techStack: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
    details?: string;
  }[];
  certifications: string[];
}

export type CountryFormat = 'US_GLOBAL' | 'GERMANY_EU' | 'SINGAPORE_AU' | 'JAPAN' | 'UK_STANDARD' | 'UAE_MIDDLE_EAST' | 'DIN_5008' | 'SINGAPORE_MOM' | 'AUSTRALIA_STANDARD';

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  city?: string;
  country: string;
  countryFormat: CountryFormat | string;
  visaSponsorship: 'Verified Sponsored' | 'Available' | 'Not Specified';
  relocationAssistance: boolean;
  postedDate: string;
  source: 'JSearch' | 'Arbeitnow (Free)' | 'Remotive (Free)' | 'LinkedIn' | 'Indeed' | 'Google Jobs' | 'RSS Feed' | 'Glassdoor' | 'Wellfound' | 'Universal 1-Click Portal Hook' | string;
  url: string;
  applyUrl: string;
  salary?: string;
  description: string;
  tags: string[];
  matchScore?: number;
  matchReason?: string;
  matchedKeywords?: string[];
  missingKeywords?: string[];
  status?: 'discovered' | 'matched' | 'resume_ready' | 'pending_approval' | 'approved' | 'applying' | 'applied' | 'skipped';
}

export interface MatchAnalysis {
  score: number; // 0-100
  verdict: 'STRONG_MATCH' | 'GOOD_MATCH' | 'MODERATE_MATCH' | 'POOR_MATCH';
  visaSponsorshipVerified: boolean;
  countryFormat: CountryFormat;
  keyRequirements: string[];
  matchedSkills: string[];
  skillGaps: string[];
  tailoringAdvice: string[];
}

export interface GeneratedResume {
  jobId: string;
  country?: string;
  markdownContent: string;
  countryFormat: CountryFormat;
  targetTitle: string;
  targetCompany: string;
  generatedAt: string;
  atsScore: number;
  summaryHighlights: string[];
}

export interface HitlCard {
  id: string;
  job: JobPosting;
  resume: GeneratedResume;
  sentAt: string;
  platform: 'telegram' | 'discord' | 'simulator';
  status: 'pending' | 'approved' | 'skipped';
  actionTimestamp?: string;
}

export interface AutomationStep {
  stepNumber: number;
  name: string;
  action: string;
  targetSelector?: string;
  value?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  timestamp?: string;
  screenshotUrl?: string;
  log?: string;
}

export interface AutomationExecution {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  startTime: string;
  endTime?: string;
  status: 'queued' | 'running' | 'success' | 'failed';
  steps: AutomationStep[];
  confirmationScreenshot?: string;
  applicationId?: string;
}

// Stage 6: Interview Preparation Guide
export interface InterviewTechnicalQuestion {
  topic: string;
  question: string;
  definition: string;
  syntax: string;
  practicalExample: string;
  keyTerms: string[];
}

export interface InterviewSystemDesign {
  title: string;
  requirements: string;
  architectureComponents: string[];
  bottlenecksAndTradeoffs: string;
}

export interface InterviewCompanyQuestion {
  question: string;
  suggestedAnswerStrategy: string;
}

export interface InterviewStarQuestion {
  scenario: string;
  situationTask: string;
  action: string;
  result: string;
}

export interface InterviewPrepGuide {
  roleTitle: string;
  companyName: string;
  technicalQuestions: InterviewTechnicalQuestion[];
  systemDesignQuestions: InterviewSystemDesign[];
  companySpecificQuestions: InterviewCompanyQuestion[];
  behavioralStarQuestions: InterviewStarQuestion[];
  interviewTips: string[];
}

// Stage 7: AI Voice Mock Interview Assessment
export interface MockInterviewEvaluation {
  score: number; // 0-100
  seniorityAssessment: string;
  clarityScore: number;
  technicalDepthScore: number;
  strengths: string[];
  areasForImprovement: string[];
  missingKeywords: string[];
  modelAnswer: string;
}

export interface MockInterviewItem {
  id: string;
  question: string;
  topic: string;
  category: 'technical' | 'system_design' | 'behavioral' | 'company';
  candidateAnswer?: string;
  evaluation?: MockInterviewEvaluation;
  status: 'unanswered' | 'recording' | 'evaluating' | 'completed';
}

// Job Portal Integration
export interface JobPortalAccount {
  portal: 'LinkedIn' | 'Indeed' | 'Glassdoor' | 'Wellfound' | 'Monster' | 'ZipRecruiter';
  usernameOrEmail: string;
  connected: boolean;
  lastScraped?: string;
  autoApplySync: boolean;
  statusMessage?: string;
}

export interface PipelineStats {
  jobsScanned: number;
  matchedCount: number;
  resumesGenerated: number;
  pendingApproval: number;
  appliedCount: number;
  skippedCount: number;
  interviewsPrepped: number;
  mockInterviewsCompleted: number;
  interviewsScheduled: number;
  totalCost: number; // $0.00
}

// Market-Based Salary Range Insights
export interface SalaryEstimate {
  role?: string;
  country: string;
  city?: string;
  currency: string;
  currencySymbol: string;
  p25: number;
  median: number;
  p75: number;
  p90: number;
  bonusEquity: string;
  visaThreshold: string;
  visaCompliant: boolean;
  estimatedTaxRate: string;
  netMonthly: string;
  costOfLivingIndex: string;
  marketDemand: string;
}

// Post-Interview Follow-Up Email
export interface FollowUpEmailDraft {
  subject: string;
  salutation: string;
  emailBody: string;
  signOff: string;
  keyHighlightsReinforced: string[];
  sendTimingTip: string;
}

export interface SavedFollowUpEmailDraft {
  id: string;
  jobId?: string;
  jobTitle: string;
  company: string;
  interviewerName: string;
  interviewRound: string;
  tone: string;
  subject: string;
  salutation: string;
  emailBody: string;
  signOff: string;
  keyHighlightsReinforced: string[];
  sendTimingTip: string;
  status: 'DRAFT' | 'REVIEWED' | 'READY_TO_SEND' | 'SENT';
  createdAt: string;
  updatedAt?: string;
}

// Skill Gap Analysis & Career Growth Roadmap
export interface SkillGapAnalysisItem {
  skillName: string;
  frequencyPercent: number; // e.g. 92% of applied jobs require this
  jobCount: number;
  userProficiency: 'Mastered' | 'Competent' | 'Growth Area' | 'Critical Gap';
  userProficiencyScore: number; // 0-100
  priority: 'Critical' | 'High' | 'Medium';
  category: 'Backend / Systems' | 'Cloud & Infra' | 'Frontend' | 'Architecture & Concurrency' | 'AI & LLM Integration' | 'Data & Storage';
  actionableRoadmap: {
    stepToBridge: string;
    productionProjectToBuild: string;
    suggestedCertOrSpec: string;
    bulletPointForAts: string;
  };
}

// Multi-Device Universal Job Portal Scraper & Listener
export interface UniversalPortalScrapedJob {
  id: string;
  portalName: 'LinkedIn' | 'Indeed' | 'Glassdoor' | 'Wellfound' | 'Greenhouse' | 'Lever' | 'Workday' | 'StepStone' | 'Generic';
  url: string;
  title: string;
  company: string;
  location: string;
  rawDescription?: string;
  scrapedVia: 'Extension' | 'Bookmarklet' | 'Clipboard Listener' | 'Direct Input' | 'Mobile Share';
  timestamp: string;
  matchScore?: number;
  status: 'detected' | 'processing' | 'ready_to_apply';
}

// Scheduled 4-Hour Notification Engine
export interface ScheduledNotificationState {
  intervalHours: number;
  schedulerActive: boolean;
  nextDispatchTime: string;
  targetPlatform: 'telegram' | 'discord' | 'simulator';
  recentDispatches: {
    id: string;
    timestamp: string;
    platform: string;
    appliedCount: number;
    pendingTasksCount: number;
    status: string;
  }[];
}

// Automated Interview Scheduling & Calendar Slots
export interface CalendarSlotProposal {
  slot: string;
  timezone: string;
  confirmed: boolean;
}

export interface CalendarEventPayload {
  eventTitle: string;
  proposedSlots: CalendarSlotProposal[];
  googleCalendarUrl: string;
  outlookCalendarUrl: string;
}

// Expert Level Badges & Gamification
export interface ExpertLevelBadge {
  id: string;
  title: string;
  category: 'technical' | 'system_design' | 'behavioral' | 'visa_readiness' | 'mastery';
  icon: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  progressPercent: number;
}

// Authenticated User Session
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider: 'linkedin' | 'google' | 'github' | 'credentials';
  linkedInVerified: boolean;
  registeredAt: string;
}

// Autonomous Daily Auto-Pilot Engine
export interface AutoPilotConfig {
  enabled: boolean;
  oneClickAutoPilot: boolean;
  minMatchScore: number;
  maxDailyApplications: number;
  preferredDailyTime: string; // e.g. "09:00"
  targetCountries: string[];
  requireVisaSponsorshipOnly: boolean;
  autoApproveEligible: boolean;
  telegramDispatchEnabled: boolean;
  discordDispatchEnabled: boolean;
  lastRunTimestamp?: string;
  nextScheduledRun?: string;
  totalAutoAppliedCount: number;
}

export interface AutoPilotRunLog {
  id: string;
  timestamp: string;
  jobsScanned: number;
  matchedCount: number;
  resumesGenerated: number;
  appliedCount: number;
  skippedCount: number;
  status: 'completed' | 'in_progress' | 'failed';
  summary: string;
  details: {
    jobTitle: string;
    company: string;
    country: string;
    matchScore: number;
    action: 'applied' | 'queued_hitl' | 'skipped';
  }[];
}

