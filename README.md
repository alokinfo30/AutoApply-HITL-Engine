# AutoApply HITL Engine 🚀
### Production-Grade, Zero-Cost Human-in-the-Loop Job Application & Interview Preparation Platform

![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
![Runtime: React 18 + Vite + Express](https://img.shields.io/badge/Runtime-React%2018%20%2B%20Vite%20%2B%20Express-teal.svg)
![AI: Google Gemini 3.7 Flash](https://img.shields.io/badge/AI-Gemini%203.7%20Flash-amber.svg)
![Cost: $0.00 / month](https://img.shields.io/badge/Cost-%240.00%2Fmonth-emerald.svg)

---

## 🌟 Overview & Mission

**AutoApply HITL Engine** is an open-source, production-ready career platform that automates the tedious parts of the global job search while keeping the candidate strictly in control (**Human-in-the-Loop**). 

Instead of blind, spammy bulk applications that harm candidate reputations, AutoApply HITL:
1. Discovers verified visa-sponsored opportunities across global markets.
2. Performs deep semantic parsing against candidate competencies.
3. Generates 100% compliant multi-country ATS resumes (**DIN 5008** for Germany/EU, **MOM** for Singapore/Australia, **W3C ATS** for US/Global).
4. Dispatches actionable interactive approval cards to **Telegram & Discord** for 1-click mobile review.
5. Executes automated portal submissions via **Playwright / browser-use** recording full proof-of-submission screenshots.
6. Generates deep post-application **Interview Master Guides** with real production syntax and STAR behavioral frameworks.
7. Simulates real-time **AI Voice Mock Interviews** with scoring and bar-raiser feedback.
8. Manages **Automated Interview Scheduling** (Google/Outlook Calendar sync) and drafts **Post-Interview Follow-Up Emails** with a dedicated review queue.
9. Performs **Skill Gap Analysis** mapping user competencies against the top 10 market requirements with actionable upskilling roadmaps.
10. Features a **Universal Multi-Device Job Portal Reader & Injector** to auto-apply on LinkedIn, Indeed, Greenhouse, Lever, and Workday from any laptop, desktop, or mobile device.

---

## 🏗️ 7-Stage Architectural Pipeline

```
  [Stage 1: Multi-Country Job Discovery]
                 │
                 ▼
  [Stage 2: Semantic JD Matching & Visa Audit]
                 │
                 ▼
  [Stage 3: Multi-Standard ATS Resume Generation]
                 │
                 ▼
  [Stage 4: Telegram / Discord 1-Click HITL Alert]
                 │
                 ▼
  [Stage 5: Playwright Browser Worker Automation]
                 │
                 ▼
  [Stage 6: Technical Interview Guide & Scheduling]
                 │
                 ▼
  [Stage 7: Live AI Voice Mock Interview Practice]
```

### 1. Stage 1 — Multi-Country Job Discovery
- Search global markets (Germany, Singapore, US, UK, Australia, Japan, UAE) and target cities.
- Filter by visa sponsorship verification, relocation packages, and tech keywords.
- Zero-cost ingestion via public RSS feeds, Arbeitnow API, Remotive API, and direct portal scraping.

### 2. Stage 2 — Semantic JD Matching & Gap Audit
- Scores alignment (0–100%) against candidate profile.
- Extracts matched keywords, missing keywords, and visa compliance requirements.

### 3. Stage 3 — Multi-Country ATS Resume Generator
- **Germany & EU (DIN 5008):** Tabular reverse-chronological layout, strict contact block, formal language.
- **Singapore & AU (MOM Standard):** Work pass qualification alignment, explicit visa eligibility declarations.
- **United States & Global:** W3C ATS single-column keyword density, quantifiable metric bullet formulas.
- **Japan (Rirekisho/Shokumu Keirekisho):** Structured career milestone narratives.

### 4. Stage 4 — Human-in-the-Loop Telegram / Discord Dispatch
- Sends interactive card with formatted job metadata, match score, and PDF preview link.
- Inline 1-click buttons: `[⚡ 1-Click Apply]`, `[📄 View ATS PDF]`, `[❌ Skip]`.

### 5. Stage 5 — Playwright Browser Automation Worker
- Automated browser session navigating to the job portal.
- Fills multi-step application forms, uploads tailored PDF CV, and captures timestamped submission confirmation screenshots.

### 6. Stage 6 — Interview Prep & Automated Scheduling
- Generates role-specific core technical definitions, optimal code syntax, system design blueprints, and behavioral STAR stories.
- **Automated Interview Scheduler:** Connects Google Calendar / Outlook 365, calculates non-conflicting availability windows, creates 1-click calendar holds, and exports `.ics` files.
- **Follow-Up Email Generator & Review Queue:** Drafts company-tailored follow-up emails based on interview round and discussion highlights, saving them to a persistent review queue.

### 7. Stage 7 — AI Voice Mock Interview
- Interactive audio practice sessions with voice input (Web Speech API).
- AI scoring across clarity, technical depth, seniority level, and missing keywords.

---

## ⚡ Zero-Cost Architecture (Designed for 5–10 Years Free Tier)

| Component | Technology | Free Tier Allocation | Cost / Mo |
| :--- | :--- | :--- | :--- |
| **Frontend SPA** | React 18 + TypeScript + Vite + Tailwind CSS | Static hosting (Cloudflare Pages / Vercel / GitHub Pages) | **$0.00** |
| **Backend API** | Node.js Express / Python FastAPI | Cloud Run / Fly.io / Render Free Tier | **$0.00** |
| **AI LLM Engine** | Google Gemini 3.7 Flash via `@google/genai` | Free Tier RPM / Server-side key isolation | **$0.00** |
| **Job Data Feeds** | Arbeitnow, Remotive, JSearch, Company RSS | Public Open APIs & RSS | **$0.00** |
| **HITL Dispatch** | Telegram Bot API + Discord Webhooks | Unlimited free bot messages | **$0.00** |
| **Worker Automation** | Playwright headless engine | Local / container execution | **$0.00** |

---

## 🛠️ Key New Features

### 1. Automated Follow-Up Email Generator & Review Queue
- Drafts company-specific follow-up emails tailored to the interview round and technical discussion points.
- Features a **Saved Drafts Review Queue** to edit, review, and track email status (`DRAFT`, `REVIEWED`, `READY_TO_SEND`, `SENT`).
- 1-click **Open in Gmail / Mail Client** with auto-filled subject and body.

### 2. Automated Interview Scheduling Engine
- Connects Google Calendar and Microsoft Outlook 365.
- Computes non-conflicting interview windows aligned with company timezones.
- 1-click **Add Hold to Google / Outlook Calendar** or export `.ics` file.
- Generates ready-to-send availability responses for recruiters.

### 3. Skill Gap Analysis & Top 10 Career Growth Roadmap
- Aggregates the top 10 most in-demand market requirements from applied jobs.
- Maps requirements against the candidate's core competencies.
- Provides actionable steps to bridge gaps, hands-on production projects to build, official specifications to study, and ATS resume bullet formulas.

### 4. Universal Multi-Device Job Portal Reader & Injector
- **Active Clipboard Listener:** Automatically detects job links copied from LinkedIn, Indeed, Glassdoor, Greenhouse, Lever, and Workday on laptop, desktop, or mobile.
- **Universal Bookmarklet:** Drag-and-drop bookmarklet injecting a floating `[⚡ 1-Click AutoApply HITL]` button directly onto any third-party job portal page.
- **Instant Parser:** Parses foreign job postings on the fly and routes them directly into the tailoring engine.

---

## 🚀 Quickstart & Development

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Installation & Run

```bash
# 1. Clone repository
git clone https://github.com/your-org/autoapply-hitl-engine.git
cd autoapply-hitl-engine

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Add GEMINI_API_KEY if running outside AI Studio sandbox

# 4. Start full-stack development server (Port 3000)
npm run dev

# 5. Build production bundle
npm run build
```

---

## 🔒 Security & Privacy
- **Zero Client-Side Keys:** All Gemini AI calls and third-party integrations execute strictly server-side.
- **User Data Isolation:** Candidate profiles, application logs, and email drafts are persisted securely per session and synced with isolated server endpoints.
- **Human-in-the-Loop Safety:** No application is ever submitted without explicit candidate approval via Telegram, Discord, or the web interface.

---

## 📄 License
Distributed under the **Apache License 2.0**. See `LICENSE` for more information.
