"use client";

import { Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth, initiateAnonymousSignIn } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

type LandingPageProps = {
  onRegister: () => void;
  onLogin: () => void;
};

export function LandingPage({ onRegister, onLogin }: LandingPageProps) {
  const auth = useAuth();
  const { toast } = useToast();

  const handleAnonymousLogin = () => {
    initiateAnonymousSignIn(auth);
    toast({
      title: "Login anónimo",
      description: "Iniciou a sessão como convidado.",
    });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-destructive p-6 rounded-lg lg:rounded-[2.5rem] shadow-2xl shadow-destructive/30 mb-8 animate-bounce">
        <Sprout size={60} className="text-destructive-foreground" />
      </div>
      <h1 className="text-5xl md:text-6xl font-black font-headline italic tracking-tighter mb-4">C-<span className="text-destructive">CHAIN</span></h1>
      <p className="text-muted-foreground font-bold uppercase tracking-[0.3em] text-xs max-w-xs mb-12 italic">Angola 2026 • Blockchain & Logística</p>
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <Button 
          onClick={onLogin} 
          size="lg"
          className="w-full py-8 text-sm tracking-widest font-black uppercase rounded-2xl hover:scale-105 transition-all shadow-xl"
        >
          Entrar com Email
        </Button>
        <Button 
          onClick={handleAnonymousLogin} 
          size="lg"
          variant="outline"
          className="w-full py-8 text-sm tracking-widest font-black uppercase rounded-2xl hover:border-destructive transition-all bg-card"
        >
          Entrar (Convidado)
        </Button>
      </div>
       <p className="mt-8 text-sm text-muted-foreground">
        Novo por aqui?{' '}
        <a href="#" onClick={(e) => { e.preventDefault(); onRegister(); }} className="font-bold text-destructive hover:underline">
          Crie um novo perfil.
        </a>
      </p>
    </div>
  );
}
