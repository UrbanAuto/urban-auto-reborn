'use client';
import { useEffect, useState } from 'react';
import { CARS as FALLBACK } from './data';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const normalize = (c) => ({ ...c, bid: c.bid ?? c.price, damage: c.damage ?? null, location: c.location ?? null, saleDate: c.saleDate ?? null });

export function useCars() {
  const [data, setData] = useState({ cars: [], updated: null, source: 'loading' }) // без демо-лотів у HTML: Google не має індексувати вигадані ціни;
  useEffect(() => {
    fetch(`${BASE}/data/cars.json`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => setData({ ...j, cars: j.cars.map(normalize) }))
      .catch(() => setData({ cars: FALLBACK.map(normalize), updated: null, source: 'demo' }));
  }, []);
  return data;
}
