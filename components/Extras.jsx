'use client';
import { useState } from 'react';
import { contactLink } from '@/lib/contact';
import { sendIntent, INTENTS } from '@/lib/lead';
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

/** Натискання «в дорозі» / «по місцю»: повідомлення в групу; без Worker відкриваємо Telegram менеджера. */
export function useIntent(source) {
  const [st, setSt] = useState({});
  const pick = async (kind) => {
    if (st[kind] === 'sending' || st[kind] === 'done') return;
    setSt((p) => ({ ...p, [kind]: 'sending' }));
    const ok = await sendIntent(kind, source);
    if (!ok) { const l = contactLink(INTENTS[kind].ask); window.open(l.href, '_blank', 'noopener'); }
    setSt((p) => ({ ...p, [kind]: ok ? 'done' : 'idle' }));
  };
  return [st, pick];
}

const Done = () => <p className="intent-done">✓ Запит передано менеджеру — він зв’яжеться з вами. Щоб швидше, залиште заявку нижче або напишіть @IvanUrbanAuto.</p>;

export function IntentButton({ kind, st, pick }) {
  const s = st[kind];
  return (
    <>
      <button className="btn btn-fire" type="button" disabled={s === 'sending' || s === 'done'} onClick={() => pick(kind)}>
        {s === 'done' ? '✓ Передано менеджеру' : s === 'sending' ? 'Надсилаємо…' : `${INTENTS[kind].button} →`}
      </button>
      {s === 'done' && <Done />}
    </>
  );
}

/** Панель, що з’являється в пошуку каталогу, коли клієнт пише «по місцю» чи «в дорозі». */
export function IntentPanel({ kinds, source }) {
  const [st, pick] = useIntent(source);
  const text = { transit: 'Авто, які вже викуплені й їдуть до України.', onsite: 'Готові авто, які вже в Україні: можна оглянути наживо.' };
  return (
    <div className="intent-panel">
      {kinds.map((k) => (
        <div className="intent-item" key={k}>
          <div><b>{INTENTS[k].title}</b><span>{text[k]}</span></div>
          <IntentButton kind={k} st={st} pick={pick} />
        </div>
      ))}
    </div>
  );
}

export function LiveCars() {
  const [st, pick] = useIntent('Головна · мапа');
  const pin = (x, y, label, sub, kind) => (
    <g className={`pin ${kind}`} role="button" tabIndex={0} aria-label={label} onClick={() => pick(kind)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && pick(kind)}>
      <circle cx={x} cy={y} r="22" className="pin-pulse" />
      <circle cx={x} cy={y} r="11" className="pin-dot" />
      <text x={x} y={y - 34} textAnchor="middle" className="pin-label">{label}</text>
      <text x={x} y={y + 40} textAnchor="middle" className="pin-sub">{st[kind] === 'done' ? '✓ передано менеджеру' : sub}</text>
    </g>
  );
  return (
    <section className="section" id="live">
      <div className="container">
        <span className="eyebrow" data-reveal>Авто в наявності</span>
        <h2 className="h2" data-reveal>Авто в дорозі <span className="grad">та по місцю</span></h2>
        <p className="lead" data-reveal>Обирайте, як вам зручніше: забронювати авто, яке вже їде до України, або подивитися готове авто в Києві. Натисніть на мапі або на кнопці — менеджер одразу отримає ваш запит.</p>
        <div className="live-map" data-reveal>
          <svg viewBox="0 0 800 320" role="img" aria-label="Мапа: аукціон у США, авто в дорозі, авто по місцю в Києві">
            <defs><linearGradient id="routeGrad" x1="0" x2="1"><stop offset="0" stopColor="#b44848" /><stop offset=".6" stopColor="#e26a6a" /><stop offset="1" stopColor="#ffc4c4" /></linearGradient></defs>
            <path d="M70 230 C 200 80, 330 70, 410 130 S 600 250, 680 190" className="route-base" />
            <path d="M70 230 C 200 80, 330 70, 410 130 S 600 250, 680 190" className="route-live" />
            <g className="node-static"><circle cx="70" cy="230" r="9" /><text x="70" y="262" textAnchor="middle">США · аукціон</text></g>
            {pin(410, 130, 'Авто в дорозі', 'їде до України', 'transit')}
            {pin(680, 190, 'Авто по місцю', 'Київ · готове авто', 'onsite')}
          </svg>
        </div>
        <div className="live-grid" data-stagger>
          <div className="live-card">
            <i>🚢</i>
            <h3>Авто в дорозі</h3>
            <p>Авто, які вже викуплені й їдуть до України. Підберемо варіант під ваш бюджет і скажемо, коли він буде в Києві. Так ви економите час і бачите авто ще до розмитнення.</p>
            <IntentButton kind="transit" st={st} pick={pick} />
          </div>
          <div className="live-card">
            <i>📍</i>
            <h3>Авто по місцю</h3>
            <p>Готові авто, які вже в Україні: можна приїхати на огляд, оцінити стан наживо й забрати швидше, без очікування доставки.</p>
            <IntentButton kind="onsite" st={st} pick={pick} />
          </div>
        </div>
      </div>
    </section>
  );
}
