const isProd = process.env.NODE_ENV === 'production';
// Адреса сайту (для SEO). Власний домен без шляху (https://urban-auto.com.ua) → сайт у корені, без /urban-auto-reborn.
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/+$/, '');
const fromSite = siteUrl ? new URL(siteUrl).pathname.replace(/\/+$/, '') : '/urban-auto-reborn';
const base = isProd ? (process.env.NEXT_PUBLIC_BASE_PATH ?? fromSite) : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: base,
  assetPrefix: base || undefined,
  images: { unoptimized: true },
  trailingSlash: true,
  env: { NEXT_PUBLIC_BASE_PATH: base },
};
export default nextConfig;
