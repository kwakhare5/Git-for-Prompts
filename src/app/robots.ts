import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://gitforprompts.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/contact',
          '/privacy',
          '/llms.txt',
          '/llms-full.txt',
          '/openapi.json',
          '/.well-known/',
          '/sign-in',
          '/sign-up',
        ],
        disallow: ['/dashboard', '/api/cron'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
