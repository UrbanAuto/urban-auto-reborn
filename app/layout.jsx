import './globals.css';
import { Space_Grotesk, Manrope } from 'next/font/google';
import { SITE_URL, TITLE, DESCRIPTION } from '@/lib/seo';

// Шрифти як на urban-auto.com.ua: Space Grotesk для заголовків (кирилиця — через Manrope) і Manrope для тексту
const display = Space_Grotesk({ subsets: ['latin'], variable: '--f-display', weight: ['500', '700'], display: 'swap' });
const body = Manrope({ subsets: ['latin', 'cyrillic'], variable: '--f-body', display: 'swap' });

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: '%s' },
  description: DESCRIPTION,
  applicationName: 'Urban Auto',
  keywords: ['пригін авто з США', 'авто з Європи під ключ', 'Copart', 'IAAI', 'розмитнення авто', 'ремонт авто після ДТП', 'Київ'],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/img/favicon.png` },
  openGraph: {
    type: 'website', locale: 'uk_UA', siteName: 'Urban Auto', title: TITLE, description: DESCRIPTION, url: '/',
    images: [{ url: '/img/og.png', width: 1200, height: 630, alt: 'Urban Auto — пригін авто під ключ' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/img/og.png'] },
  ...(process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION } } : {}),
};

export const viewport = { themeColor: '#f5f5f7' };

export default function RootLayout({ children }) {
  return (
    <html lang="uk" suppressHydrationWarning className={`${display.variable} ${body.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {children}
      </body>
    </html>
  );
}
