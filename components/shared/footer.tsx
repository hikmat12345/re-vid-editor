import Link from 'next/link';

const PRODUCT_LINKS = [
  { label: 'AI Studio', href: '/ai-studio' },
  { label: 'Video Editor', href: '/editor' },
  { label: 'AI Music', href: '/ai-music' },
  { label: 'AI Voice', href: '/ai-voice' },
  { label: 'Story Creator', href: '/stories' },
  { label: 'Viral Clip Extractor', href: '/tools/clip-extractor' },
  { label: 'Animated Captions', href: '/tools/captions' },
  { label: 'Finance Video', href: '/tools/finance-video' },
  { label: 'Brand Kit', href: '/tools/brand-kit' },
  { label: 'AI Upscaler', href: '/tools/upscaler' },
  { label: 'Video Downloader', href: '/tools/video-downloader' },
];

const COMPANY_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
];

const LEGAL_LINKS = [
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Cookie Policy', href: '/cookies' },
];

export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 bg-black">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center shrink-0">
                <span className="text-black text-xs font-black">MF</span>
              </div>
              <span className="font-semibold text-sm text-white">MotionForce</span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6 max-w-[220px]">
              The all-in-one AI platform for creating viral content — images, videos, music, and voice.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {[
                { label: 'X', href: 'https://x.com/motionforce' },
                { label: 'YT', href: 'https://youtube.com/@motionforce' },
                { label: 'TT', href: 'https://tiktok.com/@motionforce' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg border border-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 hover:border-zinc-600 hover:text-white transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-5">Product</p>
            <ul className="space-y-3">
              {PRODUCT_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-zinc-500 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-5">Company</p>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-zinc-500 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-5">Legal</p>
            <ul className="space-y-3 mb-8">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-zinc-500 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Contact</p>
            <a
              href="mailto:hello@motionforce.io"
              className="text-sm text-zinc-500 hover:text-white transition-colors"
            >
              hello@motionforce.io
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} MotionForce. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
            {['Sora 2', 'VEO 3.1', 'Kling 3.0', 'Flux Pro', 'Imagen 4', 'ElevenLabs', 'Suno AI', 'Whisper', 'GPT-4'].map((m) => (
              <span key={m} className="text-xs text-zinc-700">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
