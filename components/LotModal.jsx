'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import CarSvg from './CarSvg';
import LotRequestModal from './LotRequest';

const fmt = (n) => n.toLocaleString('uk-UA');
const FLAG = { usa: '🇺🇸', canada: '🇨🇦', europe: '🇪🇺' };
const CNAME = { usa: 'США', canada: 'Канада', europe: 'Європа' };

export default function LotModal({ car, onClose, priceLabel = 'Поточна ставка' }) {
  const imgs = car.images?.length ? car.images : car.image ? [car.image] : [];
  const [i, setI] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [ask, setAsk] = useState(null); // manager | calc | order
  const stage = useRef(null);
  const touch = useRef(null);
  const thumbs = useRef(null);

  const go = useCallback((d) => { if (!imgs.length) return; setLoaded(false); setI((v) => (v + d + imgs.length) % imgs.length); }, [imgs.length]);

  // Адреса лота: ?lot=НОМЕР (можна надіслати клієнту), а «Назад» на телефоні закриває лот
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!car.lot) return undefined;
    const prev = window.location.href;
    const url = new URL(prev); url.searchParams.set('lot', car.lot);
    window.history.pushState({ lotModal: true }, '', url.pathname + url.search + url.hash);
    const pop = () => closeRef.current();
    window.addEventListener('popstate', pop);
    return () => {
      window.removeEventListener('popstate', pop);
      if (window.history.state?.lotModal) window.history.back();
    };
  }, [car.lot]);

  useEffect(() => {
    window.__lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    const key = (e) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); };
    window.addEventListener('keydown', key);
    return () => { window.removeEventListener('keydown', key); window.__lenis?.start(); document.documentElement.style.overflow = ''; };
  }, [go, onClose]);

  useEffect(() => { thumbs.current?.children[i]?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }); }, [i]);

  const fullscreen = () => {
    const el = stage.current;
    if (document.fullscreenElement) document.exitFullscreen();
    else el?.requestFullscreen?.().catch(() => {});
  };

  const rows = [
    ['Рік', car.year], ['Пробіг', car.km > 0 ? `${fmt(car.km)} км` : null], ['Паливо', car.fuel], ['Двигун', car.engine], ['Кузов', car.body],
    ['Пошкодження', car.damage], ['Локація', car.location], ['Лот №', car.lot], ['Торги', car.saleDate ? new Date(car.saleDate).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' }) : null],
  ].filter(([, v]) => v && v !== '—');

  return createPortal(
    <div className="modal" role="dialog" aria-modal="true" aria-label={`${car.make} ${car.model}`} onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-x" onClick={onClose} aria-label="Закрити">✕</button>
        <div className="modal-gallery">
          <div className="stage" ref={stage}
            onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => { if (touch.current == null) return; const dx = e.changedTouches[0].clientX - touch.current; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); touch.current = null; }}>
            {imgs.length ? (
              <>
                {!loaded && <div className="stage-load"><i /></div>}
                <img key={imgs[i]} src={imgs[i]} alt={`${car.make} ${car.model} — фото ${i + 1}`} onLoad={() => setLoaded(true)} className={loaded ? 'in' : ''} />
              </>
            ) : <div className="stage-empty"><CarSvg id={`m${car.id}`} body={car.body} /></div>}
            {imgs.length > 1 && <>
              <button className="g-nav prev" onClick={() => go(-1)} aria-label="Попереднє фото">‹</button>
              <button className="g-nav next" onClick={() => go(1)} aria-label="Наступне фото">›</button>
              <span className="counter">{i + 1} / {imgs.length}</span>
            </>}
            {imgs.length > 0 && <button className="fs" onClick={fullscreen} aria-label="На весь екран">⛶</button>}
            <span className="src-tag">{FLAG[car.country]} {car.auction}</span>
          </div>
          {imgs.length > 1 && (
            <div className="strip" ref={thumbs}>
              {imgs.map((s, k) => <button key={s} className={k === i ? 'on' : ''} onClick={() => { setLoaded(k === i); setI(k); }}><img src={s} alt="" loading="lazy" /></button>)}
            </div>
          )}
        </div>
        <div className="modal-info">
          <span className="src-line">{FLAG[car.country]} {CNAME[car.country]} · аукціон {car.auction}</span>
          <h3>{car.year} {car.make} {car.model}</h3>
          <div className="m-price"><small>{priceLabel}</small><b>${fmt(car.bid)}</b></div>
          <dl>{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          <div className="m-actions">
            <button className="btn btn-fire" onClick={() => setAsk('manager')}>💬 Зв’язатися з менеджером</button>
            <button className="btn" onClick={() => setAsk('order')}>Замовити цей лот</button>
            <button className="btn" onClick={() => setAsk('calc')}>Розрахувати «під ключ»</button>
          </div>
          <p className="note">Ставка — поточна на аукціоні, остаточна вартість залежить від торгів.</p>
        </div>
      </div>
      {ask && <LotRequestModal car={car} kind={ask} source="Вікно лота" onClose={() => setAsk(null)} />}
    </div>,
    document.body,
  );
}
