import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/shared/navbar';
import Footer from '@/components/shared/footer';
import { getAllBlogPosts } from '@/lib/blog-posts';
import {
  ArrowRight,
  Film,
  Zap,
  Sparkles,
  Music,
  Mic,
  Wand2,
  ImageIcon,
  Play,
  Check,
  Scissors,
  Captions,
  TrendingUp,
  Palette,
  PlaySquare,
  Star,
  Users,
  Globe,
  Award,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'MotionForce — AI Content Creation Platform',
  description:
    'Create viral AI videos, music, and voice content in minutes. Access Sora 2, VEO 3.1, Kling 3.0, Flux Pro, ElevenLabs, and Suno AI — all in one platform. Start free.',
  alternates: { canonical: 'https://motionforce.io' },
  openGraph: {
    title: 'MotionForce — AI Content Creation Platform',
    description: 'Create viral AI videos, music, and voice content in minutes. Start free.',
    type: 'website',
  },
};

const MODELS = [
  { name: 'Sora 2', category: 'Video' },
  { name: 'VEO 3.1', category: 'Video' },
  { name: 'Kling 3.0', category: 'Video' },
  { name: 'Flux Pro', category: 'Image' },
  { name: 'Imagen 4', category: 'Image' },
  { name: 'Seedream', category: 'Image' },
  { name: 'ElevenLabs', category: 'Voice' },
  { name: 'Suno AI', category: 'Music' },
];

const STATS = [
  { value: '10M+', label: 'Creations generated', icon: Sparkles },
  { value: '50K+', label: 'Active creators', icon: Users },
  { value: '140+', label: 'Countries', icon: Globe },
  { value: '4.9★', label: 'Average rating', icon: Award },
];

const TOOL_CARDS = [
  {
    icon: ImageIcon,
    title: 'AI Image & Video Studio',
    desc: 'Generate stunning visuals with Flux, Imagen 4, Sora 2, VEO 3.1, and Kling.',
    gradient: 'from-violet-500/20 to-purple-600/10',
    iconBg: 'bg-violet-500/20',
    iconColor: 'text-violet-300',
    href: '/ai-studio',
  },
  {
    icon: Film,
    title: 'Professional Video Editor',
    desc: 'Timeline editor with captions, effects, stickers, and multi-track audio.',
    gradient: 'from-orange-500/20 to-amber-600/10',
    iconBg: 'bg-orange-500/20',
    iconColor: 'text-orange-300',
    href: '/editor',
  },
  {
    icon: Music,
    title: 'AI Music Generation',
    desc: 'Original tracks in any style — vocals, instrumentals, fully custom with Suno AI.',
    gradient: 'from-blue-500/20 to-cyan-600/10',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-300',
    href: '/ai-music',
  },
  {
    icon: Mic,
    title: 'AI Voice & TTS',
    desc: 'Text-to-speech, sound effects, and voice isolation — broadcast quality.',
    gradient: 'from-green-500/20 to-emerald-600/10',
    iconBg: 'bg-green-500/20',
    iconColor: 'text-green-300',
    href: '/ai-voice',
  },
  {
    icon: Sparkles,
    title: 'Story Creator',
    desc: 'Multi-shot AI video stories — ASMR, remix, talking things — auto pipeline.',
    gradient: 'from-pink-500/20 to-rose-600/10',
    iconBg: 'bg-pink-500/20',
    iconColor: 'text-pink-300',
    href: '/stories',
  },
  {
    icon: Scissors,
    title: 'Viral Clip Extractor',
    desc: 'AI scores segments for virality and cuts the best clips automatically.',
    gradient: 'from-red-500/20 to-rose-600/10',
    iconBg: 'bg-red-500/20',
    iconColor: 'text-red-300',
    href: '/tools/clip-extractor',
  },
  {
    icon: Captions,
    title: 'Animated Captions',
    desc: '7 viral caption styles — MrBeast, Hormozi, TikTok Karaoke, and more.',
    gradient: 'from-sky-500/20 to-cyan-600/10',
    iconBg: 'bg-sky-500/20',
    iconColor: 'text-sky-300',
    href: '/tools/captions',
  },
  {
    icon: TrendingUp,
    title: 'Finance Video Generator',
    desc: 'Animate candlestick charts, OHLC data, and market summaries instantly.',
    gradient: 'from-emerald-500/20 to-green-600/10',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-300',
    href: '/tools/finance-video',
  },
  {
    icon: Wand2,
    title: 'Content Tools',
    desc: 'AI upscaler (2x/4x), watermark remover, and multi-platform video downloader.',
    gradient: 'from-yellow-500/20 to-amber-600/10',
    iconBg: 'bg-yellow-500/20',
    iconColor: 'text-yellow-300',
    href: '/tools/upscaler',
  },
  {
    icon: Palette,
    title: 'Brand Kit',
    desc: 'Store your logo, colors, fonts, intro/outro — auto-applied to every render.',
    gradient: 'from-fuchsia-500/20 to-purple-600/10',
    iconBg: 'bg-fuchsia-500/20',
    iconColor: 'text-fuchsia-300',
    href: '/tools/brand-kit',
  },
  {
    icon: PlaySquare,
    title: 'Render Job Engine',
    desc: 'Async render pipeline with real-time progress, webhook delivery, job dashboard.',
    gradient: 'from-indigo-500/20 to-blue-600/10',
    iconBg: 'bg-indigo-500/20',
    iconColor: 'text-indigo-300',
    href: '/dashboard',
  },
];

const TESTIMONIALS = [
  {
    name: 'Alexandra Johnson',
    role: 'Content Creator',
    avatar: 'AJ',
    avatarBg: 'bg-violet-600',
    text: "MotionForce is insane. I used to spend days editing — now I produce 10 videos a week. The AI models are miles ahead of anything else I've tried.",
  },
  {
    name: 'Mark Davis',
    role: 'Social Media Manager',
    avatar: 'MD',
    avatarBg: 'bg-blue-600',
    text: 'My clients are blown away by the quality. The viral clip extractor alone saves me 3 hours per video. Worth every penny.',
  },
  {
    name: 'Emily Williams',
    role: 'YouTuber, 1.2M subs',
    avatar: 'EW',
    avatarBg: 'bg-pink-600',
    text: 'Flux Pro + Sora 2 in one platform? Game changer. The story creator makes ASMR content that my audience loves.',
  },
  {
    name: 'Chris Thompson',
    role: 'Digital Marketer',
    avatar: 'CT',
    avatarBg: 'bg-green-600',
    text: 'I cancelled 4 other subscriptions after switching to MotionForce. Everything I need — images, video, music, voice — all in one place.',
  },
  {
    name: 'David Lee',
    role: 'Creative Director',
    avatar: 'DL',
    avatarBg: 'bg-orange-600',
    text: 'The finance video generator is unique. Our trading recap content has 3x engagement since we started using it.',
  },
];

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    credits: '100 cr/mo',
    highlight: false,
    features: ['AI image generation', 'Basic editor', 'Community support'],
  },
  {
    name: 'Creator',
    price: '$29',
    credits: '1,000 cr/mo',
    highlight: false,
    features: ['All AI models', 'Clip extractor', 'Captions', 'Priority support'],
  },
  {
    name: 'Pro',
    price: '$79',
    credits: '5,000 cr/mo',
    highlight: true,
    features: ['Everything in Creator', 'Finance video', 'Brand kit', '4K renders'],
  },
  {
    name: 'Agency',
    price: '$199',
    credits: 'Unlimited',
    highlight: false,
    features: ['Everything in Pro', 'API access', '10 team seats', 'Dedicated support'],
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'MotionForce',
  url: 'https://motionforce.io',
  description: 'AI content creation platform for images, videos, music, and voice',
  sameAs: ['https://x.com/motionforce', 'https://youtube.com/@motionforce'],
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '0',
    highPrice: '199',
    priceCurrency: 'USD',
  },
};

export default async function HomePage() {
  const blogPosts = getAllBlogPosts().slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-[#0a0a0f] text-white min-h-screen selection:bg-white selection:text-black">
        <Navbar />

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-20 pb-0">
          {/* Background glow */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-violet-700/12 rounded-full blur-[160px]" />
            <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-blue-700/8 rounded-full blur-[120px]" />
            <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-pink-700/8 rounded-full blur-[120px]" />
          </div>

          <div className="container mx-auto px-6 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/70 text-xs text-zinc-300 mb-8 backdrop-blur-sm">
              <Zap className="w-3 h-3 text-yellow-400 shrink-0" />
              The all-in-one AI content creation platform
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-black tracking-tighter mb-6 leading-[0.92]">
              <span className="bg-gradient-to-b from-white via-white/90 to-zinc-400 bg-clip-text text-transparent">
                AI-powered tools for
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                every creator
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-base md:text-lg text-zinc-400 mb-10 leading-relaxed">
              Generate AI images, videos, music, and voice. Edit in a professional timeline.
              Extract viral clips. All in one platform — no juggling subscriptions.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded-full font-bold text-sm hover:bg-zinc-100 transition-all shadow-lg shadow-white/10 group"
              >
                Sign up for free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/ai-studio"
                className="inline-flex items-center gap-2 text-zinc-200 border border-zinc-700 hover:border-zinc-500 bg-zinc-900/60 backdrop-blur-sm px-7 py-3.5 rounded-full text-sm font-medium transition-all hover:bg-zinc-800/60"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Try AI Studio
              </Link>
            </div>

            {/* Model badges */}
            <div className="flex flex-wrap justify-center gap-2 mb-16">
              {MODELS.map((m) => (
                <span
                  key={m.name}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-zinc-800 bg-zinc-900/60 text-zinc-300"
                >
                  {m.name}
                  <span className="text-zinc-600 text-[10px]">{m.category}</span>
                </span>
              ))}
            </div>

            {/* Hero product mockup */}
            <div className="relative mx-auto max-w-5xl">
              {/* Floating stat cards */}
              <div className="absolute -left-4 lg:-left-16 top-12 hidden lg:block z-10">
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl w-44">
                  <p className="text-[11px] text-zinc-500 mb-1">Generated this week</p>
                  <p className="text-2xl font-black text-white">142K</p>
                  <p className="text-[11px] text-green-400 mt-1 font-medium">↑ 24% vs last week</p>
                </div>
              </div>
              <div className="absolute -right-4 lg:-right-16 top-12 hidden lg:block z-10">
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl w-44">
                  <p className="text-[11px] text-zinc-500 mb-1">Active creators</p>
                  <p className="text-2xl font-black text-white">50K+</p>
                  <p className="text-[11px] text-blue-400 mt-1 font-medium">140 countries</p>
                </div>
              </div>

              {/* Main app mockup */}
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm shadow-2xl shadow-black/50 overflow-hidden">
                {/* Window chrome */}
                <div className="flex items-center gap-3 px-5 py-3.5 border-b border-zinc-800/60 bg-zinc-950/60">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                  </div>
                  <div className="flex gap-1 ml-4">
                    {['Image', 'Video', 'Img → Vid', 'Stories'].map((tab, i) => (
                      <span
                        key={tab}
                        className={`px-3 py-1 rounded-md text-xs font-medium ${
                          i === 0
                            ? 'bg-violet-600 text-white'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {tab}
                      </span>
                    ))}
                  </div>
                  <div className="ml-auto flex gap-2">
                    <span className="text-[10px] text-zinc-600 border border-zinc-800 px-2 py-0.5 rounded">Flux Pro</span>
                    <span className="text-[10px] text-zinc-600 border border-zinc-800 px-2 py-0.5 rounded">16:9</span>
                  </div>
                </div>

                {/* Gallery grid */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 p-4 bg-zinc-950/30">
                  {[
                    { gradient: 'from-violet-900 via-purple-800 to-indigo-900', label: 'Neon cityscape' },
                    { gradient: 'from-rose-900 via-pink-800 to-fuchsia-900', label: 'Abstract fluid' },
                    { gradient: 'from-emerald-900 via-teal-800 to-cyan-900', label: 'Forest mist' },
                    { gradient: 'from-amber-900 via-orange-800 to-red-900', label: 'Desert dunes' },
                    { gradient: 'from-slate-800 via-blue-900 to-indigo-950', label: 'Night stars' },
                    { gradient: 'from-fuchsia-900 via-violet-800 to-purple-900', label: 'Galaxy bloom' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`rounded-xl bg-gradient-to-br ${item.gradient} aspect-square flex items-end p-2 group cursor-pointer ring-1 ring-white/5 hover:ring-white/20 transition-all`}
                    >
                      <span className="text-[9px] text-white/40 group-hover:text-white/70 transition-colors truncate">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Prompt bar */}
                <div className="px-4 pb-4 bg-zinc-950/30">
                  <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-700/60 rounded-xl px-4 py-3">
                    <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
                    <span className="text-sm text-zinc-500 flex-1 text-left">
                      A cinematic aerial shot of mountain peaks at golden hour, photorealistic...
                    </span>
                    <span className="text-xs bg-violet-600 hover:bg-violet-500 text-white px-4 py-1.5 rounded-lg font-semibold shrink-0 cursor-pointer transition-colors">
                      Generate
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom fade */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none" />
            </div>
          </div>
        </section>

        {/* ── STATS STRIP ──────────────────────────────────────────────── */}
        <section className="py-14 border-y border-zinc-900/60 bg-zinc-950/40 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-1">
                  <stat.icon className="w-4 h-4 text-zinc-600 mb-1" />
                  <p className="text-3xl font-black tracking-tight">{stat.value}</p>
                  <p className="text-xs text-zinc-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURE OVERVIEW CARDS ───────────────────────────────────── */}
        <section className="py-8 border-b border-zinc-900/60">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Film, label: 'Online video editor', sub: 'Pro timeline', color: 'text-orange-400', bg: 'bg-orange-500/10', href: '/editor' },
                { icon: ImageIcon, label: 'AI image studio', sub: 'Flux · Imagen · Seedream', color: 'text-violet-400', bg: 'bg-violet-500/10', href: '/ai-studio' },
                { icon: Music, label: 'Music generation', sub: 'Suno AI', color: 'text-blue-400', bg: 'bg-blue-500/10', href: '/ai-music' },
                { icon: Scissors, label: 'Viral clip extractor', sub: 'Auto-cut · Caption', color: 'text-green-400', bg: 'bg-green-500/10', href: '/tools/clip-extractor' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group flex items-center gap-4 p-5 rounded-2xl border border-zinc-800/60 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white leading-tight">{item.label}</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">{item.sub}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 ml-auto shrink-0 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURE SHOWCASE 1 — AI Studio ───────────────────────────── */}
        <section className="py-24 border-b border-zinc-900/60 overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-4">AI Studio</p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-[1.05]">
                  Generate images{' '}
                  <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                    and videos
                  </span>{' '}
                  in seconds.
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                  Access the world&apos;s best AI models — Sora 2, VEO 3.1, Kling 3.0, Flux Pro, Imagen 4
                  — from one clean interface. No API keys. No setup.
                </p>
                <ul className="space-y-3 mb-10">
                  {[
                    '8 AI image & video models',
                    'Image-to-video transformation',
                    'Batch generation & gallery',
                    'One-click download in any format',
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-zinc-300">
                      <div className="w-5 h-5 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-violet-400" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/ai-studio"
                  className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-full text-sm font-semibold transition-colors group"
                >
                  Open AI Studio
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Visual */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-pink-600/10 rounded-3xl blur-3xl -z-10" />
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 shadow-2xl">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {[
                      { g: 'from-violet-900 via-purple-800 to-blue-900', t: 'Cinematic sunset' },
                      { g: 'from-emerald-900 via-teal-800 to-cyan-900', t: 'Forest trail' },
                      { g: 'from-rose-900 via-pink-800 to-orange-900', t: 'Abstract flow' },
                      { g: 'from-indigo-900 via-violet-800 to-purple-900', t: 'Galaxy art' },
                    ].map((item) => (
                      <div
                        key={item.t}
                        className={`rounded-xl bg-gradient-to-br ${item.g} aspect-video flex items-end p-3`}
                      >
                        <span className="text-[10px] text-white/60">{item.t}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-800/60 border border-zinc-700/40 rounded-xl px-3 py-2">
                    <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                    <span className="text-xs text-zinc-500 flex-1">Describe your vision...</span>
                    <span className="text-[11px] bg-violet-600 text-white px-3 py-1 rounded-lg font-semibold">Generate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURE SHOWCASE 2 — Video Editor ────────────────────────── */}
        <section className="py-24 border-b border-zinc-900/60 overflow-hidden bg-zinc-950/30">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Visual first on this row */}
              <div className="relative order-2 lg:order-1">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-amber-600/10 rounded-3xl blur-3xl -z-10" />
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 shadow-2xl">
                  {/* Mock timeline editor */}
                  <div className="aspect-video bg-zinc-950 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-orange-900/20 to-red-900/30" />
                    <div className="relative z-10 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                      <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                    </div>
                    {/* Caption overlay mock */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                      {['HOW', 'TO', 'GO', 'VIRAL'].map((w) => (
                        <span key={w} className="px-2 py-0.5 bg-yellow-400 text-black text-xs font-black rounded">{w}</span>
                      ))}
                    </div>
                  </div>
                  {/* Timeline tracks */}
                  <div className="space-y-1.5">
                    {[
                      { label: 'Video', color: 'bg-orange-500/40', w: '85%' },
                      { label: 'Audio', color: 'bg-blue-500/40', w: '70%' },
                      { label: 'Captions', color: 'bg-yellow-500/40', w: '60%' },
                    ].map((track) => (
                      <div key={track.label} className="flex items-center gap-2">
                        <span className="text-[9px] text-zinc-600 w-12 shrink-0">{track.label}</span>
                        <div className="flex-1 h-5 bg-zinc-800 rounded overflow-hidden">
                          <div className={`h-full ${track.color} rounded`} style={{ width: track.w }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-4">Video Editor</p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-[1.05]">
                  Professional editor.{' '}
                  <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                    Browser-native.
                  </span>
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                  Full timeline editor powered by Remotion. Add captions, effects, stickers,
                  and multi-track audio — then export in 4K without leaving your browser.
                </p>
                <ul className="space-y-3 mb-10">
                  {[
                    '7 viral caption styles (MrBeast, Hormozi, TikTok...)',
                    'Multi-track timeline with keyframes',
                    'Stickers, transitions, and text effects',
                    '4K export with Remotion Lambda',
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-zinc-300">
                      <div className="w-5 h-5 rounded-full bg-orange-600/20 border border-orange-500/30 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-orange-400" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/editor"
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white px-6 py-3 rounded-full text-sm font-semibold transition-colors group"
                >
                  Open Editor
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── SMART TOOLS GRID ─────────────────────────────────────────── */}
        <section id="features" className="py-24 border-b border-zinc-900/60">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">All tools</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5">
                Smart tools,{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  work magic
                </span>
              </h2>
              <p className="text-zinc-400 max-w-lg mx-auto">
                Spark your creativity with next-generation AI. From generation to export —
                no switching between tools.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {TOOL_CARDS.map((tool) => (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className={`group relative p-5 rounded-2xl border border-zinc-800/60 bg-gradient-to-br ${tool.gradient} hover:border-zinc-700 hover:scale-[1.01] transition-all`}
                >
                  <div className={`w-10 h-10 rounded-xl ${tool.iconBg} flex items-center justify-center mb-4`}>
                    <tool.icon className={`w-5 h-5 ${tool.iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-sm mb-1.5 text-white">{tool.title}</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed">{tool.desc}</p>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-400 absolute bottom-5 right-5 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRUSTED BY ───────────────────────────────────────────────── */}
        <section className="py-16 border-b border-zinc-900/60 bg-zinc-950/50">
          <div className="container mx-auto px-6 text-center">
            <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest mb-10">
              Trusted by creators at
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-6">
              {[
                { name: 'TikTok', style: 'text-2xl font-black text-white/60' },
                { name: 'YouTube', style: 'text-2xl font-black text-white/60' },
                { name: 'Instagram', style: 'text-2xl font-black text-white/60' },
                { name: 'Twitch', style: 'text-2xl font-black text-white/60' },
                { name: 'X (Twitter)', style: 'text-2xl font-black text-white/60' },
              ].map((brand) => (
                <span key={brand.name} className={`${brand.style} hover:text-white/90 transition-colors`}>
                  {brand.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
        <section className="py-24 border-b border-zinc-900/60">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Reviews</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                Loved by{' '}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  millions
                </span>{' '}
                of creators
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.name}
                  className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-5 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-9 h-9 rounded-full ${t.avatarBg} flex items-center justify-center shrink-0`}>
                      <span className="text-xs font-bold text-white">{t.avatar}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white leading-tight">{t.name}</p>
                      <p className="text-[11px] text-zinc-500">{t.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{t.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ──────────────────────────────────────────────────── */}
        <section id="pricing" className="py-24 border-b border-zinc-900/60 bg-zinc-950/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Pricing</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                Simple, transparent pricing
              </h2>
              <p className="text-zinc-400 max-w-sm mx-auto">Start free. Upgrade when you need more power.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-5 max-w-5xl mx-auto mb-10">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl p-6 border transition-colors ${
                    plan.highlight
                      ? 'border-violet-500/60 bg-violet-600/5 shadow-lg shadow-violet-900/20'
                      : 'border-zinc-800/60 bg-zinc-900/20 hover:border-zinc-700'
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-violet-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <h3 className="font-bold mb-1 text-white">{plan.name}</h3>
                  <div className="mb-1">
                    <span className="text-3xl font-black">{plan.price}</span>
                    {plan.price !== '$0' && <span className="text-zinc-500 text-xs">/mo</span>}
                  </div>
                  <p className="text-xs text-zinc-500 mb-4 pb-4 border-b border-zinc-800">{plan.credits}</p>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-zinc-400">
                        <Check className="w-3 h-3 text-green-400 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.name === 'Free' ? '/signup' : '/pricing'}
                    className={`block w-full py-2.5 text-center text-xs font-bold rounded-xl transition-colors ${
                      plan.highlight
                        ? 'bg-violet-600 text-white hover:bg-violet-500'
                        : 'bg-zinc-800 text-white hover:bg-zinc-700'
                    }`}
                  >
                    {plan.name === 'Free' ? 'Get started free' : `Get ${plan.name}`}
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/pricing"
                className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
              >
                View full pricing details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── BLOG PREVIEW ─────────────────────────────────────────────── */}
        {blogPosts.length > 0 && (
          <section className="py-24 border-b border-zinc-900/60">
            <div className="container mx-auto px-6">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">Blog</p>
                  <h2 className="text-3xl font-black tracking-tight">Guides & tutorials</h2>
                </div>
                <Link
                  href="/blog"
                  className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1.5 shrink-0"
                >
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {blogPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group rounded-2xl border border-zinc-800/60 overflow-hidden hover:border-zinc-700 transition-colors"
                  >
                    <div className={`h-40 bg-gradient-to-br ${post.coverGradient} flex items-end p-5`}>
                      <span className="text-xs font-semibold bg-white/10 border border-white/20 text-white px-2.5 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <div className="p-5 bg-zinc-900/30">
                      <p className="text-xs text-zinc-600 mb-2">{post.readingTime}</p>
                      <h3 className="font-semibold text-sm leading-snug group-hover:text-zinc-200 transition-colors line-clamp-2 text-zinc-300">
                        {post.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── FINAL CTA ────────────────────────────────────────────────── */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-violet-700/10 rounded-full blur-[140px]" />
            <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[400px] h-[400px] bg-blue-700/8 rounded-full blur-[100px]" />
            <div className="absolute top-1/2 right-1/3 -translate-y-1/2 w-[400px] h-[400px] bg-pink-700/8 rounded-full blur-[100px]" />
          </div>
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 leading-[0.95]">
              <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                Start your next viral
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                video today.
              </span>
            </h2>
            <p className="text-zinc-400 text-lg mb-10 max-w-md mx-auto leading-relaxed">
              100 free credits every month. No credit card required.
              Access the world&apos;s best AI models.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-white text-black px-9 py-4 rounded-full font-bold text-sm hover:bg-zinc-100 transition-all shadow-xl shadow-white/10 group"
              >
                Sign up for free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/pricing"
                className="text-sm text-zinc-400 hover:text-white transition-colors px-4 py-4"
              >
                View pricing →
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
