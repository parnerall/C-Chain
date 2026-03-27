'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase, useUser, useUserFollowing, toggleFollow } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { CompanyProfile } from '@/lib/types';
import type { WithId } from '@/firebase/firestore/use-collection';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PROFILE_TYPES } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

export function ExploreView() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const profilesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'companyProfiles');
  }, [firestore]);

  const { data: profiles, isLoading: isLoadingProfiles } = useCollection<CompanyProfile>(profilesQuery);
  const { followingIds, isLoading: isLoadingFollowing } = useUserFollowing();


  const getProfileTypeLabel = (type: string) => {
    const profileType = PROFILE_TYPES.find(p => p.id === type);
    return profileType ? profileType.label : 'N/A';
  }

  const filteredProfiles = useMemo(() => {
    if (!profiles) return [];
    if (!searchQuery) return profiles;

    const lowercasedQuery = searchQuery.toLowerCase();
    return profiles.filter(profile =>
      profile.name.toLowerCase().includes(lowercasedQuery) ||
      profile.provinceId.toLowerCase().includes(lowercasedQuery) ||
      getProfileTypeLabel(profile.profileType).toLowerCase().includes(lowercasedQuery)
    );
  }, [profiles, searchQuery]);

  const handleFollowToggle = (profileId: string) => {
    if (!user || !firestore || user.isAnonymous) {
        toast({
            variant: "destructive",
            title: "Ação necessária",
            description: "Por favor, crie uma conta para seguir outros perfis.",
        });
        return;
    }
    toggleFollow(firestore, user.uid, profileId);
  }

  const isLoading = isLoadingProfiles || isLoadingFollowing;


  return (
    <Card className="rounded-[2rem] shadow-sm min-h-[75vh]">
      <CardHeader>
        <CardTitle className="text-2xl font-black font-headline italic tracking-tighter uppercase">Explorar Rede C-Chain</CardTitle>
        <div className="mt-4 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            type="text"
            placeholder="Pesquisar por nome, província ou tipo de perfil..."
            className="h-auto rounded-2xl pl-12 pr-6 py-4 text-sm font-black focus:border-destructive transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <UserCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProfiles.map((profile) => (
              <UserCard 
                key={profile.id} 
                profile={profile}
                isFollowing={followingIds.has(profile.id)}
                onFollowToggle={() => handleFollowToggle(profile.id)}
                isCurrentUser={profile.id === user?.uid}
              />
            ))}
          </div>
        )}
        {!isLoading && filteredProfiles.length === 0 && (
            <div className="text-center py-20">
                <p className="text-muted-foreground font-bold">
                {searchQuery ? `Nenhum perfil encontrado para "${searchQuery}".` : 'Nenhum perfil encontrado.'}
                </p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}


function UserCard({ profile, isFollowing, onFollowToggle, isCurrentUser }: { profile: WithId<CompanyProfile>, isFollowing: boolean, onFollowToggle: () => void, isCurrentUser: boolean }) {
    const getProfileTypeLabel = (type: string) => {
        const profileType = PROFILE_TYPES.find(p => p.id === type);
        return profileType ? profileType.label : 'N/A';
    }

  return (
    <Card className="rounded-2xl hover:shadow-lg transition-shadow">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <Avatar className="w-20 h-20 text-2xl mb-4">
          {profile.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={profile.name} />}
          <AvatarFallback className="bg-muted font-black">{profile.avatarInitials}</AvatarFallback>
        </Avatar>
        <h3 className="font-black font-headline italic text-lg">{profile.name}</h3>
        <p className="text-destructive font-bold uppercase text-xs tracking-widest">{getProfileTypeLabel(profile.profileType)}</p>
        <p className="text-muted-foreground text-sm mt-1">{profile.provinceId}</p>
        {!isCurrentUser && (
            <Button 
                size="sm" 
                className="mt-4 w-full text-xs font-black uppercase"
                variant={isFollowing ? "outline" : "default"}
                onClick={onFollowToggle}
            >
              {isFollowing ? 'A Seguir' : <><UserPlus size={14} className="mr-2" /> Seguir</>}
            </Button>
        )}
      </CardContent>
    </Card>
  );
}

function UserCardSkeleton() {
    return (
        <Card className="rounded-2xl">
            <CardContent className="p-6 flex flex-col items-center text-center">
                <Skeleton className="w-20 h-20 rounded-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-1" />
                <Skeleton className="h-4 w-1/3 mb-4" />
                <Skeleton className="h-9 w-full" />
            </CardContent>
        </Card>
    );
}

    