'use client';
import Motion from './Motion';
import Header from './Header';
import Hero from './Hero';
import Catalog from './Catalog';
import Order from './Order';
import Calculator from './Calculator';
import Process from './Process';
import { Repair, Cases, WhyUs, LiveCars } from './Extras';
import { Marquee, Stats, SoldTeaser, Auctions, Reviews, Contacts, Footer } from './Sections';

export default function Site() {
  const search = (f) => {
    const p = new URLSearchParams();
    Object.entries(f).forEach(([k, v]) => { if (v && v !== 'all') p.set(k, v); });
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/catalog/${p.toString() ? `?${p}` : ''}`;
  };
  return (
    <>
      <Motion />
      <Header />
      <main id="top">
        <Hero onSearch={search} />
        <Marquee />
        <Stats />
        <Catalog />
        <LiveCars />
        <SoldTeaser />
        <Order />
        <Calculator />
        <Process />
        <Repair />
        <Cases />
        <WhyUs />
        <Auctions />
        <Reviews />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}
