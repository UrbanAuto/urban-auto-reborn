'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { COUNTRIES, MAKES } from '@/lib/data';
import { useCars } from '@/lib/useCars';
import { splitMakeQuery, detectIntent } from '@/lib/search';
import { IntentPanel } from './Extras';
import { SOLD_API, searchSold, lotToCar } from '@/lib/sold';
import CarCard from './CarCard';
import LotModal from './LotModal';

const LIVE = !!SOLD_API;           // є сервер → весь каталог аукціонів; немає → локальний cars.json
const PAGE = 20;
const EU = ['autoscout24', 'mobile.de'];
const AUCTIONS = [['all', 'Усі аукціони'], ['copart', 'Copart'], ['iaai', 'IAAI'], ['europe', 'Європа']];
const TYPES = [['', 'Усі типи'], ['AUTOMOBILE', 'Легкові авто'], ['SUV', 'Кросовери / SUV'], ['PICKUP', 'Пікапи'], ['MOTORCYCLE', 'Мотоцикли'], ['ATV', 'Квадроцикли'], ['BOAT', 'Човни та катери'], ['JET SKI', 'Гідроцикли'], ['FARM EQUIPMENT', 'Сільгосптехніка'], ['HEAVY DUTY TRUCKS', 'Вантажівки'], ['BUS', 'Автобуси'], ['RECREATIONAL VEHICLE (RV)', 'Автобудинки'], ['CONSTRUCTION EQUIPMENT', 'Будтехніка']];
const SORTS = [['soon', 'Найближчі торги'], ['bid-asc', 'Ставка: від меншої'], ['bid-desc', 'Ставка: від більшої'], ['year-desc', 'Рік: новіші'], ['km-asc', 'Пробіг: менший']];
const LIVE_SORTS = [['soon', 'Найближчі торги'], ['new', 'Нещодавно додані']];
const YEARS = Array.from({ length: 16 }, (_, i) => new Date().getFullYear() - i);
const EMPTY = { q: '', make: '', country: 'all', year: '', budget: '', auction: 'all', sort: 'soon', type: '' };

export default function CatalogBrowser() {
  const local = useCars();
  const [f, setF] = useState(EMPTY);
  const [qDraft, setQDraft] = useState('');
  const [visible, setVisible] = useState(PAGE);
  const [open, setOpen] = useState(null);
  const [live, setLive] = useState({ items: [], cursor: null, more: false, loading: false, error: null, updated: null });
  const reqId = useRef(0);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const init = { ...EMPTY, q: p.get('q') || '', make: p.get('make') || '', country: p.get('country') || 'all', year: p.get('year') || '', budget: p.get('budget') || '' };
    setF(init); setQDraft(init.q);
    const lotQ = p.get('lot'); // посилання на конкретний лот
    if (lotQ) searchSold(lotQ).then((d) => setOpen(lotToCar(d))).catch(() => {});
  }, []);

  // ---------- LIVE: запити до сервера ----------
  const fetchLive = useCallback(async (filters, cursor) => {
    const id = ++reqId.current;
    setLive((s) => ({ ...s, loading: true, error: null, ...(cursor ? {} : { items: [], more: false }) }));
    const p = new URLSearchParams({ per_page: String(PAGE) });
    if (filters.auction === 'copart' || filters.auction === 'iaai') p.set('platform', filters.auction);
    // Серверний пошук шукає цілі слова («alfa» нічого не знайде, а «alfa romeo» — знайде), тому початок запиту, що схожий на марку, шлемо як фільтр марки
    const q0 = detectIntent(filters.q).rest;
    const split = filters.make ? { make: '', rest: q0 } : splitMakeQuery(q0);
    const make = filters.make || split.make;
    if (make) p.set('make', make.toUpperCase());
    if (filters.type) p.set('type', filters.type);
    if (filters.year) p.set('year_from', filters.year);
    if (filters.budget) p.set('price_max', filters.budget);
    if (split.rest) p.set('s', split.rest);
    p.set('sort', filters.sort === 'new' ? 'recently_added' : 'auction_soonest');
    if (cursor) p.set('cursor', cursor);
    try {
      const res = await fetch(`${SOLD_API}/vehicles?${p}`);
      const j = await res.json().catch(() => ({}));
      if (id !== reqId.current) return;
      if (!res.ok) throw new Error(j.message || 'Не вдалося завантажити лоти.');
      const rows = j.data.map((c) => ({ ...c, bid: c.bid ?? 0 }));
      setLive((s) => ({ items: cursor ? [...s.items, ...rows.filter((r) => !s.items.some((o) => o.id === r.id))] : rows, cursor: j.meta?.next_cursor || null, more: !!j.meta?.has_more, loading: false, error: null, updated: j.fetchedAt }));
    } catch (e) {
      if (id === reqId.current) setLive((s) => ({ ...s, loading: false, error: e.message }));
    }
  }, []);
  useEffect(() => { if (LIVE) fetchLive(f, null); }, [f.q, f.make, f.year, f.budget, f.auction, f.sort, f.type]); // eslint-disable-line

  // ---------- LOCAL: пошук у cars.json ----------
  const all = useMemo(() => {
    if (LIVE) return [];
    const tokens = detectIntent(f.q).rest.toLowerCase().split(/\s+/).filter(Boolean);
    const list = local.cars.filter((c) => {
      const a = c.auction.toLowerCase();
      const hay = `${c.make} ${c.model} ${c.year} ${c.lot} ${c.id} ${c.location || ''} ${c.damage || ''} ${c.auction} ${c.body || ''}`.toLowerCase();
      return tokens.every((t) => hay.includes(t)) &&
        (f.auction === 'all' || (f.auction === 'europe' ? EU.includes(a) : a.includes(f.auction))) &&
        (!f.make || c.make.toLowerCase() === f.make.toLowerCase()) && (f.country === 'all' || c.country === f.country) &&
        (!f.year || c.year >= +f.year) && (!f.budget || c.bid <= +f.budget);
    });
    const by = { soon: (a, b) => (a.saleDate || '9999').localeCompare(b.saleDate || '9999'), 'bid-asc': (a, b) => a.bid - b.bid, 'bid-desc': (a, b) => b.bid - a.bid, 'year-desc': (a, b) => b.year - a.year, 'km-asc': (a, b) => (a.km || 1e9) - (b.km || 1e9) }[f.sort] || (() => 0);
    return [...list].sort(by);
  }, [local.cars, f]);
  useEffect(() => { setVisible(PAGE); }, [JSON.stringify(f)]);

  const items = LIVE ? live.items.filter((c) => f.country === 'all' || c.country === f.country) : all.slice(0, visible);
  const hasMore = LIVE ? live.more : all.length > visible;
  const loadMore = () => (LIVE ? fetchLive(f, live.cursor) : setVisible((v) => v + PAGE));
  const reset = () => { setF(EMPTY); setQDraft(''); };
  const dirty = JSON.stringify({ ...f, sort: 'soon' }) !== JSON.stringify(EMPTY);
  const submit = (e) => { e.preventDefault(); set('q', qDraft.trim()); };
  const intent = detectIntent(LIVE ? qDraft : f.q); // панель «в дорозі / по місцю» з’являється вже під час набору
  const sorts = LIVE ? LIVE_SORTS : SORTS;
  const demo = !LIVE && local.source === 'demo';
  const updated = LIVE ? live.updated : local.updated;

  return (
    <>
      <form className="searchbar" onSubmit={submit} data-reveal>
        <span className="s-ico">⌕</span>
        <input type="search" value={LIVE ? qDraft : f.q} onChange={(e) => (LIVE ? setQDraft(e.target.value) : set('q', e.target.value))} placeholder="Пошук: марка, модель, VIN або номер лота…" aria-label="Пошук автомобіля" />
        {(LIVE ? qDraft : f.q) && <button type="button" className="s-x" onClick={() => { setQDraft(''); set('q', ''); }} aria-label="Очистити">✕</button>}
        {LIVE && <button type="submit" className="btn btn-fire btn-sm" style={{ marginLeft: 8 }}>Шукати</button>}
      </form>
      <div className="tabs" data-reveal>
        {COUNTRIES.filter((c) => !LIVE || c.id !== 'europe').map((c) => <button key={c.id} className={`tab ${f.country === c.id ? 'active' : ''}`} onClick={() => set('country', c.id)}>{c.label}</button>)}
      </div>
      <div className="filters" data-reveal>
        <select value={f.auction} onChange={(e) => set('auction', e.target.value)} aria-label="Аукціон">{AUCTIONS.filter(([v]) => !LIVE || v !== 'europe').map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
        {LIVE && <select value={f.type} onChange={(e) => set('type', e.target.value)} aria-label="Тип техніки">{TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>}
        <select value={f.make} onChange={(e) => set('make', e.target.value)} aria-label="Марка"><option value="">Усі марки</option>{MAKES.map((m) => <option key={m}>{m}</option>)}</select>
        <select value={f.year} onChange={(e) => set('year', e.target.value)} aria-label="Рік від"><option value="">Рік від</option>{YEARS.map((y) => <option key={y}>{y}</option>)}</select>
        <input type="number" min="0" step="500" inputMode="numeric" placeholder="Ставка до, $" value={f.budget} onChange={(e) => set('budget', e.target.value)} aria-label="Ставка до" />
        <select value={f.sort} onChange={(e) => set('sort', e.target.value)} aria-label="Сортування">{sorts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
        {dirty && <button className="btn btn-sm" onClick={reset}>Скинути</button>}
      </div>
      {intent.kinds.length > 0 && <IntentPanel kinds={intent.kinds} source="Пошук у каталозі" />}
      <div className="live-bar">
        <span className={`dot ${demo ? 'demo' : ''}`} />
        {demo ? 'Демо-дані' : LIVE ? 'Весь каталог Copart та IAAI' : 'Дані аукціонів'}
        {updated && <> · оновлено {new Date(updated).toLocaleString('uk-UA', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</>}
        {!LIVE && <b>{all.length} лотів</b>}
        {LIVE && <b>показано {items.length}</b>}
      </div>
      {live.error && LIVE && <div className="vin-msg" style={{ marginBottom: 20 }}>{live.error}</div>}
      <div className="cars" key={LIVE ? `${live.items.length ? 'r' : 'e'}${JSON.stringify(f)}` : `${JSON.stringify(f)}${local.cars.length}`} data-stagger>
        {!live.loading && items.length === 0 && !live.error && <div className="empty">За вашим запитом лотів не знайдено. Спробуйте повну назву марки чи моделі (наприклад, «Alfa Romeo Stelvio») або залиште заявку на підбір.</div>}
        {items.map((c) => <CarCard key={c.id} c={c} onOpen={setOpen} />)}
      </div>
      {LIVE && live.loading && <div className="stage-load" style={{ position: 'relative', height: 80 }}><i /></div>}
      {hasMore && !live.loading && (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button className="btn" onClick={loadMore}>Показати ще {LIVE ? PAGE : Math.min(PAGE, all.length - visible)} лотів</button>
        </div>
      )}
      {open && <LotModal car={open} onClose={() => setOpen(null)} />}
    </>
  );
}
