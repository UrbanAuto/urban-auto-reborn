export const SITE = {
  name: 'URBAN AUTO',
  email: 'urbanauto66@gmail.com',
  address: 'м. Київ, Кловський узвіз, 7А',
  hours: 'Пн–Сб 10:00–19:00, Нд — вихідний',
  instagram: 'https://www.instagram.com/urban_auto_ua/',
  tiktok: 'https://www.tiktok.com/@urbanautoua',
  mapsLink: 'https://www.google.com/maps/search/?api=1&query=Urban+Auto+%D0%9A%D0%BB%D0%BE%D0%B2%D1%81%D1%8C%D0%BA%D0%B8%D0%B9+%D1%83%D0%B7%D0%B2%D1%96%D0%B7+7%D0%B0+%D0%9A%D0%B8%D1%97%D0%B2',
  original: 'https://urban-auto.com.ua/',
  mapEmbed: 'https://www.google.com/maps?q=%D0%9A%D0%BB%D0%BE%D0%B2%D1%81%D1%8C%D0%BA%D0%B8%D0%B9%20%D1%83%D0%B7%D0%B2%D1%96%D0%B7%207%D0%90%2C%20%D0%9A%D0%B8%D1%97%D0%B2&output=embed',
  // Контакти менеджера: кнопка «Зв’язатися з менеджером» відкриває Telegram (або телефон, якщо логін порожній)
  telegram: 'IvanUrbanAuto', // логін менеджера без @
  phone: '+380664951570',
  phoneLabel: '+380 66 495 15 70',
  bot: 'UrbanAutoLeads_bot', // бот заявок: записує в групу, що саме обрав клієнт
};

export const NAV = [
  { id: 'catalog', label: 'Каталог', page: '/catalog/' },
  { id: 'sold', label: 'Продані лоти', page: '/sold/' },
  { id: 'order', label: 'Підбір авто' },
  { id: 'calc', label: 'Калькулятор' },
  { id: 'process', label: 'Як це працює' },
  { id: 'repair', label: 'Ремонт' },
  { id: 'cases', label: 'Кейси' },
  { id: 'reviews', label: 'Відгуки' },
  { id: 'contacts', label: 'Контакти' },
];

export const COUNTRIES = [
  { id: 'all', label: 'Усі' },
  { id: 'usa', label: 'США' },
  { id: 'canada', label: 'Канада' },
  { id: 'europe', label: 'Європа' },
];

// Приклади лотів (без фото — демонстраційні дані на випадок, якщо cars.json недоступний)
export const CARS = [
  { id: 1, make: 'Tesla', model: 'Model 3 Long Range', year: 2021, km: 48000, fuel: 'Електро', engine: '75 kWh', country: 'usa', price: 17800, auction: 'Copart', body: 'Седан' },
  { id: 2, make: 'Toyota', model: 'RAV4 Hybrid', year: 2020, km: 61000, fuel: 'Гібрид', engine: '2.5', country: 'usa', price: 19400, auction: 'IAAI', body: 'Кросовер' },
  { id: 3, make: 'BMW', model: 'X5 xDrive40i', year: 2019, km: 72000, fuel: 'Бензин', engine: '3.0', country: 'europe', price: 29900, auction: 'Autoscout24', body: 'Кросовер' },
  { id: 4, make: 'Ford', model: 'Mustang GT', year: 2018, km: 54000, fuel: 'Бензин', engine: '5.0', country: 'usa', price: 21500, auction: 'Copart', body: 'Купе' },
  { id: 5, make: 'Honda', model: 'CR-V Touring', year: 2021, km: 39000, fuel: 'Бензин', engine: '1.5', country: 'canada', price: 18600, auction: 'Copart CA', body: 'Кросовер' },
  { id: 6, make: 'Audi', model: 'Q5 Premium', year: 2020, km: 58000, fuel: 'Дизель', engine: '2.0', country: 'europe', price: 26300, auction: 'Mobile.de', body: 'Кросовер' },
  { id: 7, make: 'Hyundai', model: 'Tucson Limited', year: 2022, km: 27000, fuel: 'Бензин', engine: '2.5', country: 'canada', price: 17200, auction: 'IAAI', body: 'Кросовер' },
  { id: 8, make: 'Chevrolet', model: 'Bolt EUV', year: 2022, km: 22000, fuel: 'Електро', engine: '65 kWh', country: 'usa', price: 12900, auction: 'Copart', body: 'Кросовер' },
  { id: 9, make: 'Mercedes-Benz', model: 'GLC 300', year: 2019, km: 66000, fuel: 'Бензин', engine: '2.0', country: 'europe', price: 27800, auction: 'Autoscout24', body: 'Кросовер' },
];

export const MAKES = [
  'Acura', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler', 'Dodge', 'Ferrari', 'Fiat', 'Ford',
  'Genesis', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 'Jeep', 'Kia', 'Lamborghini', 'Land Rover', 'Lexus', 'Lincoln', 'Maserati', 'Mazda',
  'Mercedes-Benz', 'Mini', 'Mitsubishi', 'Nissan', 'Polestar', 'Porsche', 'Ram', 'Rivian', 'Subaru', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo',
];

// «Як це працює» — 6 етапів (тексти з urban-auto.com.ua)
export const STEPS = [
  { n: '01', title: 'Підбір', text: 'Формуємо технічне ТЗ: бюджет, бренд, клас, комплектація, ризики та ліквідність на вторинному ринку.', tag: 'Підбір' },
  { n: '02', title: 'Аукціон / покупка', text: 'Перевіряємо історію, пробіг, пошкодження, продажну статистику і визначаємо безпечну ставку.', tag: 'Аукціон' },
  { n: '03', title: 'Доставка', text: 'Організовуємо логістику, бронювання контейнера та контроль переміщення на кожному етапі.', tag: 'Доставка' },
  { n: '04', title: 'Розмитнення', text: 'Готуємо пакет документів і робимо чесний прорахунок платежів до входу авто в Україну.', tag: 'Митниця' },
  { n: '05', title: 'Ремонт під ключ', text: 'Кузовні роботи, фарбування, запчастини, електрика, ходова, діагностика і фінальний контроль якості.', tag: 'Ремонт' },
  { n: '06', title: 'Видача / реєстрація', text: 'Передаємо готовий автомобіль, допомагаємо з постановкою на облік та фінальними документами.', tag: 'Видача' },
];

export const SERVICES = [
  { icon: '🚘', title: 'Кузовні роботи', text: 'Відновлення після ДТП, рихтування, заміна елементів та контроль геометрії.' },
  { icon: '🎨', title: 'Фарбування', text: 'Підбір кольору, локальні та комплексні роботи, захисні покриття.' },
  { icon: '📦', title: 'Запчастини', text: 'Підбір оптимальних запчастин за ціною/якістю з прогнозом термінів.' },
  { icon: '🧰', title: 'Підвіска і ходова', text: 'Повна ревізія вузлів, заміна зношених деталей, тест-драйв і повторний контроль.' },
  { icon: '⚡', title: 'Електрика', text: 'Діагностика блоків, датчиків, систем безпеки та усунення прихованих помилок.' },
  { icon: '✨', title: 'Підготовка до продажу', text: 'Детейлінг, хімчистка, фінальні фото та прозорий звіт по виконаних роботах.' },
];

// Приклади пригнаних авто (з urban-auto.com.ua)
export const CASES = [
  { name: 'Tesla Model 3', year: 2021, auction: 'IAAI', city: 'Київ', days: 72, saved: 7400, tags: ['electro', 'sedan'], img: 'tesla-model-3', pos: 'center 56%' },
  { name: 'BMW X3', year: 2020, auction: 'Copart', city: 'Львів', days: 78, saved: 6800, tags: ['petrol', 'crossover'], img: 'bmw-x3' },
  { name: 'Volkswagen Passat', year: 2019, auction: 'Copart', city: 'Київ', days: 68, saved: 5100, tags: ['petrol', 'sedan'], img: 'vw-passat' },
  { name: 'Ford Mustang Mach-E', year: 2022, auction: 'IAAI', city: 'Одеса', days: 81, saved: 8300, tags: ['electro', 'crossover'], img: 'mustang-mach-e' },
  { name: 'Hyundai Tucson', year: 2021, auction: 'Copart', city: 'Дніпро', days: 70, saved: 4900, tags: ['petrol', 'crossover'], img: 'hyundai-tucson' },
  { name: 'Audi A4', year: 2020, auction: 'IAAI', city: 'Київ', days: 74, saved: 6000, tags: ['petrol', 'sedan'], img: 'audi-a4' },
  { name: 'Nissan Ariya', year: 2023, auction: 'Copart', city: 'Харків', days: 79, saved: 7700, tags: ['electro', 'crossover'], img: 'nissan-ariya' },
  { name: 'Mazda CX-5', year: 2020, auction: 'IAAI', city: 'Київ', days: 66, saved: 5300, tags: ['petrol', 'crossover'], img: 'mazda-cx5' },
  { name: 'Polestar 2', year: 2022, auction: 'Copart', city: 'Одеса', days: 82, saved: 7950, tags: ['electro', 'sedan'], img: 'polestar-2' },
  { name: 'Mercedes C300', year: 2019, auction: 'IAAI', city: 'Київ', days: 75, saved: 6450, tags: ['petrol', 'sedan'], img: 'mercedes-c300' },
  { name: 'Toyota RAV4', year: 2021, auction: 'Copart', city: 'Вінниця', days: 69, saved: 5600, tags: ['petrol', 'crossover'], img: 'toyota-rav4' },
  { name: 'Volkswagen ID.4', year: 2022, auction: 'IAAI', city: 'Львів', days: 77, saved: 8050, tags: ['electro', 'crossover'], img: 'vw-id4' },
];

export const CASE_FILTERS = [
  { id: 'all', label: 'Усі' },
  { id: 'electro', label: 'Електро' },
  { id: 'petrol', label: 'Бензин' },
  { id: 'crossover', label: 'Кросовер' },
  { id: 'sedan', label: 'Седан' },
];

export const BEFORE_AFTER = [
  { title: 'Audi A4', before: 'ba-audi-old', after: 'ba-audi-new' },
  { title: 'Jeep Cherokee', before: 'ba-jeep-old', after: 'ba-jeep-new' },
];

export const USP = [
  { icon: '🗓️', title: '8+ років досвіду', text: 'Сформовані постачальники, перевірені маршрути і зрозумілі терміни виконання.' },
  { icon: '📑', title: 'Прозора схема роботи', text: 'Договір, фінансова звітність, узгодження витрат до їх появи.' },
  { icon: '🧑‍🔧', title: 'Власна команда ремонту', text: 'Керуємо якістю напряму, а не через посередників і випадкові СТО.' },
  { icon: '🧾', title: 'Перевірка авто до ставки', text: 'VIN-звіти, фотоархів, прогноз бюджету відновлення, оцінка ліквідності.' },
  { icon: '🌍', title: 'Контроль логістики', text: 'Від порту до майданчика в Україні — ви бачите статус і терміни в процесі.' },
  { icon: '💬', title: 'Супровід до обліку', text: 'Не залишаємо після доставки: документи, консультації, постановка на облік.' },
];

export const AUCTIONS = [
  { name: 'Copart', region: 'США · Канада', text: 'Найбільший онлайн-аукціон авто після ДТП і чистих лотів. Тисячі машин щодня.', hue: 0 },
  { name: 'IAAI', region: 'США · Канада', text: 'Insurance Auto Auctions — страхові лоти, лізингові повернення та авто з відновлення.', hue: 1 },
  { name: 'Manheim', region: 'США', text: 'Закритий дилерський майданчик: лізингові та корпоративні авто у відмінному стані.', hue: 2 },
  { name: 'Канада', region: 'Північна Америка', text: 'Перевірені канадські майданчики — вигідні лоти з меншою конкуренцією.', hue: 0 },
  { name: 'Європа', region: 'Німеччина · Польща · Литва', text: 'Європейські майданчики та дилери з підтвердженою історією авто.', hue: 1 },
  { name: 'Китай', region: 'Азія', text: 'Перевірені майданчики Китаю, зокрема для електромобілів, з підтвердженою історією.', hue: 2 },
];

export const REVIEWS = [
  { name: 'Андрій', avatar: 'car', city: 'Київ', text: 'Привезли Tesla без сюрпризів по ремонту. Кожен етап з фото і цифрами, все по плану.', stars: 5 },
  { name: 'Олена', avatar: 'woman', city: 'Львів', text: 'Брала авто дистанційно. Пояснили кожен ризик, на виході зекономила понад $6 000.', stars: 5 },
  { name: 'Максим', avatar: 'mountain', city: 'Одеса', text: 'Ремонт зробили краще, ніж очікував. Під ключ означає реально під ключ.', stars: 5 },
  { name: 'Ігор', avatar: 'man', city: 'Дніпро', text: 'Купував BMW X3. Прозорий договір і чесна калькуляція без прихованих доплат.', stars: 5 },
  { name: 'Катерина', city: 'Київ', text: 'Швидко, професійно, без тиску. Отримала повну консультацію до покупки.', stars: 5 },
  { name: 'Роман', city: 'Вінниця', text: 'Замовляю вже другу машину через команду. Дуже сильний сервіс та відповідальність.', stars: 5 },
];

export const TRUST = [
  { n: '95', suffix: '%', label: 'по рекомендаціях' },
  { n: '62', suffix: '%', label: 'повторні замовлення' },
  { n: '100', suffix: '%', label: 'підтримка на кожному етапі' },
];

export const FAQ = [
  { q: 'Скільки в середньому триває пригін авто?', a: 'У середньому 65–85 днів залежно від аукціону, порту, сезону і маршруту доставки.' },
  { q: 'Чи можна замовити пригін без ремонту?', a: 'Так, можемо передати авто в стані «як прибуло», але зазвичай вигідніше робити під ключ.' },
  { q: 'Як ви перевіряєте автомобіль перед покупкою?', a: 'Використовуємо VIN-звіти, аналіз фото, історію торгів, ризики по пошкодженнях і ринкові ціни.' },
  { q: 'З якими аукціонами працюєте?', a: 'Copart, IAAI, Manheim (закритий майданчик США), а також перевірені майданчики Канади, Китаю та Європи з підтвердженою історією.' },
  { q: 'Що з гарантіями?', a: 'Фіксуємо обсяг робіт у договорі, надаємо звітність та підтвердження витрат.' },
  { q: 'Як проходить оплата?', a: 'Поетапно: страховий депозит, торги лота, логістика, митні платежі, ремонт.' },
  { q: 'Чи допомагаєте з постановкою на облік?', a: 'Так, супроводжуємо до отримання номерів та повного пакету документів.' },
  { q: 'Чи працюєте з електромобілями?', a: 'Так, маємо окрему експертизу по EV: батарея, стан модулів, електросистеми.' },
  { q: 'Чи можна замовити авто під перепродаж?', a: 'Так, розраховуємо модель з урахуванням ліквідності та ринкової маржі.' },
  { q: 'Чи можлива дистанційна співпраця?', a: 'Повністю. Всі ключові етапи підтверджуються фото, відео і документами онлайн.' },
];
