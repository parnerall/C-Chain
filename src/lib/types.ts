export type Province = {
  id: string;
  name: string;
  color: string;
  active: boolean;
};

export type Post = {
  id: string;
  user: string;
  avatar: string;
  authorAvatarUrl?: string;
  location: string;
  image: string;
  imageHint: string;
  title: string;
  description: string;
  value: string;
  category: 'Logística' | 'Produção' | 'Transporte' | 'Armazém' | 'Sementes' | string;
  likes: number;
  time: string;
  status: 'URGENTE' | 'AUDITADO' | 'NOVO' | 'Normal' | string;
  authorIsVerified: boolean;
  authorIsSubscriber: boolean;
  publishedAt: string;
  companyProfileId: string;
};

export type UserProfile = {
  location: string;
  sectors: string[];
  isVerified: boolean;
  isSubscriber: boolean;
}

export type PostLike = {
  id: string; // Corresponds to postId
  companyProfileId: string;
  postId: string;
  likedAt: string;
};

export type CompanyProfile = {
  id?: string;
  name: string;
  nif: string;
  email: string;
  profileType: string;
  provinceId: string;
  description: string;
  commercialLicenseDocumentUrl: string;
  isEmailVerified: boolean;
  registrationStatus: 'pending' | 'approved' | 'rejected' | string;
  isVerified: boolean;
  subscriptionPlan: string;
  createdAt: string;
  updatedAt: string;
  avatarInitials: string;
  avatarUrl?: string;
};

    