// Cloudflare Worker: безпечний «міст» між сайтом і Apibara.
// Ключ API зберігається як секрет Worker (APIBARA_KEY), у браузер не потрапляє.
//   GET /lot?q=VIN_або_лот          → один лот (у т.ч. проданий)
//   GET /vehicles?make=&year_from=… → каталог (Copart + IAAI) з пагінацією через cursor
// Розгортання: див. worker/README.md

const API = 'https://apibara.tech/api/v1/vehicle-auction';
const MI = 1.609344;
const TTL_LOT = 60 * 60 * 24;   // проданий лот не змінюється — кеш на добу
const TTL_LIST = 60 * 15;       // каталог — кеш 15 хвилин (економить ліміт запитів)

const FUEL = { gas: 'Бензин', gasoline: 'Бензин', petrol: 'Бензин', diesel: 'Дизель', hybrid: 'Гібрид', electric: 'Електро', flex: 'Бензин' };
const BODY = { suv: 'Кросовер', sedan: 'Седан', coupe: 'Купе', pickup: 'Пікап', hatchback: 'Хетчбек', wagon: 'Універсал', van: 'Мінівен' };
const DAMAGE = { 'front end': 'Передня частина', 'rear end': 'Задня частина', side: 'Бічна частина', 'left front': 'Передня ліва частина', 'right front': 'Передня права частина', 'left rear': 'Задня ліва частина', 'right rear': 'Задня права частина', hail: 'Град', 'all over': 'По всьому авто', roof: 'Дах', 'top/roof': 'Дах', flood: 'Затоплення', fire: 'Вогонь', undercarriage: 'Днище', vandalism: 'Вандалізм', mechanical: 'Механічні', normal: 'Звичайний знос' };
const pick = (m, v) => { const k = String(v || '').toLowerCase(); return Object.entries(m).find(([a]) => k.includes(a))?.[1]; };
const ua = (d) => (d ? pick(DAMAGE, d) || d : null);

const cors = (env, origin) => {
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  const ok = !allowed.length || allowed.includes(origin);
  return { 'Access-Control-Allow-Origin': ok ? origin || '*' : allowed[0], 'Access-Control-Allow-Methods': 'GET, OPTIONS', Vary: 'Origin' };
};
const json = (data, status, headers, extra = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', ...extra, ...headers } });

const imagesOf = (r, max = 14) => {
  const items = (r.media?.items || []).filter((i) => i.type === 'image').map((i) => i.large || i.full || i.thumb).filter(Boolean);
  return [...new Set(items.length ? items : r.media?.thumbs || [])].slice(0, max);
};

// Повна картка проданого/окремого лота
function mapLot(r) {
  const km = r.odometer?.km ?? (r.odometer?.mi != null ? Math.round(r.odometer.mi * MI) : null);
  const a = r.auction || {}; const p = r.pricing || {};
  return {
    vin: r.vin, lot: String(r.lot_number ?? ''), platform: r.platform, title: r.title, year: r.year, make: r.make, model: r.model,
    status: a.outcome_status || a.phase_label || null, confirmed: a.result_confirmed === true,
    salePrice: p.sale_price_usd ?? p.last_sold_price_usd ?? null, lastBid: p.current_bid_usd ?? null,
    soldDate: a.last_sold_day || (a.outcome_observed_at ? String(a.outcome_observed_at).slice(0, 10) : null),
    auctionDate: a.auction_at || null, location: r.location?.display || null, damage: ua(r.condition?.primary_damage), km, images: imagesOf(r, 20),
  };
}

// Картка для каталогу (та сама форма, що в cars.json на сайті)
function mapCar(r) {
  const loc = r.location?.display || null;
  const km = r.odometer?.km ?? (r.odometer?.mi != null ? Math.round(r.odometer.mi * MI) : 0);
  const a = r.auction || {};
  const date = (a.is_timed ? a.timed_end_at : null) || a.auction_at || null;
  const specs = r.vehicle_specs || {};
  const images = imagesOf(r);
  return {
    id: String(r.vin || r.lot_number), lot: String(r.lot_number ?? ''), auction: r.platform === 'iaai' ? 'IAAI' : 'Copart',
    country: /canada|\((ON|QC|BC|AB|MB|NS|NB|SK|NL|PE)\)/i.test(String(loc)) ? 'canada' : 'usa',
    make: r.make ? (String(r.make).length <= 3 ? String(r.make).toUpperCase() : String(r.make).toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())) : '—',
    model: r.model || r.title || '', year: r.year, km: Math.round(km || 0),
    fuel: pick(FUEL, specs.fuel_type) || '—', engine: specs.engine?.size_l ? `${specs.engine.size_l} л` : '—',
    body: pick(BODY, specs.body_style ?? r.title) || '—', damage: ua(r.condition?.primary_damage),
    bid: Math.round(r.pricing?.current_bid_usd ?? 0), location: loc, saleDate: date ? String(date).slice(0, 10) : null,
    image: images[0] || null, images,
  };
}

const LIST_PARAMS = ['platform', 'make', 'model', 'year_from', 'year_to', 'price_min', 'price_max', 'odometer_to', 's', 'sort', 'cursor', 'per_page', 'fuel_type[]', 'damage[]'];
const SORTS = ['auction_soonest', 'recently_added'];

async function upstream(env, path, params) {
  const url = new URL(API + path);
  for (const [k, v] of params) url.searchParams.append(k, v);
  return fetch(url, { headers: { 'X-API-Key': env.APIBARA_KEY, Accept: 'application/json' } });
}

async function cached(request, ctx, key, ttl, produce) {
  const cache = caches.default;
  const ck = new Request(`https://cache.local/${key}`);
  const hit = await cache.match(ck);
  if (hit) return { body: await hit.text(), status: 200, hit: true };
  const out = await produce();
  if (out.status === 200) ctx.waitUntil(cache.put(ck, new Response(out.body, { headers: { 'Cache-Control': `max-age=${ttl}` } })));
  return { ...out, hit: false };
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const h = cors(env, origin);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: h });
    if (request.method !== 'GET') return json({ error: 'method_not_allowed' }, 405, h);
    if (!env.APIBARA_KEY) return json({ error: 'not_configured', message: 'Сервер пошуку ще не налаштовано.' }, 503, h);

    const u = new URL(request.url);
    const path = u.pathname.replace(/\/+$/, '') || '/';

    // ---- Каталог ----
    if (path === '/vehicles') {
      const params = [['lot_status', 'Open']];
      for (const k of LIST_PARAMS) {
        for (const v of u.searchParams.getAll(k)) {
          const val = String(v).trim().slice(0, k === 'cursor' ? 600 : 100);
          if (!val) continue;
          if (k === 'sort' && !SORTS.includes(val)) continue;
          if (k === 'platform' && !['copart', 'iaai'].includes(val)) continue;
          if (k === 'per_page') { params.push([k, String(Math.min(40, Math.max(1, parseInt(val, 10) || 20)))]); continue; }
          params.push([k, val]);
        }
      }
      if (!params.some(([k]) => k === 'sort')) params.push(['sort', 'auction_soonest']);
      params.sort((a, b) => (a[0] + a[1]).localeCompare(b[0] + b[1]));
      const key = 'list/' + params.map(([k, v]) => `${k}=${v}`).join('&');
      const r = await cached(request, ctx, key, TTL_LIST, async () => {
        const res = await upstream(env, '/vehicles', params);
        if (res.status === 429) return { status: 429, body: JSON.stringify({ error: 'rate_limited', message: 'Ліміт запитів вичерпано, спробуйте пізніше.' }) };
        if (!res.ok) return { status: 502, body: JSON.stringify({ error: 'upstream', message: 'Сервіс тимчасово недоступний.' }) };
        const j = await res.json();
        return { status: 200, body: JSON.stringify({ data: (j.data || []).map(mapCar), meta: { next_cursor: j.meta?.next_cursor ?? null, has_more: !!j.meta?.has_more }, fetchedAt: new Date().toISOString() }) };
      });
      return new Response(r.body, { status: r.status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-Cache': r.hit ? 'HIT' : 'MISS', ...h } });
    }

    // ---- Один лот (VIN / номер лота) ----
    if (path === '/lot' || path === '/') {
      const q = (u.searchParams.get('q') || '').trim().toUpperCase();
      if (!/^[A-HJ-NPR-Z0-9]{11,17}$/.test(q) && !/^\d{5,10}$/.test(q))
        return json({ error: 'bad_query', message: 'Введіть VIN (11–17 символів) або номер лота (5–10 цифр).' }, 400, h);
      const r = await cached(request, ctx, `lot/${q}`, TTL_LOT, async () => {
        const res = await upstream(env, `/vehicles/${encodeURIComponent(q)}`, []);
        if (res.status === 404) return { status: 404, body: JSON.stringify({ error: 'not_found', message: 'Лот не знайдено.' }) };
        if (res.status === 429) return { status: 429, body: JSON.stringify({ error: 'rate_limited', message: 'Забагато запитів, спробуйте пізніше.' }) };
        if (!res.ok) return { status: 502, body: JSON.stringify({ error: 'upstream', message: 'Сервіс тимчасово недоступний.' }) };
        const j = await res.json();
        return { status: 200, body: JSON.stringify({ data: mapLot(j.data || j), fetchedAt: new Date().toISOString() }) };
      });
      return new Response(r.body, { status: r.status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-Cache': r.hit ? 'HIT' : 'MISS', ...h } });
    }

    return json({ error: 'not_found' }, 404, h);
  },
};
