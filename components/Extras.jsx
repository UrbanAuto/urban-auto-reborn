'use client';
import { useState } from 'react';
import { SERVICES, BEFORE_AFTER, CASES, CASE_FILTERS, USP } from '@/lib/data';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';
const fmt = (n) => n.toLocaleString('uk-UA');

function BeforeAfter({ item }) {
  const [v, setV] = useState(50);
  const move = (e) => {
    if (e.buttons !== 1 && e.pointerType === 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    setV(Math.max(1, Math.min(99, ((e.clientX - r.left) / r.width) * 100)));
  };
  const url = (n) => `url(${BASE}/img/repair/${n}.webp)`;
  return (
    <figure className="ba">
      <div className="ba-wrap" style={{ '--split': `${v}%` }} onPointerDown={(e) => { e.currentTarget.setPointerCapture?.(e.pointerId); move(e); }} onPointerMove={move}>
        <div className="ba-img ba-after" style={{ backgroundImage: url(item.after) }} />
        <div className="ba-img ba-before" style={{ backgroundImage: url(item.before) }} />
        <div className="ba-divider"><i>‹›</i></div>
        <div className="ba-labels"><span>До</span><span>Після</span></div>
        <input className="ba-range" type="range" min="1" max="99" step="0.5" value={v} style={{ '--p': `${v}%` }} onChange={(e) => setV(+e.target.value)} onPointerDown={(e) => e.stopPropagation()} aria-label={`${item.title}: до і після`} />
      </div>
      <figcaption>{item.title}: до → після</figcaption>
    </figure>
  );
}

export function Repair() {
  return (
    <section className="section" id="repair">
      <div className="container">
        <span className="eyebrow" data-reveal>Ремонт під ключ</span>
        <h2 className="h2" data-reveal>Власна команда <span className="grad">відповідає за результат</span></h2>
        <p className="lead" data-reveal>Ми не передаємо ремонт стороннім СТО без контролю. Власна команда відповідає за результат: від геометрії кузова до полірування перед видачею.</p>
        <div className="svc-grid" data-stagger>
          {SERVICES.map((s) => <div className="svc" key={s.title}><i>{s.icon}</i><h3>{s.title}</h3><p>{s.text}</p></div>)}
        </div>
        <div className="ba-grid" data-stagger>
          {BEFORE_AFTER.map((b) => <BeforeAfter key={b.title} item={b} />)}
        </div>
      </div>
    </section>
  );
}

export function Cases() {
  const [f, setF] = useState('all');
  const list = CASES.filter((c) => f === 'all' || c.tags.includes(f));
  return (
    <section className="section alt" id="cases">
      <div className="container">
        <span className="eyebrow" data-reveal>Кейси</span>
        <h2 className="h2" data-reveal>Приклади <span className="grad">пригнаних авто</span></h2>
        <p className="lead" data-reveal>Реальні авто наших клієнтів: з якого аукціону, у якому місті, за скільки днів і скільки вдалося заощадити.</p>
        <div className="tabs" data-reveal>
          {CASE_FILTERS.map((x) => <button key={x.id} className={`tab ${f === x.id ? 'active' : ''}`} onClick={() => setF(x.id)}>{x.label}</button>)}
        </div>
        <div className="case-grid">
          {list.map((c) => (
            <article className="case" key={c.img}>
              <div className="case-img">
                <img src={`${BASE}/img/cases/${c.img}.webp`} alt={`${c.name} ${c.year}`} loading="lazy" style={c.pos ? { objectPosition: c.pos } : undefined} />
                <span className="badge">{c.auction}</span>
              </div>
              <div className="case-body">
                <h3>{c.name} / {c.year}</h3>
                <div className="case-meta"><span>📍 {c.city}</span><span>⏱ {c.days} дн.</span></div>
                <span className="save"><small>економія</small> ${fmt(c.saved)}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyUs() {
  return (
    <section className="section" id="usp">
      <div className="container">
        <span className="eyebrow" data-reveal>Чому обирають нас</span>
        <h2 className="h2" data-reveal>Керуємо ризиком <span className="grad">клієнта</span></h2>
        <p className="lead" data-reveal>Ми не просто веземо авто. Ми контролюємо кожну витрату і відповідаємо за результат підписом у договорі.</p>
        <div className="usp-grid" data-stagger>
          {USP.map((u) => <div className="usp" key={u.title}><i>{u.icon}</i><h3>{u.title}</h3><p>{u.text}</p></div>)}
        </div>
      </div>
    </section>
  );
}
