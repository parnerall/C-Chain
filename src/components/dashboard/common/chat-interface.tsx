"use client";

import { useState } from 'react';
import { ChevronLeft, MoreVertical, Paperclip, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Post } from '@/lib/types';

type ChatInterfaceProps = {
  activeContact: Post;
  onBack: () => void;
};

export function ChatInterface({ activeContact, onBack }: ChatInterfaceProps) {
  const [msg, setMsg] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { id: 1, sender: 'them', text: `Boa tarde! Vimos o vosso anúncio de ${activeContact.title}.`, time: '14:20' },
    { id: 2, sender: 'me', text: 'Olá! Sim, ainda está disponível para escoamento.', time: '14:22' },
    { id: 3, sender: 'them', text: 'Conseguem fazer a carga amanhã cedo?', time: '14:25' },
  ]);

  const handleSend = () => {
    if (!msg.trim()) return;
    setChatHistory([...chatHistory, { id: Date.now(), sender: 'me', text: msg, time: 'Agora' }]);
    setMsg("");
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-10rem)] md:h-auto md:min-h-[75vh] rounded-[2rem] border-border overflow-hidden shadow-xl">
      <CardHeader className="p-4 border-b flex-row items-center justify-between bg-card/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Button onClick={onBack} variant="ghost" size="icon" className="lg:hidden">
            <ChevronLeft size={20} />
          </Button>
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-primary text-primary-foreground font-black text-xs">{activeContact.avatar}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-sm font-black font-headline italic">{activeContact.user}</h4>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="text-muted-foreground"><Phone size={20} /></Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground"><MoreVertical size={20} /></Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 bg-muted/30">
        {chatHistory.map((m) => (
          <div key={m.id} className={`flex items-end gap-2 ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-5 py-3 rounded-3xl shadow-sm ${
              m.sender === 'me' 
                ? 'bg-primary text-primary-foreground rounded-br-none' 
                : 'bg-card text-foreground border rounded-bl-none'
            }`}>
              <p className="text-sm font-medium leading-relaxed">{m.text}</p>
              <p className={`text-[9px] mt-1.5 font-black uppercase ${m.sender === 'me' ? 'text-primary-foreground/50' : 'text-muted-foreground/50'}`}>
                {m.time}
              </p>
            </div>
          </div>
        ))}
      </CardContent>

      <CardFooter className="p-4 bg-card border-t">
        <div className="flex items-center gap-2 bg-input/80 p-2 rounded-2xl border border-transparent focus-within:border-ring transition-all w-full">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-ring"><Paperclip size={20} /></Button>
          <Input 
            type="text" 
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escreva uma proposta..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-foreground placeholder:text-muted-foreground h-auto p-0"
          />
          <Button 
            onClick={handleSend}
            className="bg-primary text-primary-foreground p-3 rounded-xl hover:bg-destructive transition-all active:scale-95 aspect-square h-auto"
          >
            <Send size={18} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
