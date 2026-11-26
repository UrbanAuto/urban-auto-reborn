import SoldPage from '@/components/SoldPage';

export const metadata = {
  title: 'Пошук проданих лотів за VIN — Urban Auto',
  description: 'Перевірте, за скільки продано авто на Copart чи IAAI: ціна продажу, дата, локація та пошкодження за VIN або номером лота.',
  alternates: { canonical: '/sold/' },
  openGraph: { title: 'Пошук проданих лотів за VIN — Urban Auto', description: 'Перевірте, за скільки продано авто на Copart чи IAAI: ціна продажу, дата, локація та пошкодження за VIN або номером лота.', url: '/sold/' },
};

export default function Page() { return <SoldPage />; }
