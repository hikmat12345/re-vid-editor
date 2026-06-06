/**
 * MotionForce — Shared TypeScript Types
 */

// ─── Auth ─────────────────────────────────────────────────────────────────────

export type UserRole = 'user' | 'admin';
export type PlanName = 'free' | 'creator' | 'pro' | 'agency';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
  planName: PlanName;
  creditsRemaining: number;
  creditsMonthly: number;
  subscriptionStatus: 'active' | 'inactive' | 'canceled' | 'past_due';
  subscriptionEnd?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// ─── API Response wrapper ─────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

// ─── AI Generation ────────────────────────────────────────────────────────────

export type ImageModel = 'flux-pro' | 'imagen4' | 'seedream' | 'nano-banana-pro';
export type VideoModel = 'sora-2' | 'kling-3.0' | 'veo-3.1-fast' | 'veo-3.1-quality';
export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '21:9' | '4:5' | '5:4';
export type ImageResolution = '1K' | '2K' | '4K';
export type VideoResolution = '480p' | '720p' | '1080p' | '4K';

export type GenerationStatus = 'pending' | 'completed' | 'failed';

export interface GenerationJob {
  taskId: string;
  model: string;
  status: GenerationStatus;
  resultUrl?: string;
  error?: string;
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export type StorySource =
  | 'asmr'
  | 'remix'
  | 'talking-things'
  | 'dancing-animals'
  | 'long-form';

export type StoryStatus = 'draft' | 'generating' | 'completed' | 'failed';

export type ShotStatus =
  | 'pending'
  | 'generating_image'
  | 'generating_video'
  | 'completed'
  | 'failed';

export interface Shot {
  id: string;
  number: number;
  imagePrompt: string;
  videoPrompt: string;
  imageUrl?: string;
  videoUrl?: string;
  status: ShotStatus;
}

export interface Story {
  id: string;
  userId: string;
  title: string;
  source: StorySource;
  status: StoryStatus;
  aspectRatio: string;
  imageModel?: string;
  videoModel?: string;
  style?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  shotCount: number;
  completedShots: number;
  generationData?: { shots: Shot[] };
  errorMessage?: string;
  createdAt: string;
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export type GenerationMode = 'text-to-image' | 'image-to-video' | 'text-to-video';

export interface ProjectItem {
  id: string;
  userId: string;
  mode: GenerationMode;
  model: string;
  prompt: string;
  url: string;
  thumbnailUrl?: string;
  aspectRatio?: string;
  resolution?: string;
  durationMs?: number;
  isFavorite: boolean;
  createdAt: string;
}

// ─── Music ────────────────────────────────────────────────────────────────────

export interface MusicTrack {
  id: string;
  audioUrl: string;
  imageUrl?: string;
  title: string;
  duration?: number;
  status: 'pending' | 'complete' | 'error';
}

// ─── Voice ────────────────────────────────────────────────────────────────────

export interface Voice {
  id: string;
  name: string;
  gender: 'male' | 'female';
  accent: string;
  previewUrl?: string;
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

export interface PlanInfo {
  creditsMonthly: number;
  priceUsd: number;
  label: string;
}

export interface PricingInfo {
  images: Array<{ model: string; label: string; credits: number }>;
  videos: Array<{ model: string; label: string; creditsPerSecond: number }>;
  audio: { ttsPerChar: number; musicPerGeneration: number; sfxPerGeneration: number; voiceClone: number };
  tools: { upscale2x: number; upscale4x: number; watermarkRemove: number };
  plans: Record<PlanName, PlanInfo>;
}

// ─── Render Queue ─────────────────────────────────────────────────────────────

export type RenderJobStatus = 'queued' | 'rendering' | 'done' | 'failed' | 'cancelled';

export interface RenderJob {
  id: string;
  userId: string;
  status: RenderJobStatus;
  templateId: string;
  payload: Record<string, any>;
  outputUrl: string | null;
  thumbnailUrl: string | null;
  errorMessage: string | null;
  queueJobId: string | null;
  creditsCharged: number;
  estimatedDurationS: number | null;
  progress: number;
  webhookUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export type RenderResolution = '1920x1080' | '1080x1920' | '1080x1080' | '3840x2160';

export interface DispatchRenderRequest {
  compositionId: string;
  props: Record<string, any>;
  resolution?: RenderResolution;
  durationS?: number;
  webhookUrl?: string;
  applyBrandKit?: boolean;
}

// ─── Brand Kit ────────────────────────────────────────────────────────────────

export type WatermarkPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

export interface BrandKit {
  id: string;
  userId: string;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  introUrl: string | null;
  outroUrl: string | null;
  watermarkUrl: string | null;
  watermarkPosition: WatermarkPosition;
  watermarkOpacity: number;
  autoApply: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Caption Engine ───────────────────────────────────────────────────────────

export type CaptionStyle =
  | 'mrbeast'
  | 'hormozi'
  | 'tiktok-karaoke'
  | 'emoji-auto'
  | 'cinematic'
  | 'news-ticker'
  | 'minimal-white';

export interface CaptionStyleInfo {
  id: CaptionStyle;
  label: string;
  config: {
    fontFamily: string;
    fontSize: number;
    color: string;
    strokeColor: string;
    backgroundColor: string;
    textTransform: string;
    position: string;
    wordHighlight: boolean;
    emojiAuto: boolean;
    tickerMode: boolean;
  };
}

// ─── Clip Extractor ───────────────────────────────────────────────────────────

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

export interface ExtractedClip {
  start: number;
  end: number;
  text: string;
  viralityScore: number;
  outputUrl: string | null;
}

export interface ClipExtractionResult {
  sourceUrl: string;
  transcript: TranscriptSegment[];
  clips: ExtractedClip[];
  creditsCharged: number;
}

// ─── Finance Templates ────────────────────────────────────────────────────────

export type FinanceChartType =
  | 'candlestick'
  | 'line-chart'
  | 'ohlc'
  | 'number-reveal'
  | 'market-summary';

export interface OhlcDataPoint {
  date: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface LineDataPoint {
  date: number;
  value: number;
  label?: string;
}

export interface NumberRevealData {
  from: number;
  to: number;
  prefix?: string;
  suffix?: string;
  label?: string;
}

export interface MarketSummaryItem {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
}
