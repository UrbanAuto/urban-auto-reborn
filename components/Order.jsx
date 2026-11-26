'use client';
import { useState } from 'react';
import { MAKES, SITE } from '@/lib/data';
import { contactLink } from '@/lib/contact';

const LEAD_API = (process.env.NEXT_PUBLIC_LEAD_API || '').replace(/\/+$/, '');

export default function Order() {
  const [sent, setSent] = useState(false);
  const [state, setState] = useState('idle'); // idle | sending | done
  const submit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const d = Object.fromEntries(new FormData(form));
    const text = [
      'Заявка на підбір авто (сайт Urban Auto)',
      `Ім’я: ${d.name}`,
      `Телефон: ${d.phone}`,
      `Авто: ${[d.make, d.model].filter(Boolean).join(' ') || 'не вказано'}`,
      `Країна: ${d.country}`,
      d.year ? `Рік від: ${d.year}` : null,
      d.budget ? `Бюджет «під ключ» до: $${d.budget}` : null,
      `Ремонт під ключ: ${d.repair ? 'так' : 'ні'}`,
      d.note ? `Побажання: ${d.note}` : null,
    ].filter(Boolean).join('\n');
    if (LEAD_API) {
      setState('sending');
      try {
        const res = await fetch(`${LEAD_API}/lead`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...d, type: 'order', repair: !!d.repair }) });
        if (res.ok) { setState('done'); form.reset(); return; }
      } catch { /* запасний варіант нижче: Telegram менеджера */ }
      setState('idle');
    }
    const link = contactLink(text, 'Заявка на підбір авто');
    if (link.external) window.open(link.href, '_blank', 'noopener');
    else window.location.href = link.href;
    setSent(true);
  };
  return (
    <section className="section alt" id="order">
      <div className="container split">
        <div>
          <span className="eyebrow" data-reveal>Підбір під замовлення</span>
          <h2 className="h2" data-reveal>Опишіть авто — <span className="grad">знайдемо краще</span></h2>
          <p className="lead" data-reveal>Менеджер підбере кілька перевірених варіантів під ваш бюджет та сценарії використання.</p>
          <ul className="perks" data-stagger>
            <li><i>🧾</i><div><b>Перевірка авто до ставки</b><span>VIN-звіти, фотоархів, прогноз бюджету відновлення та оцінка ліквідності.</span></div></li>
            <li><i>📑</i><div><b>Договір і прозорі витрати</b><span>Фінансова звітність і узгодження витрат до їх появи — без сюрпризів.</span></div></li>
            <li><i>🛠️</i><div><b>Ремонт під ключ</b><span>Власна команда доводить авто до стану, з яким не соромно виїхати з першого дня.</span></div></li>
          </ul>
        </div>
        <form className="panel" onSubmit={submit} data-reveal-right>
          <div className="form-grid">
            <div className="input"><label>Ім’я</label><input name="name" required placeholder="Ваше ім’я" /></div>
            <div className="input"><label>Телефон</label><input name="phone" required type="tel" placeholder="+380XXXXXXXXX" pattern="\+?[0-9\s\-()]{10,16}" /></div>
            <div className="input"><label>Марка</label><select name="make"><option value="">Будь-яка</option>{MAKES.map((m) => <option key={m}>{m}</option>)}</select></div>
            <div className="input"><label>Модель</label><input name="model" placeholder="напр. RAV4" /></div>
            <div className="input"><label>Країна</label><select name="country"><option>США</option><option>Канада</option><option>Європа</option></select></div>
            <div className="input"><label>Рік від</label><input name="year" type="number" min="2005" max="2030" placeholder="2019" /></div>
            <div className="input full"><label>Бюджет «під ключ» до, $</label><input name="budget" type="number" min="0" step="500" placeholder="25000" /></div>
            <div className="input full"><label>Побажання</label><textarea name="note" placeholder="Колір, привід, комплектація…" /></div>
            <label className="check full"><input type="checkbox" name="repair" /> Хочу ремонт під ключ</label>
            <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0 }} />
            <button className="btn btn-fire full" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Надсилаємо…' : 'Надіслати заявку менеджеру'}</button>
          </div>
          {state === 'done' && <div className="ok">Дякуємо! Заявку отримано — менеджер зв’яжеться з вами протягом 15 хвилин у робочий час.</div>}
          {sent && state !== 'done' && <div className="ok">Відкрито Telegram із готовою заявкою — натисніть «Надіслати». Якщо цього не сталося — зателефонуйте {SITE.phoneLabel} або напишіть на {SITE.email}.</div>}
        </form>
      </div>
    </section>
  );
}
