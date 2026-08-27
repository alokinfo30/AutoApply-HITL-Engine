import { CandidateProfile, JobPosting } from '../types';

export const DEFAULT_CANDIDATE_PROFILE: CandidateProfile = {
  firstName: "Alok",
  lastName: "Kumar",
  email: "alokinfo30@gmail.com",
  phone: "+91 98765 43210",
  currentLocation: "Lucknow, India",
  nativeCountry: "India",
  citizenship: "Indian",
  targetRoles: [],
  skills: [
    "Python", "FastAPI", "TypeScript", "Node.js", "React", "LangChain", 
    "LLM Integration", "Playwright", "Docker", "PostgreSQL", "TailwindCSS", 
    "Agile / Scrum", "Microservices", "CI/CD", "AWS", "GCP"
  ],
  yearsExperience: 6,
  openToRelocation: true,
  requireVisaSponsorship: true,
  targetCountries: [],
  summary: "Experienced Full Stack & AI Software Engineer with 6+ years of hands-on expertise building production-ready distributed microservices, LLM orchestration pipelines, and scalable enterprise web apps. Proven track record leading agile cross-functional engineering teams, optimizing API performance by 40%, and implementing automated workflows.",
  experience: [
    {
      company: "Apex Tech Innovations",
      role: "Lead Full Stack & AI Systems Engineer",
      period: "2022 - Present",
      location: "Bengaluru, India (Remote)",
      achievements: [
        "Architected an end-to-end automated LLM document processing pipeline using Python, FastAPI, and LangChain, reducing manual review latency by 74%.",
        "Engineered scalable microservices in Node.js and TypeScript serving 1.2M+ daily active requests with sub-120ms p99 latency.",
        "Spearheaded the migration of legacy monolith to containerized Docker services on Kubernetes, decreasing cloud infrastructure cost by 35%."
      ],
      techStack: ["Python", "FastAPI", "Node.js", "TypeScript", "React", "PostgreSQL", "Docker", "Kubernetes", "GCP"]
    },
    {
      company: "Nexus Software Solutions",
      role: "Senior Software Engineer",
      period: "2019 - 2022",
      location: "Hyderabad, India",
      achievements: [
        "Led a squad of 7 engineers adhering to Scrum Master practices, improving sprint velocity by 28% across 14 consecutive sprints.",
        "Built responsive web applications and dashboards with React and Tailwind CSS, increasing user engagement and workflow completion rates by 42%.",
        "Developed automated end-to-end browser testing harnesses using Playwright, cutting production regression bugs by 60%."
      ],
      techStack: ["JavaScript", "Node.js", "React", "Express", "Playwright", "MongoDB", "Redis", "Jest"]
    },
    {
      company: "Infotech Core Labs",
      role: "Software Engineer",
      period: "2018 - 2019",
      location: "Noida, India",
      achievements: [
        "Implemented RESTful backend APIs in Python and Django for fintech transaction processing with strict ACID compliance.",
        "Optimized complex PostgreSQL queries and indexing strategies, decreasing query execution times by 55%."
      ],
      techStack: ["Python", "Django", "PostgreSQL", "Git", "Linux"]
    }
  ],
  education: [
    {
      degree: "Bachelor of Technology in Computer Science & Engineering",
      institution: "National Institute of Technology",
      year: "2014 - 2018",
      details: "First Class with Distinction (GPA: 8.7/10.0)"
    }
  ],
  certifications: [
    "Certified Scrum Master (CSM) - Scrum Alliance",
    "Google Cloud Certified - Associate Cloud Engineer",
    "DeepLearning.AI - LangChain & LLM Application Development"
  ]
};

export const INITIAL_SAMPLE_JOBS: JobPosting[] = [
  {
    id: "job-de-001",
    title: "Senior AI & Full Stack Engineer (Visa Sponsorship)",
    company: "Zalando SE / Tech Hub",
    location: "Berlin, Germany",
    country: "Germany",
    countryFormat: "GERMANY_EU",
    visaSponsorship: "Verified Sponsored",
    relocationAssistance: true,
    postedDate: "Today",
    source: "Arbeitnow (Free)",
    url: "https://jobs.zalando.com/en/jobs/tech-berlin-ai-fullstack",
    applyUrl: "https://jobs.zalando.com/apply/104928",
    salary: "€85,000 - €105,000 / year + Equity",
    tags: ["Python", "FastAPI", "TypeScript", "React", "Docker", "Visa Provided"],
    description: `About the Role:
We are seeking a Senior AI & Full Stack Engineer to join our Core Intelligence team in Berlin. You will design and deploy production-grade LLM applications and scalable backend APIs in Python and TypeScript.

Key Responsibilities:
- Build high-throughput microservices using Python (FastAPI) and Node.js.
- Implement intelligent agent workflows using LangChain and generative AI models.
- Collaborate with frontend engineers to build snappy React/Tailwind user interfaces.
- Work within cross-functional agile squads.

Qualifications & Requirements:
- 5+ years of software engineering experience in modern full-stack web architectures.
- Strong proficiency in Python, FastAPI, Node.js, and TypeScript.
- Hands-on experience with LLM orchestration, prompt engineering, or AI agents.
- Fluency in English (German is NOT required; work language is 100% English).

Benefits:
- Complete Visa Sponsorship and relocation flight + temporary apartment in Berlin provided.
- Flexible hybrid work model.`,
    matchScore: 96,
    matchReason: "Strong overlap in Python, FastAPI, TypeScript, React, and LLM orchestration. Full visa sponsorship verified for Germany.",
    matchedKeywords: ["Python", "FastAPI", "TypeScript", "React", "Docker", "LangChain", "LLM", "Agile"],
    missingKeywords: ["Kafka (Minor)"],
    status: "discovered"
  },
  {
    id: "job-sg-002",
    title: "Lead Node.js / AI Solutions Architect",
    company: "Grab Holdings Inc.",
    location: "Singapore (CBD)",
    country: "Singapore",
    countryFormat: "SINGAPORE_AU",
    visaSponsorship: "Verified Sponsored",
    relocationAssistance: true,
    postedDate: "Today",
    source: "JSearch",
    url: "https://grab.careers/jobs/lead-nodejs-ai-sg",
    applyUrl: "https://grab.careers/apply/node-ai-9912",
    salary: "SGD 130,000 - 165,000 / year + Bonus",
    tags: ["Node.js", "TypeScript", "Microservices", "AI Integration", "EP Visa Sponsored"],
    description: `Grab is Southeast Asia's leading superapp. We are looking for a Lead Node.js & AI Architect in Singapore.

What You Will Do:
- Architect distributed backend microservices handling millions of daily transactions.
- Drive the integration of automated AI agents to accelerate operational intelligence.
- Guide engineering squads, enforce code quality, and maintain high test coverage with Playwright/Jest.

Requirements:
- 5+ years of production experience in Node.js, TypeScript, and cloud services (GCP/AWS).
- Strong track record in system design and microservice scaling.
- Experience with browser automation or AI workflow tools is a major plus.
- Employment Pass (EP) visa sponsorship will be processed for qualifying candidates.`,
    matchScore: 92,
    matchReason: "Direct match for Node.js, TypeScript architecture, Playwright testing, and agile squad leadership.",
    matchedKeywords: ["Node.js", "TypeScript", "Microservices", "Playwright", "GCP", "Scrum"],
    missingKeywords: ["Go (Optional)"],
    status: "discovered"
  },
  {
    id: "job-au-003",
    title: "Senior Full Stack Engineer & Scrum Master",
    company: "Canva Technologies",
    location: "Sydney, Australia (Hybrid / Relocation)",
    country: "Australia",
    countryFormat: "SINGAPORE_AU",
    visaSponsorship: "Verified Sponsored",
    relocationAssistance: true,
    postedDate: "Yesterday",
    source: "Remotive (Free)",
    url: "https://canva.com/careers/senior-fullstack-sydney",
    applyUrl: "https://canva.com/apply/fullstack-syd-482",
    salary: "AUD 150,000 - 180,000 + Super + Stocks",
    tags: ["React", "TypeScript", "Python", "Scrum Master", "TSS 482 Visa"],
    description: `Join Canva's Creator Ecosystem team in Sydney!
We are hiring an experienced Full Stack Engineer who also brings solid agile facilitation and Scrum Master practices to help teams deliver at scale.

Role:
- Build slick, performant React frontend interfaces with high responsiveness.
- Write maintainable Python/Node.js backend services.
- Facilitate sprint rituals, retrospectives, and agile delivery.
- Australia TSS 482 Visa sponsorship and comprehensive relocation package provided.`,
    matchScore: 89,
    matchReason: "Perfect dual fit for Full Stack (React/TypeScript/Python) and Scrum Master credentials.",
    matchedKeywords: ["React", "TypeScript", "Python", "Scrum Master", "Agile"],
    missingKeywords: ["GraphQL"],
    status: "discovered"
  },
  {
    id: "job-nl-004",
    title: "AI Integration & Backend Developer (Highly Skilled Migrant Visa)",
    company: "Booking.com Tech",
    location: "Amsterdam, Netherlands",
    country: "Netherlands",
    countryFormat: "GERMANY_EU",
    visaSponsorship: "Verified Sponsored",
    relocationAssistance: true,
    postedDate: "Today",
    source: "Arbeitnow (Free)",
    url: "https://careers.booking.com/amsterdam-ai-backend",
    applyUrl: "https://careers.booking.com/apply/nl-883",
    salary: "€90,000 - €110,000 (30% Tax Ruling Eligible)",
    tags: ["Python", "FastAPI", "Docker", "PostgreSQL", "30% Ruling", "EU Blue Card"],
    description: `Booking.com is looking for an AI & Backend Developer to join our Amsterdam HQ.
We sponsor the Dutch Highly Skilled Migrant Visa / EU Blue Card.

Requirements:
- Deep expertise in Python backend development (FastAPI, Django).
- Knowledge of relational databases (PostgreSQL) and optimization.
- Familiarity with AI tools, LangChain, or LLM integrations.
- Excellent English communication skills.`,
    matchScore: 94,
    matchReason: "Direct match for Python, FastAPI, PostgreSQL, and LLM development. Qualifies for Dutch visa sponsorship.",
    matchedKeywords: ["Python", "FastAPI", "PostgreSQL", "Docker", "LangChain"],
    missingKeywords: ["Cassandra"],
    status: "discovered"
  },
  {
    id: "job-jp-005",
    title: "Full Stack AI Engineer (English Speaking - Tokyo)",
    company: "Mercari Japan",
    location: "Tokyo, Japan (Roppongi)",
    country: "Japan",
    countryFormat: "JAPAN",
    visaSponsorship: "Verified Sponsored",
    relocationAssistance: true,
    postedDate: "2 days ago",
    source: "RSS Feed",
    url: "https://careers.mercari.com/en/job/fullstack-ai-tokyo",
    applyUrl: "https://careers.mercari.com/apply/jp-9302",
    salary: "¥10,000,000 - ¥14,000,000 / year",
    tags: ["TypeScript", "Node.js", "Python", "LLM", "Japan Work Visa"],
    description: `Mercari Tokyo is hiring an English-speaking Full Stack AI Engineer.
No Japanese language required! Work environment is international English.

Responsibilities:
- Build AI-driven features for 20M+ monthly users.
- Full stack development across Node.js/TypeScript and Python AI microservices.
- Full visa sponsorship, COE support, and flight ticket provided.`,
    matchScore: 91,
    matchReason: "Strong fit for TypeScript, Node.js, Python, and automated AI features with zero Japanese language barrier.",
    matchedKeywords: ["TypeScript", "Node.js", "Python", "AI", "Microservices"],
    missingKeywords: ["Kubernetes"],
    status: "discovered"
  }
];
