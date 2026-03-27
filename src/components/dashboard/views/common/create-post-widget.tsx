'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import type { CompanyProfile } from '@/lib/types';
import { doc } from 'firebase/firestore';
import { Image, Video, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type CreatePostWidgetProps = {
  onWidgetClick: () => void;
};

export function CreatePostWidget({ onWidgetClick }: CreatePostWidgetProps) {
    const { user } = useUser();
    const firestore = useFirestore();

    const profileRef = useMemoFirebase(() => {
        if (!user || !firestore || user.isAnonymous) return null;
        return doc(firestore, 'companyProfiles', user.uid);
    }, [user, firestore]);

    const { data: profile, isLoading } = useDoc<CompanyProfile>(profileRef);

    if (user?.isAnonymous) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="p-4 bg-card rounded-[2rem] shadow-sm">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-12 flex-1 rounded-full" />
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 bg-card rounded-[1rem] shadow-sm border border-border">
            <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                    {profile?.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={profile.name} />}
                    <AvatarFallback className="bg-primary text-primary-foreground font-black">
                        {profile?.avatarInitials || 'C'}
                    </AvatarFallback>
                </Avatar>
                <button onClick={onWidgetClick} className="flex-1 text-left bg-card hover:bg-muted/80 border border-border transition-colors h-12 rounded-full px-6 font-bold text-muted-foreground text-sm">
                    Comece uma requisição...
                </button>
            </div>
            <div className="flex justify-around mt-4 pt-3">
                <Button variant="ghost" className="font-bold text-muted-foreground" onClick={onWidgetClick}>
                    <Image className="text-blue-500 mr-2" />
                    Foto
                </Button>
                <Button variant="ghost" className="font-bold text-muted-foreground opacity-50 cursor-not-allowed">
                    <Video className="text-green-500 mr-2" />
                    Vídeo
                </Button>
                <Button variant="ghost" className="font-bold text-muted-foreground opacity-50 cursor-not-allowed">
                    <Calendar className="text-orange-500 mr-2" />
                    Evento
                </Button>
            </div>
        </div>
    );
}
