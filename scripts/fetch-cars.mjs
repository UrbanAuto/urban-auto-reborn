// Оновлює public/data/cars.json лотами з Apibara (Copart + IAAI).
// Ключ береться зі змінної середовища APIBARA_KEY (GitHub Secret). Без ключа — нічого не змінює.
import fs from 'node:fs';

const BASE = 'https://apibara.tech/api/v1/vehicle-auction';
const OUT = 'public/data/cars.json';
const KEY = process.env.APIBARA_KEY;
const PER_PAGE = Number(process.env.APIBARA_PER_PAGE || 20);
const YEAR_FROM = new Date().getFullYear() - 8;
const MI = 1.609344;

const FUEL = { gas: 'Бензин', gasoline: 'Бензин', petrol: 'Бензин', diesel: 'Дизель', hybrid: 'Гібрид', electric: 'Електро', flex: 'Бензин' };
const BODY = { suv: 'Кросовер', sedan: 'Седан', coupe: 'Купе', pickup: 'Пікап', hatchback: 'Хетчбек', wagon: 'Універсал', van: 'Мінівен' };
const DAMAGE = { 'front end': 'Передня частина', 'rear end': 'Задня частина', side: 'Бічна частина', 'left front': 'Передня ліва частина', 'right front': 'Передня права частина', 'left rear': 'Задня ліва частина', 'right rear': 'Задня права частина', hail: 'Град', 'all over': 'По всьому авто', roof: 'Дах', 'top/roof': 'Дах', 'water/flood': 'Затоплення', flood: 'Затоплення', fire: 'Вогонь', 'undercarriage': 'Днище', vandalism: 'Вандалізм', 'minor dent/scratches': 'Дрібні вм\'ятини', 'mechanical': 'Механічні', normal: 'Звичайний знос' };
const ua = (d) => { if (!d) return null; const k = String(d).toLowerCase(); return Object.entries(DAMAGE).find(([a]) => k.includes(a))?.[1] ?? d; };
const pick = (m, v) => { const k = String(v || '').toLowerCase(); return Object.entries(m).find(([a]) => k.includes(a))?.[1]; };

export function mapLot(r) {
  const platform = (r.platform || '').toLowerCase();
  const loc = r.location?.display ?? r.location ?? null;
  const odoKm = r.odometer?.km ?? (r.odometer?.mi != null ? r.odometer.mi * MI : typeof r.odometer === 'number' ? r.odometer * MI : null);
  const bid = r.pricing?.current_bid_usd ?? r.current_bid ?? 0;
  const photo = r.media?.items?.find((i) => i.type === 'image')?.large ?? r.media?.thumbs?.[0] ?? (Array.isArray(r.photos) ? r.photos[0] : null);
  const timed = r.auction?.is_timed === true;
  const fromItems = (r.media?.items || []).filter((i) => i.type === 'image').map((i) => i.large || i.full || i.thumb).filter(Boolean);
  const images = [...new Set(fromItems.length ? fromItems : r.media?.thumbs || [])].slice(0, 20);
  const date = (timed ? r.auction?.timed_end_at : null) ?? r.auction?.auction_at ?? r.auction_date ?? null;
  const country = /canada|\((ON|QC|BC|AB|MB|NS|NB|SK|NL|PE)\)|,\s*(ON|QC|BC|AB|MB|NS|NB)\b|^(ON|QC|BC|AB|MB|NS|NB)\s*-/i.test(String(loc)) ? 'canada' : 'usa';
  return {
    id: String(r.vin || r.lot_number),
    lot: String(r.lot_number ?? ''),
    auction: platform === 'iaai' ? 'IAAI' : 'Copart',
    country,
    make: r.make ? (String(r.make).length <= 3 ? String(r.make).toUpperCase() : String(r.make).toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())) : '—',
    model: r.model || r.title || '',
    year: r.year,
    km: odoKm != null ? Math.round(odoKm) : 0,
    fuel: pick(FUEL, r.vehicle_specs?.fuel_type ?? r.vehicle_specs?.fuel ?? r.fuel_type ?? r.fuel) || '—',
    engine: r.vehicle_specs?.engine?.size_l ? `${r.vehicle_specs.engine.size_l} л` : r.vehicle_specs?.engine?.hp ? `${r.vehicle_specs.engine.hp} к.с.` : (r.engine?.displacement ?? (typeof r.engine === 'string' ? r.engine : '—')),
    body: pick(BODY, r.body_style ?? r.body_type ?? r.title) || '—',
    damage: ua(r.condition?.primary_damage ?? r.damage?.primary ?? r.primary_damage ?? (Array.isArray(r.damage) ? r.damage[0] : r.damage)),
    bid: Math.round(bid),
    location: typeof loc === 'string' ? loc : null,
    saleDate: date ? String(date).slice(0, 10) : null,
    timed,
    image: photo,
    images: images.length ? images : photo ? [photo] : [],
  };
}

async function load(platform) {
  const qs = new URLSearchParams({ platform, lot_status: 'Open', year_from: String(YEAR_FROM), sort: 'auction_soonest', per_page: String(PER_PAGE) });
  const res = await fetch(`${BASE}/vehicles?${qs}`, { headers: { 'X-API-Key': KEY, Accept: 'application/json' } });
  console.log(platform, res.status, 'remaining:', res.headers.get('X-Subscription-Remaining'));
  if (!res.ok) throw new Error(`${platform}: HTTP ${res.status}`);
  const j = await res.json();
  return (j.data || []).map(mapLot).filter((c) => c.year && c.model);
}

if (process.argv[1]?.endsWith('fetch-cars.mjs')) {
  if (!KEY) { console.log('APIBARA_KEY не задано — залишаю наявний cars.json'); process.exit(0); }
  try {
    const cars = (await Promise.all(['copart', 'iaai'].map(load))).flat();
    if (!cars.length) throw new Error('порожня відповідь');
    fs.writeFileSync(OUT, JSON.stringify({ source: 'apibara', updated: new Date().toISOString(), cars }, null, 2));
    console.log(`Записано ${cars.length} лотів`);
  } catch (e) {
    console.error('Не вдалося оновити лоти, лишаю попередні дані:', e.message);
  }
}
