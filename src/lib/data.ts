import type { Province, Post } from './types';
import { PlaceHolderImages } from './placeholder-images';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl ?? '';
const findHint = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageHint ?? '';

export const PROVINCE_STORIES: Province[] = [
    { id: 'bengo', name: 'Bengo', color: 'from-green-400 to-emerald-600', active: true },
    { id: 'benguela', name: 'Benguela', color: 'from-blue-400 to-indigo-600', active: true },
    { id: 'bie', name: 'Bié', color: 'from-orange-400 to-red-600', active: false },
    { id: 'cabinda', name: 'Cabinda', color: 'from-purple-400 to-fuchsia-600', active: true },
    { id: 'cuando-cubango', name: 'Cuando Cubango', color: 'from-emerald-500 to-teal-700', active: false },
    { id: 'cuanza-norte', name: 'Cuanza Norte', color: 'from-yellow-400 to-amber-600', active: true },
    { id: 'cuanza-sul', name: 'Cuanza Sul', color: 'from-rose-400 to-pink-600', active:true },
    { id: 'cunene', name: 'Cunene', color: 'from-amber-500 to-orange-700', active: false },
    { id: 'huambo', name: 'Huambo', color: 'from-amber-400 to-orange-600', active: true },
    { id: 'huila', name: 'Huíla', color: 'from-emerald-400 to-teal-600', active: true },
    { id: 'luanda', name: 'Luanda', color: 'from-slate-700 to-slate-900', active: true },
    { id: 'lunda-norte', name: 'Lunda Norte', color: 'from-blue-500 to-cyan-600', active: false },
    { id: 'lunda-sul', name: 'Lunda Sul', color: 'from-indigo-500 to-purple-600', active: false },
    { id: 'malanje', name: 'Malanje', color: 'from-red-400 to-rose-600', active: true },
    { id: 'moxico', name: 'Moxico', color: 'from-green-600 to-lime-700', active: false },
    { id: 'namibe', name: 'Namibe', color: 'from-cyan-400 to-blue-500', active: true },
    { id: 'uige', name: 'Uíge', color: 'from-lime-400 to-green-600', active: true },
    { id: 'zaire', name: 'Zaire', color: 'from-zinc-400 to-zinc-600', active: false },
  ];
  
  export const INITIAL_FEED: Post[] = [
    {
      id: '1',
      user: "Fazenda Girassol",
      avatar: "FG",
      location: "Quibala, Cuanza Sul",
      image: findImage('c-chain-post-1'),
      imageHint: findHint('c-chain-post-1'),
      title: "Escoamento de Milho 50T",
      description: "Necessitamos de 3 camiões para escoamento imediato para Luanda. Produção auditada pela SGS.",
      value: "2.450.000 Kz",
      category: "Logística",
      likes: 24,
      time: "2h",
      status: "URGENTE",
      authorIsVerified: true,
      authorIsSubscriber: true,
      companyProfileId: "dummy-1",
      publishedAt: new Date().toISOString(),
    },
    {
      id: '2',
      user: "Logística Angola",
      avatar: "LA",
      location: "Catumbela, Benguela",
      image: findImage('c-chain-post-2'),
      imageHint: findHint('c-chain-post-2'),
      title: "Disponibilidade de Contentor Frio",
      description: "Camião frigorífico disponível para rota Benguela-Namibe. Ideal para peixe ou hortícolas.",
      value: "850.000 Kz",
      category: "Transporte",
      likes: 12,
      time: "5h",
      status: "AUDITADO",
      authorIsVerified: true,
      authorIsSubscriber: false,
      companyProfileId: "dummy-2",
      publishedAt: new Date().toISOString(),
    },
    {
      id: '3',
      user: "Cooperativa do Uíge",
      avatar: "CU",
      location: "Negage, Uíge",
      image: findImage('c-chain-post-3'),
      imageHint: findHint('c-chain-post-3'),
      title: "Colheita de Café Robusta",
      description: "Procuramos parceiros para processamento e embalagem. Lote de 15 toneladas disponível.",
      value: "Sob consulta",
      category: "Produção",
      likes: 45,
      time: "1d",
      status: "NOVO",
      authorIsVerified: false,
      authorIsSubscriber: false,
      companyProfileId: "dummy-3",
      publishedAt: new Date().toISOString(),
    }
  ];
  
  export const NEW_POST_PLACEHOLDER_IMAGE = {
    url: findImage('c-chain-new-post'),
    hint: findHint('c-chain-new-post'),
  }
  
  export const PROFILE_TYPES = [
    { id: 'produtor', icon: 'Sprout', label: 'Produtor Agrícola', desc: 'Tenho colheitas para escoar' },
    { id: 'transportador', icon: 'Truck', label: 'Logística & Frete', desc: 'Tenho frota disponível' },
    { id: 'comprador', icon: 'ShoppingBag', label: 'Comprador/Grossista', desc: 'Procuro produtos nacionais' }
  ]
  
  export const CATEGORIES = ["Logística", "Produção", "Transporte", "Armazém", "Sementes"];
  
  
    