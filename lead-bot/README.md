# Бот заявок: сайт → Telegram-група

Cloudflare Worker приймає заявку з форми «Підбір авто» і надсилає її ботом у Telegram-групу.
Токен бота лежить лише в секретах Cloudflare, у код сайту він не потрапляє.

## 1. Бот і група (вже створені)
- Бот: **@UrbanAutoLeads_bot** («Urban Auto Заявки»). Токен лежить у чаті з @BotFather (команда `/token`).
- Група: **«Urban Auto — заявки»**, id `-5599343646` (уже вписаний у `wrangler.toml`). Бот у ній є.
  Додайте в групу менеджерів. Якщо групу перетворять на супергрупу, її id зміниться на `-100…`:
  тоді дізнайтеся новий через `https://api.telegram.org/bot<ТОКЕН>/getUpdates` і оновіть `TELEGRAM_CHAT_ID`.

## 2. Розгорніть Worker
```bash
cd lead-bot
npx wrangler login
npx wrangler secret put TELEGRAM_BOT_TOKEN      # вставте токен
npx wrangler deploy
```
Якщо в групі ввімкнені теми, додайте `TELEGRAM_THREAD_ID`.
Після `deploy` отримаєте адресу на кшталт `https://urban-auto-lead-bot.<акаунт>.workers.dev`.

## 3. Підключіть сайт
GitHub → репозиторій → Settings → Secrets and variables → Actions → **Variables** → `LEAD_API_URL` = адреса Worker
(без `/lead` наприкінці) → запустіть деплой (Actions → Deploy → Run workflow).
Без цієї змінної форма, як і раніше, відкриває Telegram менеджера.

## Перевірка
```bash
curl -X POST https://<адреса-worker>/lead -H "Origin: https://urbanauto.github.io" \
  -H "Content-Type: application/json" -d '{"name":"Тест","phone":"+380501234567","make":"Toyota","model":"RAV4"}'
```
