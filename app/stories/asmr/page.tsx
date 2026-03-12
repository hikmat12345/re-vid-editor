'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Plus, Trash2, Wand2, Loader2, ChevronDown } from 'lucide-react';
import { DashboardLayout } from '@/components/shared/dashboard-layout';
import { useApi } from '@/hooks/use-api';
import { API_STORIES } from '@/lib/constants/api';
import { ImageModel, VideoModel } from '@/lib/types';

interface Shot {
  imagePrompt: string;
  videoPrompt: string;
}

const ASMR_STYLES = [
  'Slime Play',
  'Keyboard Sounds',
  'Smear & Spread',
  'Mouth Eating',
  'Sand Cutting',
  'Foam Crushing',
];

const IMAGE_MODELS: { id: ImageModel; label: string }[] = [
  { id: 'imagen4',    label: 'Imagen 4 (Recommended)' },
  { id: 'seedream',  label: 'Seedream 4.5' },
  { id: 'flux-pro',  label: 'Flux Pro' },
];

const VIDEO_MODELS: { id: VideoModel; label: string }[] = [
  { id: 'veo-3.1-fast',  label: 'VEO 3.1 Fast (Recommended)' },
  { id: 'veo-3.1-quality', label: 'VEO 3.1 Quality' },
  { id: 'kling-3.0',     label: 'Kling 3.0 Pro' },
];

export default function ASMRCreatorPage() {
  const router = useRouter();
  const { apiFetch } = useApi();

  const [title, setTitle] = useState('');
  const [style, setStyle] = useState(ASMR_STYLES[0]);
  const [imageModel, setImageModel] = useState<ImageModel>('imagen4');
  const [videoModel, setVideoModel] = useState<VideoModel>('veo-3.1-fast');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [shots, setShots] = useState<Shot[]>([
    { imagePrompt: '', videoPrompt: '' },
    { imagePrompt: '', videoPrompt: '' },
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addShot = () => setShots((prev) => [...prev, { imagePrompt: '', videoPrompt: '' }]);
  const removeShot = (i: number) => setShots((prev) => prev.filter((_, idx) => idx !== i));
  const updateShot = (i: number, field: keyof Shot, value: string) =>
    setShots((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));

  const autoFillPrompts = () => {
    const templates: Record<string, { image: string; video: string }> = {
      'Slime Play': {
        image: `Hands kneading ${style.toLowerCase()} slime, satisfying texture close-up, vibrant colors`,
        video: `Slow motion hands pressing and stretching the slime, ASMR sounds, satisfying`,
      },
      'Keyboard Sounds': {
        image: `Mechanical keyboard with custom keycaps, studio lighting, macro photography`,
        video: `Hands typing on mechanical keyboard, satisfying click sounds, close-up`,
      },
    };

    const base = templates[style] ?? {
      image: `${style} ASMR, close-up macro photography, studio lighting, satisfying`,
      video: `Satisfying ${style.toLowerCase()} ASMR video, slow motion, soothing, close-up`,
    };

    setShots(shots.map(() => ({ imagePrompt: base.image, videoPrompt: base.video })));
  };

  const createAndGenerate = async () => {
    if (!title.trim() || shots.some((s) => !s.imagePrompt.trim())) {
      setError('Please fill in the title and all image prompts');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      // 1. Create the story
      const story = await apiFetch<{ id: string }>(API_STORIES.CREATE, {
        method: 'POST',
        body: JSON.stringify({
          title,
          source: 'asmr',
          style,
          imageModel,
          videoModel,
          aspectRatio,
          shots: shots.map((s, i) => ({
            number: i + 1,
            imagePrompt: s.imagePrompt,
            videoPrompt: s.videoPrompt || s.imagePrompt,
          })),
        }),
      });

      // 2. Start generation
      await apiFetch(API_STORIES.GENERATE(story.id), { method: 'POST' });

      // 3. Navigate to stories page
      router.push('/stories');
    } catch (err: any) {
      setError(err.message ?? 'Failed to create story');
      setIsCreating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6" /> ASMR Creator
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Create satisfying AI-generated ASMR videos, shot by shot
          </p>
        </div>

        {/* Settings */}
        <div className="border border-zinc-800 rounded-2xl p-6 space-y-5 bg-zinc-900/30">
          <h2 className="font-semibold text-sm">Story Settings</h2>

          <div>
            <label className="text-xs text-zinc-400 mb-1.5 block">Story Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My ASMR Story"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-600 placeholder:text-zinc-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">ASMR Style</label>
              <div className="relative">
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full appearance-none bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm pr-8 focus:outline-none focus:border-zinc-600"
                >
                  {ASMR_STYLES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Aspect Ratio</label>
              <div className="flex gap-1.5">
                {['9:16', '1:1', '16:9'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setAspectRatio(r)}
                    className={`flex-1 py-2 text-xs rounded border transition-colors ${
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Image Model</label>
              <div className="relative">
                <select
                  value={imageModel}
                  onChange={(e) => setImageModel(e.target.value as ImageModel)}
                  className="w-full appearance-none bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm pr-8 focus:outline-none focus:border-zinc-600"
                >
                  {IMAGE_MODELS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Video Model</label>
              <div className="relative">
                <select
                  value={videoModel}
                  onChange={(e) => setVideoModel(e.target.value as VideoModel)}
                  className="w-full appearance-none bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm pr-8 focus:outline-none focus:border-zinc-600"
                >
                  {VIDEO_MODELS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Shots */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm">{shots.length} Shot{shots.length !== 1 ? 's' : ''}</h2>
            <button
              onClick={autoFillPrompts}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
            >
              <Wand2 className="w-3.5 h-3.5" /> Auto-fill prompts
            </button>
          </div>

          {shots.map((shot, i) => (
            <div key={i} className="border border-zinc-800 rounded-xl p-4 space-y-3 bg-zinc-900/20">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-medium">Shot {i + 1}</span>
                {shots.length > 1 && (
                  <button
                    onClick={() => removeShot(i)}
                    className="text-zinc-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div>
                <label className="text-[11px] text-zinc-500 mb-1 block">Image Prompt *</label>
                <textarea
                  value={shot.imagePrompt}
                  onChange={(e) => updateShot(i, 'imagePrompt', e.target.value)}
                  rows={2}
                  placeholder="Describe the visual for this shot..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-zinc-600 placeholder:text-zinc-600"
                />
              </div>
              <div>
                <label className="text-[11px] text-zinc-500 mb-1 block">Video Prompt (optional)</label>
                <textarea
                  value={shot.videoPrompt}
                  onChange={(e) => updateShot(i, 'videoPrompt', e.target.value)}
                  rows={2}
                  placeholder="Describe the motion/action (defaults to image prompt)..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-zinc-600 placeholder:text-zinc-600"
                />
              </div>
            </div>
          ))}

          <button
            onClick={addShot}
            className="w-full py-2.5 border border-dashed border-zinc-700 rounded-xl text-sm text-zinc-500 hover:text-white hover:border-zinc-500 flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Shot
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg p-3">
            {error}
          </p>
        )}

        <button
          onClick={createAndGenerate}
          disabled={isCreating}
          className="w-full py-3 bg-white text-black text-sm font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isCreating ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Creating story…</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Create & Generate</>
          )}
        </button>
      </div>
    </DashboardLayout>
  );
}
