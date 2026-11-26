'use client';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/** Smooth scroll (Lenis) + scroll-triggered reveal / parallax / counters / progress bar. */
export default function Motion() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lenis;
    if (!reduce) {
      lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      window.__lenis = lenis;
    }

    const ctx = gsap.context(() => {
      // Scroll progress bar
      gsap.to('.progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.2 } });

      // Header state
      ScrollTrigger.create({ start: 60, end: 'max', onUpdate: (s) => document.querySelector('.header')?.classList.toggle('scrolled', s.scroll() > 60) });

      if (reduce) return;

      const hasHero = !!document.querySelector('.hero');
      // Hero intro (split lines)
      if (hasHero) {
      gsap.from('.hero h1 .line > span', { yPercent: 115, duration: 1.2, ease: 'power4.out', stagger: 0.12, delay: 0.15 });
      gsap.from('.hero-intro', { y: 30, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 0.6 });
      }

      // Reveal animations
      const reveal = (sel, from) => gsap.utils.toArray(sel).forEach((el) => {
        const delay = parseFloat(el.dataset.delay || 0);
        gsap.to(el, { opacity: 1, x: 0, y: 0, duration: 1.1, delay, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      });
      reveal('[data-reveal]'); reveal('[data-reveal-left]'); reveal('[data-reveal-right]');

      // Stagger groups
      gsap.utils.toArray('[data-stagger]').forEach((group) => {
        const kids = group.querySelectorAll(':scope > *');
        gsap.fromTo(kids, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: group, start: 'top 85%', once: true } });
      });

      // Parallax
      gsap.utils.toArray('[data-parallax]').forEach((el) => {
        const speed = parseFloat(el.dataset.parallax);
        gsap.to(el, { yPercent: speed * 100, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
      if (hasHero) {
      gsap.to('.hero-mark', { yPercent: -18, rotate: 4, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero-in', { yPercent: -12, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'center top', end: 'bottom top', scrub: true } });
      }

      // Marquee scroll-driven
      if (document.querySelector('.marquee')) gsap.to('.marquee-track', { xPercent: -30, ease: 'none', scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: 0.6 } });

      // Counters
      gsap.utils.toArray('[data-count]').forEach((el) => {
        const end = parseFloat(el.dataset.count); const suffix = el.dataset.suffix || '';
        const o = { v: 0 };
        gsap.to(o, { v: end, duration: 2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString('uk-UA') + suffix; } });
      });
    });

    // Перерахунок позицій, коли змінюється висота сторінки (каталог, шрифти, «Показати ще»)
    let t; let lastH = document.body.scrollHeight;
    const ro = new ResizeObserver(() => {
      if (Math.abs(document.body.scrollHeight - lastH) < 4) return;
      lastH = document.body.scrollHeight; clearTimeout(t); t = setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    ro.observe(document.body);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    return () => {
      window.removeEventListener('load', onLoad);
      ro.disconnect(); clearTimeout(t);
      ctx.revert();
      lenis?.destroy();
      window.__lenis = undefined;
    };
  }, []);
  return <div className="progress" />;
}
