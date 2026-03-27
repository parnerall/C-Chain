"use client";

import { useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Loader2, UploadCloud } from 'lucide-react';
import { PROVINCE_STORIES, CATEGORIES } from '@/lib/data';
import type { CompanyProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useFileUpload, useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { doc, collection, getDoc } from 'firebase/firestore';

type CreatePostModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
    const { toast } = useToast();
    const firestore = useFirestore();
    const { user } = useUser();
    const { uploadFile } = useFileUpload();
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [newPost, setNewPost] = useState({
        title: '',
        category: 'Logística',
        description: '',
        value: '',
        location: 'Luanda',
        urgency: 'Normal',
        status: 'NOVO',
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          setSelectedFile(file);
          setPreviewUrl(URL.createObjectURL(file));
        }
    };
    
    const resetForm = () => {
        setNewPost({ title: '', category: 'Logística', description: '', value: '', location: 'Luanda', urgency: 'Normal', status: 'NOVO' });
        setSelectedFile(null);
        setPreviewUrl(null);
        setIsUploading(false);
        onClose();
    }

    const handleSubmit = async () => {
        if(!user || !firestore) return;

        setIsUploading(true);

        try {
            const profileRef = doc(firestore, 'companyProfiles', user.uid);
            const profileSnap = await getDoc(profileRef);

            if (!profileSnap.exists()) {
                throw new Error("Perfil da empresa não encontrado.");
            }
            const companyProfile = profileSnap.data() as CompanyProfile;
            
            const postRef = doc(collection(firestore, 'posts'));
            const postId = postRef.id;

            let imageUrl = '';
            if (selectedFile) {
                const filePath = `post-images/${user.uid}/${postId}/${selectedFile.name}`;
                imageUrl = await uploadFile(filePath, selectedFile);
            }
            
            const finalPost = {
                ...newPost,
                image: imageUrl,
                imageHint: '',
                companyProfileId: user.uid,
                user: companyProfile.name || 'Nome Desconhecido',
                avatar: companyProfile.avatarInitials || 'NN',
                authorAvatarUrl: companyProfile.avatarUrl || '',
                likes: 0,
                time: "Agora",
                authorIsVerified: companyProfile.isVerified || false,
                authorIsSubscriber: companyProfile.subscriptionPlan === 'premium',
                publishedAt: new Date().toISOString(),
            };

            setDocumentNonBlocking(postRef, finalPost, {});

            toast({
                title: "Publicação criada!",
                description: "A sua oportunidade está agora visível na rede.",
            });
            
            resetForm();

        } catch (e: any) {
            console.error("Error creating post:", e);
            toast({
                variant: "destructive",
                title: "Erro ao Publicar",
                description: e.message || "Não foi possível criar a publicação.",
            });
            setIsUploading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="sm:max-w-xl rounded-[2.5rem] p-0">
            <DialogHeader className="p-8 pb-4 border-b">
                <DialogTitle className="text-2xl font-black font-headline italic tracking-tighter uppercase">Nova <span className="text-destructive">Requisição</span></DialogTitle>
                <DialogDescription className="text-xs font-black text-muted-foreground uppercase tracking-widest mt-1">Publique na rede nacional</DialogDescription>
            </DialogHeader>

            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div>
                    <label className="text-xs font-black uppercase text-muted-foreground ml-2 mb-1 block">Imagem da Publicação (Opcional)</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-2xl">
                        <div className="space-y-1 text-center">
                            {previewUrl ? (
                                <Image src={previewUrl} alt="Pré-visualização" width={400} height={200} className="mx-auto h-48 w-auto object-contain rounded-lg"/>
                            ) : (
                                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                            )}
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="post-image-upload" className="relative cursor-pointer bg-background rounded-md font-medium text-destructive hover:text-destructive/80 p-1">
                                    <span>Carregar um ficheiro</span>
                                    <input id="post-image-upload" name="post-image-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                </label>
                                <p className="pl-1">ou arraste e solte</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-black uppercase text-muted-foreground ml-2 mb-1 block">Título da Oportunidade</label>
                    <Input 
                        type="text" 
                        placeholder="Ex: Escoamento de 20T de Batata Doce"
                        className="h-auto rounded-2xl px-6 py-4 text-sm font-black focus:border-destructive"
                        value={newPost.title}
                        onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-black uppercase text-muted-foreground ml-2 mb-1 block">Categoria</label>
                        <Select value={newPost.category} onValueChange={(value) => setNewPost({...newPost, category: value})}>
                            <SelectTrigger className="w-full h-auto rounded-2xl px-6 py-4 text-sm font-black focus:border-destructive">
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-xs font-black uppercase text-muted-foreground ml-2 mb-1 block">Localização</label>
                        <Select value={newPost.location} onValueChange={(value) => setNewPost({...newPost, location: value})}>
                            <SelectTrigger className="w-full h-auto rounded-2xl px-6 py-4 text-sm font-black focus:border-destructive">
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                {PROVINCE_STORIES.map(p => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-black uppercase text-muted-foreground ml-2 mb-1 block">Descrição Detalhada</label>
                    <div className="relative">
                        <Textarea 
                            rows={3}
                            placeholder="Descreva as especificações, prazos e condições..."
                            className="rounded-2xl px-6 py-4 text-sm font-black focus:border-destructive resize-none"
                            value={newPost.description}
                            onChange={(e) => setNewPost({...newPost, description: e.target.value})}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-black uppercase text-muted-foreground ml-2 mb-1 block">Valor Estimado (Kz)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <Input 
                                type="text" 
                                placeholder="Sob consulta"
                                className="h-auto rounded-2xl pl-10 pr-6 py-4 text-sm font-black focus:border-destructive"
                                value={newPost.value}
                                onChange={(e) => setNewPost({...newPost, value: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-black uppercase text-muted-foreground ml-2 mb-1 block">Urgência</label>
                        <div className="flex gap-2 p-1 bg-input rounded-2xl border-2 border-transparent">
                            {['Normal', 'Alta'].map(u => (
                            <button 
                                key={u}
                                onClick={() => setNewPost({...newPost, urgency: u, status: u === 'Alta' ? 'URGENTE' : 'NOVO' })}
                                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${newPost.urgency === u ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                            >
                                {u}
                            </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <DialogFooter className="p-8 pt-4 border-t">
            <Button 
                onClick={handleSubmit}
                disabled={isUploading}
                className="w-full bg-destructive text-destructive-foreground py-6 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary transition-all shadow-xl shadow-destructive/20 active:scale-[0.98]"
            >
                {isUploading ? <Loader2 className="animate-spin" /> : 'Publicar na C-Chain'}
            </Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    );
}
