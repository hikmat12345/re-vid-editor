'use client';

import { useState } from 'react';
import { Music, Loader2, Play, Pause, Download, Wand2 } from 'lucide-react';
import { DashboardLayout } from '@/components/shared/dashboard-layout';
import { useApi, pollStatus } from '@/hooks/use-api';
import { useAudioPlayer } from '@/hooks/use-audio-player';
import { API_AI_MUSIC } from '@/lib/constants/api';
import { MusicTrack } from '@/lib/types';

export default function AIMusicPage() {
  const { apiFetch } = useApi();
  const { audioRef, playingId, togglePlay, onEnded } = useAudioPlayer();

  const [mode, setMode] = useState<'simple' | 'custom'>('simple');
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('');
  const [title, setTitle] = useState('');
  const [instrumental, setInstrumental] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (isGenerating) return;
    if (mode === 'simple' && !prompt.trim()) return;
    if (mode === 'custom' && !style.trim()) return;

    setError(null);
    setIsGenerating(true);

    try {
      const body: Record<string, unknown> = { instrumental, customMode: mode === 'custom' };
      if (mode === 'simple') body.prompt = prompt;
      if (mode === 'custom') { body.style = style; body.title = title; if (prompt) body.prompt = prompt; }

      const { taskId } = await apiFetch<{ taskId: string }>(API_AI_MUSIC.GENERATE, {
        method: 'POST',
        body: JSON.stringify(body),
      });

      const result = await pollStatus(
        () => apiFetch<{ status: string; tracks?: MusicTrack[] }>(`${API_AI_MUSIC.STATUS}?taskId=${taskId}`),
        { interval: 5000, maxAttempts: 120 },
      );

      if (result.status === 'completed' && result.tracks) {
        setTracks((prev) => [...(result.tracks ?? []), ...prev]);
      } else {
        setError('Music generation failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <audio ref={audioRef} onEnded={onEnded} />
      <div className="max-w-3xl mx-auto p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Music className="w-6 h-6" /> AI Music Generator
          </h1>
          <p className="text-zinc-400 mt-1 text-sm">Generate original tracks with Suno AI</p>
        </div>

        <div className="border border-zinc-800 rounded-2xl p-6 space-y-5 bg-zinc-900/30">
          <div className="flex rounded-lg border border-zinc-800 p-1 gap-1 w-fit">
            {(['simple', 'custom'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-1.5 text-sm rounded-md capitalize transition-colors ${
                  mode === m ? 'bg-white text-black font-medium' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {mode === 'simple' ? (
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Music prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                placeholder="Upbeat lo-fi hip hop with soft piano, gentle drums..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-zinc-600 placeholder:text-zinc-600"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Music style *</label>
                <input
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  placeholder="e.g. lo-fi, hip hop, cinematic orchestra"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-600 placeholder:text-zinc-600"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Title (optional)</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Track title..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-600 placeholder:text-zinc-600"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Prompt (optional)</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={2}
                  placeholder="Additional guidance for the AI..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-zinc-600 placeholder:text-zinc-600"
                />
              </div>
            </div>
          )}

          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <input
              type="checkbox"
              checked={instrumental}
              onChange={(e) => setInstrumental(e.target.checked)}
              className="accent-white w-4 h-4 rounded"
            />
            <span className="text-sm text-zinc-300">Instrumental only</span>
          </label>

          <button
            onClick={generate}
            disabled={isGenerating}
            className="w-full py-2.5 bg-white text-black text-sm font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
            ) : (
              <><Wand2 className="w-4 h-4" /> Generate Music</>
            )}
          </button>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg p-3">
              {error}
            </p>
          )}
        </div>

        {tracks.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Generated Tracks</h3>
            {tracks.map((track) => (
              <div
                key={track.id}
                className="flex items-center gap-4 p-4 border border-zinc-800 rounded-xl bg-zinc-900/30 hover:border-zinc-700 transition-colors"
              >
                {track.imageUrl && (
                  <img src={track.imageUrl} alt={track.title} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{track.title}</p>
                  {track.duration && (
                    <p className="text-xs text-zinc-500">
                      {Math.floor(track.duration / 60)}:{String(Math.floor(track.duration % 60)).padStart(2, '0')}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => togglePlay(track.id, track.audioUrl)}
                    className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:bg-zinc-200 transition-colors"
                  >
                    {playingId === track.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <a
                    href={track.audioUrl}
                    download={`${track.title}.mp3`}
                    className="w-9 h-9 rounded-full border border-zinc-700 flex items-center justify-center hover:border-zinc-500 transition-colors"
                  >
                    <Download className="w-4 h-4 text-zinc-400" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
