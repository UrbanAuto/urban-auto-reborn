// Ілюстровані аватарки для відгуків (власні SVG, не фото реальних людей): машина, природа, люди.
// Частина відгуків лишається з літерою: аватарки є не в усіх.
const BG = {
  car: ['#1b1f2b', '#cc5252'],
  mountain: ['#9fb4d6', '#f4d9c6'],
  forest: ['#2f5d50', '#a9cfa0'],
  sea: ['#2a6f97', '#bfe3f0'],
  woman: ['#e8c9c9', '#b44848'],
  man: ['#c9d3e8', '#353845'],
};

function Scene({ kind }) {
  switch (kind) {
    case 'car':
      return (
        <g transform="translate(30 12) scale(.62)">
          <path d="M10 68 C10 60 16 57 26 55 L40 40 C46 35 56 33 70 33 L96 33 C106 33 113 39 120 48 L136 54 C142 56 146 61 146 68 L146 76 L10 76 Z" fill="#fff" opacity=".92" />
          <path d="M44 42 L58 36 L80 36 L80 52 L38 52 Z M86 36 L98 36 C104 36 109 41 114 48 L114 52 L86 52 Z" fill="#1b1f2b" opacity=".75" />
          <circle cx="40" cy="76" r="10" fill="#12141b" stroke="#fff" strokeWidth="3" />
          <circle cx="116" cy="76" r="10" fill="#12141b" stroke="#fff" strokeWidth="3" />
        </g>
      );
    case 'mountain':
      return (
        <>
          <circle cx="104" cy="34" r="12" fill="#fff" opacity=".9" />
          <path d="M0 92 L38 40 L62 70 L84 46 L130 92 Z" fill="#5d7aa6" />
          <path d="M38 40 L50 56 L44 54 L38 60 L32 52 Z" fill="#fff" opacity=".85" />
          <path d="M60 92 L98 58 L156 92 Z" fill="#3f5a85" />
        </>
      );
    case 'forest':
      return (
        <>
          <circle cx="40" cy="30" r="10" fill="#fff6c9" opacity=".9" />
          {[[30, 70, 1], [62, 60, 1.25], [96, 68, 1.05], [124, 62, 1.2]].map(([x, y, s], i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
              <path d="M0 -34 L14 -8 L8 -8 L18 12 L-18 12 L-8 -8 L-14 -8 Z" fill="#1f4a3c" />
              <rect x="-2.5" y="12" width="5" height="9" fill="#5b4636" />
            </g>
          ))}
        </>
      );
    case 'sea':
      return (
        <>
          <circle cx="110" cy="34" r="13" fill="#fff6c9" opacity=".95" />
          <path d="M0 62 C20 54 36 70 56 62 S96 54 116 62 S146 70 160 62 L160 92 L0 92 Z" fill="#1f5a80" opacity=".85" />
          <path d="M0 76 C20 68 36 84 56 76 S96 68 116 76 S146 84 160 76 L160 92 L0 92 Z" fill="#164a6b" />
        </>
      );
    case 'woman':
      return (
        <>
          <path d="M40 92 C40 70 56 62 80 62 C104 62 120 70 120 92 Z" fill="#fff" opacity=".92" />
          <path d="M54 44 C54 24 66 16 80 16 C94 16 106 24 106 44 L106 58 C100 52 98 40 80 38 C62 40 60 52 54 58 Z" fill="#5b3a3a" />
          <circle cx="80" cy="46" r="17" fill="#f6d8c4" />
        </>
      );
    case 'man':
      return (
        <>
          <path d="M36 92 C36 70 54 62 80 62 C106 62 124 70 124 92 Z" fill="#fff" opacity=".92" />
          <circle cx="80" cy="44" r="18" fill="#efc9ae" />
          <path d="M62 38 C62 24 72 20 80 20 C90 20 98 24 98 38 C92 32 68 32 62 38 Z" fill="#3b2f2a" />
        </>
      );
    default:
      return null;
  }
}

export default function Avatar({ kind, name, size = 46 }) {
  if (!kind) return <div className="avatar" style={{ width: size, height: size }}>{name[0]}</div>;
  const [a, b] = BG[kind];
  const id = `av-${kind}-${name}`;
  return (
    <div className="avatar avatar-img" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 160 92" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
        <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient></defs>
        <rect width="160" height="92" fill={`url(#${id})`} />
        <Scene kind={kind} />
      </svg>
    </div>
  );
}
