'use client';

import { useState, useEffect } from 'react';
import { Mic, Wand2, Loader2, Play, Pause, Download, Zap } from 'lucide-react';
import { DashboardLayout } from '@/components/shared/dashboard-layout';
import { useApi } from '@/hooks/use-api';
import { useAudioPlayer } from '@/hooks/use-audio-player';
import { API_AI_VOICE } from '@/lib/constants/api';
import { Voice } from '@/lib/types';

type Tab = 'tts' | 'sfx' | 'isolate';

interface AudioResult {
  id: string;
  label: string;
  audioUrl: string;
}

export default function AIVoicePage() {
  const { apiFetch } = useApi();
  const { audioRef, playingId, togglePlay, onEnded } = useAudioPlayer();

  const [tab, setTab] = useState<Tab>('tts');
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [text, setText] = useState('');
  const [sfxPrompt, setSfxPrompt] = useState('');
  const [sfxDuration, setSfxDuration] = useState(3);
  const [isolateUrl, setIsolateUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<AudioResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Voice[]>(API_AI_VOICE.VOICES)
      .then((v) => { setVoices(v); setSelectedVoice(v[0]?.id ?? ''); })
      .catch(() => {});
  }, []);

  const generate = async () => {
    if (isGenerating) return;
    setError(null);
    setIsGenerating(true);

    try {
      let resultUrl = '';
      let label = '';

      if (tab === 'tts') {
        if (!text.trim() || !selectedVoice) return;
        const res = await apiFetch<{ audioUrl: string }>(API_AI_VOICE.TTS, {
          method: 'POST',
          body: JSON.stringify({ text, voiceId: selectedVoice }),
        });
        resultUrl = res.audioUrl;
        label = text.slice(0, 40) + (text.length > 40 ? '...' : '');
      } else if (tab === 'sfx') {
        if (!sfxPrompt.trim()) return;
        const res = await apiFetch<{ audioUrl: string }>(API_AI_VOICE.SFX, {
          method: 'POST',
          body: JSON.stringify({ prompt: sfxPrompt, durationSeconds: sfxDuration }),
        });
        resultUrl = res.audioUrl;
        label = sfxPrompt.slice(0, 40);
      } else {
        if (!isolateUrl.trim()) return;
        const res = await apiFetch<{ audioUrl: string }>(API_AI_VOICE.ISOLATE, {
          method: 'POST',
          body: JSON.stringify({ audioUrl: isolateUrl }),
        });
        resultUrl = res.audioUrl;
        label = 'Isolated Voice';
      }

      setResults((prev) => [{ id: `${Date.now()}`, label, audioUrl: resultUrl }, ...prev]);
    } catch (err: any) {
      setError(err.message ?? 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'tts', label: 'Text to Speech', icon: Mic },
    { id: 'sfx', label: 'Sound Effects', icon: Zap },
    { id: 'isolate', label: 'Voice Isolator', icon: Wand2 },
  ];

  return (
    <DashboardLayout>
      <audio ref={audioRef} onEnded={onEnded} />
      <div className="max-w-3xl mx-auto p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Mic className="w-6 h-6" /> AI Voice Tools
          </h1>
          <p className="text-zinc-400 mt-1 text-sm">
            Text-to-speech, sound effects, and voice isolation powered by ElevenLabs
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors ${
                tab === t.id
                  ? 'border-white text-white'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="border border-zinc-800 rounded-2xl p-6 space-y-5 bg-zinc-900/30">
          {tab === 'tts' && (
            <>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Voice</label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-600"
                >
                  {voices.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} — {v.gender}, {v.accent}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 flex justify-between">
                  <span>Text</span>
                  <span className="text-zinc-600">{text.length} chars</span>
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={5}
                  placeholder="Enter the text you want to convert to speech..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-zinc-600 placeholder:text-zinc-600"
                />
              </div>
            </>
          )}

          {tab === 'sfx' && (
            <>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">Sound description</label>
                <input
                  value={sfxPrompt}
                  onChange={(e) => setSfxPrompt(e.target.value)}
                  placeholder="Thunder rolling, rain hitting metal roof..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-600 placeholder:text-zinc-600"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 flex justify-between">
                  <span>Duration</span>
                  <span className="text-white">{sfxDuration}s</span>
                </label>
                <input
                  type="range"
                  min={0.5}
                  max={22}
                  step={0.5}
                  value={sfxDuration}
                  onChange={(e) => setSfxDuration(Number(e.target.value))}
                  className="w-full accent-white"
                />
              </div>
            </>
          )}

          {tab === 'isolate' && (
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Audio URL</label>
              <input
                value={isolateUrl}
                onChange={(e) => setIsolateUrl(e.target.value)}
                placeholder="https://... (mp3, wav, m4a)"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-600 placeholder:text-zinc-600"
              />
              <p className="text-xs text-zinc-600 mt-1.5">
                Removes background music and noise, leaving only the vocal track.
              </p>
            </div>
          )}

          <button
            onClick={generate}
            disabled={isGenerating}
            className="w-full py-2.5 bg-white text-black text-sm font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
            ) : (
              <><Wand2 className="w-4 h-4" /> Generate</>
            )}
          </button>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg p-3">
              {error}
            </p>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Results</h3>
            {results.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-4 p-4 border border-zinc-800 rounded-xl bg-zinc-900/30 hover:border-zinc-700 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{r.label}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => togglePlay(r.id, r.audioUrl)}
                    className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:bg-zinc-200 transition-colors"
                  >
                    {playingId === r.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <a
                    href={r.audioUrl}
                    download="audio.mp3"
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
