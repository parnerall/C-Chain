"use client";

import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Post, UserProfile, CompanyProfile } from '@/lib/types';
import { runSearch } from '@/app/actions';
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection, useFirestore, useUser, useMemoFirebase, useUserLikes } from '@/firebase';

import { DashboardHeader } from './header';
import { LeftSidebar } from './left-sidebar';
import { RightSidebar } from './right-sidebar';
import { MobileNav } from './mobile-nav';
import { HomeView } from './views/home-view';
import { MessagesView } from './views/messages-view';
import { CreatePostModal } from './common/create-post-modal';
import { ExploreView } from './views/explore-view';
import { ProfileView } from './views/profile-view';
import { INITIAL_FEED } from '@/lib/data';


type DashboardProps = {
  onLogout: () => void;
};

const MOCK_USER_PROFILE: UserProfile = {
  location: "Luanda",
  sectors: ["Logística", "Transporte"],
  isVerified: true,
  isSubscriber: false,
};

// --- Local Feed Sorting Logic ---

function getRecencyScore(time: string): number {
    if (!time) return 0;
    const lowerTime = time.toLowerCase();
    if (lowerTime.includes('h') || lowerTime.includes('m') || lowerTime === 'agora') {
        return 1.0;
    }
    if (lowerTime.includes('d')) {
        return 0.5;
    }
    return 0.1; // Default low score for older or unparsed times
}

function sortPostsByFeedScore(posts: Post[], userProfile: UserProfile): Post[] {
    if (!posts || posts.length === 0) return [];

    const maxLikes = Math.max(...posts.map(p => p.likes), 0);

    const scoredPosts = posts.map(post => {
        // Proximity Score (25%)
        const proximityScore = post.location.includes(userProfile.location) ? 1.0 : 0.0;
        
        // Sector Compatibility Score (20%)
        const sectorScore = userProfile.sectors.includes(post.category) ? 1.0 : 0.0;
        
        // Author Verification Score (15%)
        const verificationScore = post.authorIsVerified ? 1.0 : 0.0;
        
        // Author Subscription Score (25%)
        const subscriptionScore = post.authorIsSubscriber ? 1.0 : 0.0;
        
        // Popularity Score (10%)
        const popularityScore = maxLikes > 0 ? post.likes / maxLikes : 0;
        
        // Recency Score (5%)
        const recencyScore = getRecencyScore(post.time);

        const feedScore =
            (proximityScore * 0.25) +
            (sectorScore * 0.20) +
            (verificationScore * 0.15) +
            (subscriptionScore * 0.25) +
            (popularityScore * 0.10) +
            (recencyScore * 0.05);

        return { ...post, feedScore };
    });

    // We don't need to return the feedScore in the final object
    return scoredPosts.sort((a, b) => b.feedScore - a.feedScore).map(({ feedScore, ...rest }) => rest);
}

// --- End of Local Feed Sorting Logic ---


export function Dashboard({ onLogout }: DashboardProps) {
  const [view, setView] = useState('home');
  const [activeChat, setActiveChat] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [feed, setFeed] = useState<Post[]>([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useUser();
  const firestore = useFirestore();
  const { likedPostIds, isLoading: isLoadingLikes } = useUserLikes();

  const postsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'posts'), orderBy('publishedAt', 'desc'));
  }, [firestore]);

  const { data: postsFromDb, isLoading: isLoadingFeed } = useCollection<Post>(postsQuery);

  useEffect(() => {
    const processFeed = async () => {
      let basePosts: Post[] = postsFromDb || [];

      // Use fallback data only if the database is empty and there's no active search.
      if (basePosts.length === 0 && !isLoadingFeed && !searchQuery) {
        basePosts = INITIAL_FEED;
      }

      if (searchQuery) {
        // AI search can still be used
        basePosts = await runSearch(searchQuery, basePosts);
      }
      
      const userProfile = user ? { ...MOCK_USER_PROFILE, isVerified: !!user.emailVerified, isSubscriber: false } : MOCK_USER_PROFILE;

      // Use local sorting instead of AI
      const sortedPosts = sortPostsByFeedScore(basePosts, userProfile);
      
      setFeed(sortedPosts);
    };

    const debounceTimer = setTimeout(() => {
      processFeed();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, postsFromDb, user, isLoadingFeed]);


  const handleViewChange = (newView: string) => {
    setView(newView);
    if(newView !== 'messages') {
        setActiveChat(null);
    }
  }

  const handleSelectChat = (post: Post) => {
    setActiveChat(post);
    setView('messages');
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <CreatePostModal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)} 
      />

      <DashboardHeader
        view={view}
        onLogoClick={() => handleViewChange('home')}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNewPostClick={() => setIsPostModalOpen(true)}
        onMessagesClick={() => handleViewChange('messages')}
        onLogout={onLogout}
      />

      <div className="max-w-7xl mx-auto flex gap-8 p-0 md:p-8">
        <LeftSidebar view={view} setView={handleViewChange} />

        <main className="flex-1 min-w-0">
          {view === 'messages' ? (
            <MessagesView 
                activeChat={activeChat} 
                setActiveChat={setActiveChat}
                onSelectChat={handleSelectChat}
            />
          ) : view === 'home' ? (
            <HomeView 
              feed={feed}
              isLoading={isLoadingFeed || isLoadingLikes}
              onSelectChat={handleSelectChat}
              likedPostIds={likedPostIds}
              onNewPostClick={() => setIsPostModalOpen(true)}
            />
          ) : view === 'profile' ? (
            <ProfileView />
          ) : <ExploreView />}
        </main>
        
        <RightSidebar />
      </div>

      <MobileNav view={view} setView={handleViewChange} onNewPostClick={() => setIsPostModalOpen(true)} />
    </div>
  );
}
