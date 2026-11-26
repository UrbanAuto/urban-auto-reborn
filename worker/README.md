# Пошук проданих лотів і каталог: Cloudflare Worker

Сайт статичний, тому ключ Apibara не можна класти в код сторінки. Worker приймає запити (`/lot?q=VIN_або_лот`, `/vehicles?...`),
додає секретний ключ, викликає Apibara і кешує результат.

## Розгортання (безкоштовний план Cloudflare)
1. Створіть акаунт на https://dash.cloudflare.com та Worker (Workers & Pages → Create → Hello World)
   або використайте вже розгорнутий Worker із сайту Titan Cargo.
2. Вставте вміст `sold-search.js` у код Worker і натисніть Deploy.
3. Settings → Variables and Secrets:
   - Secret `APIBARA_KEY` — ваш ключ Apibara (вводите самі, нікому не надсилайте).
   - Variable `ALLOWED_ORIGINS` = `https://urbanauto.github.io` (і ваш домен, якщо буде; через кому).
4. Скопіюйте адресу Worker (на кшталт `https://urban-auto-sold-search.<ваш-акаунт>.workers.dev`).
5. У репозиторії GitHub: Settings → Secrets and variables → Actions:
   - Variables → `SOLD_API_URL` = адреса Worker;
   - Secrets → `APIBARA_KEY` — той самий ключ (потрібен для щоденного оновлення `public/data/cars.json`).
   Без них каталог показує збережені дані, а пошук проданих працює в демо-режимі.
