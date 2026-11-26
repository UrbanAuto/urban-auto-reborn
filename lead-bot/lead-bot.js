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

export default {
  async fetch(req, env) {
    const c = cors(req, env);
    const url = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: c.headers });
    if (req.method === 'GET' && url.pathname === '/') return new Response('ok');
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
