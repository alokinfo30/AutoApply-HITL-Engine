// Comprehensive World Countries & Tech Role Keywords for 100% Free AutoApply HITL Engine

export interface CountryOption {
  code: string;
  name: string;
  region: 'Europe' | 'Americas' | 'Asia-Pacific' | 'Middle East & Africa';
  popularTechHub?: boolean;
  commonCities: string[];
  cvFormatStandard: 'GERMANY_EU' | 'UK_STANDARD' | 'US_GLOBAL' | 'SINGAPORE_AU' | 'JAPAN' | 'UAE_MIDDLE_EAST';
}

export const ALL_WORLD_COUNTRIES: CountryOption[] = [
  // Europe
  { code: 'DE', name: 'Germany', region: 'Europe', popularTechHub: true, commonCities: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne', 'Stuttgart'], cvFormatStandard: 'GERMANY_EU' },
  { code: 'NL', name: 'Netherlands', region: 'Europe', popularTechHub: true, commonCities: ['Amsterdam', 'Rotterdam', 'Utrecht', 'Eindhoven', 'The Hague'], cvFormatStandard: 'GERMANY_EU' },
  { code: 'GB', name: 'United Kingdom', region: 'Europe', popularTechHub: true, commonCities: ['London', 'Manchester', 'Edinburgh', 'Cambridge', 'Bristol', 'Birmingham'], cvFormatStandard: 'UK_STANDARD' },
  { code: 'IE', name: 'Ireland', region: 'Europe', popularTechHub: true, commonCities: ['Dublin', 'Cork', 'Galway', 'Limerick'], cvFormatStandard: 'GERMANY_EU' },
  { code: 'SE', name: 'Sweden', region: 'Europe', popularTechHub: true, commonCities: ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala'], cvFormatStandard: 'GERMANY_EU' },
  { code: 'CH', name: 'Switzerland', region: 'Europe', popularTechHub: true, commonCities: ['Zurich', 'Geneva', 'Lausanne', 'Basel', 'Bern'], cvFormatStandard: 'GERMANY_EU' },
  { code: 'FR', name: 'France', region: 'Europe', popularTechHub: true, commonCities: ['Paris', 'Lyon', 'Toulouse', 'Nantes', 'Bordeaux'], cvFormatStandard: 'GERMANY_EU' },
  { code: 'ES', name: 'Spain', region: 'Europe', popularTechHub: true, commonCities: ['Barcelona', 'Madrid', 'Valencia', 'Seville', 'Málaga'], cvFormatStandard: 'GERMANY_EU' },
  { code: 'PL', name: 'Poland', region: 'Europe', popularTechHub: true, commonCities: ['Warsaw', 'Krakow', 'Wroclaw', 'Gdansk', 'Poznan'], cvFormatStandard: 'GERMANY_EU' },
  { code: 'DK', name: 'Denmark', region: 'Europe', popularTechHub: true, commonCities: ['Copenhagen', 'Aarhus', 'Odense'], cvFormatStandard: 'GERMANY_EU' },
  { code: 'NO', name: 'Norway', region: 'Europe', popularTechHub: true, commonCities: ['Oslo', 'Bergen', 'Trondheim', 'Stavanger'], cvFormatStandard: 'GERMANY_EU' },
  { code: 'FI', name: 'Finland', region: 'Europe', popularTechHub: true, commonCities: ['Helsinki', 'Espoo', 'Tampere', 'Oulu'], cvFormatStandard: 'GERMANY_EU' },
  { code: 'AT', name: 'Austria', region: 'Europe', popularTechHub: true, commonCities: ['Vienna', 'Graz', 'Linz', 'Salzburg'], cvFormatStandard: 'GERMANY_EU' },
  { code: 'BE', name: 'Belgium', region: 'Europe', popularTechHub: true, commonCities: ['Brussels', 'Antwerp', 'Ghent', 'Leuven'], cvFormatStandard: 'GERMANY_EU' },
  { code: 'PT', name: 'Portugal', region: 'Europe', popularTechHub: true, commonCities: ['Lisbon', 'Porto', 'Braga', 'Coimbra'], cvFormatStandard: 'GERMANY_EU' },
  { code: 'IT', name: 'Italy', region: 'Europe', popularTechHub: true, commonCities: ['Milan', 'Rome', 'Turin', 'Bologna'], cvFormatStandard: 'GERMANY_EU' },
  { code: 'CZ', name: 'Czech Republic', region: 'Europe', commonCities: ['Prague', 'Brno', 'Ostrava'], cvFormatStandard: 'GERMANY_EU' },
  { code: 'EE', name: 'Estonia', region: 'Europe', popularTechHub: true, commonCities: ['Tallinn', 'Tartu'], cvFormatStandard: 'GERMANY_EU' },
  { code: 'RO', name: 'Romania', region: 'Europe', commonCities: ['Bucharest', 'Cluj-Napoca', 'Timisoara', 'Iasi'], cvFormatStandard: 'GERMANY_EU' },
  { code: 'HU', name: 'Hungary', region: 'Europe', commonCities: ['Budapest', 'Debrecen', 'Szeged'], cvFormatStandard: 'GERMANY_EU' },
  { code: 'GR', name: 'Greece', region: 'Europe', commonCities: ['Athens', 'Thessaloniki', 'Heraklion'], cvFormatStandard: 'GERMANY_EU' },

  // Americas
  { code: 'US', name: 'United States', region: 'Americas', popularTechHub: true, commonCities: ['San Francisco', 'New York', 'Seattle', 'Austin', 'Boston', 'Los Angeles', 'Chicago', 'San Jose'], cvFormatStandard: 'US_GLOBAL' },
  { code: 'CA', name: 'Canada', region: 'Americas', popularTechHub: true, commonCities: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa', 'Calgary', 'Waterloo'], cvFormatStandard: 'US_GLOBAL' },
  { code: 'BR', name: 'Brazil', region: 'Americas', popularTechHub: true, commonCities: ['São Paulo', 'Rio de Janeiro', 'Florianópolis', 'Belo Horizonte', 'Curitiba'], cvFormatStandard: 'US_GLOBAL' },
  { code: 'MX', name: 'Mexico', region: 'Americas', popularTechHub: true, commonCities: ['Mexico City', 'Guadalajara', 'Monterrey', 'Querétaro'], cvFormatStandard: 'US_GLOBAL' },
  { code: 'AR', name: 'Argentina', region: 'Americas', commonCities: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza'], cvFormatStandard: 'US_GLOBAL' },
  { code: 'CL', name: 'Chile', region: 'Americas', commonCities: ['Santiago', 'Valparaíso', 'Concepción'], cvFormatStandard: 'US_GLOBAL' },
  { code: 'CO', name: 'Colombia', region: 'Americas', commonCities: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla'], cvFormatStandard: 'US_GLOBAL' },

  // Asia-Pacific
  { code: 'SG', name: 'Singapore', region: 'Asia-Pacific', popularTechHub: true, commonCities: ['Singapore', 'Jurong East', 'One-North', 'Marina Bay'], cvFormatStandard: 'SINGAPORE_AU' },
  { code: 'AU', name: 'Australia', region: 'Asia-Pacific', popularTechHub: true, commonCities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra'], cvFormatStandard: 'SINGAPORE_AU' },
  { code: 'JP', name: 'Japan', region: 'Asia-Pacific', popularTechHub: true, commonCities: ['Tokyo', 'Osaka', 'Kyoto', 'Fukuoka', 'Yokohama', 'Nagoya'], cvFormatStandard: 'JAPAN' },
  { code: 'IN', name: 'India', region: 'Asia-Pacific', popularTechHub: true, commonCities: ['Bengaluru', 'Hyderabad', 'Pune', 'Gurugram', 'Noida', 'Mumbai', 'Chennai', 'Lucknow'], cvFormatStandard: 'US_GLOBAL' },
  { code: 'NZ', name: 'New Zealand', region: 'Asia-Pacific', popularTechHub: true, commonCities: ['Auckland', 'Wellington', 'Christchurch'], cvFormatStandard: 'SINGAPORE_AU' },
  { code: 'KR', name: 'South Korea', region: 'Asia-Pacific', popularTechHub: true, commonCities: ['Seoul', 'Pangyo', 'Busan', 'Incheon', 'Daejeon'], cvFormatStandard: 'JAPAN' },
  { code: 'MY', name: 'Malaysia', region: 'Asia-Pacific', commonCities: ['Kuala Lumpur', 'Penang', 'Cyberjaya', 'Johor Bahru'], cvFormatStandard: 'SINGAPORE_AU' },
  { code: 'TH', name: 'Thailand', region: 'Asia-Pacific', commonCities: ['Bangkok', 'Chiang Mai', 'Phuket'], cvFormatStandard: 'SINGAPORE_AU' },
  { code: 'VN', name: 'Vietnam', region: 'Asia-Pacific', commonCities: ['Ho Chi Minh City', 'Hanoi', 'Da Nang'], cvFormatStandard: 'SINGAPORE_AU' },
  { code: 'ID', name: 'Indonesia', region: 'Asia-Pacific', commonCities: ['Jakarta', 'Bandung', 'Bali', 'Surabaya'], cvFormatStandard: 'SINGAPORE_AU' },
  { code: 'PH', name: 'Philippines', region: 'Asia-Pacific', commonCities: ['Manila', 'Cebu City', 'Taguig', 'Makati'], cvFormatStandard: 'SINGAPORE_AU' },
  { code: 'HK', name: 'Hong Kong', region: 'Asia-Pacific', commonCities: ['Hong Kong', 'Cyberport', 'Science Park'], cvFormatStandard: 'SINGAPORE_AU' },
  { code: 'TW', name: 'Taiwan', region: 'Asia-Pacific', commonCities: ['Taipei', 'Hsinchu', 'Taichung', 'Kaohsiung'], cvFormatStandard: 'JAPAN' },

  // Middle East & Africa
  { code: 'AE', name: 'United Arab Emirates', region: 'Middle East & Africa', popularTechHub: true, commonCities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'DIFC'], cvFormatStandard: 'UAE_MIDDLE_EAST' },
  { code: 'SA', name: 'Saudi Arabia', region: 'Middle East & Africa', popularTechHub: true, commonCities: ['Riyadh', 'Jeddah', 'Dammam', 'NEOM'], cvFormatStandard: 'UAE_MIDDLE_EAST' },
  { code: 'IL', name: 'Israel', region: 'Middle East & Africa', popularTechHub: true, commonCities: ['Tel Aviv', 'Herzliya', 'Jerusalem', 'Haifa'], cvFormatStandard: 'US_GLOBAL' },
  { code: 'QA', name: 'Qatar', region: 'Middle East & Africa', commonCities: ['Doha', 'Lusail', 'Al Rayyan'], cvFormatStandard: 'UAE_MIDDLE_EAST' },
  { code: 'ZA', name: 'South Africa', region: 'Middle East & Africa', popularTechHub: true, commonCities: ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria'], cvFormatStandard: 'UK_STANDARD' },
  { code: 'EG', name: 'Egypt', region: 'Middle East & Africa', commonCities: ['Cairo', 'Giza', 'Alexandria'], cvFormatStandard: 'UAE_MIDDLE_EAST' },
  { code: 'NG', name: 'Nigeria', region: 'Middle East & Africa', commonCities: ['Lagos', 'Abuja', 'Port Harcourt'], cvFormatStandard: 'UK_STANDARD' },
  { code: 'KE', name: 'Kenya', region: 'Middle East & Africa', commonCities: ['Nairobi', 'Mombasa', 'Kisumu'], cvFormatStandard: 'UK_STANDARD' }
];

export interface RoleCategory {
  category: string;
  roles: string[];
}

export const SOFTWARE_INDUSTRY_ROLES: RoleCategory[] = [
  {
    category: "AI, Machine Learning & LLMs",
    roles: [
      "AI Engineer",
      "LLM Solutions Engineer",
      "Generative AI Specialist",
      "Machine Learning Engineer",
      "Deep Learning Researcher",
      "Computer Vision Engineer",
      "NLP Engineer",
      "MLOps Engineer",
      "AI Automation Architect",
      "Prompt Engineer / AI Workflow Designer"
    ]
  },
  {
    category: "Full Stack & Frontend Engineering",
    roles: [
      "Senior Full Stack Engineer",
      "Full Stack Developer",
      "Lead Frontend Engineer",
      "React / Next.js Specialist",
      "Vue.js / Nuxt Developer",
      "Angular Software Engineer",
      "TypeScript Frontend Architect",
      "UI/UX Web Application Engineer",
      "Jamstack / Headless Web Developer"
    ]
  },
  {
    category: "Backend & Systems Engineering",
    roles: [
      "Senior Backend Engineer",
      "Python / FastAPI Backend Developer",
      "Node.js / Express Architect",
      "Golang Systems Engineer",
      "Java / Spring Boot Developer",
      "Rust Systems Developer",
      "C# / .NET Core Engineer",
      "Microservices Backend Architect",
      "Distributed Systems Engineer",
      "API & GraphQL Platform Engineer"
    ]
  },
  {
    category: "Cloud, DevOps & Site Reliability (SRE)",
    roles: [
      "DevOps Engineer",
      "Site Reliability Engineer (SRE)",
      "Cloud Architect (AWS / GCP / Azure)",
      "Kubernetes & Containerization Engineer",
      "Infrastructure as Code (Terraform) Engineer",
      "CI/CD Release Automation Engineer",
      "Platform Engineering Specialist"
    ]
  },
  {
    category: "Data Engineering & Analytics",
    roles: [
      "Data Engineer",
      "Big Data Architect (Spark / Kafka)",
      "Analytics Engineer (dbt / Snowflake)",
      "Database Administrator (PostgreSQL / NoSQL)",
      "Data Pipeline Automation Developer",
      "Business Intelligence Engineer"
    ]
  },
  {
    category: "QA, Automation & SDET",
    roles: [
      "Software Development Engineer in Test (SDET)",
      "QA Automation Engineer (Playwright / Cypress)",
      "Headless Browser Automation Specialist",
      "Performance & Load Testing Engineer",
      "Quality Engineering Lead"
    ]
  },
  {
    category: "Mobile Engineering",
    roles: [
      "Senior React Native Developer",
      "Flutter Cross-Platform Engineer",
      "iOS Swift / SwiftUI Developer",
      "Android Kotlin / Jetpack Compose Engineer",
      "Mobile Solutions Architect"
    ]
  },
  {
    category: "Security, Cryptography & Web3",
    roles: [
      "Application Security Engineer",
      "DevSecOps Specialist",
      "Cybersecurity Analyst",
      "Smart Contract & Web3 Developer",
      "Cloud Security Architect"
    ]
  },
  {
    category: "Leadership, Agile & Product Delivery",
    roles: [
      "Scrum Master (CSM / PSM)",
      "Agile Delivery Coach",
      "Technical Lead / Team Lead",
      "Engineering Manager",
      "Principal Software Architect",
      "Technical Product Manager (TPM)"
    ]
  }
];

export const ALL_FLATTENED_ROLES = SOFTWARE_INDUSTRY_ROLES.flatMap(cat => cat.roles);
