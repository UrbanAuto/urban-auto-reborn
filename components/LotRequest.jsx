'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { sendLot } from '@/lib/lead';
import { managerLink } from '@/lib/contact';

/** Запит менеджеру по лоту: ім’я + телефон → повідомлення з даними лота в Telegram-групу. */
export default function LotRequestModal({ car, source, onClose }) {
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
    setState('sending');
    const ok = await sendLot(car, source, name, phone);
    if (!ok) { // запасний варіант: Telegram менеджера
      const l = managerLink(car);
      window.open(l.href, '_blank', 'noopener');
    }
    setState(ok ? 'done' : 'form');
  };

  return createPortal(
    <div className="modal ask-modal" role="dialog" aria-modal="true" onClick={(e) => { e.stopPropagation(); if (e.target === e.currentTarget) onClose(); }}>
      <div className="ask-box">
        <button className="modal-x" onClick={onClose} aria-label="Закрити" type="button">✕</button>
        <h3>Запит менеджеру</h3>
        <p className="ask-car">{car.year} {car.make} {car.model}{car.lot ? ` · лот № ${car.lot}` : ''}</p>
        {state === 'done' ? (
          <>
            <p className="intent-done">✓ Запит передано менеджеру — він зателефонує вам найближчим часом.</p>
            <button className="btn" type="button" onClick={onClose}>Закрити</button>
          </>
        ) : (
          <form className="ask-form" onSubmit={submit}>
            <input name="name" required placeholder="Ваше ім’я" autoComplete="name" />
            <input name="phone" required type="tel" placeholder="+380XXXXXXXXX" autoComplete="tel" pattern="\+?[0-9\s\-\(\)]{10,18}" title="Вкажіть номер у форматі +380XXXXXXXXX" />
            <button className="btn btn-fire" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Надсилаємо…' : 'Надіслати менеджеру'}</button>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
}
