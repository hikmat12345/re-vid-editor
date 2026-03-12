'use client';

import { useState, useEffect } from 'react';
import { Check, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/shared/navbar';
import Footer from '@/components/shared/footer';
import { useApi } from '@/hooks/use-api';
import { useAuth } from '@/contexts/auth-context';
import { API_CREDITS, API_SUBSCRIPTIONS } from '@/lib/constants/api';
import { PricingInfo, PlanName } from '@/lib/types';

const PLAN_FEATURES: Record<PlanName, string[]> = {
  free: [
    '50 credits / month',
    'AI image generation',
    'Basic video editor',
    'Community support',
  ],
  creator: [
    '1,000 credits / month',
    'All AI generation models',
    'Video editor (full)',
    'AI Music & Voice',
    'Story creator',
    'Priority support',
  ],
  pro: [
    '3,500 credits / month',
    'Everything in Creator',
    'AI Upscaler (2x & 4x)',
    'Watermark remover',
    'Video downloader',
    'Faster generation queue',
    'Priority support',
  ],
  agency: [
    '12,000 credits / month',
    'Everything in Pro',
    'API access',
    'Dedicated support',
    'Custom integrations',
    'Team seat (coming soon)',
  ],
};

const PLAN_HIGHLIGHT: Record<PlanName, boolean> = {
  free: false, creator: false, pro: true, agency: false,
};

const FAQ = [
  {
    q: 'What is a credit?',
    a: 'One credit is approximately $0.0115 USD (87 credits = $1). Each AI action costs a different number of credits depending on the model and output quality. You can see the exact credit cost before generating anything.',
  },
  {
    q: 'Do credits roll over?',
    a: 'Monthly subscription credits reset at the start of each billing cycle and do not roll over. However, credits purchased as top-ups never expire.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. You can cancel your subscription at any time from your account settings. You will retain access to your plan features until the end of the billing period.',
  },
  {
    q: 'Is there a free plan?',
    a: 'Yes. The free plan gives you 50 credits every month with no credit card required. It is a great way to explore the platform before committing to a paid plan.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex), as well as Google Pay and Apple Pay via Stripe.',
  },
];

export default function PricingPage() {
  const { apiFetch } = useApi();
  const { user, isAuthenticated } = useAuth();
  const [pricingInfo, setPricingInfo] = useState<PricingInfo | null>(null);
  const [isLoading, setIsLoading] = useState<PlanName | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    apiFetch<PricingInfo>(API_CREDITS.PRICING).then(setPricingInfo).catch(() => {});
  }, []);

  const subscribe = async (plan: PlanName) => {
    if (plan === 'free' || !isAuthenticated) {
      if (!isAuthenticated) window.location.href = '/signup';
      return;
    }
    setIsLoading(plan);
    try {
      const { url } = await apiFetch<{ url: string }>(API_SUBSCRIPTIONS.CHECKOUT, {
        method: 'POST',
        body: JSON.stringify({
          planName: plan,
          successUrl: `${window.location.origin}/account?upgraded=true`,
          cancelUrl: window.location.href,
        }),
      });
      window.location.href = url;
    } catch (err: any) {
      alert(err.message ?? 'Failed to start checkout');
    } finally {
      setIsLoading(null);
    }
  };

  const plans = pricingInfo?.plans ?? {
    free:    { creditsMonthly: 50,    priceUsd: 0,   label: 'Free' },
    creator: { creditsMonthly: 1000,  priceUsd: 19,  label: 'Creator' },
    pro:     { creditsMonthly: 3500,  priceUsd: 49,  label: 'Pro' },
    agency:  { creditsMonthly: 12000, priceUsd: 149, label: 'Agency' },
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container mx-auto px-6 py-20 max-w-5xl">
        {/* Hero */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Pricing</p>
          <h1 className="text-4xl md:text-6xl font-black mb-5 tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="text-zinc-400 text-lg max-w-md mx-auto">
            Start free. Upgrade when you need more. Credits never expire within the month.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid md:grid-cols-4 gap-5 mb-14">
          {(Object.entries(plans) as [PlanName, typeof plans[PlanName]][]).map(([planId, plan]) => {
            const isCurrentPlan = user?.planName === planId;
            const highlight = PLAN_HIGHLIGHT[planId];

            return (
              <div
                key={planId}
                className={`relative rounded-2xl p-6 border ${
                  highlight
                    ? 'border-white bg-white/5'
                    : 'border-zinc-800 bg-zinc-900/20'
                }`}
              >
                {highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="font-semibold text-lg mb-1">{plan.label}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-black">${plan.priceUsd}</span>
                  {plan.priceUsd > 0 && <span className="text-zinc-500 text-sm">/mo</span>}
                </div>
                <p className="text-xs text-zinc-500 mb-5 pb-5 border-b border-zinc-800">
                  {plan.creditsMonthly.toLocaleString()} credits / month
                </p>

                <ul className="space-y-2.5 mb-6">
                  {PLAN_FEATURES[planId].map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                      <span className="text-zinc-300">{f}</span>
                    </li>
                  ))}
                </ul>

                {isCurrentPlan ? (
                  <div className="w-full py-2 text-center text-sm text-zinc-400 border border-zinc-700 rounded-lg">
                    Current plan
                  </div>
                ) : planId === 'free' ? (
                  <Link
                    href="/signup"
                    className="block w-full py-2 text-center text-sm text-zinc-400 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
                  >
                    Get started free
                  </Link>
                ) : (
                  <button
                    onClick={() => subscribe(planId)}
                    disabled={isLoading === planId}
                    className={`w-full py-2 text-sm font-semibold rounded-lg transition-colors ${
                      highlight
                        ? 'bg-white text-black hover:bg-zinc-200'
                        : 'bg-zinc-800 text-white hover:bg-zinc-700'
                    } disabled:opacity-50`}
                  >
                    {isLoading === planId ? 'Redirecting...' : isAuthenticated ? `Get ${plan.label}` : 'Sign up to subscribe'}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Credit top-up */}
        <div className="border border-zinc-800 rounded-2xl p-8 mb-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <h3 className="text-xl font-bold">Need more credits?</h3>
              </div>
              <p className="text-zinc-400 text-sm">
                Top up your balance at any time. Credits added instantly, never expire.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {[100, 500, 1000, 2500].map((amount) => (
                <button
                  key={amount}
                  onClick={async () => {
                    if (!isAuthenticated) { window.location.href = '/signup'; return; }
                    try {
                      const { url } = await apiFetch<{ url: string }>(API_SUBSCRIPTIONS.TOPUP, {
                        method: 'POST',
                        body: JSON.stringify({
                          credits: amount,
                          successUrl: `${window.location.origin}/account`,
                          cancelUrl: window.location.href,
                        }),
                      });
                      window.location.href = url;
                    } catch {}
                  }}
                  className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm hover:border-zinc-600 transition-colors text-center"
                >
                  <span className="font-semibold">{amount} cr</span>
                  <span className="text-zinc-500 ml-2">${(amount * 0.012).toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently asked questions</h2>
          <div className="space-y-2">
            {FAQ.map((item, i) => (
              <div key={i} className="border border-zinc-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-zinc-900/50 transition-colors"
                >
                  <span className="font-medium text-sm">{item.q}</span>
                  <span className="text-zinc-500 text-lg ml-4 shrink-0">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-zinc-400 leading-relaxed border-t border-zinc-800 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl">
          <h3 className="text-2xl font-bold mb-3">Ready to start creating?</h3>
          <p className="text-zinc-400 text-sm mb-6">50 free credits every month. No credit card required.</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-colors group"
          >
            Get started free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
