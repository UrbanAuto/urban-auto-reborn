'use client';
import { useState } from 'react';
import CarSvg from './CarSvg';
import LotRequestModal from './LotRequest';

const fmt = (n) => n.toLocaleString('uk-UA');
const FLAG = { usa: '🇺🇸', canada: '🇨🇦', europe: '🇪🇺' };
const dateUa = (d) => new Date(d).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' });

export default function CarCard({ c, onOpen }) {
  const [ask, setAsk] = useState(false);
  return (
    <article className="car" onClick={() => onOpen(c)} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpen(c)}>
      <div className="car-visual">
        {c.image ? <img src={c.images?.[0] || c.image} alt={`${c.make} ${c.model}`} loading="lazy" className="car-photo" /> : <CarSvg id={`k${c.id}`} body={c.body} />}
        <span className="badge src">{FLAG[c.country]} {c.auction}</span>
        <span className="badge r">{c.year}</span>
        {c.saleDate && <span className="badge b">Торги {dateUa(c.saleDate)}</span>}
      </div>
      <div className="car-body">
        <h3>{c.make} {c.model}</h3>
        <div className="car-meta">{c.km > 0 && <span>{fmt(c.km)} км</span>}{[c.fuel, c.engine, c.body].filter((v) => v && v !== '—').map((v) => <span key={v}>{v}</span>)}</div>
        {(c.damage || c.location) && (
          <div className="lot-info">
            {c.damage && <span>⚠ {c.damage}</span>}
            {c.location && <span>📍 {c.location}</span>}
            {c.lot && <span>Лот № {c.lot}</span>}
          </div>
        )}
        <div className="car-foot">
          <div className="price"><small>поточна ставка</small><b>${fmt(c.bid)}</b></div>
          <div className="car-btns">
            <button className="btn btn-sm" onClick={(e) => { e.stopPropagation(); onOpen(c); }}>Детальніше</button>
            <button className="btn btn-fire btn-sm" onClick={(e) => { e.stopPropagation(); setAsk(true); }}>Менеджер</button>
          </div>
        </div>
      </div>
      {ask && <LotRequestModal car={c} kind="manager" source="Каталог" onClose={() => setAsk(false)} />}
    </article>
  );
}
