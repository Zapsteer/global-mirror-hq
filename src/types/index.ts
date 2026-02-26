// =============================================================================
// Global Mirror HQ - Type Definitions
// =============================================================================

// -- User & Authentication -----------------------------------------------------
export type UserRole = 'admin' | 'editor';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// -- News Article --------------------------------------------------------------
export type NewsStatus = 'fetched' | 'processing' | 'ready' | 'posted' | 'archived';
export type NewsCategory = 'world' | 'technology' | 'business' | 'entertainment' | 'sports' | 'science' | 'health';

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content?: string;
  url: string;
  imageUrl?: string;
  source: string;
  category: NewsCategory;
  publishedAt: string;
  fetchedAt: string;
  status: NewsStatus;
  
  // AI Generated Content
  caption?: string;
  imagePrompt?: string;
  hashtags?: string[];
  
  // Social Media Links
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  
  // Metadata
  createdBy?: string;
  updatedAt?: string;
}

// -- RSS Feed Configuration ----------------------------------------------------
export interface RssFeed {
  id: string;
  name: string;
  url: string;
  category: NewsCategory;
  isActive: boolean;
  lastFetched?: string;
  fetchInterval: number; // in minutes
}

// -- Social Media Platform -----------------------------------------------------
export interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  baseUrl: string;
  maxCaptionLength: number;
  supportsImages: boolean;
  supportsVideos: boolean;
}

// -- Dashboard Stats -----------------------------------------------------------
export interface DashboardStats {
  totalArticles: number;
  readyToPost: number;
  postedToday: number;
  pendingProcessing: number;
  sourcesActive: number;
}

// -- AI Generation Request -----------------------------------------------------
export interface AIGenerationRequest {
  articleId: string;
  type: 'caption' | 'imagePrompt' | 'both';
  tone?: 'professional' | 'casual' | 'engaging' | 'humorous';
  platform?: 'instagram' | 'facebook' | 'youtube' | 'all';
}

// -- Activity Log --------------------------------------------------------------
export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}

// -- Settings ------------------------------------------------------------------
export interface AppSettings {
  rssFetchInterval: number;
  autoGenerateCaptions: boolean;
  autoGenerateImagePrompts: boolean;
  defaultPlatform: string;
  aiTone: string;
}
