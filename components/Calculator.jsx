'use client';
import { useState, useMemo } from 'react';
import { calculate, FUELS } from '@/lib/calc';
import { goTo } from '@/lib/scroll';

const usd = (n) => '$' + Math.round(n).toLocaleString('uk-UA');
const YEAR = new Date().getFullYear();

function Range({ label, value, min, max, step, onChange, fmt = (v) => v }) {
  const p = ((value - min) / (max - min)) * 100;
  return (
    <div className="range-row">
      <div className="top"><span>{label}</span><b>{fmt(value)}</b></div>
      <input type="range" min={min} max={max} step={step} value={value} style={{ '--p': `${p}%` }} onChange={(e) => onChange(+e.target.value)} aria-label={label} />
    </div>
  );
}

export default function Calculator() {
  const [s, setS] = useState({ price: 12000, year: YEAR - 6, fuel: 'petrol', volume: 2.0, kwh: 60 });
  const set = (k) => (v) => setS((p) => ({ ...p, [k]: v }));
  const r = useMemo(() => calculate(s), [s]);
  const ev = s.fuel === 'electric';
  const mid = Math.round(r.total / 100) * 100;
  const lo = Math.max(0, mid - 3000);
  const hi = mid + 3000;
  return (
    <section className="section" id="calc">
      <div className="container">
        <span className="eyebrow" data-reveal>Калькулятор · орієнтовно</span>
        <h2 className="h2" data-reveal>Орієнтовна вартість <span className="grad">пригону авто</span></h2>
        <p className="lead" data-reveal>Орієнтовний розрахунок у 2 кліки: вкажіть параметри авто й отримайте приблизну вилку бюджету ще до ставки на аукціоні.</p>
        <div className="calc-wrap">
          <div className="panel" data-reveal-left style={{ display: 'grid', gap: 26 }}>
            <Range label="Ціна авто на аукціоні" value={s.price} min={2000} max={80000} step={500} onChange={set('price')} fmt={usd} />
            <Range label="Рік випуску" value={s.year} min={YEAR - 15} max={YEAR} step={1} onChange={set('year')} />
            <div className="range-row"><div className="top"><span>Тип пального</span></div>
              <div className="seg">{FUELS.map((f) => <button key={f.id} className={s.fuel === f.id ? 'on' : ''} onClick={() => set('fuel')(f.id)}>{f.label}</button>)}</div></div>
            {ev
              ? <Range label="Потужність батареї" value={s.kwh} min={20} max={120} step={1} onChange={set('kwh')} fmt={(v) => `${v} кВт·год`} />
              : <Range label="Об’єм двигуна" value={s.volume} min={0.8} max={6} step={0.1} onChange={set('volume')} fmt={(v) => `${v.toFixed(1)} л`} />}
          </div>
          <div className="panel result" data-reveal-right>
            <span className="approx">≈ Орієнтовний розрахунок</span>
            <div className="total-label" style={{ marginTop: 14 }}>Орієнтовний бюджет в Україні</div>
            <div className="total grad">{usd(lo)} – {usd(hi)}</div>
            <p className="note" style={{ margin: '14px 0 26px' }}>Орієнтовна вилка бюджету «під ключ» в Україні (±$3 000). Для точної суми залиште заявку — менеджер порахує під конкретний лот.</p>
            <button className="btn btn-fire" style={{ width: '100%' }} onClick={() => goTo('order')}>Замовити точний розрахунок</button>
            <p className="note">Розрахунок орієнтовний: ремонт і послуги компанії не враховано. Точна сума залежить від лота, порту, курсу та чинних митних ставок.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
