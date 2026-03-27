"use client";

import { UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useCollection, useFirestore, useUser, useMemoFirebase, useUserFollowing, toggleFollow } from '@/firebase';
import { collection, limit, query, where } from 'firebase/firestore';
import type { CompanyProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export function RightSidebar() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const suggestionsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
        collection(firestore, 'companyProfiles'),
        where('__name__', '!=', user.uid), // Exclude the current user
        limit(3)
    );
  }, [firestore, user]);

  const { data: suggestions, isLoading: isLoadingSuggestions } = useCollection<CompanyProfile>(suggestionsQuery);
  const { followingIds, isLoading: isLoadingFollowing } = useUserFollowing();

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

  const isLoading = isLoadingSuggestions || isLoadingFollowing;


  return (
    <aside className="hidden xl:block w-80 h-fit sticky top-[calc(theme(spacing.4)_+_70px)] space-y-8">
      <Card className="rounded-[2rem]">
         <CardHeader>
           <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-widest">Sugestões de Rede</CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
           {isLoading ? (
             <>
                <SuggestionSkeleton />
                <SuggestionSkeleton />
                <SuggestionSkeleton />
             </>
           ) : (
             suggestions?.map(s => (
               <div key={s.id} className="flex items-center gap-3">
                 <Avatar className="w-9 h-9">
                   <AvatarFallback className="font-black text-xs bg-muted">{s.avatarInitials}</AvatarFallback>
                 </Avatar>
                 <span className="text-sm font-black font-headline italic flex-1 truncate">{s.name}</span>
                 <Button 
                    size="sm" 
                    variant={followingIds.has(s.id) ? "outline" : "default"}
                    className="text-xs font-black uppercase"
                    onClick={() => handleFollowToggle(s.id)}
                  >
                   {followingIds.has(s.id) ? 'A Seguir' : <><UserPlus size={14} className="mr-2"/> Seguir</>}
                  </Button>
               </div>
             ))
           )}
         </CardContent>
      </Card>
    </aside>
  );
}

const SuggestionSkeleton = () => (
    <div className="flex items-center gap-3">
        <Skeleton className="w-9 h-9 rounded-full" />
        <Skeleton className="h-5 w-2/4" />
        <Skeleton className="h-8 w-24" />
    </div>
)

    