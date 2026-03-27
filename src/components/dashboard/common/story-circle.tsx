"use client";

import type { Province } from '@/lib/types';

type StoryCircleProps = {
  province: Province;
};

export function StoryCircle({ province }: StoryCircleProps) {
  return (
    <div className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group">
      <div className={`p-[3px] rounded-full bg-gradient-to-tr ${province.active ? province.color : 'from-slate-200 to-slate-300'}`}>
        <div className="bg-card p-[2px] rounded-full">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-black text-xs text-center px-1 bg-gradient-to-tr ${province.color} shadow-inner group-hover:scale-95 transition-transform`}>
            {province.name.split(' ').map(n => n[0]).join('')}
          </div>
        </div>
      </div>
      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter truncate w-16 text-center">{province.name}</span>
    </div>
  );
}
