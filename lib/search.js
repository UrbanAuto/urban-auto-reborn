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
