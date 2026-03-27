'use client';

import { useCollection } from '@/firebase/firestore/use-collection';
import { useMemoFirebase, useUser, useFirestore } from '@/firebase/provider';
import { collection } from 'firebase/firestore';
import { useMemo } from 'react';

// A simple type for the data in the 'following' subcollection.
// The document ID is the ID of the user being followed.
type FollowingLink = {
    followedAt: string;
};

/**
 * A hook that provides a Set of profile IDs that the current user is following.
 * This is optimized for quick lookups in the UI.
 * @returns An object containing the set of followed profile IDs and a loading state.
 */
export function useUserFollowing(): { followingIds: Set<string>, isLoading: boolean } {
    const { user } = useUser();
    const firestore = useFirestore();

    const followingQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        // Query the 'following' subcollection for the current user.
        return collection(firestore, 'companyProfiles', user.uid, 'following');
    }, [firestore, user?.uid]);

    const { data: followingData, isLoading } = useCollection<FollowingLink>(followingQuery);

    // useMemo recalculates the Set only when the followingData changes.
    const followingIds = useMemo(() => {
        if (!followingData) return new Set<string>();
        // The document ID in this subcollection *is* the followedId.
        return new Set(followingData.map(follow => follow.id));
    }, [followingData]);

    return { followingIds, isLoading };
}

    