# Бот заявок: сайт → Telegram-група

Cloudflare Worker приймає заявку з форми «Підбір авто» і надсилає її ботом у Telegram-групу.
Токен бота лежить лише в секретах Cloudflare, у код сайту він не потрапляє.

## 1. Створіть бота й групу
1. У Telegram відкрийте **@BotFather** → `/newbot` → вкажіть назву й логін → отримаєте **токен** (нікому його не показуйте).
2. Створіть групу для заявок і додайте туди бота (як учасника; для груп із темами — дайте право писати).
3. Дізнайтеся id групи: напишіть щось у групі, відкрийте
   `https://api.telegram.org/bot<ТОКЕН>/getUpdates` — у відповіді знайдіть `"chat":{"id":-100…}`. Це **TELEGRAM_CHAT_ID**.

## 2. Розгорніть Worker
```bash
cd lead-bot
npx wrangler login
npx wrangler secret put TELEGRAM_BOT_TOKEN      # вставте токен
npx wrangler deploy
```
У `wrangler.toml` розкоментуйте й заповніть `TELEGRAM_CHAT_ID` (або додайте змінну в панелі Cloudflare:
Workers → urban-auto-lead-bot → Settings → Variables). Якщо в групі ввімкнені теми, додайте `TELEGRAM_THREAD_ID`.
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
