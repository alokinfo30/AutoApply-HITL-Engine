# AutoApply HITL Engine 🚀
### Production-Grade, Zero-Cost Human-in-the-Loop Job Application & Interview Preparation Platform

![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
![Runtime: React 18 + TypeScript + Vite + Express](https://img.shields.io/badge/Runtime-React%2018%20%2B%20TypeScript%20%2B%20Express-teal.svg)
![AI Engine: Google Gemini 3.7 Flash + Multi-Model Fallback](https://img.shields.io/badge/AI-Gemini%203.7%20Flash-amber.svg)
![Accessibility: WCAG AA & ARIA Compliant](https://img.shields.io/badge/Accessibility-WCAG%20AA%20%2F%20ARIA-indigo.svg)
![Operating Cost: $0.00 / month](https://img.shields.io/badge/Operating%20Cost-%240.00%2Fmonth-emerald.svg)

---

## 🌟 Overview & Core Mission

**AutoApply HITL Engine** is an open-source, production-ready career platform that automates the time-consuming tasks of global and domestic job hunting while keeping the candidate strictly in control (**Human-in-the-Loop / HITL**).

Unlike blind, spammy bulk-apply bots that burn recruiter goodwill and candidate reputations, AutoApply HITL:
1. **Discovers verified opportunities** across global tech hubs (Germany, Singapore, US, UK, Australia, Japan, UAE) and native domestic markets with automatic visa-exemption logic.
2. **Performs deep semantic job description analysis** using Google Gemini 3.7 Flash with resilient multi-model fallbacks.
3. **Generates 100% compliant multi-country ATS resumes** (**DIN 5008** for Germany/EU, **MOM Standard** for Singapore/Australia, **W3C ATS** for US/Global, **Rirekisho/Shokumu Keirekisho** for Japan, **UK Standard**, and **UAE Middle East**) with instant client-side PDF compilation, `.tex` LaTeX, and Markdown exports.
4. **Dispatches actionable interactive approval cards** to **Telegram & Discord** for 1-click mobile review (`[⚡ 1-Click Apply]`, `[📄 View ATS PDF]`, `[❌ Skip]`).
5. **Executes automated portal submissions** via **Playwright / browser-use** recording full step-by-step logs and timestamped proof-of-submission screenshots.
6. **Generates comprehensive Interview Master Guides** featuring exact code syntax patterns, production trade-off narratives, system design blueprints, and STAR behavioral answers.
7. **Simulates live AI Voice Mock Interviews** with microphone audio capture (Web Speech API) and real-time bar-raiser scoring across technical depth, communication clarity, seniority level, and missing keywords.
8. **Automates Interview Scheduling** with Google Calendar and Microsoft Outlook 365 availability sync, 1-click `.ics` export, and recruiter response blurb generators.
9. **Drafts Post-Interview Follow-Up Emails** with a persistent Review Queue (`DRAFT`, `REVIEWED`, `READY_TO_SEND`, `SENT`) and 1-click Gmail/Mail client launch.
10. **Provides Skill Gap Analytics & Top 10 Market Growth Roadmaps**, mapping user competencies against aggregated job requirements with actionable project blueprints.
11. **Includes a Universal Multi-Device Job Portal Reader & Injector** with active clipboard listening and a drag-and-drop JavaScript Bookmarklet for LinkedIn, Indeed, Greenhouse, Lever, and Workday.
12. **Runs a 24/7 Autonomous AutoPilot Engine** that monitors feeds, filters high-match roles, pre-generates tailored resumes, and dispatches approval cards automatically.

---

## 🏗️ 7-Stage Architectural Pipeline

```
  ┌──────────────────────────────────────────────────────────┐
  │  Stage 1: Multi-Country Job Discovery & Live Feeds       │
  │  (Germany, Singapore, US, UK, AU, Japan, UAE, Domestic)  │
  └────────────────────────────┬─────────────────────────────┘
                               │
                               ▼
  ┌──────────────────────────────────────────────────────────┐
  │  Stage 2: Semantic JD Matching & Visa Compliance Audit   │
  │  (Gemini 3.7 Flash, 0–100% Score, Gap Keyword Extraction)│
  └────────────────────────────┬─────────────────────────────┘
                               │
                               ▼
  ┌──────────────────────────────────────────────────────────┐
  │  Stage 3: Multi-Standard ATS Resume Generator & PDF      │
  │  (DIN 5008 EU, MOM Singapore, W3C ATS USA, Japan Format) │
  └────────────────────────────┬─────────────────────────────┘
                               │
                               ▼
  ┌──────────────────────────────────────────────────────────┐
  │  Stage 4: Telegram & Discord 1-Click HITL Mobile Alert   │
  │  (@AutoApplyHitlBot, Deep Linking, Webhooks, Cards)      │
  └────────────────────────────┬─────────────────────────────┘
                               │
                               ▼
  ┌──────────────────────────────────────────────────────────┐
  │  Stage 5: Playwright Browser Worker Automation           │
  │  (Form Field Mapping, PDF Upload, Proof Screenshot)      │
  └────────────────────────────┬─────────────────────────────┘
                               │
                               ▼
  ┌──────────────────────────────────────────────────────────┐
  │  Stage 6: Technical Interview Preparation & Scheduling   │
  │  (Code Patterns, Trade-offs, STAR, GCal/Outlook Sync)    │
  └────────────────────────────┬─────────────────────────────┘
                               │
                               ▼
  ┌──────────────────────────────────────────────────────────┐
  │  Stage 7: Live AI Voice Mock Interview & Bar-Raiser Eval │
  │  (Web Speech API, Audio Feedback, Category Scoring)      │
  └──────────────────────────────────────────────────────────┘
```

---

## 🚀 Detailed Stage Breakdown

### 1. Stage 1 — Multi-Country Job Discovery
- **Global & Domestic Scope:** Search across Germany/EU, Singapore, United States, United Kingdom, Australia, Japan, United Arab Emirates, or candidate's home country.
- **Smart Visa Exemption Logic:** When searching within the candidate's native country (e.g. India, Germany, US), visa sponsorship requirements are automatically bypassed, unlocking all domestic roles without false negatives.
- **Zero-Cost Data Ingestion:** Integrates free public RSS feeds, Arbeitnow API, Remotive API, JSearch, and custom job URL scraping.
- **Advanced Filtering:** Filter by visa sponsorship verification, relocation assistance packages, tech stacks, seniority, and salary bands.

### 2. Stage 2 — Semantic JD Matching & Visa Compliance Audit
- **LLM Semantic Parsing:** Google Gemini 3.7 Flash analyzes the full job description against the candidate's verified skills, career history, and relocation preferences.
- **Quantifiable Match Metrics:** Computes overall match score (0–100%), alignment verdict (`STRONG_MATCH`, `GOOD_MATCH`, `MODERATE_MATCH`, `POOR_MATCH`), and extracts matched vs. missing keywords.
- **Tailoring Strategies:** Outlines 3–4 role-specific bullet point rewrites using Google XYZ formulas (`Accomplished [X], as measured by [Y], by doing [Z]`).

### 3. Stage 3 — Multi-Country ATS Resume Generator & PDF
- **Germany & EU (DIN 5008):** Strict tabular header structure, reverse-chronological milestones, European date formatting, and formal language.
- **Singapore & Australia (MOM / SkillSelect):** Explicit work pass qualification criteria, nationality status, and clear salary expectation declarations.
- **United States & Global (W3C ATS Standard):** Single-column ATS parsing architecture, zero two-column tables, high keyword density, and quantifiable metric impact.
- **Japan (Rirekisho & Shokumu Keirekisho):** Structured career milestone narratives and technical specialty matrices.
- **Export Formats:** 1-click client-side PDF generation via `jspdf`, downloadable LaTeX `.tex` source, clean `.md` Markdown, and live side-by-side preview.

### 4. Stage 4 — Human-in-the-Loop Telegram / Discord Dispatch
- **Zero-Friction Mobile Review:** Dispatches interactive alert cards directly to candidate's private Telegram chat or Discord channel.
- **Interactive Action Buttons:**
  - `[⚡ 1-Click Approve & Apply]` → Triggers automated browser submission worker.
  - `[📄 View ATS Tailored PDF]` → Opens compiled resume preview.
  - `[❌ Skip / Dismiss]` → Archives opportunity without applying.
- **Zero-Technical Setup:** Direct deep link launch to `@AutoApplyHitlBot` to auto-capture chat ID with a single `/start` message.

### 5. Stage 5 — Playwright Browser Automation Worker
- **Headless & Headed Browser Automation:** Emulates candidate interaction on Greenhouse, Lever, Workday, Taleo, Ashby, LinkedIn Easy Apply, and custom career portals.
- **Intelligent Field Mapping:** Accurately populates first name, last name, email, phone, location, LinkedIn/GitHub URLs, and work authorization questions.
- **PDF Resume Upload:** Attaches the tailored ATS resume PDF directly to the portal file input.
- **Proof-of-Submission Screenshot:** Captures and stores timestamped visual proof of the confirmation screen for complete auditing.

### 6. Stage 6 — Technical Interview Preparation & Real-World Guides
- **Role-Tailored Interview Guide:** Generates 5–7 deep technical questions tailored to the company's tech stack:
  - **Core Technical Definition & Mechanism:** Deep architectural breakdown.
  - **Optimal Code Pattern / Syntax:** Executable code snippets with 1-click copy.
  - **Production Trade-offs & Experience Narrative:** Seniority-level war stories and latency/concurrency trade-offs.
  - **STAR Behavioral Stories:** Situation, Task, Action, and Result scripts.
- **Guide PDF Download:** Export complete interview guide as a formatted PDF for offline revision.
- **Safety Gate:** Protective confirmation modal before advancing to Stage 7 to ensure candidate saves their preparation materials.

### 7. Stage 7 — Live AI Voice Mock Interview
- **Real-Time Voice Input:** Web Speech API captures candidate verbal answers in real time.
- **Speech Synthesis Audio Playback:** AI interviewer speaks questions aloud with natural pacing.
- **Multi-Category Bar-Raiser Feedback:**
  - **Overall Score (0–100%)**
  - **Technical Accuracy & Depth**
  - **Communication Clarity & Structure**
  - **Seniority & Trade-off Articulation**
  - **Missing Industry Terminology & Keywords**

---

## ⚡ Additional Advanced Ecosystem Modules

### 🤖 Autonomous 24/7 AutoPilot Engine
- **Background Execution:** Automated scanner that periodically polls live job feeds across target countries.
- **Configurable Filters:** Set minimum match threshold (e.g. >=85%), target roles, target geographies, and daily application limits (e.g. max 5/day).
- **Auto-Generation & Dispatch:** Pre-generates ATS-compliant resumes and dispatches Telegram approval cards automatically, allowing you to review and apply to 10+ jobs in seconds.
- **Safety Circuit Breaker:** Auto-pauses if consecutive match scores fall below safety thresholds.

### 🌐 Universal Multi-Device Job Portal Reader & Injector
- **Active Clipboard Auto-Listener:** Automatically detects when you copy job URLs from LinkedIn, Indeed, Glassdoor, Greenhouse, Lever, or Workday on your phone or computer.
- **Universal JavaScript Bookmarklet:** Drag-and-drop browser bookmarklet that injects a floating `[⚡ 1-Click AutoApply HITL]` button directly on any third-party career page.
- **Live URL Parsing:** Extracts job title, company, description, and requirements from arbitrary URLs and imports them directly into Stage 2.

### 📅 Automated Interview Scheduler
- **Calendar Integration:** Syncs with Google Calendar and Microsoft Outlook 365.
- **Conflict-Free Windows:** Calculates non-overlapping interview slots matched to company and candidate timezones.
- **1-Click Holds & `.ics` Export:** Generates downloadable standard `.ics` calendar invitation files.
- **Recruiter Availability Templates:** Generates ready-to-copy blurb messages formatted with your exact available windows.

### ✉️ Follow-Up Email Generator & Review Queue
- **Round-Specific Templates:** Generates tailored follow-up emails for Recruiter Screens, Technical Rounds, System Design, Bar-Raiser, and Final Round Interviews.
- **Saved Drafts Review Queue:** Persistent review list with lifecycle statuses (`DRAFT`, `REVIEWED`, `READY_TO_SEND`, `SENT`).
- **1-Click Mailbox Integration:** Launches default mail client or Gmail with pre-filled subject and recipient.

### 💰 Market Salary & Visa Benchmark Estimator
- **Compensation Benchmarks:** Role- and city-specific salary distributions (P25, Median, P75, P90).
- **Visa Threshold Compliance:** Checks European Blue Card (€45,300–€58,400), Singapore Tech Pass / EP (SGD 5,000+), and US H-1B prevailing wage thresholds.
- **Net Income Estimator:** Displays estimated post-tax take-home pay and average living expenses.

### 📊 Top 10 Skill Gap Analysis & Growth Roadmap
- **Market Aggregation:** Identifies the top 10 most demanded skills across all matched job descriptions.
- **Competency Mapping:** Compares candidate skills with market requirements to highlight high-value gaps.
- **Actionable Roadmaps:** Provides specific hands-on project architectures, official documentation/RFCs to study, and ATS bullet formulas.

### 📋 Candidate Profile & Completion Meter
- **Dynamic 0–100% Progress Meter:** Real-time feedback identifying missing fields needed for optimal ATS score generation.
- **Authentication & Profiles:** Multi-method SSO (Google, GitHub, Telegram Login Widget, LinkedIn OAuth) with strict data isolation.

---

## 💰 Zero-Cost Infrastructure Design ($0.00 / Month)

The entire platform is engineered to operate 100% within permanent free-tier allocations for 5–10+ years:

| Architecture Layer | Technology | Free Tier Allocation | Monthly Cost |
| :--- | :--- | :--- | :--- |
| **Frontend SPA** | React 18 + TypeScript + Vite + Tailwind CSS | Static hosting on Cloudflare Pages, Vercel, or GitHub Pages | **$0.00** |
| **Backend Proxy & API** | Node.js Express / TSX | Cloud Run, Fly.io, or Render Free Tier | **$0.00** |
| **AI LLM Engine** | Google Gemini 3.7 Flash via `@google/genai` | Free Tier RPM with resilient multi-model fallback | **$0.00** |
| **Job Feeds & Discovery** | Arbeitnow, Remotive, Public RSS, JSearch | Public Open APIs & RSS Ingestion | **$0.00** |
| **HITL Alerting** | Telegram Bot API + Discord Webhooks | Unlimited free bot messages & webhook posts | **$0.00** |
| **Browser Automation** | Playwright / Chromium headless worker | Local execution / Container free tier | **$0.00** |
| **Calendar & Exports** | Standard `.ics` RFC 5545 + Client-side `jspdf` | In-browser computation & standard calendar protocols | **$0.00** |
| **Total Estimated Cost** | — | — | **$0.00 / month** |

---

## 🔒 Security, Privacy & Compliance

- **Zero Client-Side API Keys:** All calls to Google Gemini AI and third-party services are proxied through secure server-side `/api/*` endpoints.
- **No Password Storage:** Authentication uses secure OAuth SSO (Google, GitHub, Telegram Widget) and session-isolated local stores.
- **Strict Data Isolation:** Candidate resumes, application logs, and email drafts remain private to the user session.
- **Human-in-the-Loop Guarantee:** No job application is ever submitted without explicit confirmation from the candidate.
- **Accessibility (a11y):** Full keyboard navigation, ARIA roles (`role="tablist"`, `role="radiogroup"`, `aria-expanded`, `aria-label`), and WCAG AA contrast compliance.

---

## 🚀 Quickstart & Development Setup

### Prerequisites
- Node.js 18.x or 20.x
- npm, pnpm, or bun

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/autoapply-hitl-engine.git
cd autoapply-hitl-engine
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your `.env` contains your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### 4. Start Development Server
```bash
npm run dev
```
The application will boot at `http://localhost:3000`.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 🛡️ Autonomous Self-Healing (Auto-Debugging) SaaS Pipeline

AutoApply HITL Engine includes a built-in, production-grade **Self-Healing Agentic Pipeline** that autonomously captures runtime errors across the frontend and backend, parses AST context, executes an agentic diagnosis and patch generation workflow with strict security guardrails, runs tests in a sandbox environment, and deploys hotfixes with 1-click rollback snapshots.

```
   ┌──────────────────────────────────────────────────────────┐
   │  Layer 1: Error Capture Layer (Frontend & Backend)       │
   │  (window.onerror, unhandledrejection, Express Catch)     │
   └────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
   ┌──────────────────────────────────────────────────────────┐
   │  Layer 2: Codebase AST & Context Aggregator              │
   │  (File slice, function map, imported modules, symbols)   │
   └────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
   ┌──────────────────────────────────────────────────────────┐
   │  Layer 3: 3-Agent Autonomous Workflow Engine             │
   │  • Agent 1: Forensic Root Cause Analyzer (Gemini 3.7)    │
   │  • Agent 2: Patch Generator (LLM Security Guardrails)    │
   │  • Agent 3: Sandbox Test Runner (Vitest Assertions)      │
   └────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
   ┌──────────────────────────────────────────────────────────┐
   │  Layer 4: Zero-Downtime Hotfix & Rollback Snapshots      │
   │  (100% Test Green Gate, SHA-256 Snapshot, Auto-Rollback) │
   └──────────────────────────────────────────────────────────┘
```

### 1. Error Capture Layer
- **Frontend Interceptors**: Injects global `window.onerror` and `unhandledrejection` event listeners into the browser runtime, capturing uncaught script errors, network timeout rejections, and React component stack traces.
- **Backend Catch Middleware**: Intercepts server-side Express runtime crashes, database connection timeouts, and unhandled async route rejections, streaming normalized diagnostic payloads to the Self-Healing buffer.

### 2. Codebase AST & Context Aggregator
- Extracts exact surrounding code slices around the error line number.
- Scans files for declared functions, imported modules, and symbol hierarchies to build high-context prompts for AI agents.

### 3. Safe 3-Agent Workflow
1. **Agent 1 (Root Cause Analyzer)**: Diagnoses why the error happened, evaluates the failure mechanism, calculates confidence score (0–100%), and specifies an actionable fix strategy.
2. **Agent 2 (Patch Generator)**: Generates surgical unified diffs and replacement code blocks with **Strict LLM Security Guardrails** (no authentication bypass, no disabled security middleware, no environment variable leaks, and enforced input sanitization).
3. **Agent 3 (Security & Sandbox Test Runner)**: Simulates isolated worker execution running:
   - **AST Security Static Scan**: Confirms zero secret leaks or arbitrary code execution vectors.
   - **Vitest Automated Test Suite**: Verifies unit assertions, zero-crash boundary conditions, regression tests, and memory/type safety.

### 4. Zero-Downtime Hotfix Deployment & Instant Rollback
- If all automated tests pass, the patch is applied as an active hotfix and recorded with a SHA-256 rollback snapshot.
- If any test fails or security vulnerability is flagged, the patch is quarantined and escalated to the administrator.
- Includes a 1-click **Rollback Hotfix** action to restore the pre-incident codebase state in milliseconds.

---

## 📁 Project Architecture & Directory Structure

```
├── server.ts                       # Express backend server with Gemini 3.7 Flash API proxies
├── metadata.json                   # Applet metadata, capabilities, and microphone permissions
├── package.json                    # Dependencies and build scripts
├── vite.config.ts                  # Vite configuration with Tailwind CSS plugin
├── index.html                      # Single-page application entry point
├── src/
│   ├── main.tsx                    # React DOM entry point
│   ├── App.tsx                     # Main layout & stage orchestrator
│   ├── index.css                   # Tailwind CSS global styles
│   ├── types.ts                    # TypeScript types, interfaces, and enums
│   ├── data/
│   │   └── mockData.ts             # Curated starter job postings, standards, & seed profiles
│   ├── utils/
│   │   ├── apiClient.ts            # Server-side API proxy client
│   │   ├── pdfGenerator.ts         # Multi-standard ATS PDF generator (DIN 5008, MOM, W3C)
│   │   ├── profileValidation.ts    # Profile completion rate and validation helpers
│   │   └── i18n.ts                 # Dual-language translations (English / German)
│   └── components/
│       ├── Header.tsx                      # Top navigation, status indicator & auth trigger
│       ├── PipelineStageTracker.tsx        # 7-stage interactive visual progress tracker
│       ├── JobDiscoveryView.tsx            # Stage 1: Global & domestic job discovery & feeds
│       ├── JdMatchView.tsx                 # Stage 2: Gemini semantic match analysis & gap audit
│       ├── ResumeGeneratorView.tsx         # Stage 3: Multi-standard ATS resume editor & PDF export
│       ├── TelegramHitlView.tsx            # Stage 4: Telegram & Discord HITL alert cards
│       ├── BrowserWorkerModal.tsx          # Stage 5: Playwright automated application worker
│       ├── InterviewPrepView.tsx           # Stage 6: Role-specific technical prep & system design
│       ├── MockInterviewView.tsx           # Stage 7: Real-time AI voice mock interview & scoring
│       ├── AutonomousAutoPilotModal.tsx    # 24/7 background scheduler & autonomous scanner
│       ├── UniversalJobPortalInjector.tsx  # Clipboard listener & browser bookmarklet hook
│       ├── InterviewSchedulerModal.tsx     # Google/Outlook calendar sync & availability blurb
│       ├── FollowUpEmailModal.tsx          # Post-interview follow-up generator & review queue
│       ├── SalaryEstimatorModal.tsx        # Market compensation & Blue Card/Visa threshold check
│       ├── ApplicationSummaryDashboard.tsx # Application analytics & Top 10 skill gap roadmaps
│       ├── ApplicationHistoryView.tsx      # Comprehensive application lifecycle tracking table
│       ├── CandidateProfileModal.tsx       # Profile editor with 0–100% completion progress meter
│       ├── AuthModal.tsx                   # OAuth SSO (Google, GitHub, Telegram, LinkedIn)
│       └── OpenSourceCodeHub.tsx           # Open-source architecture & API documentation hub
```

---

## 🤝 Contributing

Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing new feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the **Apache License 2.0**. See the `LICENSE` file for details.
