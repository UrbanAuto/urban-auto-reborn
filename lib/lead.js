const LEAD_API = (process.env.NEXT_PUBLIC_LEAD_API || '').replace(/\/+$/, '');

export const INTENTS = {
  transit: { title: 'Авто в дорозі', button: 'Шукаю авто в дорозі', ask: 'Доброго дня! Шукаю авто в дорозі.' },
  onsite: { title: 'Авто по місцю', button: 'Цікавить авто по місцю', ask: 'Доброго дня! Цікавить авто по місцю.' },
};

/** Запит менеджеру по конкретному лоту: дані лота + ім’я й телефон клієнта → Telegram-група. */
const LOT_INTENT = { manager: 'lot', calc: 'lot_calc', order: 'lot_order' };
export async function sendLot(car, source, name, phone, kind = 'manager', extra = {}) {
  if (!LEAD_API) return false;
  const lot = { title: `${car.year || ''} ${car.make || ''} ${car.model || ''}`.trim(), auction: car.auction, lot: car.lot, vin: car.vin || car.id, bid: car.bid, location: car.location };
  try {
    const r = await fetch(`${LEAD_API}/click`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ intent: LOT_INTENT[kind] || 'lot', source, name, phone, lot, extra }) });
    return r.ok;
  } catch { return false; }
}

/** Повідомляє менеджерів (Telegram-група): клієнт обрав «в дорозі» / «по місцю» і залишив ім’я та телефон. */
export async function sendIntent(kind, source, name, phone) {
  if (!LEAD_API) return false;
  try {
    const r = await fetch(`${LEAD_API}/click`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ intent: kind, source, name, phone }) });
    return r.ok;
  } catch { return false; }
}
