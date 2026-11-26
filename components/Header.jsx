'use client';
import { useState } from 'react';
import { NAV, SITE } from '@/lib/data';
import { contactLink } from '@/lib/contact';
import { goTo } from '@/lib/scroll';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function Brand({ home = true, onClick }) {
  return (
    <a className="brand" href={home ? '#top' : `${BASE}/`} onClick={onClick} aria-label="Urban Auto">
      <img className="logo" src={`${BASE}/img/logo.png`} alt="Urban Auto" width="54" height="54" />
      <span className="brand-text">Urban Auto</span>
    </a>
  );
}

export default function Header({ home = true }) {
  const [open, setOpen] = useState(false);
  const href = (n) => (n.page ? `${BASE}${n.page}` : home ? `#${n.id}` : `${BASE}/#${n.id}`);
  const click = (e, n) => {
    setOpen(false);
    if (n.page || !home) return; // звичайний перехід
    e.preventDefault(); goTo(n.id);
  };
  const logo = (e) => { if (home) { e.preventDefault(); goTo('top'); } };
  const mgr = contactLink('Доброго дня! Хочу отримати консультацію щодо пригону авто.');
  return (
    <>
      <header className="header">
        <div className="container header-in">
          <Brand home={home} onClick={logo} />
          <nav className="nav">
            {NAV.map((n) => <a key={n.id} className={n.page ? 'nav-cat' : ''} href={href(n)} onClick={(e) => click(e, n)}>{n.label}</a>)}
          </nav>
          <button className={`burger ${open ? 'open' : ''}`} onClick={() => setOpen(!open)} aria-label="Меню"><span /><span /><span /></button>
        </div>
      </header>
      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        {NAV.map((n) => <a key={n.id} className="m-link" href={href(n)} onClick={(e) => click(e, n)}>{n.label}</a>)}
        <a className="btn btn-fire" href={mgr.href} {...(mgr.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>Написати менеджеру · {SITE.phoneLabel}</a>
      </div>
    </>
  );
}
