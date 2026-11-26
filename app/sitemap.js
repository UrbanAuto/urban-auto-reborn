import { url } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap() {
  const now = new Date();
  return [
    { url: url('/'), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: url('/catalog/'), lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: url('/sold/'), lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];
}
