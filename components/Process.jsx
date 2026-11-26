'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STEPS } from '@/lib/data';

gsap.registerPlugin(ScrollTrigger);

const D = 'M40 330 C 120 330, 120 250, 200 250 S 300 330, 360 270 S 330 150, 260 150 S 130 190, 150 100 S 330 50, 440 60';

export default function Process() {
  const root = useRef(null);
  const pathRef = useRef(null);
  const liveRef = useRef(null);
  const truckRef = useRef(null);
  const [active, setActive] = useState(0);
  const [pts, setPts] = useState([]);

  useEffect(() => {
    const path = pathRef.current; const L = path.getTotalLength();
    setPts(STEPS.map((_, i) => { const p = path.getPointAtLength((L * i) / (STEPS.length - 1)); return { x: p.x, y: p.y }; }));
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const path = pathRef.current; const live = liveRef.current; const L = path.getTotalLength();
    gsap.set(live, { strokeDasharray: L, strokeDashoffset: L });
    const steps = gsap.utils.toArray('.step', root.current);
    const place = (p) => {
      const pt = path.getPointAtLength(L * p);
      const svg = path.ownerSVGElement; const box = svg.getBoundingClientRect();
      const m = path.getScreenCTM();
      const s = new DOMPoint(pt.x, pt.y).matrixTransform(m); // враховує «meet»-відступи SVG
      gsap.set(truckRef.current, { x: s.x - box.left, y: s.y - box.top });
      gsap.set(live, { strokeDashoffset: L * (1 - p) });
    };
    place(0);
    let cur = 0;
    const show = (i) => {
      if (i === cur) return;
      const prev = steps[cur]; const next = steps[i]; const dir = i > cur ? 1 : -1; cur = i; setActive(i);
      gsap.to(prev, { opacity: 0, y: -40 * dir, duration: 0.45, ease: 'power2.in', overwrite: true });
      gsap.fromTo(next, { opacity: 0, y: 50 * dir }, { opacity: 1, y: 0, duration: 0.7, delay: 0.15, ease: 'power3.out', overwrite: true });
    };
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: '.process-pin', start: 'top top', end: reduce ? '+=1' : '+=450%', pin: !reduce, scrub: true, anticipatePin: 1,
        onUpdate: (self) => { place(self.progress); show(Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length * 0.999))); },
      });
      gsap.to('.process-bg', { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.process', start: 'top bottom', end: 'bottom top', scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section className="process" id="process" ref={root}>
      <div className="process-pin">
        <div className="process-bg"><div className="sky" /></div>
        <div className="container">
          <div className="process-head">
            <span className="eyebrow">Як це працює</span>
            <h2 className="h2">Шлях авто — від підбору <span className="grad">до ваших ключів</span></h2>
          </div>
          <div className="story">
            <div className="story-text">
              {STEPS.map((s, i) => (
                <div className="step" key={s.n} aria-hidden={i !== active}>
                  <div className="num">{s.n}</div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <span className="tag">{s.tag}</span>
                </div>
              ))}
            </div>
            <div className="story-visual">
              <svg className="route" viewBox="0 0 480 380" preserveAspectRatio="xMidYMid meet">
                <defs><linearGradient id="fireStroke" x1="0" x2="1"><stop offset="0" stopColor="#b44848" /><stop offset=".5" stopColor="#e26a6a" /><stop offset="1" stopColor="#ffc4c4" /></linearGradient></defs>
                <path ref={pathRef} className="base" d={D} />
                <path ref={liveRef} className="live" d={D} />
                {pts.map((p, i) => (
                  <g key={i}><circle className={`node ${i <= active ? 'on' : ''}`} cx={p.x} cy={p.y} r="8" />
                    <text x={p.x + (p.x > 380 ? -14 : 14)} y={p.y - 14} textAnchor={p.x > 380 ? 'end' : 'start'}>{STEPS[i].tag}</text></g>
                ))}
              </svg>
              <div className="truck" ref={truckRef}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 15v-3l2-5h9l3 5h3v3" /><circle cx="7" cy="16" r="2" /><circle cx="17" cy="16" r="2" /></svg>
              </div>
            </div>
          </div>
        </div>
        <div className="step-dots">{STEPS.map((_, i) => <i key={i} className={i <= active ? 'on' : ''} />)}</div>
      </div>
    </section>
  );
}
