'use client';
import { AUCTIONS, REVIEWS, FAQ, TRUST, SITE } from '@/lib/data';
import { contactLink } from '@/lib/contact';
import { goTo } from '@/lib/scroll';
import { Brand } from './Header';
import Avatar from './Avatars';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function SoldTeaser() {
  const go = (e) => { e.preventDefault(); const v = new FormData(e.currentTarget).get('q'); window.location.href = `${BASE}/sold/${v ? `?q=${encodeURIComponent(v)}` : ''}`; };
  return (
    <section className="section" style={{ padding: 'clamp(40px, 6vw, 80px) 0' }}>
      <div className="container">
        <div className="teaser" data-reveal>
          <div>
            <span className="eyebrow">Історія продажів</span>
            <h2 className="h2" style={{ marginBottom: 10 }}>За скільки <span className="grad">продали це авто?</span></h2>
            <p className="lead">Введіть VIN або номер лота Copart чи IAAI — покажемо ціну продажу, дату й локацію.</p>
          </div>
          <form className="vin-form" onSubmit={go}>
            <input name="q" placeholder="VIN чи № лота …" aria-label="VIN або номер лота" autoCapitalize="characters" spellCheck="false" />
            <button type="submit" aria-label="Шукати"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg></button>
          </form>
        </div>
      </div>
    </section>
  );
}

export function Marquee() {
  const items = ['США', 'Європа', 'Copart', 'IAAI', 'Manheim', 'Підбір', 'Ремонт під ключ', 'Розмитнення', 'Доставка'];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">{[...items, ...items, ...items].map((t, i) => <span key={i}>{t}</span>)}</div>
    </div>
  );
}

export function Stats() {
  const s = [['8', '+', 'років досвіду'], ['1000', '+', 'реальних пригнаних авто'], ['95', '%', 'клієнтів по рекомендації'], ['100', '%', 'підтримка на кожному етапі']];
  return (
    <section className="section" style={{ paddingBottom: 0 }}>
      <div className="container">
        <span className="eyebrow" data-reveal>Про нас</span>
        <h2 className="h2" data-reveal style={{ maxWidth: 820 }}>Преміум-сервіс <span className="grad">без ризиків</span></h2>
        <p className="lead" data-reveal>Працюємо як ваш технічний і фінансовий партнер: перевірка лота, прогноз ремонту, логістика, розмитнення, повний фото/відео-контроль.</p>
        <div className="stats" data-stagger>
          {s.map(([n, suf, l]) => <div className="stat" key={l}><b className="grad" data-count={n} data-suffix={suf}>0</b><span>{l}</span></div>)}
        </div>
        <p className="quote" data-reveal>Ваша задача: озвучити бажання. Наша задача: привезти авто, за яке не соромно платити.</p>
      </div>
    </section>
  );
}

export function SeoText() {
  return (
    <section className="section" id="about-service" style={{ paddingTop: 0 }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <span className="eyebrow" data-reveal>Про послугу</span>
        <h2 className="h2" data-reveal>Пригін авто зі США та Європи <span className="grad">під ключ у Києві</span></h2>
        <div className="seo-text" data-reveal>
          <p>Urban Auto приганяє авто зі США та Європи під ключ: підбираємо лот на аукціонах Copart та IAAI, перевіряємо історію за VIN, визначаємо безпечну ставку, організовуємо доставку й розмитнення, а за потреби відновлюємо авто у власній команді ремонту. Ви отримуєте готовий автомобіль в Україні й допомогу з постановкою на облік.</p>
          <p>Купити авто з Америки чи з Європи вигідніше, коли всі витрати відомі наперед. Тому ми працюємо за договором, узгоджуємо платежі до їх появи, а орієнтовний бюджет можна порахувати в калькуляторі ще до ставки на аукціоні. Середній термін пригону авто — 65–85 днів залежно від аукціону, порту та маршруту.</p>
          <p>Працюємо з бензиновими, дизельними та гібридними авто, а також з електромобілями (Tesla, Ford Mustang Mach-E, Nissan Ariya, Volkswagen ID.4 та інші). Офіс у Києві: Кловський узвіз, 7А, телефон {SITE.phoneLabel}.</p>
        </div>
      </div>
    </section>
  );
}

export function Auctions() {
  return (
    <section className="section alt" id="auctions">
      <div className="container">
        <span className="eyebrow" data-reveal>Аукціони</span>
        <h2 className="h2" data-reveal>Купуємо там, де <span className="grad">найкращі ціни</span></h2>
        <p className="lead" data-reveal>Працюємо з провідними майданчиками США, Канади, Китаю та Європи й торгуємо від вашого імені.</p>
        <div className="auc-grid" data-stagger>
          {AUCTIONS.map((a) => (
            <div className="auc" key={a.name}><div className="reg">{a.region}</div><h3>{a.name}</h3><p>{a.text}</p></div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Reviews() {
  return (
    <section className="section" id="reviews">
      <div className="container">
        <span className="eyebrow" data-reveal>Відгуки</span>
        <h2 className="h2" data-reveal>Відгуки <span className="grad">клієнтів</span></h2>
        <p className="lead" data-reveal>Головна причина нашого зростання — рекомендації. Люди повертаються за другим і третім авто, бо отримують саме те, що обіцяли на старті.</p>
        <div className="rev-grid" data-stagger>
          {REVIEWS.map((r) => (
            <div className="rev" key={r.name}>
              <div className="stars">{'★'.repeat(r.stars)}</div>
              <p>«{r.text}»</p>
              <div className="who"><Avatar kind={r.avatar} name={r.name} /><div><b>{r.name}</b><span>{r.city}</span></div></div>
            </div>
          ))}
        </div>
        <div className="trust-row" data-stagger>
          {TRUST.map((t) => <div className="stat" key={t.label}><b className="grad" data-count={t.n} data-suffix={t.suffix}>0</b><span>{t.label}</span></div>)}
        </div>
        <div className="faq" data-stagger>
          <h2 className="h2 faq-title">Часті <span className="grad">питання</span></h2>
          {FAQ.map((f) => <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}
        </div>
      </div>
    </section>
  );
}

export function Contacts() {
  return (
    <section className="section alt" id="contacts">
      <div className="container">
        <div className="cta" data-reveal>
          <h2 className="h2">Готові привезти авто мрії?</h2>
          <p>Приїжджайте в офіс або залиште заявку — повернемось з консультацією протягом 15 хвилин у робочий час.</p>
          <div className="hero-cta" style={{ justifyContent: 'center' }}>
            <button className="btn" onClick={() => goTo('order')}>Залишити заявку</button>
            <a className="btn" href="https://t.me/NikitaAmerika" target="_blank" rel="noopener noreferrer">Написати в Telegram</a>
          </div>
        </div>
        <div className="contact-grid" data-stagger>
          <a className="c-card" href={`tel:${SITE.phone}`}><small>Телефон менеджера</small><b>{SITE.phoneLabel}</b></a>
          <a className="c-card" href={`https://t.me/${SITE.telegram}`} target="_blank" rel="noopener noreferrer"><small>Telegram</small><b>@{SITE.telegram}</b></a>
          <a className="c-card" href={`mailto:${SITE.email}`}><small>Email</small><b>{SITE.email}</b></a>
          <div className="c-card"><small>Офіс</small><b>{SITE.address}</b></div>
          <div className="c-card"><small>Графік роботи</small><b>Пн–Сб 10:00–19:00</b><span>Неділя — вихідний</span></div>
          <a className="c-card" href={SITE.instagram} target="_blank" rel="noopener noreferrer"><small>Instagram</small><b>@urban_auto_ua</b></a>
          <a className="c-card" href={SITE.tiktok} target="_blank" rel="noopener noreferrer"><small>TikTok</small><b>@urbanautoua</b></a>
          <a className="c-card" href={SITE.mapsLink} target="_blank" rel="noopener noreferrer"><small>Google Карти</small><b>Прокласти маршрут</b><span>Відкрити офіс на карті</span></a>
        </div>
        <div className="map" data-reveal>
          <iframe title="Карта офісу Urban Auto" loading="lazy" allowFullScreen src={SITE.mapEmbed} />
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-in">
        <Brand home={false} />
        <div className="socials">
          <a href={`https://t.me/${SITE.telegram}`} target="_blank" rel="noopener noreferrer">Telegram</a>
          <a href={SITE.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href={SITE.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a>
          <a href={SITE.mapsLink} target="_blank" rel="noopener noreferrer">Google Карти</a>
          <a href={`tel:${SITE.phone}`}>{SITE.phoneLabel}</a>
        </div>
        <span>© {new Date().getFullYear()} Urban Auto · Пригін авто під ключ</span>
      </div>
    </footer>
  );
}
