/**
 * MotionForce — API Endpoint Constants
 * All frontend API calls should import from here.
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const API_AUTH = {
  REGISTER:      `${BACKEND_URL}/auth/register`,
  LOGIN:         `${BACKEND_URL}/auth/login`,
  REFRESH:       `${BACKEND_URL}/auth/refresh`,
} as const;

// ─── Users ────────────────────────────────────────────────────────────────────
export const API_USERS = {
  ME:            `${BACKEND_URL}/users/me`,
} as const;

// ─── Credits ──────────────────────────────────────────────────────────────────
export const API_CREDITS = {
  BALANCE:       `${BACKEND_URL}/credits/balance`,
  PRICING:       `${BACKEND_URL}/credits/pricing`,
} as const;

// ─── Subscriptions ────────────────────────────────────────────────────────────
export const API_SUBSCRIPTIONS = {
  CHECKOUT:      `${BACKEND_URL}/subscriptions/checkout`,
  TOPUP:         `${BACKEND_URL}/subscriptions/topup`,
  PORTAL:        `${BACKEND_URL}/subscriptions/portal`,
} as const;

// ─── AI — Image Generation ────────────────────────────────────────────────────
export const API_AI_IMAGE = {
  GENERATE:      `${BACKEND_URL}/ai/image/generate`,
  STATUS:        `${BACKEND_URL}/ai/image/status`,
} as const;

// ─── AI — Video Generation ────────────────────────────────────────────────────
export const API_AI_VIDEO = {
  GENERATE:      `${BACKEND_URL}/ai/video/generate`,
  STATUS:        `${BACKEND_URL}/ai/video/status`,
} as const;

// ─── AI — Music ───────────────────────────────────────────────────────────────
export const API_AI_MUSIC = {
  GENERATE:      `${BACKEND_URL}/ai/music/generate`,
  STATUS:        `${BACKEND_URL}/ai/music/status`,
} as const;

// ─── AI — Voice ───────────────────────────────────────────────────────────────
export const API_AI_VOICE = {
  VOICES:        `${BACKEND_URL}/ai/voice/voices`,
  TTS:           `${BACKEND_URL}/ai/voice/tts`,
  SFX:           `${BACKEND_URL}/ai/voice/sfx`,
  ISOLATE:       `${BACKEND_URL}/ai/voice/isolate`,
} as const;

// ─── Stories ──────────────────────────────────────────────────────────────────
export const API_STORIES = {
  LIST:          `${BACKEND_URL}/stories`,
  CREATE:        `${BACKEND_URL}/stories`,
  GET:           (id: string) => `${BACKEND_URL}/stories/${id}`,
  GENERATE:      (id: string) => `${BACKEND_URL}/stories/${id}/generate`,
  DELETE:        (id: string) => `${BACKEND_URL}/stories/${id}`,
} as const;

// ─── Projects (Gallery) ───────────────────────────────────────────────────────
export const API_PROJECTS = {
  LIST:          `${BACKEND_URL}/projects`,
  GET:           (id: string) => `${BACKEND_URL}/projects/${id}`,
  FAVORITE:      (id: string) => `${BACKEND_URL}/projects/${id}/favorite`,
  DELETE:        (id: string) => `${BACKEND_URL}/projects/${id}`,
} as const;

// ─── Content Tools ────────────────────────────────────────────────────────────
export const API_TOOLS = {
  UPSCALE:       `${BACKEND_URL}/tools/upscale`,
  UPSCALE_STATUS:`${BACKEND_URL}/tools/upscale/status`,
  WATERMARK:     `${BACKEND_URL}/tools/watermark-remove`,
  DOWNLOADER_PREVIEW: `${BACKEND_URL}/tools/downloader/preview`,
  DOWNLOADER_DOWNLOAD: `${BACKEND_URL}/tools/downloader/download`,
} as const;

// ─── Render Queue ─────────────────────────────────────────────────────────────
export const API_RENDER = {
  LIST:          `${BACKEND_URL}/render`,
  CREATE:        `${BACKEND_URL}/render`,
  GET:           (id: string) => `${BACKEND_URL}/render/${id}`,
  CANCEL:        (id: string) => `${BACKEND_URL}/render/${id}`,
} as const;

// ─── Template Engine ──────────────────────────────────────────────────────────
export const API_TEMPLATES = {
  COMPOSITIONS:  `${BACKEND_URL}/templates/compositions`,
  RENDER:        `${BACKEND_URL}/templates/render`,
} as const;

// ─── Brand Kit ────────────────────────────────────────────────────────────────
export const API_BRAND_KIT = {
  GET:           `${BACKEND_URL}/brand-kit`,
  UPSERT:        `${BACKEND_URL}/brand-kit`,
} as const;

// ─── Clip Extractor ───────────────────────────────────────────────────────────
export const API_CLIP_EXTRACTOR = {
  EXTRACT:       `${BACKEND_URL}/clip-extractor/extract`,
} as const;

// ─── Caption Engine ───────────────────────────────────────────────────────────
export const API_CAPTIONS = {
  STYLES:        `${BACKEND_URL}/captions/styles`,
  ADD:           `${BACKEND_URL}/captions`,
} as const;

// ─── Finance Templates ────────────────────────────────────────────────────────
export const API_FINANCE = {
  CHART_TYPES:   `${BACKEND_URL}/finance-templates/chart-types`,
  CREATE:        `${BACKEND_URL}/finance-templates`,
} as const;

// ─── Video Editor (existing Next.js API routes) ───────────────────────────────
export const API_EDITOR = {
  LAMBDA_RENDER:   '/api/latest/lambda/render',
  LAMBDA_PROGRESS: '/api/latest/lambda/progress',
  SSR_RENDER:      '/api/latest/ssr/render',
  SSR_PROGRESS:    '/api/latest/ssr/progress',
  SSR_DOWNLOAD:    (id: string) => `/api/latest/ssr/download/${id}`,
  TRANSCRIBE:      '/api/latest/transcribe',
  MEDIA_UPLOAD:    '/api/latest/local-media/upload',
  MEDIA_DELETE:    '/api/latest/local-media/delete',
} as const;
