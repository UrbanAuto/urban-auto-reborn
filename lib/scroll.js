export function goTo(id) {
  const el = id === 'top' ? null : document.getElementById(id);
  const lenis = typeof window !== 'undefined' ? window.__lenis : null;
  if (lenis) lenis.scrollTo(el || 0, { offset: el ? -70 : 0, duration: 1.6 });
  else if (el) el.scrollIntoView({ behavior: 'smooth' });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
}
