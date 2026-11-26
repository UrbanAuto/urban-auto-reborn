// Орієнтовний розрахунок бюджету «під ключ» в Україні (оціночний, не публічна оферта).
// Логіка та ставки — з калькулятора urban-auto.com.ua.
export const FUELS = [
  { id: 'petrol', label: 'Бензин' },
  { id: 'diesel', label: 'Дизель' },
  { id: 'hybrid', label: 'Гібрид' },
  { id: 'electric', label: 'Електро' },
];
export const EUR_RATE = 1.04;       // EUR → USD, орієнтовно
export const DELIVERY_TO_PORT = 2500;   // логістика до порту, $
export const DELIVERY_TO_UA = 1900;     // комплекс доставки до України, $
export const EV_HAZARDOUS = 100;        // збір за небезпечний вантаж (EV), $

export function exciseUSD({ fuel, volume, kwh, age }) {
  if (fuel === 'electric') return Math.max(0, kwh) * EUR_RATE;
  if (fuel === 'diesel') return 75 * volume * (volume > 3.5 ? 2 : 1) * age * EUR_RATE;
  if (fuel === 'petrol') return 50 * volume * (volume > 3 ? 2 : 1) * age * EUR_RATE;
  return 40 * volume * age * EUR_RATE; // гібрид
}

export function calculate({ price, year, fuel, volume, kwh }) {
  const age = Math.max(1, new Date().getFullYear() - year);
  const ev = fuel === 'electric';
  const delivery = DELIVERY_TO_PORT + DELIVERY_TO_UA;
  const duty = ev ? 0 : price * 0.1;
  const excise = exciseUSD({ fuel, volume, kwh, age });
  const vat = ev ? 0 : (price + delivery + duty + excise) * 0.2;
  const hazardous = ev ? EV_HAZARDOUS : 0;
  const items = [
    { k: 'Ставка (лот)', v: price },
    { k: 'Логістика до порту', v: DELIVERY_TO_PORT },
    { k: 'Комплекс до України', v: DELIVERY_TO_UA },
    { k: 'Мито 10%', v: duty },
    { k: ev ? 'Акциз (за кВт·год)' : 'Акциз', v: excise },
    { k: 'ПДВ 20%', v: vat },
    { k: 'Hazardous (EV)', v: hazardous },
  ].map((i) => ({ ...i, v: Math.round(i.v) })).filter((i) => i.v > 0);
  const total = items.reduce((s, i) => s + i.v, 0);
  return { items, total, age };
}
