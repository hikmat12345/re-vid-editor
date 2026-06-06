'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/shared/dashboard-layout';
import { useApi } from '@/hooks/use-api';
import { API_CLIP_EXTRACTOR } from '@/lib/constants/api';
import { ClipExtractionResult, ExtractedClip } from '@/lib/types';
import {
  Scissors,
  Loader2,
  Zap,
  TrendingUp,
  Download,
  Play,
  Clock,
} from 'lucide-react';

const CAPTION_STYLES = [
  { id: 'mrbeast', label: 'MrBeast' },
  { id: 'hormozi', label: 'Hormozi' },
  { id: 'tiktok-karaoke', label: 'TikTok Karaoke' },
  { id: 'minimal-white', label: 'Minimal White' },
];

function ScoreBar({ score }: { score: number }) {
  const pct = (score / 10) * 100;
  const color = score >= 7 ? 'bg-green-500' : score >= 4 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-bold ${score >= 7 ? 'text-green-400' : score >= 4 ? 'text-yellow-400' : 'text-red-400'}`}>
        {score}/10
      </span>
    </div>
  );
}

function ClipCard({ clip, index }: { clip: ExtractedClip; index: number }) {
  const duration = Math.round(clip.end - clip.start);
  const minutes = Math.floor(clip.start / 60);
  const seconds = Math.floor(clip.start % 60);
  const timestamp = `${minutes}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="border border-zinc-800 rounded-xl p-5 bg-zinc-900/30">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-lg font-black shrink-0">
          {index + 1}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {timestamp} — {duration}s
            </span>
            <div className="flex-1">
              <ScoreBar score={clip.viralityScore} />
            </div>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed mb-3">&quot;{clip.text}&quot;</p>
          <div className="flex gap-2">
            {clip.outputUrl ? (
              <>
                <a
                  href={clip.outputUrl}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black text-xs font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
                >
                  <Play className="w-3 h-3" /> Preview
                </a>
                <a
                  href={clip.outputUrl}
                  download
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-700 text-xs rounded-lg hover:border-zinc-500 transition-colors"
                >
                  <Download className="w-3 h-3" /> Download
                </a>
              </>
            ) : (
              <span className="text-xs text-zinc-500 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Rendering clip...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClipExtractorPage() {
  const { apiFetch } = useApi();
  const [videoUrl, setVideoUrl] = useState('');
  const [maxClips, setMaxClips] = useState(3);
  const [minClipS, setMinClipS] = useState(15);
  const [maxClipS, setMaxClipS] = useState(60);
  const [addCaptions, setAddCaptions] = useState(false);
  const [captionStyle, setCaptionStyle] = useState('mrbeast');
  const [isExtracting, setIsExtracting] = useState(false);
  const [result, setResult] = useState<ClipExtractionResult | null>(null);
  const [error, setError] = useState('');

  const handleExtract = async () => {
    if (!videoUrl.trim()) return;
    setError('');
    setIsExtracting(true);
    setResult(null);
    try {
      const data = await apiFetch<ClipExtractionResult>(API_CLIP_EXTRACTOR.EXTRACT, {
        method: 'POST',
        body: JSON.stringify({
          videoUrl: videoUrl.trim(),
          maxClips,
          minClipS,
          maxClipS,
          addCaptions,
          captionStyle: addCaptions ? captionStyle : undefined,
        }),
      });
      setResult(data);
    } catch (err: any) {
      setError(err.message ?? 'Extraction failed');
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <Scissors className="w-5 h-5 text-zinc-400" />
          <h1 className="text-xl font-bold">Viral Clip Extractor</h1>
          <span className="px-2 py-0.5 bg-violet-500/20 text-violet-300 text-xs rounded-full font-medium">AI</span>
        </div>
        <p className="text-zinc-400 text-sm mb-8">
          Upload a long video — AI transcribes it, scores segments for virality, and extracts the best clips automatically.
        </p>

        {/* Form */}
        <div className="border border-zinc-800 rounded-2xl p-6 mb-6 space-y-5">
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

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Max Clips</label>
              <select
                value={maxClips}
                onChange={(e) => setMaxClips(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none appearance-none"
              >
                {[1,2,3,5,10].map((n) => <option key={n} value={n}>{n} clips</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Min Length</label>
              <select
                value={minClipS}
                onChange={(e) => setMinClipS(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none appearance-none"
              >
                {[10,15,20,30].map((s) => <option key={s} value={s}>{s}s</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Max Length</label>
              <select
                value={maxClipS}
                onChange={(e) => setMaxClipS(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm focus:outline-none appearance-none"
              >
                {[30,45,60,90,120].map((s) => <option key={s} value={s}>{s}s</option>)}
              </select>
            </div>
          </div>

          {/* Caption toggle */}
          <div className="border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium">Add animated captions</p>
                <p className="text-xs text-zinc-500">Auto-transcribe + bake captions into each clip</p>
              </div>
              <button
                onClick={() => setAddCaptions(!addCaptions)}
                className={`relative w-12 h-6 rounded-full transition-colors ${addCaptions ? 'bg-white' : 'bg-zinc-700'}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full transition-transform ${addCaptions ? 'translate-x-7 bg-black' : 'translate-x-1 bg-zinc-300'}`} />
              </button>
            </div>
            {addCaptions && (
              <div className="grid grid-cols-2 gap-2">
                {CAPTION_STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setCaptionStyle(s.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${captionStyle === s.id ? 'border-white text-white' : 'border-zinc-700 text-zinc-400 hover:text-white'}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-500">
              {maxClips * 30} credits per extraction
            </p>
            <button
              onClick={handleExtract}
              disabled={isExtracting || !videoUrl.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-zinc-200 disabled:opacity-50 transition-colors"
            >
              {isExtracting ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Zap className="w-4 h-4" /> Extract Clips</>}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <h2 className="font-semibold">
                Found {result.clips.length} viral clip{result.clips.length !== 1 ? 's' : ''}
              </h2>
              <span className="text-xs text-zinc-500">— {result.creditsCharged} credits charged</span>
            </div>
            <div className="space-y-3">
              {result.clips.map((clip, i) => (
                <ClipCard key={i} clip={clip} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
