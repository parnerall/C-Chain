"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { sendEmailVerification, signOut, getAuth } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { MailCheck, RefreshCw } from 'lucide-react';

type EmailVerificationScreenProps = {
  onLogout: () => void;
};

export function EmailVerificationScreen({ onLogout }: EmailVerificationScreenProps) {
  const { user } = useUser();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  // Auto-reload user state to check for verification
  useEffect(() => {
    if (!user) return;

    const intervalId = setInterval(async () => {
      try {
        await user.reload();
        // The onAuthStateChanged listener in FirebaseProvider will detect the change 
        // in emailVerified status and trigger a re-render of the app,
        // which will then show the dashboard.
      } catch (error) {
        // This can happen if the user's session expires, for example.
        // The onAuthStateChanged listener will handle logging the user out.
        console.error("Error reloading user state:", error);
        clearInterval(intervalId); // Stop polling on error
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(intervalId);
  }, [user]);

  const handleResendEmail = async () => {
    if (!user) return;
    setIsSending(true);
    try {
      await sendEmailVerification(user);
      toast({
        title: "Novo email de verificação enviado!",
        description: "Verifique a sua caixa de entrada (e a pasta de spam).",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao reenviar",
        description: "Não foi possível reenviar o email. Por favor, aguarde um pouco e tente novamente.",
      });
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const handleLogoutClick = async () => {
    const auth = getAuth();
    await signOut(auth);
    onLogout();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden border-border">
        <CardHeader className="text-center p-8 bg-muted/30">
            <div className="relative mx-auto w-16 h-16 mb-4">
                <MailCheck className="mx-auto h-16 w-16 text-destructive" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <RefreshCw className="h-8 w-8 text-destructive/80 animate-spin" />
                </div>
            </div>
            <CardTitle className="text-3xl font-black font-headline italic tracking-tighter uppercase">Verifique o seu <span className="text-destructive">Email</span></CardTitle>
            <CardDescription className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest mt-2">Aguardando confirmação da conta</CardDescription>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <p className="text-sm text-muted-foreground mb-6">
            Enviámos um link de verificação para <strong className="text-foreground">{user?.email}</strong>. Assim que clicar no link, esta página será atualizada automaticamente.
          </p>
          <div className="space-y-4">
             <Button
              onClick={handleResendEmail}
              disabled={isSending}
              className="w-full py-7 rounded-2xl text-xs font-black uppercase hover:bg-destructive transition-all shadow-lg"
            >
              {isSending ? 'A enviar...' : 'Reenviar Email de Verificação'}
            </Button>
            <Button
              onClick={handleLogoutClick}
              variant="ghost"
              className="w-full !mt-6 text-xs font-bold uppercase text-muted-foreground"
            >
              Voltar ao Login
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-8">
            Não recebeu o email? Verifique a sua pasta de spam. Se o link expirou, solicite um novo utilizando o botão acima.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
