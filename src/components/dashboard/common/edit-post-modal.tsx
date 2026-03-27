"use client";

import { useState, useEffect } from 'react';
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
import type { Post } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useFileUpload, useUser, useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';

type EditPostModalProps = {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
};

export function EditPostModal({ isOpen, onClose, post }: EditPostModalProps) {
    const { toast } = useToast();
    const firestore = useFirestore();
    const { user } = useUser();
    const { uploadFile } = useFileUpload();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [postData, setPostData] = useState({
        title: '',
        category: 'Logística',
        description: '',
        value: '',
        location: 'Luanda',
        urgency: 'Normal',
        status: 'NOVO',
    });

    useEffect(() => {
        if (post) {
            setPostData({
                title: post.title,
                category: post.category,
                description: post.description,
                value: post.value,
                location: post.location,
                urgency: post.status === 'URGENTE' ? 'Alta' : 'Normal',
                status: post.status,
            });
            setPreviewUrl(post.image || null);
        } else {
            // Reset when there is no post (e.g., after closing)
            setPostData({ title: '', category: 'Logística', description: '', value: '', location: 'Luanda', urgency: 'Normal', status: 'NOVO' });
            setPreviewUrl(null);
            setSelectedFile(null);
        }
    }, [post, isOpen]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          setSelectedFile(file);
          setPreviewUrl(URL.createObjectURL(file));
        }
    };
    
    const handleClose = () => {
        setSelectedFile(null);
        onClose();
    }

    const handleSubmit = async () => {
        if(!user || !firestore || !post) return;

        setIsSubmitting(true);

        try {
            const postRef = doc(firestore, 'posts', post.id);
            
            let imageUrl = post.image;
            if (selectedFile) {
                // Note: This won't delete the old image. A more robust implementation would.
                const filePath = `post-images/${user.uid}/${post.id}/${selectedFile.name}`;
                imageUrl = await uploadFile(filePath, selectedFile);
            }
            
            const finalPostUpdate = {
                ...postData,
                image: imageUrl,
            };

            await updateDoc(postRef, finalPostUpdate);

            toast({
                title: "Publicação atualizada!",
                description: "A sua oportunidade foi atualizada com sucesso.",
            });
            
            handleClose();

        } catch (e: any) {
            console.error("Error updating post:", e);
            toast({
                variant: "destructive",
                title: "Erro ao Atualizar",
                description: e.message || "Não foi possível atualizar a publicação.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !post) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-xl rounded-[2.5rem] p-0">
            <DialogHeader className="p-8 pb-4 border-b">
                <DialogTitle className="text-2xl font-black font-headline italic tracking-tighter uppercase">Editar <span className="text-destructive">Requisição</span></DialogTitle>
                <DialogDescription className="text-xs font-black text-muted-foreground uppercase tracking-widest mt-1">Modifique a sua publicação</DialogDescription>
            </DialogHeader>

            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div>
                    <label className="text-xs font-black uppercase text-muted-foreground ml-2 mb-1 block">Imagem da Publicação</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-2xl">
                        <div className="space-y-1 text-center">
                            {previewUrl ? (
                                <Image src={previewUrl} alt="Pré-visualização" width={400} height={200} className="mx-auto h-48 w-auto object-contain rounded-lg"/>
                            ) : (
                                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                            )}
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="post-image-update-upload" className="relative cursor-pointer bg-background rounded-md font-medium text-destructive hover:text-destructive/80 p-1">
                                    <span>Alterar imagem</span>
                                    <input id="post-image-update-upload" name="post-image-update-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                </label>
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
                        value={postData.title}
                        onChange={(e) => setPostData({...postData, title: e.target.value})}
                    />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-black uppercase text-muted-foreground ml-2 mb-1 block">Categoria</label>
                        <Select value={postData.category} onValueChange={(value) => setPostData({...postData, category: value})}>
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
                        <Select value={postData.location} onValueChange={(value) => setPostData({...postData, location: value})}>
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
                            value={postData.description}
                            onChange={(e) => setPostData({...postData, description: e.target.value})}
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
                                value={postData.value}
                                onChange={(e) => setPostData({...postData, value: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-black uppercase text-muted-foreground ml-2 mb-1 block">Urgência</label>
                        <div className="flex gap-2 p-1 bg-input rounded-2xl border-2 border-transparent">
                            {['Normal', 'Alta'].map(u => (
                            <button 
                                key={u}
                                onClick={() => setPostData({...postData, urgency: u, status: u === 'Alta' ? 'URGENTE' : 'NOVO' })}
                                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all ${postData.urgency === u ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
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
                disabled={isSubmitting}
                className="w-full bg-destructive text-destructive-foreground py-6 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary transition-all shadow-xl shadow-destructive/20 active:scale-[0.98]"
            >
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Guardar Alterações'}
            </Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    );
}
