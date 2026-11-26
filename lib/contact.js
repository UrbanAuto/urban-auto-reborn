import { SITE } from './data';

/** Посилання для зв’язку з менеджером (Telegram → телефон → пошта) з готовим текстом. */
export function contactLink(text, subject = 'Заявка з сайту Urban Auto') {
  if (SITE.telegram) return { href: `https://t.me/${SITE.telegram}?text=${encodeURIComponent(text)}`, external: true };
  if (SITE.phone) return { href: `tel:${SITE.phone}`, external: false };
  return { href: `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`, external: false };
}

/** Посилання для зв’язку з менеджером з готовим повідомленням про лот. */
export function managerLink(car) {
  const text = `Доброго дня! Цікавить лот: ${car.year} ${car.make} ${car.model}, ${car.auction}${car.lot ? ` №${car.lot}` : ''}${car.id ? ` (VIN/ID ${car.id})` : ''}, поточна ставка $${car.bid}. Підкажіть, будь ласка, вартість «під ключ» і умови.`;
  return contactLink(text, `Лот ${car.auction} №${car.lot}: ${car.make} ${car.model}`);
}
