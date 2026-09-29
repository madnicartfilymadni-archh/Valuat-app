export type CategoryId = 
  | 'ai-tools'
  | 'video-editing'
  | 'photo-editing'
  | 'android-apps'
  | 'productivity'
  | 'entertainment'
  | 'social-media'
  | 'other-tools';

export interface Category {
  id: CategoryId;
  name: string;
  shortName: string;
  iconName: string;
  description: string;
  gradient: string;
  color: string;
}

export type Platform = 'Web' | 'Android' | 'iOS' | 'Windows' | 'macOS' | 'Linux';

export type PricingModel = 'Free' | 'Freemium' | 'Paid' | 'Open Source';

export interface AppItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  category: CategoryId;
  logoUrl: string;
  websiteUrl: string;
  downloadUrl?: string;
  platforms: Platform[];
  pricing: PricingModel;
  developer: string;
  rating: number; // e.g., 4.8
  reviewCount: number;
  isPopular: boolean;
  isTrending: boolean;
  isLatest: boolean;
  createdAt: string;
  tags: string[];
}

export type SortOption = 'trending' | 'popular' | 'latest' | 'rating' | 'name-asc';

export interface AdSlotConfig {
  id: string;
  title: string;
  format: 'banner-728x90' | 'square-300x250' | 'native-card' | 'sticky-bottom';
  enabled: boolean;
  codeSnippet?: string;
}

export interface OfficialApkConfig {
  enabled: boolean;
  appName: string;
  tagline: string;
  description: string;
  version: string;
  fileSize: string; // e.g. "18.4 MB"
  logoUrl: string;
  downloadUrl: string; // Direct link or data URL
  fileName: string; // e.g. "appvault-official-v2.4.apk"
  updatedAt: string;
  packageName: string;
  minAndroid: string; // e.g. "Android 8.0+"
  features: string[];
  hasLocalFile?: boolean;
}

