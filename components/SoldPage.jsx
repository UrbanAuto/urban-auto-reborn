'use client';
import Motion from './Motion';
import Header from './Header';
import SoldSearch from './SoldSearch';
import { Footer } from './Sections';

export default function SoldPage() {
  return (
    <>
      <Motion />
      <Header home={false} />
      <main className="page-top">
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container" style={{ maxWidth: 900 }}>
            <span className="eyebrow" data-reveal>Історія продажів</span>
            <h1 className="h2" data-reveal>Пошук <span className="grad">проданих лотів</span></h1>
            <p className="lead" data-reveal style={{ marginBottom: 30 }}>Введіть VIN або номер лота Copart чи IAAI — покажемо, за скільки продано, де був лот і в якому стані.</p>
            <SoldSearch />
            <p className="note">Дані надані сторонніми сервісами й мають інформаційний характер. Ціна продажу не включає збори аукціону, доставку та митні платежі.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
