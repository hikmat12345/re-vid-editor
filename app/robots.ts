import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/account',
          '/ai-studio',
          '/ai-music',
          '/ai-voice',
          '/stories',
          '/tools',
          '/editor',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://motionforce.io/sitemap.xml',
  };
}
