'use client';

import { useCollection, type WithId } from '@/firebase/firestore/use-collection';
import { useMemoFirebase, useUser, useFirestore } from '@/firebase/provider';
import { collection } from 'firebase/firestore';
import { useMemo } from 'react';
import type { PostLike } from '@/lib/types';

/**
 * A hook that provides a Set of post IDs that the current user has liked.
 * This is optimized for quick lookups in the UI to see if a post is liked.
 * @returns An object containing the set of liked post IDs and a loading state.
 */
export function useUserLikes(): { likedPostIds: Set<string>, isLoading: boolean } {
    const { user } = useUser();
    const firestore = useFirestore();

    const likesQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        // Query the 'likes' subcollection for the current user.
        return collection(firestore, 'companyProfiles', user.uid, 'likes');
    }, [firestore, user?.uid]);

    // useCollection provides a real-time stream of the user's likes.
    const { data: likesData, isLoading } = useCollection<PostLike>(likesQuery);

    // useMemo recalculates the Set only when the likesData changes.
    const likedPostIds = useMemo(() => {
        if (!likesData) return new Set<string>();
        // The document ID in this subcollection *is* the postId, providing a fast way to check for a like.
        return new Set(likesData.map((like: WithId<PostLike>) => like.id));
    }, [likesData]);

    return { likedPostIds, isLoading };
}
