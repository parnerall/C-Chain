"use server";

import type { Post } from '@/lib/types';

export async function runSearch(query: string, posts: Post[]): Promise<Post[]> {
    if (!query) return posts;
    
    const lowerCaseQuery = query.toLowerCase();
    return posts.filter(post => 
        post.title.toLowerCase().includes(lowerCaseQuery) ||
        post.description.toLowerCase().includes(lowerCaseQuery) ||
        post.location.toLowerCase().includes(lowerCaseQuery)
    );
}
