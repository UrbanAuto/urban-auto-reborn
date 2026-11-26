# Urban Auto — Reborn

Сайт компанії Urban Auto (пригін авто зі США та Європи під ключ): світлий дизайн у кольорах
[urban-auto.com.ua](https://urban-auto.com.ua/), каталог лотів Copart/IAAI, пошук проданих лотів за VIN,
орієнтовний калькулятор вартості, ремонт під ключ, кейси, відгуки та FAQ.

Стек: Next.js 15 (статичний експорт), GSAP, Lenis.

```bash
npm ci
npm run dev      # http://localhost:3000
npm run build    # статичний сайт у ./out (basePath /urban-auto-reborn)
```

Налаштування контактів менеджера — `lib/data.js` (`SITE`). Каталог і пошук проданих: див. `worker/README.md`.
