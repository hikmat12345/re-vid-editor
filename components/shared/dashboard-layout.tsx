'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Image,
  Video,
  Music,
  Mic,
  Film,
  Zap,
  Download,
  Wand2,
  Settings,
  LogOut,
  Sparkles,
  Palette,
  Scissors,
  Captions,
  BarChart3,
  PlaySquare,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV: NavSection[] = [
  {
    title: 'Create',
    items: [
      { label: 'Dashboard',       href: '/dashboard',        icon: LayoutDashboard },
      { label: 'Video Editor',    href: '/editor',           icon: Video,   badge: 'Editor' },
      { label: 'AI Studio',       href: '/ai-studio',        icon: Image },
    ],
  },
  {
    title: 'AI Tools',
    items: [
      { label: 'AI Music',        href: '/ai-music',         icon: Music },
      { label: 'AI Voice',        href: '/ai-voice',         icon: Mic },
    ],
  },
  {
    title: 'Stories',
    items: [
      { label: 'All Stories',     href: '/stories',          icon: Film },
      { label: 'ASMR Creator',   href: '/stories/asmr',     icon: Sparkles },
      { label: 'Remix',          href: '/stories/remix',    icon: Zap },
    ],
  },
  {
    title: 'Render',
    items: [
      { label: 'Render Jobs',     href: '/render',                  icon: PlaySquare },
    ],
  },
  {
    title: 'Video Tools',
    items: [
      { label: 'Brand Kit',       href: '/tools/brand-kit',         icon: Palette },
      { label: 'Clip Extractor',  href: '/tools/clip-extractor',    icon: Scissors, badge: 'AI' },
      { label: 'Captions',        href: '/tools/captions',          icon: Captions, badge: 'AI' },
      { label: 'Finance Video',   href: '/tools/finance-video',     icon: TrendingUp },
    ],
  },
  {
    title: 'Tools',
    items: [
      { label: 'AI Upscaler',     href: '/tools/upscaler',          icon: Wand2 },
      { label: 'Video Downloader',href: '/tools/video-downloader',  icon: Download },
    ],
  },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, creditsRemaining } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside className="w-60 shrink-0 border-r border-zinc-800 flex flex-col">
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-zinc-800">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center">
              <span className="text-black text-xs font-black">MF</span>
            </div>
            <span className="font-semibold text-sm tracking-tight">MotionForce</span>
          </Link>
        </div>

        {/* Credits */}
        <div className="px-4 py-3 border-b border-zinc-800">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-zinc-500">Credits</span>
            <Link href="/pricing" className="text-xs text-zinc-400 hover:text-white">Top up</Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (creditsRemaining / (user?.creditsMonthly ?? 50)) * 100)}%`,
                }}
              />
            </div>
            <span className="text-xs text-zinc-300 font-medium tabular-nums">
              {creditsRemaining}
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {NAV.map((section) => (
            <div key={section.title}>
              <p className="text-[10px] uppercase tracking-widest text-zinc-600 px-2 mb-1">
                {section.title}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-colors',
                          active
                            ? 'bg-zinc-800 text-white'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-900',
                        )}
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <span className="text-[10px] bg-white/10 text-zinc-300 px-1.5 py-0.5 rounded">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-zinc-800 p-3">
          <div className="flex items-center gap-2 rounded-md hover:bg-zinc-900 p-2 cursor-pointer group">
            <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-medium shrink-0">
              {user?.name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name ?? 'User'}</p>
              <p className="text-[10px] text-zinc-500 capitalize">{user?.planName ?? 'free'} plan</p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link href="/account">
                <Settings className="w-3.5 h-3.5 text-zinc-400 hover:text-white" />
              </Link>
              <button onClick={handleLogout}>
                <LogOut className="w-3.5 h-3.5 text-zinc-400 hover:text-white" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
