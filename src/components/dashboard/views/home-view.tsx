"use client";

import { useState } from 'react';
import type { Post } from '@/lib/types';
import { PostCard } from '../common/post-card';
import { PostCardSkeleton } from '../common/post-card-skeleton';
import { EditPostModal } from '../common/edit-post-modal';
import { useFirestore } from '@/firebase';
import { deletePost } from '@/firebase/posts';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CreatePostWidget } from './common/create-post-widget';

type HomeViewProps = {
  feed: Post[];
  isLoading: boolean;
  onSelectChat: (post: Post) => void;
  likedPostIds: Set<string>;
  onNewPostClick: () => void;
};

export function HomeView({ feed, isLoading, onSelectChat, likedPostIds, onNewPostClick }: HomeViewProps) {
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const firestore = useFirestore();
  const { toast } = useToast();
  
  const handleDeletePost = async () => {
    if (!postToDelete || !firestore) return;

    setIsDeleting(true);
    try {
      await deletePost(firestore, postToDelete.id, postToDelete.image);
      toast({
        title: "Publicação eliminada",
        description: "A sua publicação foi removida da rede.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao eliminar",
        description: "Não foi possível eliminar a publicação. Tente novamente.",
      });
      console.error(error);
    } finally {
      setIsDeleting(false);
      setPostToDelete(null);
    }
  };

  return (
    <>
      <EditPostModal 
        isOpen={!!editingPost}
        onClose={() => setEditingPost(null)}
        post={editingPost}
      />
      <AlertDialog open={!!postToDelete} onOpenChange={(open) => !open && !isDeleting && setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem a certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser revertida. Isto irá eliminar permanentemente a sua publicação.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
              {isDeleting ? 'A eliminar...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-4 md:space-y-6">
        <div className="px-4 md:px-0">
          <CreatePostWidget onWidgetClick={onNewPostClick} />
        </div>
        
        <div className="flex items-center gap-4 px-4 md:px-0 pt-2">
            <hr className="flex-1 border-t border-border" />
        </div>

        {/* Feed */}
        <div className="space-y-4 md:space-y-6 px-4 md:px-0 pb-24 lg:pb-0">
          {isLoading ? (
            <>
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
            </>
          ) : (
            <>
              {feed.length > 0 ? feed.map(post => (
                <PostCard 
                  key={post.id} 
                  post={post}
                  onSelectChat={() => onSelectChat(post)}
                  onEdit={() => setEditingPost(post)}
                  onDelete={() => setPostToDelete(post)}
                  isLiked={likedPostIds.has(post.id)}
                />
              )) : (
                <div className="text-center py-20 bg-card rounded-2xl">
                  <p className="text-muted-foreground font-bold">
                    Nenhuma oportunidade encontrada no seu feed.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Siga outros perfis ou crie uma publicação para começar.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
