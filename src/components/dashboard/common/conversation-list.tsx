"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { INITIAL_FEED } from "@/lib/data";
import type { Post } from "@/lib/types";

type ConversationListProps = {
    onSelectChat: (post: Post) => void;
}

export function ConversationList({ onSelectChat }: ConversationListProps) {
    // Using feed as a stand-in for conversation list
    const conversations = INITIAL_FEED.slice(0, 5);

    return (
        <Card className="rounded-[2rem] border-border shadow-sm">
            <CardHeader>
                <CardTitle className="text-2xl font-black font-headline italic tracking-tighter uppercase">Caixa de Entrada</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
            {conversations.map(post => (
                <div 
                    key={post.id} 
                    onClick={() => onSelectChat(post)}
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/50 cursor-pointer border border-transparent hover:border-border transition-all"
                >
                    <Avatar className="w-14 h-14">
                        <AvatarFallback className="bg-primary text-primary-foreground font-black text-base">{post.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-center">
                            <h4 className="font-black font-headline italic text-base">{post.user}</h4>
                            <span className="text-xs font-bold text-muted-foreground">{post.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate font-medium">Início de conversa sobre {post.title}...</p>
                    </div>
                </div>
            ))}
            </CardContent>
        </Card>
    );
}
