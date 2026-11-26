import CatalogPage from '@/components/CatalogPage';

export const metadata = {
  title: 'Каталог авто з аукціонів Copart та IAAI — Urban Auto',
  description: 'Усі лоти Copart та IAAI: пошук за маркою, моделлю, VIN чи номером лота, фільтри та сортування. Розрахунок «під ключ» від Urban Auto.',
  alternates: { canonical: '/catalog/' },
  openGraph: { title: 'Каталог авто з аукціонів Copart та IAAI — Urban Auto', description: 'Усі лоти Copart та IAAI: пошук за маркою, моделлю, VIN чи номером лота, фільтри та сортування. Розрахунок «під ключ» від Urban Auto.', url: '/catalog/' },
};

export default function Page() { return <CatalogPage />; }
