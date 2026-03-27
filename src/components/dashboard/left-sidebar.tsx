"use client";

import { LayoutDashboard, Search, MessageSquare, ShoppingBag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

type LeftSidebarProps = {
  view: string;
  setView: (view: string) => void;
};

const navItems = [
  { id: 'home', icon: LayoutDashboard, label: 'Feed Geral' },
  { id: 'explore', icon: Search, label: 'Explorar' },
  { id: 'messages', icon: MessageSquare, label: 'Negociações' },
  { id: 'market', icon: ShoppingBag, label: 'Oportunidades' },
  { id: 'profile', icon: User, label: 'Certificação' },
];

export function LeftSidebar({ view, setView }: LeftSidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col gap-2 w-64 h-fit sticky top-[calc(theme(spacing.4)_+_70px)]">
      {navItems.map(item => (
        <Button 
          key={item.id}
          variant={view === item.id ? 'default' : 'ghost'}
          onClick={() => setView(item.id)}
          className="flex items-center justify-start gap-4 p-4 h-auto rounded-2xl font-black uppercase text-xs tracking-widest transition-all"
        >
          <item.icon size={20} /> {item.label}
        </Button>
      ))}
    </aside>
  );
}
