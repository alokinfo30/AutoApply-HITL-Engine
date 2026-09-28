import { db } from './index.ts';
import { portfolios, portfolioProjects, portfolioAgentReviews } from './schema.ts';
import { eq, desc, and } from 'drizzle-orm';

export interface ProjectData {
  id?: number;
  title: string;
  description?: string;
  technologies?: string | string[];
  githubRepoUrl?: string;
  liveDemoUrl?: string;
  starsCount?: number;
  forksCount?: number;
  primaryLanguage?: string;
  isFeatured?: boolean;
  agentCurationReason?: string;
  highlightBullets?: string | string[];
  status?: string;
  displayOrder?: number;
}

export async function getPortfolioWithDetailsByUserUid(userUid: string) {
  try {
    const portfolioList = await db
      .select()
      .from(portfolios)
      .where(eq(portfolios.userUid, userUid))
      .limit(1);

    if (portfolioList.length === 0) {
      return null;
    }

    const portfolio = portfolioList[0];

    const projects = await db
      .select()
      .from(portfolioProjects)
      .where(eq(portfolioProjects.portfolioId, portfolio.id))
      .orderBy(portfolioProjects.displayOrder, desc(portfolioProjects.starsCount));

    const reviews = await db
      .select()
      .from(portfolioAgentReviews)
      .where(eq(portfolioAgentReviews.portfolioId, portfolio.id))
      .orderBy(desc(portfolioAgentReviews.createdAt));

    return {
      ...portfolio,
      projects,
      reviews,
    };
  } catch (error) {
    console.error('Error in getPortfolioWithDetailsByUserUid:', error);
    throw new Error('Failed to retrieve portfolio details.', { cause: error });
  }
}

export async function getPortfolioBySlug(slug: string) {
  try {
    const portfolioList = await db
      .select()
      .from(portfolios)
      .where(and(eq(portfolios.slug, slug), eq(portfolios.isPublished, true)))
      .limit(1);

    if (portfolioList.length === 0) {
      return null;
    }

    const portfolio = portfolioList[0];

    const projects = await db
      .select()
      .from(portfolioProjects)
      .where(and(eq(portfolioProjects.portfolioId, portfolio.id), eq(portfolioProjects.status, 'approved')))
      .orderBy(portfolioProjects.displayOrder, desc(portfolioProjects.starsCount));

    return {
      ...portfolio,
      projects,
    };
  } catch (error) {
    console.error('Error in getPortfolioBySlug:', error);
    throw new Error('Failed to retrieve public portfolio.', { cause: error });
  }
}

export async function incrementPortfolioViews(slug: string) {
  try {
    const portfolio = await db.select().from(portfolios).where(eq(portfolios.slug, slug)).limit(1);
    if (portfolio.length > 0) {
      await db
        .update(portfolios)
        .set({ viewsCount: (portfolio[0].viewsCount || 0) + 1 })
        .where(eq(portfolios.id, portfolio[0].id));
    }
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
}

export async function upsertPortfolio(data: {
  userId: number;
  userUid: string;
  slug: string;
  title: string;
  headline?: string;
  bio?: string;
  curatedSummary?: string;
  featuredSkills?: string;
  theme?: string;
  isPublished?: boolean;
  socialLinks?: string;
}) {
  try {
    const existing = await db
      .select()
      .from(portfolios)
      .where(eq(portfolios.userUid, data.userUid))
      .limit(1);

    if (existing.length > 0) {
      const updated = await db
        .update(portfolios)
        .set({
          title: data.title,
          headline: data.headline,
          bio: data.bio,
          curatedSummary: data.curatedSummary,
          featuredSkills: data.featuredSkills,
          theme: data.theme || existing[0].theme,
          isPublished: data.isPublished !== undefined ? data.isPublished : existing[0].isPublished,
          socialLinks: data.socialLinks || existing[0].socialLinks,
          updatedAt: new Date(),
        })
        .where(eq(portfolios.id, existing[0].id))
        .returning();
      return updated[0];
    }

    const inserted = await db
      .insert(portfolios)
      .values({
        userId: data.userId,
        userUid: data.userUid,
        slug: data.slug,
        title: data.title,
        headline: data.headline || null,
        bio: data.bio || null,
        curatedSummary: data.curatedSummary || null,
        featuredSkills: data.featuredSkills || null,
        theme: data.theme || 'modern',
        isPublished: data.isPublished ?? true,
        socialLinks: data.socialLinks || null,
      })
      .returning();

    return inserted[0];
  } catch (error) {
    console.error('Error in upsertPortfolio:', error);
    throw new Error('Failed to create or update portfolio.', { cause: error });
  }
}

export async function syncPortfolioProjects(portfolioId: number, projects: ProjectData[]) {
  try {
    // Delete existing projects and insert newly curated projects
    await db.delete(portfolioProjects).where(eq(portfolioProjects.portfolioId, portfolioId));

    if (projects.length === 0) return [];

    const toInsert = projects.map((p, idx) => ({
      portfolioId,
      title: p.title,
      description: p.description || null,
      technologies: Array.isArray(p.technologies) ? JSON.stringify(p.technologies) : (p.technologies || '[]'),
      githubRepoUrl: p.githubRepoUrl || null,
      liveDemoUrl: p.liveDemoUrl || null,
      starsCount: p.starsCount || 0,
      forksCount: p.forksCount || 0,
      primaryLanguage: p.primaryLanguage || null,
      isFeatured: p.isFeatured ?? true,
      agentCurationReason: p.agentCurationReason || null,
      highlightBullets: Array.isArray(p.highlightBullets) ? JSON.stringify(p.highlightBullets) : (p.highlightBullets || '[]'),
      status: p.status || 'approved',
      displayOrder: p.displayOrder !== undefined ? p.displayOrder : idx,
    }));

    const inserted = await db.insert(portfolioProjects).values(toInsert).returning();
    return inserted;
  } catch (error) {
    console.error('Error in syncPortfolioProjects:', error);
    throw new Error('Failed to update portfolio projects.', { cause: error });
  }
}

export async function createAgentReviewProposal(data: {
  portfolioId: number;
  userUid: string;
  reviewType: string;
  title: string;
  changeSummary: string;
  diffPayload: string;
}) {
  try {
    const inserted = await db
      .insert(portfolioAgentReviews)
      .values({
        portfolioId: data.portfolioId,
        userUid: data.userUid,
        reviewType: data.reviewType,
        title: data.title,
        changeSummary: data.changeSummary,
        diffPayload: data.diffPayload,
        status: 'pending',
      })
      .returning();

    return inserted[0];
  } catch (error) {
    console.error('Error in createAgentReviewProposal:', error);
    throw new Error('Failed to create agent review proposal.', { cause: error });
  }
}

export async function resolveAgentReview(
  reviewId: number,
  status: 'approved' | 'rejected' | 'modified',
  userFeedback?: string
) {
  try {
    const updated = await db
      .update(portfolioAgentReviews)
      .set({
        status,
        userFeedback: userFeedback || null,
        resolvedAt: new Date(),
      })
      .where(eq(portfolioAgentReviews.id, reviewId))
      .returning();

    return updated[0] || null;
  } catch (error) {
    console.error('Error in resolveAgentReview:', error);
    throw new Error('Failed to resolve agent review.', { cause: error });
  }
}
