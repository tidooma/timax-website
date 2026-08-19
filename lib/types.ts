export type PortfolioItemDTO = {
  id: string;
  title: string;
  category: string;
  youtubeId: string;
  editorId: string;
  editorName?: string;
  editorAccentColor?: string;
  createdAt: string;
};

export type EditorDTO = {
  id: string;
  name: string;
  avatar?: string | null;
  description: string;
  accentColor: string;
  isActive: boolean;
  createdAt: string;
  portfolioItems: PortfolioItemDTO[];
};

export type ServiceDTO = {
  id: string;
  title: string;
  description: string;
  price: string;
  isPopular: boolean;
  createdAt: string;
};

export type ReviewDTO = {
  id: string;
  clientName: string;
  text: string;
  rating?: number | null;
  createdAt: string;
};

export type OrderDTO = {
  id: string;
  clientName: string;
  telegram: string;
  videoType: string;
  duration: string;
  description: string;
  urgency: string;
  status: string;
  createdAt: string;
};

export type PublicDataDTO = {
  editors: EditorDTO[];
  services: ServiceDTO[];
  reviews: ReviewDTO[];
};
