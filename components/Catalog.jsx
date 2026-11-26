'use client';
import { useState } from 'react';
import { useCars } from '@/lib/useCars';
import CarCard from './CarCard';
import LotModal from './LotModal';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** Вітрина на головній: свіжі лоти + перехід до повного каталогу з пошуком. */
export default function Catalog() {
  const data = useCars();
  const [open, setOpen] = useState(null);
  const list = [...data.cars].sort((a, b) => (a.saleDate || '9999').localeCompare(b.saleDate || '9999')).slice(0, 3);
  return (
    <section className="section" id="catalog">
      <div className="container">
        <span className="eyebrow" data-reveal>Каталог</span>
        <h2 className="h2" data-reveal>Найближчі торги <span className="grad">на аукціонах</span></h2>
        <p className="lead" data-reveal>Підбірка лотів Copart та IAAI з найближчою датою торгів. Весь каталог із пошуком і фільтрами — на окремій сторінці.</p>
        <div className="cars" style={{ marginTop: 40 }} data-stagger>
          {list.map((c) => <CarCard key={c.id} c={c} onOpen={setOpen} />)}
        </div>
        <div style={{ textAlign: 'center', marginTop: 44 }} data-reveal>
          <a className="btn btn-fire" href={`${BASE}/catalog/`}>Усі автомобілі →</a>
        </div>
      </div>
      {open && <LotModal car={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
