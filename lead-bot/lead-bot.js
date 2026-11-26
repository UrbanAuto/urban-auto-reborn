// Cloudflare Worker: приймає заявки з форми сайту й надсилає їх у Telegram-групу через бота.
//   POST /lead   JSON → повідомлення в групу
//   GET  /       → "ok" (перевірка, що Worker живий)
// Змінні (Settings → Variables and Secrets):
//   TELEGRAM_BOT_TOKEN  (Secret)  токен від @BotFather
//   TELEGRAM_CHAT_ID    (Variable) id групи, напр. -1001234567890
//   ALLOWED_ORIGINS     (Variable) домени сайту через кому, напр. https://urbanauto.github.io
//   TELEGRAM_THREAD_ID  (Variable, необов’язково) id теми, якщо в групі ввімкнені Topics

const esc = (s) => String(s ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
const clip = (v, n) => String(v ?? '').trim().slice(0, n);

function cors(req, env) {
  const origin = req.headers.get('Origin') || '';
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  const ok = allowed.includes(origin);
  return {
    ok,
    headers: {
      ...(ok ? { 'Access-Control-Allow-Origin': origin } : {}),
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
    },
  };
}

const json = (obj, status, headers) => new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...headers } });

export function formatLead(d) {
  const kind = d.type === 'consult' ? '📞 Запис на консультацію' : '🚗 Нова заявка на підбір авто';
  const car = [d.make, d.model].map((x) => clip(x, 60)).filter(Boolean).join(' ');
  const rows = [
    ['👤 Ім’я', d.name],
    ['📱 Телефон', d.phone],
    ['🚘 Авто', car],
    ['🌍 Країна', d.country],
    ['📅 Рік від', d.year],
    ['💰 Бюджет до', d.budget ? `$${d.budget}` : ''],
    ['🛠 Ремонт під ключ', d.repair ? 'так' : 'ні'],
    ['💬 Побажання', d.note],
  ].filter(([, v]) => v);
  const time = new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  return `<b>${kind}</b>\n\n${rows.map(([k, v]) => `${k}: <b>${esc(v)}</b>`).join('\n')}\n\n<i>Сайт Urban Auto · ${time}</i>`;
}


// ---------- Telegram-бот: клієнт натискає кнопку на сайті → відкривається бот → вибір записується в групу ----------
const token = (env) => (String(env.TELEGRAM_BOT_TOKEN || '').match(/\d+:[A-Za-z0-9_-]+/) || [''])[0];
const tg = (env, method, body) => fetch(`https://api.telegram.org/bot${token(env)}/${method}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

// Секрет вебхука виводиться з токена, окремої змінної не потрібно
async function hookSecret(env) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`webhook:${token(env)}`));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 48);
}

const INTENTS = {
  transit: '🚢 Шукає авто в дорозі',
  onsite: '📍 Цікавить авто по місцю',
};

const who = (u) => `<a href="tg://user?id=${u.id}">${esc([u.first_name, u.last_name].filter(Boolean).join(' ') || 'Клієнт')}</a>${u.username ? ` (@${esc(u.username)})` : ''}`;

async function toGroup(env, text) {
  const payload = { chat_id: env.TELEGRAM_CHAT_ID, text, parse_mode: 'HTML', disable_web_page_preview: true };
  if (env.TELEGRAM_THREAD_ID) payload.message_thread_id = Number(env.TELEGRAM_THREAD_ID);
  return tg(env, 'sendMessage', payload);
}

// Бот не веде діалог: лише записує в групу, що клієнт натиснув (/start transit | onsite), і коротко підтверджує
async function handleUpdate(env, update) {
  const m = update.message;
  if (!m || m.chat?.type !== 'private') return; // у групі та на інші повідомлення бот мовчить
  const text = String(m.text || '');
  if (!text.startsWith('/start')) return;
  const intent = INTENTS[text.split(/\s+/)[1] || ''];
  await toGroup(env, `🔔 <b>Клієнт натиснув на сайті:</b> ${intent || 'відкрив бота'}\n👤 ${who(m.from)}\n<i>Сайт Urban Auto</i>`);
  await tg(env, 'sendMessage', { chat_id: m.chat.id, text: 'Дякуємо! Ваш запит передано менеджеру Urban Auto — він зв’яжеться з вами найближчим часом.' });
}

export default {
  async fetch(req, env) {
    const c = cors(req, env);
    const url = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: c.headers });
    if (req.method === 'GET' && url.pathname === '/') return new Response('ok');
    if (req.method === 'POST' && url.pathname === '/webhook') {
      if (req.headers.get('X-Telegram-Bot-Api-Secret-Token') !== (await hookSecret(env))) return new Response('forbidden', { status: 403 });
      try { await handleUpdate(env, await req.json()); } catch (e) { console.log('webhook error', e.message); }
      return new Response('ok'); // Telegram завжди отримує 200
    }
    if (req.method === 'GET' && url.pathname === '/setup') {
      // Підключає вебхук бота до цього Worker (безпечно: адреса вебхука завжди ця сама)
      const r = await tg(env, 'setWebhook', { url: `${url.origin}/webhook`, secret_token: await hookSecret(env), allowed_updates: ['message'], drop_pending_updates: true });
      return json(await r.json().catch(() => ({})), r.ok ? 200 : 502, {});
    }
    if (req.method === 'POST' && url.pathname === '/click') {
      // Клієнт натиснув на сайті «Авто в дорозі» / «Авто по місцю» → одразу повідомлення в групу
      if (!c.ok) return json({ error: 'forbidden' }, 403, c.headers);
      if (!token(env) || !env.TELEGRAM_CHAT_ID) return json({ error: 'not_configured' }, 500, c.headers);
      let b; try { b = await req.json(); } catch { return json({ error: 'bad_json' }, 400, c.headers); }
      const intent = INTENTS[b.intent];
      if (!intent) return json({ error: 'invalid' }, 422, c.headers);
      const time = new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
      const r = await toGroup(env, `🔔 <b>Клієнт натиснув на сайті:</b> ${intent}\n📍 Розділ: ${esc(clip(b.source, 40) || 'сайт')}\n\n<i>Сайт Urban Auto · ${time}</i>`);
      return r.ok ? json({ ok: true }, 200, c.headers) : json({ error: 'telegram_failed' }, 502, c.headers);
    }
    if (req.method !== 'POST' || url.pathname !== '/lead') return json({ error: 'not_found' }, 404, c.headers);
    if (!c.ok) return json({ error: 'forbidden' }, 403, c.headers);
    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return json({ error: 'not_configured' }, 500, c.headers);

    let body;
    try { body = await req.json(); } catch { return json({ error: 'bad_json' }, 400, c.headers); }
    if (body.website) return json({ ok: true }, 200, c.headers); // honeypot: боти заповнюють приховане поле

    const d = {
      type: body.type === 'consult' ? 'consult' : 'order',
      name: clip(body.name, 80), phone: clip(body.phone, 24),
      make: body.make, model: body.model, country: clip(body.country, 30), year: clip(body.year, 4),
      budget: clip(body.budget, 9).replace(/\D/g, ''), repair: !!body.repair, note: clip(body.note, 600),
    };
    if (!d.name || !/^\+?[0-9\s\-()]{10,18}$/.test(d.phone)) return json({ error: 'invalid', message: 'Вкажіть ім’я та коректний телефон.' }, 422, c.headers);

    const payload = { chat_id: env.TELEGRAM_CHAT_ID, text: formatLead(d), parse_mode: 'HTML', disable_web_page_preview: true };
    if (env.TELEGRAM_THREAD_ID) payload.message_thread_id = Number(env.TELEGRAM_THREAD_ID);
    const res = await fetch(`https://api.telegram.org/bot${(String(env.TELEGRAM_BOT_TOKEN).match(/\d+:[A-Za-z0-9_-]+/) || [''])[0]}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const info = await res.json().catch(() => ({}));
      console.log('telegram error', res.status, info.description);
      return json({ error: 'telegram_failed', detail: info.description || res.status, migrate_to_chat_id: info.parameters?.migrate_to_chat_id }, 502, c.headers);
    }
    return json({ ok: true }, 200, c.headers);
  },
};
