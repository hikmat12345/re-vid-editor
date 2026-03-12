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

const FEATURES = [
  {
    icon: ImageIcon,
    title: 'AI Image & Video Studio',
    description:
      'Generate stunning visuals with Flux, Imagen 4, Sora 2, VEO 3.1, and Kling — all in one place.',
    accent: 'from-violet-500/10 to-purple-500/5',
    iconColor: 'text-violet-400',
  },
  {
    icon: Film,
    title: 'Professional Video Editor',
    description:
      'Remotion-powered browser editor with timeline, captions, effects, stickers, and multi-track audio.',
    accent: 'from-orange-500/10 to-amber-500/5',
    iconColor: 'text-orange-400',
  },
  {
    icon: Music,
    title: 'AI Music Generation',
    description:
      'Create original tracks in any style with Suno AI — vocals, instrumentals, fully custom.',
    accent: 'from-blue-500/10 to-cyan-500/5',
    iconColor: 'text-blue-400',
  },
  {
    icon: Mic,
    title: 'AI Voice & TTS',
    description:
      'Text-to-speech, sound effects, and voice isolation powered by ElevenLabs — broadcast quality.',
    accent: 'from-green-500/10 to-emerald-500/5',
    iconColor: 'text-green-400',
  },
  {
    icon: Sparkles,
    title: 'Story Creator',
    description:
      'Build multi-shot AI video stories — ASMR, remix, talking things — in one automated pipeline.',
    accent: 'from-pink-500/10 to-rose-500/5',
    iconColor: 'text-pink-400',
  },
  {
    icon: Wand2,
    title: 'Content Tools',
    description:
      'AI upscaler (2x/4x), watermark remover, and video downloader for any platform.',
    accent: 'from-yellow-500/10 to-amber-500/5',
    iconColor: 'text-yellow-400',
  },
];

const MODELS = [
  { name: 'Sora 2', category: 'Video', color: 'bg-zinc-800 text-zinc-200' },
  { name: 'VEO 3.1', category: 'Video', color: 'bg-zinc-800 text-zinc-200' },
  { name: 'Kling 3.0', category: 'Video', color: 'bg-zinc-800 text-zinc-200' },
  { name: 'Flux Pro', category: 'Image', color: 'bg-zinc-800 text-zinc-200' },
  { name: 'Imagen 4', category: 'Image', color: 'bg-zinc-800 text-zinc-200' },
  { name: 'Seedream', category: 'Image', color: 'bg-zinc-800 text-zinc-200' },
  { name: 'ElevenLabs', category: 'Voice', color: 'bg-zinc-800 text-zinc-200' },
  { name: 'Suno AI', category: 'Music', color: 'bg-zinc-800 text-zinc-200' },
];

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Describe your idea',
    desc: 'Write a prompt or pick a template. Be as detailed or as simple as you want.',
    icon: Sparkles,
  },
  {
    step: '02',
    title: 'Generate with AI',
    desc: 'Choose your model. Images and video clips are generated automatically in seconds.',
    icon: Zap,
  },
  {
    step: '03',
    title: 'Edit & refine',
    desc: 'Add music, captions, and effects in the built-in timeline editor.',
    icon: Film,
  },
  {
    step: '04',
    title: 'Export & publish',
    desc: 'Download in any format and publish directly to your platforms.',
    icon: ArrowRight,
  },
];

const PLANS = [
  { name: 'Free', price: '$0', credits: '50 cr/mo', highlight: false, features: ['AI image generation', 'Basic editor', 'Community support'] },
  { name: 'Creator', price: '$19', credits: '1,000 cr/mo', highlight: false, features: ['All AI models', 'Full video editor', 'AI Music & Voice', 'Priority support'] },
  { name: 'Pro', price: '$49', credits: '3,500 cr/mo', highlight: true, features: ['Everything in Creator', 'AI Upscaler', 'Watermark remover', 'Faster queue'] },
  { name: 'Agency', price: '$149', credits: '12,000 cr/mo', highlight: false, features: ['Everything in Pro', 'API access', 'Dedicated support', 'Custom integrations'] },
];

// Structured data for homepage
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MotionForce",
  url: "https://motionforce.io",
  description: "AI content creation platform for images, videos, music, and voice",
  sameAs: [
    "https://x.com/motionforce",
    "https://youtube.com/@motionforce",
  ],
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "0",
    highPrice: "149",
    priceCurrency: "USD",
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
      <div className="bg-black text-white min-h-screen selection:bg-white selection:text-black">
        <Navbar />

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative pt-24 pb-20 md:pt-36 md:pb-28 overflow-hidden">
          {/* Gradient orbs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] -z-10 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/15 rounded-full blur-[120px]" />
            <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px]" />
            <div className="absolute top-20 right-1/4 w-[300px] h-[300px] bg-pink-600/10 rounded-full blur-[100px]" />
          </div>

          <div className="container mx-auto px-6 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 text-xs text-zinc-400 mb-10 backdrop-blur-sm">
              <Zap className="w-3 h-3 text-yellow-400 shrink-0" />
              The all-in-one AI content creation platform
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-[0.9]">
              <span className="bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-transparent">
                Create viral content
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                with AI.
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed">
              MotionForce combines AI video generation, a professional editor, music tools,
              voice synthesis — all in one platform. No juggling subscriptions.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-white text-black px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-zinc-100 transition-colors group"
              >
                Start for free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/ai-studio"
                className="inline-flex items-center gap-2 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 backdrop-blur-sm px-7 py-3.5 rounded-full text-sm transition-all"
              >
                <Play className="w-3.5 h-3.5" />
                Try AI Studio
              </Link>
            </div>

            {/* Model grid */}
            <div className="flex flex-wrap justify-center gap-2 mb-20">
              {MODELS.map((m) => (
                <span
                  key={m.name}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-zinc-800 ${m.color}`}
                >
                  {m.name}
                  <span className="text-zinc-600 text-[10px]">{m.category}</span>
                </span>
              ))}
            </div>

            {/* Hero visual — mock UI cards */}
            <div className="relative mx-auto max-w-4xl">
              {/* Main card */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-1 shadow-2xl shadow-violet-900/10">
                <div className="rounded-xl overflow-hidden bg-zinc-950">
                  {/* Mock toolbar */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                      <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    </div>
                    <div className="flex-1 flex gap-2 ml-4">
                      {['Image', 'Video', 'Img→Vid'].map((tab, i) => (
                        <span
                          key={tab}
                          className={`px-3 py-1 rounded-md text-xs ${i === 0 ? 'bg-white text-black font-medium' : 'text-zinc-500'}`}
                        >
                          {tab}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Mock content */}
                  <div className="grid grid-cols-3 gap-3 p-4 h-52">
                    {[
                      { gradient: 'from-violet-900 via-purple-800 to-blue-900', label: 'Cinematic sunset' },
                      { gradient: 'from-emerald-900 via-teal-800 to-cyan-900', label: 'Forest trail' },
                      { gradient: 'from-rose-900 via-pink-800 to-orange-900', label: 'Abstract flow' },
                      { gradient: 'from-slate-800 via-blue-900 to-indigo-900', label: 'Night cityscape' },
                      { gradient: 'from-amber-900 via-orange-800 to-red-900', label: 'Desert dunes' },
                      { gradient: 'from-indigo-900 via-violet-800 to-purple-900', label: 'Galaxy art' },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={`rounded-lg bg-gradient-to-br ${item.gradient} flex items-end p-2 group cursor-pointer hover:ring-1 hover:ring-white/20 transition-all`}
                      >
                        <span className="text-[9px] text-white/50 group-hover:text-white/80 transition-colors truncate">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* Mock prompt bar */}
                  <div className="px-4 pb-4">
                    <div className="flex items-center gap-3 bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2.5">
                      <span className="text-xs text-zinc-500 flex-1">A cinematic aerial shot of mountain peaks at golden hour...</span>
                      <span className="text-xs bg-white text-black px-3 py-1 rounded-full font-medium shrink-0">Generate</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating stat cards */}
              <div className="absolute -left-8 top-16 hidden lg:block">
                <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 shadow-xl w-48">
                  <p className="text-xs text-zinc-500 mb-1">Generated this week</p>
                  <p className="text-2xl font-black">142K</p>
                  <p className="text-xs text-green-400 mt-0.5">+24% vs last week</p>
                </div>
              </div>
              <div className="absolute -right-8 top-16 hidden lg:block">
                <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 shadow-xl w-48">
                  <p className="text-xs text-zinc-500 mb-1">Active creators</p>
                  <p className="text-2xl font-black">50K+</p>
                  <p className="text-xs text-blue-400 mt-0.5">from 140 countries</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Social proof strip ───────────────────────────────────────── */}
        <section className="py-10 border-y border-zinc-900 bg-zinc-950/50">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-center">
              {[
                { value: '10M+', label: 'Creations generated' },
                { value: '50K+', label: 'Active creators' },
                { value: '140+', label: 'Countries' },
                { value: '4.9★', label: 'Average rating' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-black mb-0.5">{stat.value}</p>
                  <p className="text-xs text-zinc-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────────────────── */}
        <section id="features" className="py-28">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Features</p>
              <h2 className="text-3xl md:text-5xl font-bold mb-5">
                Everything you need to create
              </h2>
              <p className="text-zinc-400 max-w-lg mx-auto">
                From generation to export — no switching between tools, no extra subscriptions.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className={`relative p-6 rounded-2xl border border-zinc-800/60 bg-gradient-to-br ${f.accent} hover:border-zinc-700 transition-all group`}
                >
                  <div className="w-10 h-10 rounded-xl border border-zinc-800 bg-zinc-900 flex items-center justify-center mb-5">
                    <f.icon className={`w-5 h-5 ${f.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────────── */}
        <section className="py-28 border-t border-zinc-900 bg-zinc-950/30">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">How it works</p>
              <h2 className="text-3xl md:text-5xl font-bold">
                From idea to viral in minutes
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-8 relative">
              {/* Connecting line */}
              <div className="absolute top-6 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent hidden md:block" />

              {WORKFLOW_STEPS.map((s, i) => (
                <div key={s.step} className="text-center relative">
                  <div className="w-12 h-12 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center mx-auto mb-5">
                    <s.icon className="w-5 h-5 text-zinc-400" />
                  </div>
                  <p className="text-xs font-mono text-zinc-600 mb-2">{s.step}</p>
                  <h3 className="font-semibold mb-2">{s.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing preview ──────────────────────────────────────────── */}
        <section id="pricing" className="py-28 border-t border-zinc-900">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Pricing</p>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple, transparent pricing</h2>
              <p className="text-zinc-400 max-w-sm mx-auto">Start free. Upgrade when you need more.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-5 max-w-5xl mx-auto mb-10">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl p-6 border ${
                    plan.highlight ? 'border-white bg-white/5' : 'border-zinc-800 bg-zinc-900/20'
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-white text-black text-[10px] font-bold px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <h3 className="font-semibold mb-1">{plan.name}</h3>
                  <div className="mb-1">
                    <span className="text-2xl font-black">{plan.price}</span>
                    {plan.price !== '$0' && <span className="text-zinc-500 text-xs">/mo</span>}
                  </div>
                  <p className="text-xs text-zinc-500 mb-4 pb-4 border-b border-zinc-800">{plan.credits}</p>
                  <ul className="space-y-2 mb-5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-zinc-400">
                        <Check className="w-3 h-3 text-green-400 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.name === 'Free' ? '/signup' : '/pricing'}
                    className={`block w-full py-2 text-center text-xs font-semibold rounded-lg transition-colors ${
                      plan.highlight
                        ? 'bg-white text-black hover:bg-zinc-200'
                        : 'bg-zinc-800 text-white hover:bg-zinc-700'
                    }`}
                  >
                    {plan.name === 'Free' ? 'Get started' : `Get ${plan.name}`}
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

        {/* ── Blog preview ─────────────────────────────────────────────── */}
        {blogPosts.length > 0 && (
          <section className="py-28 border-t border-zinc-900 bg-zinc-950/30">
            <div className="container mx-auto px-6">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">Blog</p>
                  <h2 className="text-3xl font-bold">Guides & tutorials</h2>
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
                    className="group rounded-xl border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-colors"
                  >
                    <div className={`h-36 bg-gradient-to-br ${post.coverGradient} flex items-end p-5`}>
                      <span className="text-xs font-semibold bg-white/10 border border-white/20 text-white px-2 py-0.5 rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <div className="p-5">
                      <p className="text-xs text-zinc-600 mb-2">{post.readingTime}</p>
                      <h3 className="font-semibold text-sm leading-snug group-hover:text-zinc-200 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section className="py-28 border-t border-zinc-900 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-600/8 rounded-full blur-[120px]" />
          </div>
          <div className="container mx-auto px-6 text-center">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-5">Get started</p>
            <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent leading-tight">
              Start creating for free
            </h2>
            <p className="text-zinc-400 text-lg mb-10 max-w-md mx-auto">
              50 free credits every month. No credit card required. Access the world&apos;s best AI models.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-zinc-100 transition-colors group"
              >
                Create your account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/pricing"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                View pricing
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
