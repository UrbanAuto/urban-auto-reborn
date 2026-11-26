import './globals.css';
import { Space_Grotesk, Manrope } from 'next/font/google';

// Шрифти як на urban-auto.com.ua: Space Grotesk для заголовків (кирилиця — через Manrope) і Manrope для тексту
const display = Space_Grotesk({ subsets: ['latin'], variable: '--f-display', weight: ['500', '700'], display: 'swap' });
const body = Manrope({ subsets: ['latin', 'cyrillic'], variable: '--f-body', display: 'swap' });

export const metadata = {
  title: 'Urban Auto — пригін авто з США та Європи під ключ',
  description: 'Підбір, викуп на аукціонах Copart та IAAI, доставка, розмитнення і ремонт під ключ. Орієнтовний калькулятор вартості, каталог лотів та пошук проданих авто за VIN.',
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/img/favicon.png` },
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
