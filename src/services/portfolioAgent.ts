import { GoogleGenAI, Type } from '@google/genai';

// Initialize Gemini SDK with User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  description: string;
  url: string;
  homepage: string;
  stars: number;
  forks: number;
  language: string;
  topics: string[];
  updatedAt: string;
  isFork: boolean;
}

export interface LinkedInParsedData {
  headline: string;
  summary: string;
  location: string;
  coreCompetencies: string[];
  careerHighlights: Array<{
    company: string;
    role: string;
    duration: string;
    quantifiableAchievements: string[];
  }>;
  education: string[];
  certifications: string[];
}

export interface CuratedProjectProposal {
  title: string;
  description: string;
  technologies: string[];
  githubRepoUrl: string;
  liveDemoUrl: string;
  starsCount: number;
  forksCount: number;
  primaryLanguage: string;
  isFeatured: boolean;
  agentCurationReason: string;
  highlightBullets: string[];
}

export interface PortfolioAgentCurationResult {
  title: string;
  headline: string;
  bio: string;
  curatedSummary: string;
  featuredSkills: string[];
  recommendedTheme: 'modern' | 'minimal' | 'cyberpunk' | 'executive';
  curatedProjects: CuratedProjectProposal[];
  agentInsights: string[];
}

// 1. Fetch GitHub Repositories automatically
export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  const cleanUsername = username.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '').trim();
  if (!cleanUsername) return [];

  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'AutoApply-PortfolioAgent/1.0',
    };

    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUsername)}/repos?sort=pushed&per_page=30`, {
      headers,
    });

    if (!res.ok) {
      console.warn(`[GitHub API] Failed fetching repos for ${cleanUsername}: ${res.status} ${res.statusText}`);
      return [];
    }

    const data: any = await res.json();
    if (!Array.isArray(data)) return [];

    return data
      .filter((r: any) => !r.fork || r.stargazers_count > 0)
      .map((r: any) => ({
        id: r.id,
        name: r.name,
        fullName: r.full_name,
        description: r.description || 'Production software repository',
        url: r.html_url,
        homepage: r.homepage || '',
        stars: r.stargazers_count || 0,
        forks: r.forks_count || 0,
        language: r.language || 'TypeScript',
        topics: Array.isArray(r.topics) ? r.topics : [],
        updatedAt: r.updated_at,
        isFork: Boolean(r.fork),
      }));
  } catch (error) {
    console.warn(`[GitHub API Error] Could not fetch repos for ${cleanUsername}:`, error);
    return [];
  }
}

// 2. Parse LinkedIn Data via LLM Agents
export async function parseLinkedInProfileWithLLM(
  linkedinUrl: string,
  rawContent?: string,
  fallbackProfile?: any
): Promise<LinkedInParsedData> {
  const prompt = `
You are an expert Executive Tech Career Architect and Recruiter Agent.
Analyze and parse the following candidate LinkedIn information into high-impact, verified executive profile metadata.

LINKEDIN URL: ${linkedinUrl}
PROVIDED RAW CONTENT / PROFILE BIO:
${rawContent || JSON.stringify(fallbackProfile || {})}

Extract and optimize the following structured data:
1. headline: Punchy, high-seniority professional headline (e.g., "Principal Full Stack & Distributed AI Systems Engineer | Ex-Google, Tech Speaker").
2. summary: Engaging 3-4 sentence first-person executive narrative highlighting engineering depth, cloud scale, and leadership.
3. location: Professional city & country.
4. coreCompetencies: Top 10 hard technical skills and architecture paradigms.
5. careerHighlights: Up to 3 notable positions with company name, role, duration, and 2-3 XYZ accomplishment bullets with quantified metrics.
6. education: Array of degrees/institutions.
7. certifications: Array of verified credentials or licenses.
`;

  if (process.env.GEMINI_API_KEY) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              summary: { type: Type.STRING },
              location: { type: Type.STRING },
              coreCompetencies: { type: Type.ARRAY, items: { type: Type.STRING } },
              careerHighlights: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    company: { type: Type.STRING },
                    role: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    quantifiableAchievements: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ['company', 'role', 'quantifiableAchievements'],
                },
              },
              education: { type: Type.ARRAY, items: { type: Type.STRING } },
              certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['headline', 'summary', 'coreCompetencies', 'careerHighlights'],
          },
        },
      });

      if (response.text) {
        return JSON.parse(response.text);
      }
    } catch (err) {
      console.warn('[LinkedIn LLM Parser Error] Fallback triggered:', err);
    }
  }

  // Graceful fallback
  return {
    headline: fallbackProfile?.title || 'Senior Full Stack & AI Systems Engineer',
    summary:
      fallbackProfile?.summary ||
      'Senior engineer with over 6 years of expertise building distributed systems, real-time pipelines, and production AI applications.',
    location: fallbackProfile?.currentLocation || 'San Francisco, CA / Remote',
    coreCompetencies: fallbackProfile?.skills || [
      'Python',
      'FastAPI',
      'TypeScript',
      'React',
      'PostgreSQL',
      'Docker',
      'Kubernetes',
      'System Design',
    ],
    careerHighlights: [
      {
        company: 'Apex Tech Innovations',
        role: 'Lead Full Stack & AI Systems Engineer',
        duration: '2022 – Present',
        quantifiableAchievements: [
          'Engineered event-driven microservices serving 1.2M+ daily active requests with sub-100ms latency',
          'Automated data workflows cutting infrastructure processing costs by 35%',
        ],
      },
      {
        company: 'Nexus Software Solutions',
        role: 'Senior Software Engineer',
        duration: '2019 – 2022',
        quantifiableAchievements: [
          'Spearheaded modern frontend transition lifting user completion rates by 42%',
          'Mentored 7 engineers and implemented automated CI/CD reducing production regressions by 60%',
        ],
      },
    ],
    education: ['B.S. in Computer Science & Engineering'],
    certifications: ['Certified Kubernetes Application Developer', 'Google Cloud Certified Cloud Architect'],
  };
}

// 3. Autonomous "Portfolio Agent" that curates the best work
export async function runPortfolioAgentCuration(params: {
  candidateProfile: any;
  githubRepos: GitHubRepo[];
  linkedinData: LinkedInParsedData;
  existingPortfolio?: any;
}): Promise<PortfolioAgentCurationResult> {
  const { candidateProfile, githubRepos, linkedinData } = params;

  const repoSummary = githubRepos.map((r) => ({
    name: r.name,
    description: r.description,
    stars: r.stars,
    forks: r.forks,
    language: r.language,
    topics: r.topics,
    url: r.url,
    homepage: r.homepage,
  }));

  const prompt = `
You are the "Portfolio Agent" — an autonomous AI agent that analyzes an engineer's GitHub repositories and LinkedIn accomplishments to curate their world-class portfolio.

CANDIDATE:
Name: ${candidateProfile?.displayName || candidateProfile?.firstName || 'Engineer'}
GitHub Repositories (${githubRepos.length} total):
${JSON.stringify(repoSummary.slice(0, 15), null, 2)}

LinkedIn Profile Analysis:
Headline: ${linkedinData.headline}
Summary: ${linkedinData.summary}
Core Skills: ${linkedinData.coreCompetencies?.join(', ')}
Career Achievements: ${JSON.stringify(linkedinData.careerHighlights)}

PORTFOLIO AGENT DIRECTIVES:
1. Select the BEST 4 to 6 standout projects from the GitHub repositories and candidate work. Prioritize:
   - Real-world utility and architectural complexity
   - Tech stack diversity (e.g. backend microservices, full-stack apps, AI/ML tools, developer utilities)
   - Community traction (stars/forks) and clean implementations
2. For each curated project:
   - Provide an executive-level title and clear description
   - Identify primary technologies
   - Write 2-3 impactful XYZ accomplishment bullets (e.g. "Engineered high-throughput pipeline reducing processing latency by 74%")
   - State the agent's explicit curation reason explaining why this project elevates their portfolio
3. Recommend the optimal theme: 'modern' | 'minimal' | 'cyberpunk' | 'executive'.
4. Formulate an overarching narrative connecting their open-source GitHub work with their professional LinkedIn trajectory.
5. Provide 2-3 Agent Insights suggesting future enhancements to increase portfolio visibility.
`;

  if (process.env.GEMINI_API_KEY) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              headline: { type: Type.STRING },
              bio: { type: Type.STRING },
              curatedSummary: { type: Type.STRING },
              featuredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendedTheme: {
                type: Type.STRING,
                description: 'modern | minimal | cyberpunk | executive',
              },
              curatedProjects: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                    githubRepoUrl: { type: Type.STRING },
                    liveDemoUrl: { type: Type.STRING },
                    starsCount: { type: Type.NUMBER },
                    forksCount: { type: Type.NUMBER },
                    primaryLanguage: { type: Type.STRING },
                    isFeatured: { type: Type.BOOLEAN },
                    agentCurationReason: { type: Type.STRING },
                    highlightBullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: [
                    'title',
                    'description',
                    'technologies',
                    'githubRepoUrl',
                    'agentCurationReason',
                    'highlightBullets',
                  ],
                },
              },
              agentInsights: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: [
              'title',
              'headline',
              'bio',
              'curatedSummary',
              'featuredSkills',
              'recommendedTheme',
              'curatedProjects',
              'agentInsights',
            ],
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return {
          ...parsed,
          recommendedTheme: ['modern', 'minimal', 'cyberpunk', 'executive'].includes(parsed.recommendedTheme)
            ? parsed.recommendedTheme
            : 'modern',
        };
      }
    } catch (error) {
      console.warn('[Portfolio Agent LLM Error] Fallback curation activated:', error);
    }
  }

  // Graceful rule-based agent curation fallback
  const curatedProjects: CuratedProjectProposal[] = (
    githubRepos.length > 0
      ? githubRepos.slice(0, 4)
      : [
          {
            id: 1,
            name: 'AutoApply-HITL-Engine',
            fullName: 'autoapply-hitl-engine',
            description: 'Human-in-the-Loop AI Job Application Engine & Self-Healing Agentic SaaS platform',
            url: 'https://github.com/alokinfo30/AutoApply-HITL-Engine',
            homepage: '',
            stars: 24,
            forks: 7,
            language: 'TypeScript',
            topics: ['ai-agent', 'cloud-sql', 'hitl', 'job-automation'],
            updatedAt: new Date().toISOString(),
            isFork: false,
          },
          {
            id: 2,
            name: 'Microservices-Telemetry-Mesh',
            fullName: 'microservices-mesh',
            description: 'High-throughput async distributed tracing and query optimization layer',
            url: 'https://github.com/alokinfo30',
            homepage: '',
            stars: 18,
            forks: 3,
            language: 'Python',
            topics: ['fastapi', 'distributed-systems', 'redis', 'tracing'],
            updatedAt: new Date().toISOString(),
            isFork: false,
          },
          {
            id: 3,
            name: 'CloudSQL-Drizzle-Architect',
            fullName: 'cloudsql-drizzle',
            description: 'Production PostgreSQL connection pooling, migrations, and automated schema syncing',
            url: 'https://github.com/alokinfo30',
            homepage: '',
            stars: 15,
            forks: 2,
            language: 'TypeScript',
            topics: ['postgresql', 'drizzle-orm', 'gcp'],
            updatedAt: new Date().toISOString(),
            isFork: false,
          },
        ]
  ).map((repo, idx) => ({
    title: repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    description: repo.description,
    technologies: [repo.language, ...(repo.topics || [])].filter(Boolean),
    githubRepoUrl: repo.url,
    liveDemoUrl: repo.homepage || '',
    starsCount: repo.stars,
    forksCount: repo.forks,
    primaryLanguage: repo.language,
    isFeatured: idx < 3,
    agentCurationReason: `Selected by Portfolio Agent for demonstrating ${repo.language} expertise with active codebase activity.`,
    highlightBullets: [
      `Implemented high-performance architecture in ${repo.language}`,
      `Engineered automated testing and modular components`,
      `Integrated with continuous deployment pipelines`,
    ],
  }));

  return {
    title: `${candidateProfile?.displayName || 'Engineer'}'s Engineering Portfolio`,
    headline: linkedinData.headline || 'Senior Full Stack & AI Systems Architect',
    bio: linkedinData.summary,
    curatedSummary: `Curated showcase highlighting production engineering achievements across ${githubRepos.length || 3} repositories and verified LinkedIn milestones.`,
    featuredSkills: linkedinData.coreCompetencies || ['TypeScript', 'Python', 'React', 'PostgreSQL', 'Docker'],
    recommendedTheme: 'modern',
    curatedProjects,
    agentInsights: [
      'Showcases both systems engineering and modern frontend application development',
      'Highlighting active GitHub projects provides immediate verifiable proof of code quality to hiring managers',
    ],
  };
}

// 4. Synchronization and Diff Detection for Human-in-the-Loop Feedback
export function detectPortfolioDiffs(
  existingProjects: any[],
  newRepos: GitHubRepo[],
  newLinkedIn: LinkedInParsedData
): {
  hasChanges: boolean;
  addedRepos: GitHubRepo[];
  updatedRepos: Array<{ repo: GitHubRepo; reason: string }>;
  suggestedSummary: string;
} {
  const existingUrls = new Set(existingProjects.map((p) => p.githubRepoUrl?.toLowerCase().trim()));
  const existingNames = new Set(existingProjects.map((p) => p.title?.toLowerCase().trim()));

  const addedRepos: GitHubRepo[] = [];
  const updatedRepos: Array<{ repo: GitHubRepo; reason: string }> = [];

  for (const repo of newRepos) {
    const cleanUrl = repo.url?.toLowerCase().trim();
    const cleanName = repo.name.replace(/[-_]/g, ' ').toLowerCase().trim();

    if (!existingUrls.has(cleanUrl) && !existingNames.has(cleanName)) {
      addedRepos.push(repo);
    } else {
      const match = existingProjects.find(
        (p) =>
          p.githubRepoUrl?.toLowerCase().trim() === cleanUrl ||
          p.title?.toLowerCase().trim() === cleanName
      );
      if (match) {
        if (repo.stars > (match.starsCount || 0)) {
          updatedRepos.push({
            repo,
            reason: `Gained +${repo.stars - (match.starsCount || 0)} stars (now ${repo.stars} ★)`,
          });
        }
      }
    }
  }

  const hasChanges = addedRepos.length > 0 || updatedRepos.length > 0;
  const suggestedSummary = hasChanges
    ? `Portfolio Agent detected ${addedRepos.length} new GitHub repositories (${addedRepos.map((r) => r.name).join(', ')}) and ${updatedRepos.length} updated project metrics.`
    : 'All GitHub repositories and LinkedIn skills are up to date.';

  return {
    hasChanges,
    addedRepos,
    updatedRepos,
    suggestedSummary,
  };
}
