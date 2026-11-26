export default function CarSvg({ id = 'c', body = 'Седан' }) {
  const paths = {
    'Седан': 'M12 92 C12 80 22 76 40 72 L72 50 C84 42 100 38 128 38 L196 38 C218 38 232 48 248 62 L280 70 C292 73 298 80 298 92 L298 100 L12 100 Z',
    'Кросовер': 'M12 92 C12 78 20 74 36 70 L66 42 C74 36 90 32 118 32 L218 32 C238 32 248 42 258 56 L284 66 C294 70 298 78 298 92 L298 100 L12 100 Z',
    'Купе': 'M12 94 C12 84 22 80 44 76 L96 52 C108 46 124 44 146 44 L190 46 C214 48 236 62 262 72 C286 78 298 84 298 94 L298 100 L12 100 Z',
  };
  const d = paths[body] || paths['Седан'];
  return (
    <svg viewBox="0 0 310 120" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1b1f2b" /><stop offset=".35" stopColor="#353845" />
          <stop offset=".7" stopColor="#b44848" /><stop offset="1" stopColor="#d95b5b" />
        </linearGradient>
      </defs>
      <path d={d} stroke={`url(#g${id})`} strokeWidth="3" strokeLinejoin="round" fill="rgba(180,72,72,.1)" />
      <path d="M78 52 L104 40 L150 40 L150 70 L70 70 Z" stroke="rgba(27,31,43,.3)" strokeWidth="1.5" fill="rgba(255,255,255,.55)" />
      <path d="M158 40 L196 40 C208 40 218 48 228 62 L228 70 L158 70 Z" stroke="rgba(27,31,43,.3)" strokeWidth="1.5" fill="rgba(255,255,255,.55)" />
      <circle cx="68" cy="100" r="17" fill="#1b1f2b" stroke={`url(#g${id})`} strokeWidth="3" />
      <circle cx="68" cy="100" r="6" fill="#cc5252" />
      <circle cx="244" cy="100" r="17" fill="#1b1f2b" stroke={`url(#g${id})`} strokeWidth="3" />
      <circle cx="244" cy="100" r="6" fill="#cc5252" />
      <path d="M290 84 L298 84" stroke="#cc5252" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
