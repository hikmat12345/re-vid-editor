'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/shared/dashboard-layout';
import { useApi } from '@/hooks/use-api';
import { API_CAPTIONS, API_RENDER } from '@/lib/constants/api';
import { CaptionStyle, CaptionStyleInfo, RenderJob } from '@/lib/types';
import { Captions, Loader2, Zap, CheckCircle, Download } from 'lucide-react';

const STYLE_PREVIEWS: Record<CaptionStyle, { bg: string; text: string; font: string }> = {
  'mrbeast':       { bg: 'bg-black', text: 'text-yellow-400 uppercase font-black text-2xl [text-shadow:_2px_2px_0_black]', font: 'font-["Impact"]' },
  'hormozi':       { bg: 'bg-black/60', text: 'text-white uppercase font-bold text-xl', font: '' },
  'tiktok-karaoke':{ bg: 'bg-transparent', text: 'text-white font-semibold text-xl', font: '' },
  'emoji-auto':    { bg: 'bg-black/50', text: 'text-white text-lg', font: '' },
  'cinematic':     { bg: 'bg-black/70', text: 'text-white italic text-lg', font: 'font-["Playfair_Display"]' },
  'news-ticker':   { bg: 'bg-red-700', text: 'text-white uppercase font-bold text-sm tracking-wider', font: '' },
  'minimal-white': { bg: 'bg-transparent', text: 'text-white text-xl', font: '' },
};

const STYLE_SAMPLE_TEXT: Record<CaptionStyle, string> = {
  'mrbeast': 'WE DID IT! 🔥',
  'hormozi': 'MOST PEOPLE NEVER LEARN THIS',
  'tiktok-karaoke': 'this is how you go viral',
  'emoji-auto': 'amazing things happen 🚀✨',
  'cinematic': 'The world will never be the same.',
  'news-ticker': 'BREAKING: AI CHANGES EVERYTHING',
  'minimal-white': 'Simple. Clean. Powerful.',
};

export default function CaptionsPage() {
  const { apiFetch } = useApi();
  const [styles, setStyles] = useState<CaptionStyleInfo[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<CaptionStyle>('mrbeast');
  const [videoUrl, setVideoUrl] = useState('');
  const [autoTranscribe, setAutoTranscribe] = useState(true);
  const [srtContent, setSrtContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [job, setJob] = useState<RenderJob | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch<{ styles: CaptionStyleInfo[] }>(API_CAPTIONS.STYLES)
      .then((d) => setStyles(d.styles))
      .catch(() => {});
  }, []);

  const handleAdd = async () => {
    if (!videoUrl.trim()) return;
    setError('');
    setIsSubmitting(true);
    setJob(null);
    try {
      const data = await apiFetch<RenderJob>(API_CAPTIONS.ADD, {
        method: 'POST',
        body: JSON.stringify({
          videoUrl: videoUrl.trim(),
          style: selectedStyle,
          autoTranscribe,
          srtContent: !autoTranscribe ? srtContent : undefined,
        }),
      });
      setJob(data);

      // Poll for completion
      const poll = setInterval(async () => {
        const updated = await apiFetch<RenderJob>(API_RENDER.GET(data.id));
        setJob(updated);
        if (updated.status === 'done' || updated.status === 'failed') {
          clearInterval(poll);
        }
      }, 3000);
    } catch (err: any) {
      setError(err.message ?? 'Failed to submit caption job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <Captions className="w-5 h-5 text-zinc-400" />
          <h1 className="text-xl font-bold">Animated Captions</h1>
          <span className="px-2 py-0.5 bg-violet-500/20 text-violet-300 text-xs rounded-full font-medium">AI</span>
        </div>
        <p className="text-zinc-400 text-sm mb-8">
          Add viral-style animated captions to any video. Auto-transcribed by Whisper — 7 style presets.
        </p>

        {/* Style picker */}
        <div className="border border-zinc-800 rounded-2xl p-6 mb-6">
          <h3 className="font-semibold mb-4">Choose a caption style</h3>
          <div className="grid grid-cols-2 gap-3">
            {(styles.length > 0 ? styles.map((s) => s.id as CaptionStyle) : Object.keys(STYLE_PREVIEWS) as CaptionStyle[]).map((styleId) => {
              const preview = STYLE_PREVIEWS[styleId];
              const sample = STYLE_SAMPLE_TEXT[styleId];
              const isSelected = selectedStyle === styleId;

              return (
                <button
                  key={styleId}
                  onClick={() => setSelectedStyle(styleId)}
                  className={`relative rounded-xl border p-3 text-left transition-all ${isSelected ? 'border-white' : 'border-zinc-800 hover:border-zinc-600'}`}
                >
                  {/* Preview */}
                  <div className={`h-14 rounded-lg mb-2 flex items-center justify-center ${preview.bg} border border-zinc-700/50 overflow-hidden`}>
                    <span className={`px-2 text-center leading-tight ${preview.text} ${preview.font}`}>
                      {sample}
                    </span>
                  </div>
                  <p className="text-xs font-medium capitalize">{styleId.replace(/-/g, ' ')}</p>
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Video input */}
        <div className="border border-zinc-800 rounded-2xl p-6 mb-6 space-y-4">
          <h3 className="font-semibold">Video & Transcription</h3>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Video URL</label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://your-cdn.com/video.mp4"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoTranscribe(true)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${autoTranscribe ? 'border-white text-white bg-white/5' : 'border-zinc-800 text-zinc-400'}`}
            >
              Auto-transcribe (AI)
            </button>
            <button
              onClick={() => setAutoTranscribe(false)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${!autoTranscribe ? 'border-white text-white bg-white/5' : 'border-zinc-800 text-zinc-400'}`}
            >
              Paste SRT manually
            </button>
          </div>

          {!autoTranscribe && (
            <textarea
              value={srtContent}
              onChange={(e) => setSrtContent(e.target.value)}
              placeholder={`1\n00:00:00,000 --> 00:00:03,000\nYour subtitle here`}
              rows={8}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-zinc-600 resize-none"
            />
          )}

          {error && (
            <p className="text-sm text-red-400 bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-500">15 credits per video</p>
            <button
              onClick={handleAdd}
              disabled={isSubmitting || !videoUrl.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-zinc-200 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <><Zap className="w-4 h-4" /> Add Captions</>}
            </button>
          </div>
        </div>

        {/* Job status */}
        {job && (
          <div className="border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-semibold mb-3">Render Status</h3>
            <div className="flex items-center gap-3">
              {job.status === 'done' ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : job.status === 'failed' ? (
                <span className="text-red-400 text-sm">{job.errorMessage}</span>
              ) : (
                <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
              )}
              <span className="text-sm capitalize text-zinc-300">{job.status}</span>
              {job.status === 'rendering' && (
                <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${job.progress}%` }} />
                </div>
              )}
            </div>
            {job.status === 'done' && job.outputUrl && (
              <a
                href={job.outputUrl}
                download
                className="mt-4 flex items-center gap-2 px-4 py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-zinc-200 transition-colors w-fit"
              >
                <Download className="w-4 h-4" /> Download Captioned Video
              </a>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
