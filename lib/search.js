import { MAKES } from './data';

const norm = (s) => s.toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
const ALIAS = { vw: 'Volkswagen', chevy: 'Chevrolet', merc: 'Mercedes-Benz', mercedes: 'Mercedes-Benz', benz: 'Mercedes-Benz', landrover: 'Land Rover', alfa: 'Alfa Romeo', aston: 'Aston Martin' };

/**
 * Відокремлює марку на початку пошукового запиту: «alfa» → { make: 'Alfa Romeo', rest: '' },
 * «toyota camry» → { make: 'Toyota', rest: 'camry' }, «camry» → { make: '', rest: 'camry' }.
 * VIN і номери лотів не збігаються з жодною маркою, тож лишаються як є.
 */
export function splitMakeQuery(q) {
  const text = norm(q || '');
  if (!text) return { make: '', rest: '' };
  const words = text.split(' ');
  for (let n = Math.min(2, words.length); n >= 1; n--) {
    const head = words.slice(0, n).join(' ');
    const make = MAKES.find((m) => norm(m) === head) || ALIAS[head] || (head.length >= 3 ? MAKES.find((m) => norm(m).startsWith(head)) : null);
    if (make) return { make, rest: words.slice(n).join(' ') };
  }
  return { make: '', rest: q.trim() };
}

// \b у JS не працює з кирилицею, тому межі слів — через lookaround по літерах Unicode
const W = (words) => new RegExp(`(?<![\\p{L}])(?:${words})(?![\\p{L}])`, 'giu');
const INTENT_WORDS = {
  onsite: W('по місцю|по місці|на місці|в наявності|у наявності|наявні|наявність'),
  transit: W('в дорозі|у дорозі|в дорогу|дорозі|транзит'),
};

/** Знаходить у запиті слова «по місцю» / «в дорозі» і повертає решту запиту для звичайного пошуку. */
export function detectIntent(q) {
  let rest = String(q || ''); const kinds = [];
  for (const [kind, re] of Object.entries(INTENT_WORDS)) {
    re.lastIndex = 0;
    if (re.test(rest)) { kinds.push(kind); rest = rest.replace(re, ' '); }
  }
  if (kinds.length) rest = rest.replace(W('авто|автомобіль|автомобілі|машина|машини'), ' '); // загальні слова не шукаємо як марку
  return { kinds, rest: rest.replace(/\s+/g, ' ').trim() };
}
