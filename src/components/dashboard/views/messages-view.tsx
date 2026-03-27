"use client";

import type { Post } from "@/lib/types";
import { ChatInterface } from "../common/chat-interface";
import { ConversationList } from "../common/conversation-list";

type MessagesViewProps = {
    activeChat: Post | null;
    setActiveChat: (post: Post | null) => void;
    onSelectChat: (post: Post) => void;
}

export function MessagesView({ activeChat, setActiveChat, onSelectChat }: MessagesViewProps) {
    return (
        activeChat ? (
            <ChatInterface activeContact={activeChat} onBack={() => setActiveChat(null)} />
        ) : (
            <ConversationList onSelectChat={onSelectChat} />
        )
    )
}
