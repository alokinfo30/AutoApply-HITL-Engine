import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table (keyed to Firebase Auth UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoUrl: text('photo_url'),
  githubUrl: text('github_url'),
  githubUsername: text('github_username'),
  linkedinUrl: text('linkedin_url'),
  linkedinData: text('linkedin_data'), // JSON string parsed by Gemini LLM Agent
  autoSyncEnabled: boolean('auto_sync_enabled').default(true),
  lastSyncedAt: timestamp('last_synced_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Portfolios table
export const portfolios = pgTable('portfolios', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  userUid: text('user_uid').notNull(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  headline: text('headline'),
  bio: text('bio'),
  curatedSummary: text('curated_summary'),
  featuredSkills: text('featured_skills'), // JSON string array of top skills
  theme: text('theme').default('modern'), // 'modern' | 'minimal' | 'cyberpunk' | 'executive'
  status: text('status').default('published'),
  isPublished: boolean('is_published').default(true),
  viewsCount: integer('views_count').default(0),
  socialLinks: text('social_links'), // JSON string with github, linkedin, twitter, website
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Curated Projects Table
export const portfolioProjects = pgTable('portfolio_projects', {
  id: serial('id').primaryKey(),
  portfolioId: integer('portfolio_id')
    .references(() => portfolios.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  description: text('description'),
  technologies: text('technologies'), // JSON string array
  githubRepoUrl: text('github_repo_url'),
  liveDemoUrl: text('live_demo_url'),
  starsCount: integer('stars_count').default(0),
  forksCount: integer('forks_count').default(0),
  primaryLanguage: text('primary_language'),
  isFeatured: boolean('is_featured').default(true),
  agentCurationReason: text('agent_curation_reason'),
  highlightBullets: text('highlight_bullets'), // JSON string array of impact bullets
  status: text('status').default('approved'), // 'approved' | 'suggested' | 'archived'
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// HITL (Human-in-the-Loop) Portfolio Agent Reviews and Sync Diff Proposals
export const portfolioAgentReviews = pgTable('portfolio_agent_reviews', {
  id: serial('id').primaryKey(),
  portfolioId: integer('portfolio_id')
    .references(() => portfolios.id, { onDelete: 'cascade' })
    .notNull(),
  userUid: text('user_uid').notNull(),
  reviewType: text('review_type').notNull(), // 'sync_update' | 'curation_proposal' | 'headline_refinement' | 'new_repo_detected'
  title: text('title').notNull(),
  changeSummary: text('change_summary').notNull(),
  diffPayload: text('diff_payload').notNull(), // JSON string with full proposal details
  status: text('status').default('pending'), // 'pending' | 'approved' | 'rejected' | 'modified'
  userFeedback: text('user_feedback'),
  createdAt: timestamp('created_at').defaultNow(),
  resolvedAt: timestamp('resolved_at'),
});

// Relationships
export const usersRelations = relations(users, ({ many, one }) => ({
  portfolios: many(portfolios),
}));

export const portfoliosRelations = relations(portfolios, ({ one, many }) => ({
  user: one(users, {
    fields: [portfolios.userId],
    references: [users.id],
  }),
  projects: many(portfolioProjects),
  agentReviews: many(portfolioAgentReviews),
}));

export const portfolioProjectsRelations = relations(portfolioProjects, ({ one }) => ({
  portfolio: one(portfolios, {
    fields: [portfolioProjects.portfolioId],
    references: [portfolios.id],
  }),
}));

export const portfolioAgentReviewsRelations = relations(portfolioAgentReviews, ({ one }) => ({
  portfolio: one(portfolios, {
    fields: [portfolioAgentReviews.portfolioId],
    references: [portfolios.id],
  }),
}));
