'use client';

import { doc, writeBatch, increment, getDoc, type Firestore, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { getApp } from 'firebase/app';

/**
 * Atomically toggles a 'like' on a post.
 * It creates a 'like' document in the user's profile and increments the post's like counter.
 * If the like already exists, it removes the document and decrements the counter.
 * @param db The Firestore instance.
 * @param userId The ID of the user toggling the like.
 * @param postId The ID of the post being liked/unliked.
 */
export async function togglePostLike(db: Firestore, userId: string, postId: string) {
  if (!userId) {
    console.error("User must be logged in to like a post.");
    // In a real app, you might want to show a toast to prompt login
    return;
  }

  const likeRef = doc(db, 'companyProfiles', userId, 'likes', postId);
  const postRef = doc(db, 'posts', postId);
  
  const batch = writeBatch(db);

  try {
    const likeDoc = await getDoc(likeRef);

    if (likeDoc.exists()) {
      // The user has already liked the post, so we "unlike" it.
      batch.delete(likeRef);
      batch.update(postRef, { likes: increment(-1) });
    } else {
      // The user is liking the post.
      batch.set(likeRef, { 
        postId: postId, 
        companyProfileId: userId,
        likedAt: new Date().toISOString()
      });
      batch.update(postRef, { likes: increment(1) });
    }

    await batch.commit();
  } catch (error) {
    console.error("Error toggling like on post:", error);
    // In a real app, you might want to show a toast to the user about the failure
  }
}

/**
 * Deletes a post document from Firestore and its associated image from Storage.
 * @param db The Firestore instance.
 * @param postId The ID of the post to delete.
 * @param imageUrl The full URL of the image to delete from Storage (optional).
 */
export async function deletePost(db: Firestore, postId: string, imageUrl?: string) {
  if (!postId) {
    throw new Error("Post ID is required to delete a post.");
  }
  const postRef = doc(db, 'posts', postId);

  // Delete the Firestore document
  await deleteDoc(postRef);

  // If there's an image, delete it from Firebase Storage
  if (imageUrl && (imageUrl.includes('firebasestorage.googleapis.com') || imageUrl.includes('storage.googleapis.com'))) {
    const storage = getStorage(getApp());
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (storageError: any) {
      if (storageError.code === 'storage/object-not-found') {
        console.warn(`Image at ${imageUrl} not found in Storage, but post document ${postId} was deleted.`);
      } else {
        // Log other storage errors but don't block the UI from reflecting the deletion
        console.error("Error deleting image from storage:", storageError);
      }
    }
  }
}
