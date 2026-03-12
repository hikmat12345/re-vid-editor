'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-900 bg-black/80 backdrop-blur-xl">
      <div className="container mx-auto px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center shrink-0">
              <span className="text-black text-xs font-black">MF</span>
            </div>
            <span className="font-semibold text-sm text-white tracking-tight">MotionForce</span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = link.href !== '/#features' && pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm px-3 py-1.5 rounded-lg transition-colors',
                    isActive
                      ? 'text-white bg-zinc-800/60'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:block text-sm text-zinc-400 hover:text-white transition-colors px-1"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold bg-white text-black hover:bg-zinc-100 transition-colors px-4 py-1.5 rounded-full"
            >
              Get started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
