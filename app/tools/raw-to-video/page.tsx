'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { DashboardLayout } from '@/components/shared/dashboard-layout';
import {
  Check, ChevronLeft, ChevronRight, Rocket, X, Play,
  Info, Mic, Video, Image as ImageIcon, Wand2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = ['Platform & goal', 'Upload assets', 'Script', 'Audio source', 'Settings', 'Review'];

const PLATFORMS    = ['YouTube', 'Instagram', 'TikTok', 'LinkedIn', 'Website / other'];
const GOALS        = ['Promote product', 'Educate audience', 'Share news', 'Brand story', 'Tutorial / how-to', 'Testimonial'];
const VISUAL_STYLES = ['Clean / minimal', 'Dynamic / fast cuts', 'Documentary', 'Cinematic', 'Vertical / social'];
const RESOLUTIONS  = ['720p', '1080p', '4K', 'Vertical 9:16', 'Square 1:1'];
const TONES        = ['Professional', 'Casual / friendly', 'Energetic', 'Calm / soothing', 'Authoritative', 'Storytelling', 'Humorous', 'Inspirational'];
const PACE_LABELS  = ['Very slow', 'Slow', 'Normal', 'Fast', 'Very fast'];
const LANGUAGES    = ['English (US)', 'English (UK)', 'Urdu', 'Arabic', 'Hindi', 'Spanish', 'French', 'German', 'Portuguese', 'Mandarin', 'Japanese'];
const TRANSITIONS  = ['Hard cut', 'Fade', 'Cross-dissolve'];
const FPS_OPTIONS  = ['24 fps', '30 fps', '60 fps'];
const DUCKING_OPTIONS = ['Mute under VO', 'Reduce under VO', 'None'];

const VOICES = [
  { id: 'rachel', name: 'Rachel', meta: 'Female · American · Calm',       color: 'bg-violet-500/20 text-violet-300' },
  { id: 'adam',   name: 'Adam',   meta: 'Male · American · Confident',    color: 'bg-green-500/20 text-green-300' },
  { id: 'bella',  name: 'Bella',  meta: 'Female · British · Warm',        color: 'bg-pink-500/20 text-pink-300' },
  { id: 'josh',   name: 'Josh',   meta: 'Male · Australian · Energetic',  color: 'bg-orange-500/20 text-orange-300' },
  { id: 'noura',  name: 'Noura',  meta: 'Female · Arabic · Smooth',       color: 'bg-teal-500/20 text-teal-300' },
];

type AudioSource = 'elevenlabs' | 'upload-audio' | 'upload-video';

function fmtDur(s: number) {
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return r ? `${m} min ${r}s` : `${m} min`;
}

// ── Pill (single-select) ────────────────────────────────────────────────────
function Pill({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-sm transition-colors',
        selected
          ? 'border-violet-500 bg-violet-500/10 text-violet-300'
          : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
      )}
    >
      {children}
    </button>
  );
}

// ── TagChip (multi-select) ──────────────────────────────────────────────────
function TagChip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-3 py-1 rounded-full text-xs border transition-colors',
        selected
          ? 'border-violet-500 bg-violet-500/10 text-violet-300'
          : 'border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
      )}
    >
      {children}
    </button>
  );
}

// ── DropZone ────────────────────────────────────────────────────────────────
function DropZone({
  label, subLabel, accept, multiple = false, files, onFiles, icon: Icon,
}: {
  label: string;
  subLabel: string;
  accept: string;
  multiple?: boolean;
  files: File[];
  onFiles: (files: File[]) => void;
  icon: React.ElementType;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const merge = (incoming: FileList | null) => {
    if (!incoming) return;
    onFiles([...files, ...Array.from(incoming)]);
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e: DragEvent) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e: DragEvent) => { e.preventDefault(); setDrag(false); merge(e.dataTransfer.files); }}
        className={cn(
          'border border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors',
          drag
            ? 'border-violet-500 bg-violet-500/10'
            : 'border-zinc-700 bg-zinc-900/30 hover:border-zinc-500 hover:bg-zinc-900/50'
        )}
      >
        <Icon className={cn('w-6 h-6 mx-auto mb-2', drag ? 'text-violet-400' : 'text-zinc-600')} />
        <p className="text-sm font-medium text-zinc-300">{label}</p>
        <p className="text-xs text-zinc-600 mt-0.5">{subLabel}</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e: ChangeEvent<HTMLInputElement>) => merge(e.target.files)}
      />
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {files.map((f, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300"
            >
              {f.name}
              <button
                type="button"
                onClick={() => onFiles(files.filter((_, idx) => idx !== i))}
                className="text-zinc-600 hover:text-zinc-200 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Step indicator bar ──────────────────────────────────────────────────────
function StepBar({ current }: { current: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center">
        {STEPS.map((_, idx) => {
          const step = idx + 1;
          const done = step < current;
          const active = step === current;
          return (
            <div key={step} className="flex items-center" style={{ flex: idx < STEPS.length - 1 ? 1 : 'none' }}>
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 border transition-colors',
                  done   ? 'bg-green-500 border-green-500 text-white' :
                  active ? 'bg-violet-600 border-violet-600 text-white' :
                           'bg-transparent border-zinc-700 text-zinc-600'
                )}
              >
                {done ? <Check className="w-3.5 h-3.5" /> : step}
              </div>
              {idx < STEPS.length - 1 && (
                <div className={cn('flex-1 h-px mx-1', done ? 'bg-green-500/40' : 'bg-zinc-800')} />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex mt-2">
        {STEPS.map((label, idx) => {
          const step = idx + 1;
          return (
            <div
              key={label}
              style={{ flex: idx < STEPS.length - 1 ? 1 : 'none' }}
              className={cn(
                'text-[10px] whitespace-nowrap overflow-hidden',
                step < current  ? 'text-green-500' :
                step === current ? 'text-violet-400 font-medium' :
                                   'text-zinc-600'
              )}
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Summary row ─────────────────────────────────────────────────────────────
function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline py-2.5 border-b border-zinc-800 last:border-b-0 text-sm">
      <span className="text-zinc-500">{label}</span>
      <span className="text-zinc-200 font-medium text-right max-w-[200px] truncate">{value || '—'}</span>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function RawToVideoPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Step 1
  const [platform, setPlatform]       = useState('YouTube');
  const [goal, setGoal]               = useState('Promote product');
  const [audience, setAudience]       = useState('');
  const [duration, setDuration]       = useState(90);
  const [visualStyle, setVisualStyle] = useState('Clean / minimal');

  // Step 2
  const [videoFiles, setVideoFiles]   = useState<File[]>([]);
  const [imageFiles, setImageFiles]   = useState<File[]>([]);
  const [assetNotes, setAssetNotes]   = useState('');
  const [resolution, setResolution]   = useState('1080p');

  // Step 3
  const [script, setScript]           = useState('');
  const [tones, setTones]             = useState<string[]>(['Professional']);
  const [pace, setPace]               = useState(3);
  const [language, setLanguage]       = useState('English (US)');
  const [keywords, setKeywords]       = useState<string[]>([]);
  const [kwInput, setKwInput]         = useState('');

  // Step 4
  const [audioSource, setAudioSource]       = useState<AudioSource>('upload-audio');
  const [voice, setVoice]                   = useState('rachel');
  const [voiceStability, setVoiceStability] = useState(65);
  const [similarityBoost, setSimilarityBoost] = useState(75);
  const [audioFiles, setAudioFiles]         = useState<File[]>([]);
  const [audioVideoFiles, setAudioVideoFiles] = useState<File[]>([]);
  const [ducking, setDucking]               = useState('Mute under VO');

  // Step 5
  const [transition, setTransition]               = useState('Hard cut');
  const [loudness, setLoudness]                   = useState(-14);
  const [fps, setFps]                             = useState('30 fps');
  const [introText, setIntroText]                 = useState('');
  const [outroText, setOutroText]                 = useState('');
  const [logoFiles, setLogoFiles]                 = useState<File[]>([]);
  const [filename, setFilename]                   = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');

  const toggleTone = (t: string) =>
    setTones((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  const addKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && kwInput.trim()) {
      setKeywords((prev) => [...prev, kwInput.trim()]);
      setKwInput('');
      e.preventDefault();
    }
  };

  const go = (dir: 1 | -1) => {
    if (step === 6 && dir === 1) { setSubmitted(true); return; }
    setStep((s) => Math.max(1, Math.min(6, s + dir)));
  };

  const AUDIO_LABELS: Record<AudioSource, string> = {
    'elevenlabs':   'AI voiceover (ElevenLabs)',
    'upload-audio': 'Upload audio file',
    'upload-video': 'Extract from video',
  };

  // ── Submitted ──────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-center p-8">
          <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
            <Check className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Submitted to render agent</h2>
            <p className="text-zinc-400 text-sm max-w-sm">
              Your video is queued. You'll see the preview in the editor once rendering completes — usually 2–5 minutes depending on video length.
            </p>
          </div>
          <button
            onClick={() => { setStep(1); setSubmitted(false); }}
            className="px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
          >
            Start new video
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2.5">
            <Rocket className="w-6 h-6 text-violet-400" />
            Raw Content to Video
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Upload your assets, write a script, and let the agent produce a polished video.
          </p>
        </div>

        <StepBar current={step} />

        {/* ── Step 1: Platform & Goal ──────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <p className="text-lg font-semibold mb-1">What's this video for?</p>
              <p className="text-sm text-zinc-400 mb-5">Choose a platform and goal so the agent can tailor structure, pacing, and style.</p>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider block mb-2">Platform</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <Pill key={p} selected={platform === p} onClick={() => setPlatform(p)}>{p}</Pill>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider block mb-2">Video goal</label>
              <div className="flex flex-wrap gap-2">
                {GOALS.map((g) => (
                  <Pill key={g} selected={goal === g} onClick={() => setGoal(g)}>{g}</Pill>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider block mb-2">Target audience</label>
              <input
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. startup founders, 25–40, tech-savvy"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-600 placeholder:text-zinc-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Video duration</label>
                <span className="text-sm font-semibold text-zinc-200">{fmtDur(duration)}</span>
              </div>
              <input
                type="range"
                min={15} max={600} step={15}
                value={duration}
                onChange={(e) => setDuration(+e.target.value)}
                className="w-full accent-violet-500"
              />
              <div className="flex justify-between text-[10px] text-zinc-700 mt-1">
                <span>15s</span><span>10 min</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider block mb-2">Visual style</label>
              <div className="flex flex-wrap gap-2">
                {VISUAL_STYLES.map((s) => (
                  <Pill key={s} selected={visualStyle === s} onClick={() => setVisualStyle(s)}>{s}</Pill>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Upload Assets ────────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <p className="text-lg font-semibold mb-1">Upload your raw assets</p>
              <p className="text-sm text-zinc-400 mb-5">Add all the footage and photos for this video. You can re-order them later in the editor.</p>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider block mb-2">Video clips</label>
              <DropZone
                label="Drop video clips here, or click to browse"
                subLabel="MP4, MOV, AVI, WebM — up to 2 GB each"
                accept="video/*"
                multiple
                files={videoFiles}
                onFiles={setVideoFiles}
                icon={Video}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider block mb-2">Photos / images</label>
              <DropZone
                label="Drop photos here, or click to browse"
                subLabel="JPG, PNG, WEBP, HEIC — up to 50 MB each"
                accept="image/*"
                multiple
                files={imageFiles}
                onFiles={setImageFiles}
                icon={ImageIcon}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider block mb-2">
                Asset notes{' '}
                <span className="normal-case font-normal text-zinc-600">(optional)</span>
              </label>
              <textarea
                value={assetNotes}
                onChange={(e) => setAssetNotes(e.target.value)}
                rows={3}
                placeholder="e.g. Use the rooftop clips first, product close-ups mid-video, team shots at the end…"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-zinc-600 placeholder:text-zinc-600"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider block mb-2">Output resolution</label>
              <div className="flex flex-wrap gap-2">
                {RESOLUTIONS.map((r) => (
                  <Pill key={r} selected={resolution === r} onClick={() => setResolution(r)}>{r}</Pill>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Script ───────────────────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <p className="text-lg font-semibold mb-1">Write or paste your script</p>
              <p className="text-sm text-zinc-400 mb-5">This becomes your narration. The agent will sync it to the clips automatically.</p>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider block mb-2">Narration script</label>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value.slice(0, 2000))}
                rows={7}
                placeholder={"Write your narration here. Each sentence becomes a sync point with your video clips.\n\nTip: Keep sentences short and punchy — they match cut timing better."}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-zinc-600 placeholder:text-zinc-600"
              />
              <div className={cn('text-right text-[11px] mt-1', script.length > 1800 ? 'text-red-400' : 'text-zinc-600')}>
                {script.length} / 2000
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider block mb-2">Tone of voice</label>
              <div className="flex flex-wrap gap-2">
                {TONES.map((t) => (
                  <TagChip key={t} selected={tones.includes(t)} onClick={() => toggleTone(t)}>{t}</TagChip>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Speaking pace</label>
                <span className="text-sm font-semibold text-zinc-200">{PACE_LABELS[pace - 1]}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-zinc-600 w-10">Slow</span>
                <input
                  type="range"
                  min={1} max={5} step={1}
                  value={pace}
                  onChange={(e) => setPace(+e.target.value)}
                  className="flex-1 accent-violet-500"
                />
                <span className="text-[11px] text-zinc-600 w-10 text-right">Fast</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider block mb-2">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:border-zinc-600"
              >
                {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider block mb-2">
                Keywords / SEO tags{' '}
                <span className="normal-case font-normal text-zinc-600">(optional)</span>
              </label>
              <input
                value={kwInput}
                onChange={(e) => setKwInput(e.target.value)}
                onKeyDown={addKeyword}
                placeholder="Type a keyword and press Enter"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-600 placeholder:text-zinc-600"
              />
              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300"
                    >
                      {kw}
                      <button
                        type="button"
                        onClick={() => setKeywords((prev) => prev.filter((_, idx) => idx !== i))}
                        className="text-violet-500 hover:text-violet-200 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Step 4: Audio Source ─────────────────────────────────────── */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <p className="text-lg font-semibold mb-1">Choose your audio source</p>
              <p className="text-sm text-zinc-400 mb-5">Pick how the narration audio is created. You can change this before final render.</p>
            </div>

            {/* Source cards */}
            <div className="grid grid-cols-3 gap-3">
              {([
                { id: 'elevenlabs'   as AudioSource, icon: Wand2,    title: 'AI voiceover',       sub: 'ElevenLabs TTS — pick a voice' },
                { id: 'upload-audio' as AudioSource, icon: Mic,      title: 'Upload audio file',  sub: 'MP3, WAV, AAC' },
                { id: 'upload-video' as AudioSource, icon: Video,    title: 'Extract from video', sub: 'Pull audio from a clip' },
              ]).map(({ id, icon: Icon, title, sub }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setAudioSource(id)}
                  className={cn(
                    'p-4 rounded-xl border text-left transition-colors',
                    audioSource === id
                      ? 'border-violet-500 bg-violet-500/10'
                      : 'border-zinc-700 bg-zinc-900/30 hover:border-zinc-500'
                  )}
                >
                  <Icon className={cn('w-5 h-5 mb-2', audioSource === id ? 'text-violet-400' : 'text-zinc-500')} />
                  <p className={cn('text-sm font-medium', audioSource === id ? 'text-violet-300' : 'text-zinc-200')}>{title}</p>
                  <p className="text-xs text-zinc-600 mt-0.5">{sub}</p>
                </button>
              ))}
            </div>

            {/* ElevenLabs voice picker */}
            {audioSource === 'elevenlabs' && (
              <div className="space-y-4">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider block">Select a voice</label>
                <div className="space-y-2">
                  {VOICES.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => setVoice(v.id)}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors',
                        voice === v.id
                          ? 'border-violet-500 bg-violet-500/10'
                          : 'border-zinc-700 bg-zinc-900/30 hover:border-zinc-600'
                      )}
                    >
                      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0', v.color)}>
                        {v.name[0]}
                      </div>
                      <div className="flex-1">
                        <p className={cn('text-sm font-medium', voice === v.id ? 'text-violet-300' : 'text-zinc-200')}>{v.name}</p>
                        <p className="text-xs text-zinc-600">{v.meta}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs border border-zinc-700 rounded-md text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors shrink-0"
                      >
                        <Play className="w-3 h-3" /> Preview
                      </button>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Voice stability</label>
                    <span className="text-xs text-zinc-400">{voiceStability}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-zinc-600 w-14">Variable</span>
                    <input type="range" min={0} max={100} value={voiceStability} onChange={(e) => setVoiceStability(+e.target.value)} className="flex-1 accent-violet-500" />
                    <span className="text-[11px] text-zinc-600 w-10 text-right">Stable</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Similarity boost</label>
                    <span className="text-xs text-zinc-400">{similarityBoost}%</span>
                  </div>
                  <input type="range" min={0} max={100} value={similarityBoost} onChange={(e) => setSimilarityBoost(+e.target.value)} className="w-full accent-violet-500" />
                </div>
              </div>
            )}

            {/* Upload audio */}
            {audioSource === 'upload-audio' && (
              <DropZone
                label="Drop audio file here, or click to browse"
                subLabel="MP3, WAV, AAC, OGG — up to 500 MB"
                accept="audio/*"
                files={audioFiles}
                onFiles={setAudioFiles}
                icon={Mic}
              />
            )}

            {/* Extract from video */}
            {audioSource === 'upload-video' && (
              <DropZone
                label="Drop video clip here, or click to browse"
                subLabel="Audio track will be extracted automatically"
                accept="video/*"
                files={audioVideoFiles}
                onFiles={setAudioVideoFiles}
                icon={Video}
              />
            )}

            <div>
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider block mb-2">Background audio ducking</label>
              <div className="flex flex-wrap gap-2">
                {DUCKING_OPTIONS.map((d) => (
                  <Pill key={d} selected={ducking === d} onClick={() => setDucking(d)}>{d}</Pill>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 5: Advanced Settings ─────────────────────────────────── */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <p className="text-lg font-semibold mb-1">Advanced settings</p>
              <p className="text-sm text-zinc-400 mb-5">Fine-tune how the agent constructs and renders the video.</p>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider block mb-2">Clip transition style</label>
              <div className="flex flex-wrap gap-2">
                {TRANSITIONS.map((t) => (
                  <Pill key={t} selected={transition === t} onClick={() => setTransition(t)}>{t}</Pill>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Narration loudness target</label>
                <span className="text-sm font-semibold text-zinc-200">{loudness} LUFS</span>
              </div>
              <input
                type="range"
                min={-23} max={-9} step={1}
                value={loudness}
                onChange={(e) => setLoudness(+e.target.value)}
                className="w-full accent-violet-500"
              />
              <div className="flex justify-between text-[10px] text-zinc-700 mt-1">
                <span>-23 LUFS (quiet)</span><span>-9 LUFS (loud)</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider block mb-2">Frame rate</label>
              <div className="flex gap-2">
                {FPS_OPTIONS.map((f) => (
                  <Pill key={f} selected={fps === f} onClick={() => setFps(f)}>{f}</Pill>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider block mb-2">Intro title text</label>
                <input
                  value={introText}
                  onChange={(e) => setIntroText(e.target.value)}
                  placeholder="e.g. Our 2025 Journey"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-600 placeholder:text-zinc-600"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider block mb-2">Outro / CTA text</label>
                <input
                  value={outroText}
                  onChange={(e) => setOutroText(e.target.value)}
                  placeholder="e.g. Subscribe for more"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-600 placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider block mb-2">
                Watermark / logo{' '}
                <span className="normal-case font-normal text-zinc-600">(optional)</span>
              </label>
              <DropZone
                label="Upload logo / watermark"
                subLabel="PNG with transparency recommended"
                accept="image/png,image/svg+xml"
                files={logoFiles}
                onFiles={setLogoFiles}
                icon={ImageIcon}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider block mb-2">Output file name</label>
              <div className="flex items-center gap-2">
                <input
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  placeholder="e.g. product-launch-Q3-2025"
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-600 placeholder:text-zinc-600"
                />
                <span className="text-sm text-zinc-600">.mp4</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider block mb-2">
                Additional instructions for agent{' '}
                <span className="normal-case font-normal text-zinc-600">(optional)</span>
              </label>
              <textarea
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
                rows={3}
                placeholder="e.g. Prioritise rooftop footage. Cut between clips when the narrator pauses. Keep brand colours consistent."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-zinc-600 placeholder:text-zinc-600"
              />
            </div>
          </div>
        )}

        {/* ── Step 6: Review ───────────────────────────────────────────── */}
        {step === 6 && (
          <div className="space-y-5">
            <div>
              <p className="text-lg font-semibold mb-1">Review and submit</p>
              <p className="text-sm text-zinc-400 mb-5">Everything looks good? Hit submit to send to the render agent.</p>
            </div>

            <div className="border border-zinc-800 rounded-2xl px-5 bg-zinc-900/30">
              <SummaryRow label="Platform"     value={platform} />
              <SummaryRow label="Goal"         value={goal} />
              <SummaryRow label="Duration"     value={fmtDur(duration)} />
              <SummaryRow label="Visual style" value={visualStyle} />
              <SummaryRow label="Resolution"   value={resolution} />
              <SummaryRow label="Audio source" value={AUDIO_LABELS[audioSource]} />
              <SummaryRow label="Tone"         value={tones.join(', ')} />
              <SummaryRow label="Frame rate"   value={fps} />
            </div>

            <div className="flex items-start gap-3 bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 text-sm text-blue-300">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                The agent will process your assets, generate the video, and present a preview editor — usually within 2–5 minutes depending on video length.
              </span>
            </div>
          </div>
        )}

        {/* ── Navigation ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-6 mt-8 border-t border-zinc-800">
          <button
            type="button"
            onClick={() => go(-1)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border transition-colors',
              step === 1
                ? 'invisible pointer-events-none'
                : 'border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
            )}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          <span className="text-xs text-zinc-600">Step {step} of {STEPS.length}</span>

          <button
            type="button"
            onClick={() => go(1)}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
          >
            {step === 6
              ? <><Rocket className="w-4 h-4" /> Submit to agent</>
              : <>Continue <ChevronRight className="w-4 h-4" /></>
            }
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
