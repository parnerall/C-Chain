'use client';

import { doc, writeBatch, getDoc, type Firestore } from 'firebase/firestore';

/**
 * Atomically toggles a 'follow' on a company profile.
 * It creates documents in the 'following' and 'followers' subcollections.
 * If the follow relationship already exists, it removes the documents.
 * @param db The Firestore instance.
 * @param followerId The ID of the user initiating the follow.
 * @param followedId The ID of the user to be followed.
 */
export async function toggleFollow(db: Firestore, followerId: string, followedId: string) {
  if (!followerId) {
    console.error("User must be logged in to follow another user.");
    return;
  }
  if (followerId === followedId) {
    console.error("User cannot follow themselves.");
    return;
  }

  const followingRef = doc(db, 'companyProfiles', followerId, 'following', followedId);
  const followerRef = doc(db, 'companyProfiles', followedId, 'followers', followerId);
  
  const batch = writeBatch(db);

  try {
    const followingDoc = await getDoc(followingRef);

    const followData = { followedAt: new Date().toISOString() };

    if (followingDoc.exists()) {
      // The user is already following, so we "unfollow".
      batch.delete(followingRef);
      batch.delete(followerRef);
    } else {
      // The user is following.
      batch.set(followingRef, followData);
      batch.set(followerRef, followData);
    }

    await batch.commit();
  } catch (error) {
    console.error("Error toggling follow:", error);
    // In a real app, you might want to show a toast to the user about the failure
  }
}

    