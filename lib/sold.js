const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const SOLD_API = (process.env.NEXT_PUBLIC_SOLD_API || '').replace(/\/+$/, '');

export const normalizeQuery = (s) => s.trim().toUpperCase().replace(/\s+/g, '');
export const validQuery = (q) => /^[A-HJ-NPR-Z0-9]{11,17}$/.test(q) || /^\d{5,10}$/.test(q);

/** Шукає лот за VIN або номером лота. Без налаштованого сервера працює демо-режим. */
export async function searchSold(raw) {
  const q = normalizeQuery(raw);
  if (!validQuery(q)) throw new Error('Введіть VIN (11–17 символів) або номер лота (5–10 цифр).');
  if (!SOLD_API) {
    const demo = await fetch(`${BASE}/data/sold-demo.json`).then((r) => r.json());
    const hit = Object.values(demo).find((d) => d.vin === q || d.lot === q);
    if (!hit) { const e = new Error('Демо-режим: спробуйте VIN DEMV0000000000001 або DEMV0000000000002. Реальний пошук буде доступний після підключення сервера.'); e.demo = true; throw e; }
    return { ...hit, demo: true };
  }
  const res = await fetch(`${SOLD_API}/lot?q=${encodeURIComponent(q)}`);
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(j.message || 'Не вдалося виконати пошук.');
  return j.data;
}
