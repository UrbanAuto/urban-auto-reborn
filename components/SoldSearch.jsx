'use client';
import { useEffect, useState } from 'react';
import { searchSold } from '@/lib/sold';
import LotRequestModal from './LotRequest';
import { goTo } from '@/lib/scroll';
import LotModal from './LotModal';

const fmt = (n) => n.toLocaleString('uk-UA');
const PLATFORM = { copart: 'Copart', iaai: 'IAAI' };
const STATUS = { sold: ['Продано', 'ok'], 'sold on approval': ['Продано (за погодженням)', 'warn'], 'not sold': ['Не продано', 'bad'], removed: ['Знято з торгів', 'bad'] };
const dateUa = (d) => new Date(d).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });

export default function SoldSearch({ initial = '' }) {
  const [q, setQ] = useState(initial);
  const [state, setState] = useState({ loading: false, error: null, data: null });
  const [open, setOpen] = useState(false);
  const [ask, setAsk] = useState(false);

  const run = async (value) => {
    setState({ loading: true, error: null, data: null });
    try { setState({ loading: false, error: null, data: await searchSold(value) }); }
    catch (e) { setState({ loading: false, error: e.message, data: null }); }
  };
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('q');
    if (p) { setQ(p); run(p); }
  }, []); // eslint-disable-line

  const d = state.data;
  const st = d ? STATUS[(d.status || '').toLowerCase()] || [d.status || 'Невідомо', 'warn'] : null;
  const car = d && { id: d.vin, vin: d.vin, lot: d.lot, auction: PLATFORM[d.platform] || d.platform, country: 'usa', make: d.make, model: d.model, year: d.year,
    km: d.km || 0, fuel: '—', engine: '—', body: '—', damage: d.damage, location: d.location, saleDate: d.soldDate, bid: d.salePrice ?? d.lastBid ?? 0, images: d.images, image: d.images?.[0] };

  return (
    <div>
      <form className="vin-form" onSubmit={(e) => { e.preventDefault(); run(q); }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="VIN чи № лота …" aria-label="VIN або номер лота" autoCapitalize="characters" spellCheck="false" />
        <button type="submit" aria-label="Шукати" disabled={state.loading}>{state.loading ? <i className="spin" /> : <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>}</button>
      </form>

      {state.error && <div className="vin-msg">{state.error}</div>}

      {d && (
        <article className="sold-card">
          <div className="sold-photo" onClick={() => d.images?.length && setOpen(true)} style={{ cursor: d.images?.length ? 'pointer' : 'default' }}>
            {d.images?.[0] ? <img src={d.images[0]} alt={d.title} /> : <div className="sold-noimg">Фото відсутнє</div>}
            <span className={`pill ${st[1]}`}>{st[0]}</span>
            {d.demo && <span className="pill demo">Демо</span>}
            {d.images?.length > 1 && <span className="count">📷 {d.images.length}</span>}
          </div>
          <div className="sold-info">
            <span className="src-line">{PLATFORM[d.platform] || d.platform} · лот № {d.lot}</span>
            <h3>{d.title || `${d.year} ${d.make} ${d.model}`}</h3>
            <div className="sold-price">
              <small>{d.salePrice != null ? 'Ціна продажу' : 'Остання ставка'}</small>
              <b>{d.salePrice != null ? `$${fmt(d.salePrice)}` : d.lastBid != null ? `$${fmt(d.lastBid)}` : '—'}</b>
              {d.salePrice == null && d.status && /not sold/i.test(d.status) && <em>не віддали за цю ціну</em>}
            </div>
            <dl>
              {[['VIN', d.vin], ['Дата продажу', d.soldDate ? dateUa(d.soldDate) : null], ['Локація', d.location], ['Пошкодження', d.damage], ['Пробіг', d.km ? `${fmt(d.km)} км` : null]]
                .filter(([, v]) => v).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
            <div className="m-actions">
              <button className="btn btn-fire" onClick={() => goTo('calc')}>Розрахувати «під ключ»</button>
              <button className="btn" onClick={() => setAsk(true)}>Запитати менеджера</button>
            </div>
          </div>
        </article>
      )}
      {ask && car && <LotRequestModal car={car} source="Продані лоти" onClose={() => setAsk(false)} />}
      {open && car && <LotModal car={car} priceLabel={d.salePrice != null ? 'Ціна продажу' : 'Остання ставка'} onClose={() => setOpen(false)} />}
    </div>
  );
}
