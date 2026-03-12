'use client';

import { useState, useCallback } from 'react';
import {
  Wand2,
  Download,
  Heart,
  ChevronDown,
  Loader2,
  ImageIcon,
  Video,
} from 'lucide-react';
import { DashboardLayout } from '@/components/shared/dashboard-layout';
import { useApi, pollStatus } from '@/hooks/use-api';
import { API_AI_IMAGE, API_AI_VIDEO, API_PROJECTS } from '@/lib/constants/api';
import {
  ImageModel,
  VideoModel,
  AspectRatio,
  ImageResolution,
  GenerationJob,
  ProjectItem,
} from '@/lib/types';

type Mode = 'text-to-image' | 'image-to-video' | 'text-to-video';

const IMAGE_MODELS: { id: ImageModel; label: string; credits: string }[] = [
  { id: 'flux-pro',        label: 'Flux Pro',         credits: '~130 cr' },
  { id: 'imagen4',         label: 'Imagen 4',          credits: '~84 cr'  },
  { id: 'seedream',        label: 'Seedream 4.5',      credits: '~63 cr'  },
  { id: 'nano-banana-pro', label: 'Nano Banana Pro',   credits: '~108 cr' },
];

const VIDEO_MODELS: { id: VideoModel; label: string; credits: string }[] = [
  { id: 'veo-3.1-fast',    label: 'VEO 3.1 Fast',     credits: '~12 cr/s' },
  { id: 'veo-3.1-quality', label: 'VEO 3.1 Quality',  credits: '~33 cr/s' },
  { id: 'sora-2',          label: 'Sora 2',            credits: '~17 cr/s' },
  { id: 'kling-3.0',       label: 'Kling 3.0 Pro',    credits: '~60 cr/s' },
];

const ASPECT_RATIOS: AspectRatio[] = ['1:1', '16:9', '9:16', '4:3', '3:4'];
const RESOLUTIONS: ImageResolution[] = ['1K', '2K', '4K'];

export default function AIStudioPage() {
  const { apiFetch } = useApi();

  const [mode, setMode] = useState<Mode>('text-to-image');
  const [prompt, setPrompt] = useState('');
  const [imageModel, setImageModel] = useState<ImageModel>('imagen4');
  const [videoModel, setVideoModel] = useState<VideoModel>('veo-3.1-fast');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [resolution, setResolution] = useState<ImageResolution>('1K');
  const [duration, setDuration] = useState(5);
  const [sourceImageUrl, setSourceImageUrl] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentJob, setCurrentJob] = useState<GenerationJob | null>(null);
  const [gallery, setGallery] = useState<ProjectItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    if (!prompt.trim() || isGenerating) return;
    setError(null);
    setIsGenerating(true);
    setCurrentJob(null);

    try {
      let job: { taskId: string; model: string };

      if (mode === 'text-to-image') {
        job = await apiFetch<{ taskId: string; model: string }>(API_AI_IMAGE.GENERATE, {
          method: 'POST',
          body: JSON.stringify({ prompt, model: imageModel, aspectRatio, resolution }),
        });

        // Poll image status
        const result = await pollStatus(() =>
          apiFetch<{ status: string; imageUrl?: string; error?: string }>(
            `${API_AI_IMAGE.STATUS}?model=${imageModel}&taskId=${job.taskId}`,
          ),
        );

        if (result.status === 'completed' && result.imageUrl) {
          const newItem: ProjectItem = {
            id: job.taskId,
            userId: '',
            mode: 'text-to-image',
            model: imageModel,
            prompt,
            url: result.imageUrl,
            thumbnailUrl: result.imageUrl,
            aspectRatio,
            resolution,
            isFavorite: false,
            createdAt: new Date().toISOString(),
          };
          setGallery((prev) => [newItem, ...prev]);
          setCurrentJob({ taskId: job.taskId, model: imageModel, status: 'completed', resultUrl: result.imageUrl });
        } else {
          setError(result.error ?? 'Generation failed');
          setCurrentJob({ taskId: job.taskId, model: imageModel, status: 'failed' });
        }
      } else {
        // Video generation
        const body: Record<string, unknown> = {
          prompt,
          model: videoModel,
          durationSeconds: duration,
          aspectRatio,
        };
        if (mode === 'image-to-video' && sourceImageUrl) {
          body.startImageUrl = sourceImageUrl;
        }

        job = await apiFetch<{ taskId: string; model: string }>(API_AI_VIDEO.GENERATE, {
          method: 'POST',
          body: JSON.stringify(body),
        });

        const result = await pollStatus(
          () =>
            apiFetch<{ status: string; videoUrl?: string; error?: string }>(
              `${API_AI_VIDEO.STATUS}?model=${videoModel}&taskId=${job.taskId}`,
            ),
          { interval: 5000, maxAttempts: 180 },
        );

        if (result.status === 'completed' && result.videoUrl) {
          setCurrentJob({ taskId: job.taskId, model: videoModel, status: 'completed', resultUrl: result.videoUrl });
        } else {
          setError(result.error ?? 'Video generation failed');
          setCurrentJob({ taskId: job.taskId, model: videoModel, status: 'failed' });
        }
      }
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong');
      setCurrentJob(null);
    } finally {
      setIsGenerating(false);
    }
  }, [apiFetch, prompt, mode, imageModel, videoModel, aspectRatio, resolution, duration, sourceImageUrl, isGenerating]);

  return (
    <DashboardLayout>
      <div className="flex h-full">
        {/* ── Controls Panel ─────────────────────────────────────────── */}
        <aside className="w-72 border-r border-zinc-800 flex flex-col overflow-y-auto">
          <div className="p-5 space-y-5">
            <h2 className="font-semibold">AI Studio</h2>

            {/* Mode tabs */}
            <div className="flex rounded-lg border border-zinc-800 p-1 gap-1">
              {(['text-to-image', 'text-to-video', 'image-to-video'] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-1 text-xs rounded-md transition-colors ${
                    mode === m ? 'bg-white text-black font-medium' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {m === 'text-to-image' ? 'Image' : m === 'text-to-video' ? 'Video' : 'Img→Vid'}
                </button>
              ))}
            </div>

            {/* Prompt */}
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to create..."
                rows={4}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-zinc-600 placeholder:text-zinc-600"
              />
            </div>

            {/* Source image URL (image-to-video) */}
            {mode === 'image-to-video' && (
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Source Image URL</label>
                <input
                  type="url"
                  value={sourceImageUrl}
                  onChange={(e) => setSourceImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-600 placeholder:text-zinc-600"
                />
              </div>
            )}

            {/* Model */}
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Model</label>
              <div className="relative">
                <select
                  value={mode === 'text-to-image' ? imageModel : videoModel}
                  onChange={(e) =>
                    mode === 'text-to-image'
                      ? setImageModel(e.target.value as ImageModel)
                      : setVideoModel(e.target.value as VideoModel)
                  }
                  className="w-full appearance-none bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm pr-8 focus:outline-none focus:border-zinc-600"
                >
                  {(mode === 'text-to-image' ? IMAGE_MODELS : VIDEO_MODELS).map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label} — {m.credits}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Aspect Ratio</label>
              <div className="flex flex-wrap gap-1.5">
                {ASPECT_RATIOS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setAspectRatio(r)}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                      aspectRatio === r
                        ? 'border-white bg-white text-black font-medium'
                        : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution (images only) */}
            {mode === 'text-to-image' && (
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Resolution</label>
                <div className="flex gap-1.5">
                  {RESOLUTIONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => setResolution(r)}
                      className={`flex-1 py-1 text-xs rounded border transition-colors ${
                        resolution === r
                          ? 'border-white bg-white text-black font-medium'
                          : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Duration (video only) */}
            {mode !== 'text-to-image' && (
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 flex justify-between">
                  <span>Duration</span>
                  <span className="text-white">{duration}s</span>
                </label>
                <input
                  type="range"
                  min={4}
                  max={15}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full accent-white"
                />
              </div>
            )}

            {/* Generate button */}
            <button
              onClick={generate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full py-2.5 bg-white text-black text-sm font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Generate
                </>
              )}
            </button>

            {error && (
              <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg p-3">
                {error}
              </p>
            )}
          </div>
        </aside>

        {/* ── Output Panel ────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Current generation preview */}
          {currentJob?.status === 'completed' && currentJob.resultUrl && (
            <div className="mb-6">
              <p className="text-xs text-zinc-500 mb-3">Latest generation</p>
              <div className="relative inline-block rounded-xl overflow-hidden border border-zinc-700">
                {mode === 'text-to-image' ? (
                  <img
                    src={currentJob.resultUrl}
                    alt="Generated"
                    className="max-h-[500px] object-contain"
                  />
                ) : (
                  <video
                    src={currentJob.resultUrl}
                    controls
                    className="max-h-[500px]"
                    autoPlay
                  />
                )}
                <a
                  href={currentJob.resultUrl}
                  download
                  className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg hover:bg-black/80 transition-colors"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* Gallery grid */}
          {gallery.length > 0 && (
            <div>
              <p className="text-xs text-zinc-500 mb-3">Session gallery</p>
              <div className="grid grid-cols-3 gap-3">
                {gallery.map((item) => (
                  <div
                    key={item.id}
                    className="aspect-square rounded-lg overflow-hidden border border-zinc-800 relative group"
                  >
                    <img
                      src={item.url}
                      alt={item.prompt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <p className="text-[10px] text-zinc-300 line-clamp-2">{item.prompt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {gallery.length === 0 && !isGenerating && !currentJob && (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <ImageIcon className="w-12 h-12 text-zinc-700 mb-4" />
              <p className="text-zinc-500 text-sm">
                Write a prompt and hit Generate to create your first image or video.
              </p>
            </div>
          )}

          {/* Loading state */}
          {isGenerating && (
            <div className="flex flex-col items-center justify-center h-full py-20">
              <Loader2 className="w-8 h-8 text-zinc-400 animate-spin mb-4" />
              <p className="text-zinc-400 text-sm">Generating — this may take a minute…</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
