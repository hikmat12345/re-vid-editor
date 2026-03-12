'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, CheckCircle, Mail, MessageSquare, Building } from 'lucide-react';
import Navbar from '@/components/shared/navbar';
import Footer from '@/components/shared/footer';

const TOPICS = [
  'General question',
  'Billing & subscriptions',
  'Technical support',
  'Partnership or API access',
  'Press & media',
  'Other',
];

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setError('');
    setIsSubmitting(true);

    // Simulate submission (replace with real endpoint)
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      <div className="container mx-auto px-6 py-20 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left: Info */}
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Contact</p>
            <h1 className="text-4xl font-black mb-6">Let&apos;s talk</h1>
            <p className="text-zinc-400 leading-relaxed mb-10">
              Whether you have a question about pricing, need technical help, or want to discuss
              a partnership — our team is here and usually responds within 24 hours.
            </p>

            <div className="space-y-6">
              {[
                {
                  icon: Mail,
                  label: 'Email',
                  value: 'hello@motionforce.io',
                  href: 'mailto:hello@motionforce.io',
                },
                {
                  icon: MessageSquare,
                  label: 'Support',
                  value: 'support@motionforce.io',
                  href: 'mailto:support@motionforce.io',
                },
                {
                  icon: Building,
                  label: 'Partnerships',
                  value: 'partners@motionforce.io',
                  href: 'mailto:partners@motionforce.io',
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl border border-zinc-800 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 font-medium mb-0.5">{item.label}</p>
                    <a
                      href={item.href}
                      className="text-sm text-zinc-300 hover:text-white transition-colors"
                    >
                      {item.value}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="border border-zinc-800 rounded-2xl p-8 bg-zinc-900/20">
            {submitted ? (
              <div className="flex flex-col items-center text-center py-8">
                <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mb-5">
                  <CheckCircle className="w-7 h-7 text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Message sent!</h3>
                <p className="text-zinc-400 text-sm mb-6">
                  Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setName(''); setEmail(''); setMessage('');
                  }}
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <p className="text-sm text-red-400 bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3">
                    {error}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Topic</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600 transition-colors appearance-none"
                  >
                    {TOPICS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider flex justify-between">
                    <span>Message</span>
                    <span className="text-zinc-600 normal-case font-normal">{message.length}/2000</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, 2000))}
                    placeholder="Tell us how we can help..."
                    rows={6}
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 resize-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim() || !email.trim() || !message.trim()}
                  className="w-full py-3 bg-white text-black text-sm font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? 'Sending...' : 'Send message'}
                </button>

                <p className="text-xs text-zinc-600 text-center">
                  We typically respond within 24 hours on business days.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
