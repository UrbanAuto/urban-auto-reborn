'use client';
import Motion from './Motion';
import Header from './Header';
import CatalogBrowser from './CatalogBrowser';
import { Footer } from './Sections';

export default function CatalogPage() {
  return (
    <>
      <Motion />
      <Header home={false} />
      <main className="page-top">
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <span className="eyebrow" data-reveal>Каталог</span>
            <h1 className="h2" data-reveal>Усі автомобілі <span className="grad">з аукціонів</span></h1>
            <p className="lead" data-reveal style={{ marginBottom: 32 }}>Шукайте за маркою, моделлю, роком, VIN чи номером лота. Відкрийте лот, щоб подивитися всі фото.</p>
            <CatalogBrowser />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
