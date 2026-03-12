'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Settings, CreditCard, User, ExternalLink, Loader2, Check } from 'lucide-react';
import { DashboardLayout } from '@/components/shared/dashboard-layout';
import { useAuth } from '@/contexts/auth-context';
import { useApi } from '@/hooks/use-api';
import { API_USERS, API_SUBSCRIPTIONS } from '@/lib/constants/api';

export default function AccountPage() {
  const { user, refreshUser } = useAuth();
  const { apiFetch } = useApi();

  const [name, setName] = useState(user?.name ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  const saveProfile = async () => {
    if (!name.trim() || isSaving) return;
    setIsSaving(true);
    try {
      await apiFetch(API_USERS.ME, {
        method: 'PATCH',
        body: JSON.stringify({ name }),
      });
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      //
    } finally {
      setIsSaving(false);
    }
  };

  const openBillingPortal = async () => {
    setIsPortalLoading(true);
    try {
      const { url } = await apiFetch<{ url: string }>(API_SUBSCRIPTIONS.PORTAL, {
        method: 'POST',
        body: JSON.stringify({ returnUrl: window.location.href }),
      });
      window.open(url, '_blank');
    } catch (err: any) {
      alert(err.message ?? 'Could not open billing portal');
    } finally {
      setIsPortalLoading(false);
    }
  };

  const SECTIONS = [
    {
      id: 'profile',
      title: 'Profile',
      icon: User,
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-zinc-400 mb-1.5 block">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-600"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-400 mb-1.5 block">Email</label>
            <p className="text-sm text-zinc-400">{user?.email}</p>
          </div>
          <button
            onClick={saveProfile}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 disabled:opacity-50 transition-colors"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : null}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      ),
    },
    {
      id: 'billing',
      title: 'Billing & Subscription',
      icon: CreditCard,
      content: (
        <div className="space-y-5">
          {/* Plan summary */}
          <div className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
            <div>
              <p className="font-medium capitalize">{user?.planName ?? 'free'} Plan</p>
              <p className="text-xs text-zinc-500">
                {user?.creditsRemaining?.toLocaleString()} / {user?.creditsMonthly?.toLocaleString()} credits remaining
              </p>
            </div>
            <Link
              href="/pricing"
              className="text-xs text-zinc-400 hover:text-white border border-zinc-700 px-3 py-1.5 rounded-lg hover:border-zinc-500 transition-colors"
            >
              Upgrade
            </Link>
          </div>

          {/* Credit bar */}
          <div>
            <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
              <span>Credits used this month</span>
              <span>
                {((user?.creditsMonthly ?? 0) - (user?.creditsRemaining ?? 0)).toLocaleString()} used
              </span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (1 - (user?.creditsRemaining ?? 0) / Math.max(user?.creditsMonthly ?? 1, 1)) * 100,
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Subscription management */}
          {user?.planName !== 'free' && (
            <button
              onClick={openBillingPortal}
              disabled={isPortalLoading}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {isPortalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
              Manage subscription on Stripe
            </button>
          )}

          {/* Subscription end date */}
          {user?.subscriptionEnd && (
            <p className="text-xs text-zinc-600">
              {user.subscriptionStatus === 'canceled'
                ? `Access until ${new Date(user.subscriptionEnd).toLocaleDateString()}`
                : `Renews ${new Date(user.subscriptionEnd).toLocaleDateString()}`}
            </p>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6" /> Account
          </h1>
        </div>

        {SECTIONS.map((section) => (
          <div key={section.id} className="border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-zinc-800 bg-zinc-900/30">
              <section.icon className="w-4 h-4 text-zinc-400" />
              <h2 className="font-semibold text-sm">{section.title}</h2>
            </div>
            <div className="p-6">{section.content}</div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
