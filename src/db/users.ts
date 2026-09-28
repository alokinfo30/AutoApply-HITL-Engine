import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export interface UserInput {
  uid: string;
  email: string;
  displayName?: string;
  photoUrl?: string;
  githubUrl?: string;
  githubUsername?: string;
  linkedinUrl?: string;
  linkedinData?: string;
}

export async function getOrCreateUser(input: UserInput) {
  try {
    const existing = await db.select().from(users).where(eq(users.uid, input.uid)).limit(1);
    if (existing.length > 0) {
      // Update with new incoming fields if provided
      const updateData: Record<string, any> = {
        updatedAt: new Date(),
      };
      if (input.email) updateData.email = input.email;
      if (input.displayName) updateData.displayName = input.displayName;
      if (input.photoUrl) updateData.photoUrl = input.photoUrl;
      if (input.githubUrl) updateData.githubUrl = input.githubUrl;
      if (input.githubUsername) updateData.githubUsername = input.githubUsername;
      if (input.linkedinUrl) updateData.linkedinUrl = input.linkedinUrl;
      if (input.linkedinData) updateData.linkedinData = input.linkedinData;

      const updated = await db
        .update(users)
        .set(updateData)
        .where(eq(users.uid, input.uid))
        .returning();
      return updated[0];
    }

    const inserted = await db
      .insert(users)
      .values({
        uid: input.uid,
        email: input.email,
        displayName: input.displayName || null,
        photoUrl: input.photoUrl || null,
        githubUrl: input.githubUrl || null,
        githubUsername: input.githubUsername || null,
        linkedinUrl: input.linkedinUrl || null,
        linkedinData: input.linkedinData || null,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email: input.email,
          updatedAt: new Date(),
        },
      })
      .returning();

    return inserted[0];
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    throw new Error('Failed to synchronize user in database.', { cause: error });
  }
}

export async function getUserByUid(uid: string) {
  try {
    const result = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Error in getUserByUid:', error);
    throw new Error('Failed to retrieve user from database.', { cause: error });
  }
}

export async function updateUserLinks(
  uid: string,
  data: {
    githubUrl?: string;
    githubUsername?: string;
    linkedinUrl?: string;
    linkedinData?: string;
    autoSyncEnabled?: boolean;
    lastSyncedAt?: Date;
  }
) {
  try {
    const updated = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.uid, uid))
      .returning();
    return updated[0] || null;
  } catch (error) {
    console.error('Error in updateUserLinks:', error);
    throw new Error('Failed to update user profile links.', { cause: error });
  }
}
