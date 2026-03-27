"use client";

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft } from 'lucide-react';

type LoginFormProps = {
  onBack: () => void;
  onRegisterClick: () => void;
};

export function LoginForm({ onBack, onRegisterClick }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();

  const handleLogin = () => {
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Campos em falta",
        description: "Por favor, preencha o email e a senha.",
      });
      return;
    }
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo(a) de volta!",
        });
        // O `useUser` hook em page.tsx irá tratar do redirecionamento para o dashboard
      })
      .catch((error) => {
        let description = "Ocorreu um erro. Por favor, tente novamente.";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          description = "Email ou senha incorretos.";
        }
        toast({
          variant: "destructive",
          title: "Erro no Login",
          description: description,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden border-border relative">
        <Button onClick={onBack} variant="ghost" size="icon" className="absolute top-6 left-6">
            <ChevronLeft />
        </Button>
        <CardContent className="p-6 sm:p-10">
          <div className="text-center mb-10 mt-8">
            <h2 className="text-3xl font-black font-headline italic tracking-tighter uppercase">Login C-<span className="text-destructive">Chain</span></h2>
            <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest mt-2">Acesse a sua conta</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase text-muted-foreground ml-2 mb-1 block">Email</label>
              <Input 
                type="email" 
                placeholder="seu.email@empresa.com"
                className="h-auto rounded-2xl px-6 py-4 text-sm font-black focus:border-destructive focus:bg-card transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-muted-foreground ml-2 mb-1 block">Senha</label>
              <Input 
                type="password" 
                placeholder="••••••••••"
                className="h-auto rounded-2xl px-6 py-4 text-sm font-black focus:border-destructive focus:bg-card transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleLogin} 
              disabled={isLoading}
              className="w-full py-7 rounded-2xl text-xs font-black uppercase hover:bg-destructive transition-all shadow-lg"
            >
              {isLoading ? 'A entrar...' : 'Entrar na Plataforma'}
            </Button>
          </div>

           <p className="mt-8 text-center text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); onRegisterClick(); }} className="font-bold text-destructive hover:underline">
              Registe-se agora.
            </a>
          </p>
        </CardContent>
      </Card>
      <p className="mt-8 text-[9px] font-black text-muted-foreground/50 uppercase tracking-[0.4em]">Auditado pelo Ministério da Agricultura e Pescas</p>
    </div>
  );
}
