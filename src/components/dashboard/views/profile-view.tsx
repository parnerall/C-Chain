'use client';

import { useState } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Star, Clock, MapPin, Mail, FileText, Briefcase, Pencil } from 'lucide-react';
import type { CompanyProfile } from '@/lib/types';
import { PROFILE_TYPES } from '@/lib/data';
import { EditProfileModal } from '../common/edit-profile-modal';


export function ProfileView() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const profileRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'companyProfiles', user.uid);
  }, [user, firestore]);

  const { data: profile, isLoading } = useDoc<CompanyProfile>(profileRef);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return (
      <Card className="rounded-[2rem] text-center flex flex-col items-center justify-center min-h-[60vh]">
        <CardHeader>
          <CardTitle className="font-headline font-bold text-2xl">Perfil não encontrado</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Não foi possível carregar as informações do seu perfil.</p>
        </CardContent>
      </Card>
    );
  }

  const getProfileTypeLabel = (type: string) => {
    const profileType = PROFILE_TYPES.find(p => p.id === type);
    return profileType ? profileType.label : 'N/A';
  }

  return (
    <>
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
      />

      <Card className="rounded-[2rem] shadow-xl border-border overflow-hidden">
        <CardHeader className="p-8 bg-muted/30 border-b">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
                <Avatar className="w-24 h-24 text-3xl">
                  {profile.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={profile.name} />}
                  <AvatarFallback className="bg-primary text-primary-foreground font-black">{profile.avatarInitials}</AvatarFallback>
                </Avatar>
                <button onClick={() => setIsEditModalOpen(true)} className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil size={24} />
                </button>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h2 className="text-3xl font-black font-headline italic tracking-tighter">{profile.name}</h2>
                  {profile.isVerified && <ShieldCheck className="text-green-500" size={28} />}
                  {profile.subscriptionPlan === 'premium' && <Star className="text-amber-400 fill-amber-400" size={28} />}
              </div>
              <p className="font-bold uppercase text-sm tracking-widest text-destructive">{getProfileTypeLabel(profile.profileType)}</p>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-3 text-muted-foreground text-xs font-bold uppercase">
                  <div className="flex items-center gap-2"><MapPin size={12} /> {profile.provinceId}</div>
                  <div className="flex items-center gap-2"><Clock size={12} /> Membro desde {new Date(profile.createdAt).toLocaleDateString('pt-PT')}</div>
              </div>
            </div>
            <Button onClick={() => setIsEditModalOpen(true)} className="rounded-xl font-black uppercase text-xs tracking-widest">
              <Pencil size={14} className="mr-2" />
              Editar Perfil
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-8 grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
              <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest">Detalhes da Empresa</h4>
              <div className="space-y-4">
                  <InfoItem icon={Mail} label="Email de Contacto" value={profile.email} />
                  <InfoItem icon={FileText} label="NIF" value={profile.nif} />
                  <InfoItem icon={Briefcase} label="Tipo de Perfil" value={getProfileTypeLabel(profile.profileType)} />
                  {profile.description && (
                    <InfoItem icon={FileText} label="Descrição" value={profile.description} />
                  )}
              </div>
          </div>
          <div className="space-y-6">
              <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest">Estado da Conta</h4>
              <div className="space-y-4">
                  <StatusItem label="Email Verificado" status={profile.isEmailVerified} />
                  <StatusItem label="Verificação de Perfil" status={profile.isVerified} />
                  <StatusItem label="Subscrição Premium" status={profile.subscriptionPlan === 'premium'} />
                  <InfoItem icon={FileText} label="Estado do Registo" value={profile.registrationStatus} isBadge={true}/>
              </div>
              <p className="text-xs text-muted-foreground italic mt-4">A verificação e subscrição aumentam a sua visibilidade e credibilidade na rede C-Chain.</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

const InfoItem = ({ icon: Icon, label, value, isBadge = false }: { icon: React.ElementType, label: string, value: string, isBadge?: boolean }) => (
    <div className="flex items-start gap-4">
        <Icon className="text-muted-foreground mt-1 flex-shrink-0" size={16} />
        <div>
            <p className="text-xs text-muted-foreground font-bold uppercase">{label}</p>
            {isBadge ? 
                <Badge variant="secondary" className="mt-1">{value}</Badge> : 
                <p className="text-sm font-bold text-foreground break-words">{value}</p>
            }
        </div>
    </div>
);


const StatusItem = ({ label, status }: { label: string, status: boolean }) => (
    <div className="flex items-start gap-4">
        <ShieldCheck className={`mt-1 ${status ? 'text-green-500' : 'text-muted-foreground/50'}`} size={16} />
        <div>
            <p className="text-xs text-muted-foreground font-bold uppercase">{label}</p>
            <p className={`text-sm font-bold ${status ? 'text-green-600' : 'text-foreground'}`}>
                {status ? 'Ativo' : 'Inativo'}
            </p>
        </div>
    </div>
)

const ProfileSkeleton = () => (
     <Card className="rounded-[2rem] shadow-xl border-border overflow-hidden">
      <CardHeader className="p-8 bg-muted/30 border-b">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="flex-1 space-y-2 text-center md:text-left">
            <Skeleton className="h-8 w-64 mx-auto md:mx-0" />
            <Skeleton className="h-5 w-40 mx-auto md:mx-0" />
            <Skeleton className="h-4 w-72 mx-auto md:mx-0" />
          </div>
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </CardHeader>
      <CardContent className="p-8 grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
            <Skeleton className="h-4 w-32" />
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
        <div className="space-y-6">
             <Skeleton className="h-4 w-32" />
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
      </CardContent>
    </Card>
)
