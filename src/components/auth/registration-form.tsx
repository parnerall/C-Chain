"use client";

import React, { useState } from 'react';
import { Sprout, Truck, ShoppingBag, UploadCloud, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from '@/components/ui/progress';
import { PROVINCE_STORIES, PROFILE_TYPES } from '@/lib/data';
import { Checkbox } from '../ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

type RegistrationFormProps = {
  onComplete: () => void;
  onLoginClick: () => void;
};

const iconMap = { Sprout, Truck, ShoppingBag };

export function RegistrationForm({ onComplete, onLoginClick }: RegistrationFormProps) {
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    nif: '',
    province: 'Luanda',
    email: '',
    password: '',
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleFinalSubmit = async () => {
    if (!formData.email || !formData.password || !formData.name || !formData.nif || !formData.type) {
        toast({
            variant: "destructive",
            title: "Campos em falta",
            description: "Por favor, preencha todos os campos obrigatórios.",
        });
        return;
    }
    setIsLoading(true);

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        // Send verification email
        await sendEmailVerification(user);

        const profileData = {
            name: formData.name,
            nif: formData.nif,
            profileType: formData.type,
            provinceId: formData.province,
            email: formData.email,
            description: "",
            commercialLicenseDocumentUrl: "",
            isEmailVerified: user.emailVerified,
            registrationStatus: 'pending',
            isVerified: false,
            subscriptionPlan: 'none',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            avatarInitials: formData.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()
        };

        if (firestore) {
          const profileRef = doc(firestore, 'companyProfiles', user.uid);
          setDocumentNonBlocking(profileRef, profileData, { merge: false });
        }
        
        toast({
            title: "Registo quase concluído!",
            description: "Enviámos um email de verificação. Por favor, confirme a sua conta.",
        });
        onComplete();

    } catch (error: any) {
        let description = "Ocorreu um erro durante o registo.";
        if (error.code === 'auth/email-already-in-use') {
            description = "Este endereço de email já está a ser utilizado.";
        } else if (error.code === 'auth/weak-password') {
            description = "A senha é demasiado fraca. Use pelo menos 6 caracteres.";
        }
        toast({
            variant: "destructive",
            title: "Erro no Registo",
            description: description,
        });
    } finally {
        setIsLoading(false);
    }
  };


  const progressValue = (step / 3) * 100;
  
  const ProfileIcon = ({ type }: { type: string }) => {
    const Icon = iconMap[type as keyof typeof iconMap];
    return Icon ? <Icon size={24} /> : null;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border-border">
        <Progress value={progressValue} className="h-2 w-full rounded-none bg-muted [&>*]:bg-destructive" />
        <CardContent className="p-6 sm:p-10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-black font-headline italic tracking-tighter uppercase">Registo <span className="text-destructive">C-Chain</span></h2>
            <span className="bg-muted px-4 py-1 rounded-full text-[10px] font-black uppercase text-muted-foreground tracking-widest">Passo {step}/3</span>
          </div>

          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest mb-6">Selecione o seu perfil na rede</p>
              <div className="grid grid-cols-1 gap-4">
                {PROFILE_TYPES.map((profile) => (
                  <button 
                    key={profile.id}
                    onClick={() => { setFormData({...formData, type: profile.id}); handleNext(); }}
                    className={`flex items-center gap-5 p-6 rounded-3xl border-2 text-left transition-all ${formData.type === profile.id ? 'border-destructive bg-destructive/5' : 'border-border bg-card hover:border-muted-foreground/50'}`}
                  >
                    <div className={`p-3 rounded-2xl transition-colors ${formData.type === profile.id ? 'bg-destructive text-destructive-foreground' : 'bg-muted text-foreground'}`}>
                      <ProfileIcon type={profile.icon} />
                    </div>
                    <div>
                      <h4 className="font-black font-headline italic text-sm text-foreground">{profile.label}</h4>
                      <p className="text-xs text-muted-foreground font-medium">{profile.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest mb-2">Informações da Entidade e Login</p>
              <div className="space-y-4">
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} type="text" placeholder="Nome Comercial" className="h-auto rounded-2xl px-6 py-4 text-sm font-black focus:border-destructive focus:bg-card transition-all" />
                <Input value={formData.nif} onChange={(e) => setFormData({...formData, nif: e.target.value})} type="text" placeholder="NIF (Número de Identificação Fiscal)" className="h-auto rounded-2xl px-6 py-4 text-sm font-black focus:border-destructive focus:bg-card transition-all" />
                <Select value={formData.province} onValueChange={(value) => setFormData({...formData, province: value})}>
                  <SelectTrigger className="h-auto w-full rounded-2xl px-6 py-4 text-sm font-black focus:border-destructive focus:bg-card transition-all">
                    <SelectValue placeholder="Selecione a província" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCE_STORIES.map(p => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                 <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} type="email" placeholder="Email de Acesso" className="h-auto rounded-2xl px-6 py-4 text-sm font-black focus:border-destructive focus:bg-card transition-all" />
                 <Input value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} type="password" placeholder="Senha de Acesso" className="h-auto rounded-2xl px-6 py-4 text-sm font-black focus:border-destructive focus:bg-card transition-all" />
              </div>
              <div className="flex gap-4 pt-4">
                <Button onClick={handleBack} variant="ghost" className="flex-1 py-6 text-xs font-black uppercase">Voltar</Button>
                <Button onClick={handleNext} className="flex-[2] py-6 rounded-2xl text-xs font-black uppercase hover:bg-destructive transition-all">Próximo</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="text-center p-8 bg-green-500/10 rounded-3xl border border-green-500/20">
                 <ShieldCheck size={48} className="text-green-600 mx-auto mb-4" />
                 <h4 className="text-green-800 font-black font-headline italic uppercase tracking-tighter">Quase lá!</h4>
                 <p className="text-green-700/80 text-xs font-medium mt-2">Os seus dados serão validados pelo Smart Contract da rede nacional.</p>
               </div>
               <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 border-2 border-dashed rounded-2xl hover:border-destructive cursor-pointer transition-all">
                    <UploadCloud className="text-muted-foreground" />
                    <span className="text-[10px] font-black uppercase text-muted-foreground">Upload Alvará Comercial (PDF/JPG)</span>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <Checkbox id="terms" className="rounded-md border-muted-foreground text-destructive focus:ring-destructive" />
                    <label htmlFor="terms" className="text-xs font-bold text-muted-foreground uppercase cursor-pointer">Aceito os termos da C-Chain Angola</label>
                  </div>
               </div>
               <div className="flex gap-4">
                <Button onClick={handleBack} variant="ghost" className="flex-1 py-6 text-xs font-black uppercase">Voltar</Button>
                <Button onClick={handleFinalSubmit} disabled={isLoading} className="flex-[2] py-6 bg-destructive text-destructive-foreground rounded-2xl text-xs font-black uppercase hover:bg-primary transition-all shadow-xl shadow-destructive/20">
                  {isLoading ? 'A finalizar...' : 'Finalizar Registo'}
                </Button>
              </div>
            </div>
          )}

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Já tem conta?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); onLoginClick(); }} className="font-bold text-destructive hover:underline">
              Faça login.
            </a>
          </p>
        </CardContent>
      </Card>
      <p className="mt-8 text-[9px] font-black text-muted-foreground/50 uppercase tracking-[0.4em]">Auditado pelo Ministério da Agricultura e Pescas</p>
    </div>
  );
}
