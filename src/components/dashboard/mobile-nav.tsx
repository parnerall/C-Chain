"use client";

import { LayoutDashboard, Search, MessageSquare, User, Plus } from 'lucide-react';

type MobileNavProps = {
  view: string;
  setView: (view: string) => void;
  onNewPostClick: () => void;
};

export function MobileNav({ view, setView, onNewPostClick }: MobileNavProps) {
  const navItems = [
    { id: 'home', icon: LayoutDashboard },
    { id: 'explore', icon: Search },
    { id: 'messages', icon: MessageSquare },
    { id: 'profile', icon: User },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t px-8 py-4 lg:hidden flex justify-between items-center z-50">
      {navItems.slice(0, 2).map(item => (
        <item.icon
          key={item.id}
          className={view === item.id ? 'text-destructive' : 'text-muted-foreground'}
          size={28}
          onClick={() => setView(item.id)}
        />
      ))}
      <button 
        onClick={onNewPostClick}
        className="bg-primary text-primary-foreground p-4 rounded-2xl -mt-12 border-4 border-background shadow-xl active:scale-95 transition-all"
      >
        <Plus size={24} />
      </button>
      {navItems.slice(2).map(item => (
        <item.icon
          key={item.id}
          className={view === item.id ? 'text-destructive' : 'text-muted-foreground'}
          size={28}
          onClick={() => setView(item.id)}
        />
      ))}
    </nav>
  );
}
