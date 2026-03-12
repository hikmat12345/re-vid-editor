import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/shared/navbar';
import Footer from '@/components/shared/footer';
import { ArrowRight, Zap, Users, Globe, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About MotionForce',
  description:
    'Learn about MotionForce — the all-in-one AI content creation platform built for creators who want to produce viral video, music, and voice content at scale.',
  openGraph: {
    title: 'About MotionForce',
    description: 'The all-in-one AI content creation platform for creators and agencies.',
    type: 'website',
  },
};

const STATS = [
  { value: '10M+', label: 'Generations created' },
  { value: '50K+', label: 'Active creators' },
  { value: '140+', label: 'Countries' },
  { value: '4.9/5', label: 'Average rating' },
];

const VALUES = [
  {
    icon: Zap,
    title: 'Speed without compromise',
    description:
      'We integrate only the fastest and highest-quality AI models. No compromises on output quality to hit generation speed targets.',
  },
  {
    icon: Globe,
    title: 'Built for scale',
    description:
      'Whether you are creating one video or managing an agency with hundreds of clients, MotionForce scales with you.',
  },
  {
    icon: Users,
    title: 'Creator-first',
    description:
      'Every decision we make starts with the creator. The tools we build are the tools we would want to use ourselves.',
  },
  {
    icon: Shield,
    title: 'Transparent pricing',
    description:
      'No hidden fees. No surprise charges. You see exactly how many credits each action costs before you run it.',
  },
];

const TEAM = [
  { name: 'Alex Rivera', role: 'CEO & Co-founder', initials: 'AR' },
  { name: 'Sam Chen', role: 'CTO & Co-founder', initials: 'SC' },
  { name: 'Jordan Taylor', role: 'Head of Product', initials: 'JT' },
  { name: 'Morgan Lee', role: 'Head of AI Research', initials: 'ML' },
];

export default function AboutPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-20 border-b border-zinc-900">
        <div className="container mx-auto px-6 max-w-4xl">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">About us</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-8 leading-tight">
            We believe every creator<br />
            <span className="text-zinc-500">deserves world-class AI tools.</span>
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl">
            MotionForce started from a simple frustration: the best AI models were scattered across
            a dozen platforms, each with their own subscription, interface, and learning curve.
            We built the platform we always wanted — one place to generate, edit, and publish.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-b border-zinc-900">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-black mb-1">{stat.value}</p>
                <p className="text-sm text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 border-b border-zinc-900">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Our mission</p>
              <h2 className="text-3xl font-bold mb-6">
                Democratize professional content creation
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                Five years ago, creating a professional-quality video required a film crew, a recording studio,
                and a post-production team. Three years ago, it required expensive software and days of learning.
                Today, it should take minutes.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                MotionForce exists to close the gap between having an idea and having a finished piece of
                content ready to publish. We integrate the world&apos;s best AI models — Sora 2, VEO 3.1,
                Kling 3.0, ElevenLabs, Suno — so you don&apos;t have to manage ten subscriptions.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {VALUES.map((v) => (
                <div key={v.title} className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/30">
                  <v.icon className="w-5 h-5 mb-3 text-zinc-400" />
                  <h3 className="font-semibold text-sm mb-1.5">{v.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 border-b border-zinc-900">
        <div className="container mx-auto px-6 max-w-4xl">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Team</p>
          <h2 className="text-3xl font-bold mb-12">Built by creators, for creators</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                  {member.initials}
                </div>
                <p className="font-semibold text-sm">{member.name}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-4xl font-black mb-4">Ready to start creating?</h2>
          <p className="text-zinc-400 mb-8">50 free credits every month. No credit card required.</p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-colors group"
            >
              Get started free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
