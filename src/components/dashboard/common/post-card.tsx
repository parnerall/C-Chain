"use client";

import Image from 'next/image';
import { Heart, MessageSquare, Navigation2, MoreHorizontal, Zap, Edit, Trash2, Star } from 'lucide-react';
import type { Post } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFirestore, useUser } from '@/firebase';
import { togglePostLike } from '@/firebase/posts';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type PostCardProps = {
  post: Post;
  onSelectChat: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isLiked: boolean;
};

export function PostCard({ post, onSelectChat, onEdit, onDelete, isLiked }: PostCardProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const isOwner = user?.uid === post.companyProfileId;

  const handleLikeClick = () => {
    if (!user || user.isAnonymous) {
      toast({
        variant: 'destructive',
        title: 'Funcionalidade restrita',
        description: 'Por favor, crie uma conta para gostar de publicações.',
      });
      return;
    }
    if (!firestore) return;
    togglePostLike(firestore, user.uid, post.id);
  }

  const handleNavigationClick = () => {
    const mapsQuery = encodeURIComponent(`${post.title}, ${post.location}, Angola`);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
    window.open(mapsUrl, '_blank');
    toast({
      title: 'Abrindo Mapa',
      description: `A mostrar a localização para "${post.title}"`,
    });
  };

  return (
    <Card className="rounded-[1rem] overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-border bg-card">
      <CardHeader className="flex-row items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            {post.authorAvatarUrl && <AvatarImage src={post.authorAvatarUrl} alt={post.user} />}
            <AvatarFallback className="bg-primary text-primary-foreground font-black text-sm">{post.avatar}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black font-headline italic">{post.user}</h4>
              {post.authorIsSubscriber && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Star className="text-amber-400 fill-amber-400" size={16} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Membro Premium</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{post.location}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            {post.status === 'URGENTE' && (
                <Badge variant="destructive" className="flex items-center gap-1 animate-pulse">
                    <Zap size={12} /> {post.status}
                </Badge>
            )}
            {post.status !== 'URGENTE' && post.status !== 'Normal' && <Badge variant="secondary">{post.status}</Badge>}
            
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                        <MoreHorizontal size={20} className="text-muted-foreground" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Editar</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Eliminar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
        </div>
      </CardHeader>
      
      <CardContent className="px-5 pb-4 pt-0">
        <h3 className="text-md font-bold ">{post.title}</h3>
        <p className="text-sm text-muted-foreground font-medium mt-1">{post.description}</p>
      </CardContent>

      {post.image && (
        <div className="bg-black">
             <Image 
                src={post.image}
                alt={post.title}
                width={800}
                height={450}
                className="w-full aspect-video object-contain"
                data-ai-hint={post.imageHint}
            />
        </div>
      )}
      
      <CardContent className="p-0">
         {(post.likes > 0) && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground px-5 pt-3 pb-2">
                <Heart size={14} className="text-destructive/80 fill-destructive/80" />
                <span className="font-bold">{post.likes}</span>
            </div>
         )}
        <Separator className={`${post.likes > 0 ? '' : 'hidden'}`} />
        <div className="flex justify-around items-center">
            <Button variant="ghost" size="sm" onClick={handleLikeClick} className="w-full text-muted-foreground font-bold hover:bg-muted/50 rounded-lg py-5">
                <Heart size={18} className={`mr-2 transition-all ${isLiked ? "text-destructive fill-destructive" : ""}`}/>
                Gostar
            </Button>
            <Button variant="ghost" size="sm" onClick={onSelectChat} className="w-full text-muted-foreground font-bold hover:bg-muted/50 rounded-lg py-5">
                <MessageSquare size={18} className="mr-2"/>
                Negociar
            </Button>
            <Button variant="ghost" size="sm" onClick={handleNavigationClick} className="w-full text-muted-foreground font-bold hover:bg-muted/50 rounded-lg py-5">
                <Navigation2 size={18} className="mr-2"/>
                Ver Rota
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
