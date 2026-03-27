"use client";

import { Search, PlusCircle, MessageSquare, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type DashboardHeaderProps = {
  view: string;
  onLogoClick: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNewPostClick: () => void;
  onMessagesClick: () => void;
  onLogout: () => void;
};

export function DashboardHeader({
  view,
  onLogoClick,
  searchQuery,
  setSearchQuery,
  onNewPostClick,
  onMessagesClick,
  onLogout,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 bg-background/80 backdrop-blur-xl border-b z-50 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 cursor-pointer" onClick={onLogoClick}>
            <h1 className="text-2xl font-black font-headline italic tracking-tighter">C-<span className="text-destructive">CHAIN</span></h1>
        </div>
        
        <div className="hidden md:flex items-center flex-1 max-w-md mx-auto bg-muted/50 rounded-2xl px-4 py-2 border border-transparent focus-within:border-ring focus-within:bg-background transition-all">
          <Search size={18} className="text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Pesquisar províncias ou produtos..."
            className="bg-transparent border-none focus:ring-0 text-sm font-medium w-full ml-2 h-auto p-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Button 
            onClick={onNewPostClick}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-destructive transition-all active:scale-95 h-auto"
          >
            <PlusCircle size={16} /> Publicar
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onMessagesClick}
            className="relative"
          >
            <MessageSquare size={24} className={view === 'messages' ? 'text-ring' : 'text-foreground'} />
            <span className="absolute -top-0 -right-0 bg-destructive text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-background">2</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
          >
            <User size={24} className="text-foreground" />
          </Button>
        </div>
      </div>
    </header>
  );
}
