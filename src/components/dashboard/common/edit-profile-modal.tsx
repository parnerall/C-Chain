'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useFirestore, useUser, errorEmitter, FirestorePermissionError, useFileUpload } from '@/firebase';
import type { CompanyProfile } from '@/lib/types';
import { PROVINCE_STORIES } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


type EditProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  profile: CompanyProfile | null;
};

export function EditProfileModal({ isOpen, onClose, profile }: EditProfileModalProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const { uploadFile } = useFileUpload();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    provinceId: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        description: profile.description || '',
        provinceId: profile.provinceId || 'Luanda',
      });
      setPreviewUrl(profile.avatarUrl || null);
      setSelectedFile(null); 
    }
  }, [profile, isOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = async () => {
    if (!user || !firestore) return;
    setIsLoading(true);

    let avatarUrl = profile?.avatarUrl;

    if (selectedFile) {
        try {
            const filePath = `profile-pictures/${user.uid}/${selectedFile.name}`;
            avatarUrl = await uploadFile(filePath, selectedFile);
        } catch (uploadError) {
            toast({
                variant: "destructive",
                title: "Erro no Upload",
                description: "Não foi possível carregar a sua foto de perfil.",
            });
            setIsLoading(false);
            return;
        }
    }


    const profileRef = doc(firestore, 'companyProfiles', user.uid);
    const updatedData = {
        name: formData.name,
        description: formData.description,
        provinceId: formData.provinceId,
        updatedAt: new Date().toISOString(),
        avatarInitials: formData.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase(),
        avatarUrl: avatarUrl || '',
    };

    try {
      await updateDoc(profileRef, updatedData);

      toast({
          title: "Perfil atualizado!",
          description: "As suas informações foram guardadas com sucesso.",
      });
      onClose();

    } catch (error) {
        console.error("Error updating profile:", error);
        
        const contextualError = new FirestorePermissionError({
          operation: 'update',
          path: profileRef.path,
          requestResourceData: updatedData
        });
        errorEmitter.emit('permission-error', contextualError);

        toast({
            variant: "destructive",
            title: "Erro ao atualizar",
            description: "Não foi possível guardar as alterações. Verifique as suas permissões e tente novamente.",
        });
    } finally {
        setIsLoading(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl rounded-[2.5rem] p-0">
        <DialogHeader className="p-8 pb-4 border-b">
          <DialogTitle className="text-2xl font-black font-headline italic tracking-tighter uppercase">Editar <span className="text-destructive">Perfil</span></DialogTitle>
        </DialogHeader>

        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="flex flex-col items-center gap-4">
              <Avatar className="w-24 h-24 text-3xl">
                {previewUrl ? <AvatarImage src={previewUrl} alt={formData.name} /> : null}
                <AvatarFallback className="bg-primary text-primary-foreground font-black">
                  {formData.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Input id="picture" type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
              <Button asChild variant="outline" className="rounded-xl">
                <label htmlFor="picture">Carregar Foto</label>
              </Button>
          </div>
          <div>
            <label className="text-xs font-black uppercase text-muted-foreground ml-2 mb-1 block">Nome Comercial</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-auto rounded-2xl px-6 py-4 text-sm font-black focus:border-destructive"
            />
          </div>
          <div>
            <label className="text-xs font-black uppercase text-muted-foreground ml-2 mb-1 block">Província</label>
            <Select value={formData.provinceId} onValueChange={(value) => setFormData({...formData, provinceId: value})}>
                <SelectTrigger className="w-full h-auto rounded-2xl px-6 py-4 text-sm font-black focus:border-destructive">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {PROVINCE_STORIES.map(p => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-black uppercase text-muted-foreground ml-2 mb-1 block">Descrição da Empresa</label>
            <Textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva a sua empresa, a sua missão e os seus serviços."
              className="rounded-2xl px-6 py-4 text-sm font-black focus:border-destructive resize-none"
            />
          </div>
        </div>

        <DialogFooter className="p-8 pt-4 border-t">
          <Button onClick={onClose} variant="ghost" className="rounded-xl font-black uppercase text-xs tracking-widest">Cancelar</Button>
          <Button
            onClick={handleSaveChanges}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground py-6 px-8 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary transition-all shadow-xl shadow-destructive/20 active:scale-[0.98]"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Guardar Alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
