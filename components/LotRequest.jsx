'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { sendLot } from '@/lib/lead';
import { managerLink } from '@/lib/contact';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

// Три різні заявки по лоту: кожна з власним заголовком, полями й текстом повідомлення менеджеру
const KINDS = {
  manager: {
    icon: '💬', title: 'Зв’язатися з менеджером', hint: 'Залиште контакти — менеджер зателефонує й відповість на питання по цьому лоту.',
    submit: 'Передати менеджеру', note: true, noteLabel: 'Ваше питання (необов’язково)', notePh: 'Наприклад: чи є історія ДТП, яка вартість доставки…',
    done: 'Запит передано менеджеру — він зателефонує вам найближчим часом.',
  },
  calc: {
    icon: '🧮', title: 'Розрахунок «під ключ»', hint: 'Порахуємо повну вартість цього авто в Україні: ставка, доставка, розмитнення, а за потреби ремонт.',
    submit: 'Отримати розрахунок', budget: true, budgetLabel: 'Орієнтовний бюджет, $ (необов’язково)', repair: true, note: false,
    done: 'Заявку на розрахунок передано. Менеджер надішле вам повну вартість «під ключ».',
  },
  order: {
    icon: '🛒', title: 'Замовити цей лот', hint: 'Менеджер перевірить лот, узгодить умови й допоможе зробити ставку на аукціоні.',
    submit: 'Замовити лот', budget: true, budgetLabel: 'Максимальна ставка, $', budgetReq: true, repair: true, note: true, noteLabel: 'Побажання (необов’язково)', notePh: 'Терміни, комплектація, ремонт…',
    done: 'Замовлення отримано. Менеджер зв’яжеться з вами для підтвердження ставки й договору.',
  },
};

/** Заявка по лоту (manager | calc | order): ім’я + телефон + поля під конкретну дію → повідомлення в Telegram-групу. */
export default function LotRequestModal({ car, source, kind = 'manager', onClose }) {
  const cfg = KINDS[kind] || KINDS.manager;
  const [state, setState] = useState('form'); // form | sending | done
  useEffect(() => {
    // Esc закриває лише цю форму, а не вікно лота під нею
    const key = (e) => { if (e.key === 'Escape') { e.stopImmediatePropagation(); onClose(); } };
    window.addEventListener('keydown', key, true);
    return () => window.removeEventListener('keydown', key, true);
  }, [onClose]);

  const submit = async (e) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const name = String(d.get('name')).trim();
    const phone = String(d.get('phone')).trim();
    const extra = { maxBid: String(d.get('budget') || '').replace(/\D/g, ''), repair: !!d.get('repair'), note: String(d.get('note') || '').trim() };
    setState('sending');
    const ok = await sendLot(car, source, name, phone, kind, extra);
    if (!ok) { // запасний варіант: Telegram менеджера
      const l = managerLink(car);
      window.open(l.href, '_blank', 'noopener');
    }
    setState(ok ? 'done' : 'form');
  };

  return createPortal(
    <div className="modal ask-modal" role="dialog" aria-modal="true" aria-label={cfg.title} onClick={(e) => { e.stopPropagation(); if (e.target === e.currentTarget) onClose(); }}>
      <div className="ask-box">
        <div className="ask-head">
          <img className="ask-logo" src={`${BASE}/img/logo.png`} alt="" width="44" height="44" />
          <div>
            <span className="ask-kind">{cfg.icon} {cfg.title}</span>
            <b className="ask-car">{car.year} {car.make} {car.model}{car.lot ? ` · лот № ${car.lot}` : ''}</b>
          </div>
          <button className="ask-x" onClick={onClose} aria-label="Закрити" type="button">✕</button>
        </div>
        <div className="ask-body">
          {state === 'done' ? (
            <>
              <p className="ask-done"><i>✓</i>{cfg.done}</p>
              <button className="btn" type="button" onClick={onClose}>Закрити</button>
            </>
          ) : (
            <form className="ask-form" onSubmit={submit}>
              <p className="ask-hint">{cfg.hint}</p>
              <label>Ім’я<input name="name" required placeholder="Ваше ім’я" autoComplete="name" /></label>
              <label>Телефон<input name="phone" required type="tel" placeholder="+380XXXXXXXXX" autoComplete="tel" pattern="\+?[0-9\s\-\(\)]{10,18}" title="Вкажіть номер у форматі +380XXXXXXXXX" /></label>
              {cfg.budget && <label>{cfg.budgetLabel}<input name="budget" type="number" min="0" step="100" inputMode="numeric" placeholder={car.bid ? `напр. ${Math.round((car.bid || 0) * 1.3 / 100) * 100 || 10000}` : 'напр. 12000'} required={!!cfg.budgetReq} /></label>}
              {cfg.repair && <label className="check"><input type="checkbox" name="repair" /> Потрібен ремонт під ключ</label>}
              {cfg.note && <label>{cfg.noteLabel}<textarea name="note" rows="3" placeholder={cfg.notePh} /></label>}
              <button className="btn btn-fire" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Надсилаємо…' : cfg.submit}</button>
              <small className="ask-fine">Натискаючи кнопку, ви погоджуєтесь, що менеджер зателефонує вам щодо цього лота.</small>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
