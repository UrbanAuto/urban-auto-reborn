import { SITE, FAQ } from './data';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';
// Головна адреса сайту: змінна SITE_URL у GitHub (власний домен) або адреса GitHub Pages
export const ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).origin : 'https://urbanauto.github.io');
export const SITE_URL = `${ORIGIN}${BASE}`;
export const url = (path = '/') => `${SITE_URL}${path}`;

export const TITLE = 'Urban Auto — пригін авто з США та Європи під ключ | Київ';
export const DESCRIPTION = 'Пригін авто з США та Європи під ключ: підбір на Copart та IAAI, доставка, розмитнення і ремонт у власній команді. Орієнтовний калькулятор, каталог лотів, договір і прозорі витрати. Офіс у Києві.';

/** Дані про компанію для Google (картка організації, пошук по місту) */
export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['AutoDealer', 'LocalBusiness'],
    '@id': `${SITE_URL}/#organization`,
    name: 'Urban Auto',
    description: DESCRIPTION,
    url: `${SITE_URL}/`,
    logo: url('/img/logo.png'),
    image: url('/img/og.png'),
    telephone: SITE.phone,
    email: SITE.email,
    priceRange: '$$',
    address: { '@type': 'PostalAddress', streetAddress: 'Кловський узвіз, 7А', addressLocality: 'Київ', addressCountry: 'UA' },
    areaServed: { '@type': 'Country', name: 'Україна' },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:00', closes: '19:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '10:00', closes: '16:00' },
    ],
    sameAs: [SITE.instagram, `https://t.me/${SITE.telegram}`],
  };
}

export function faqLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}
