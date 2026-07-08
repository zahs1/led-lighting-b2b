# LEDLight — B2B-лендинг LED-освещения

Демонстрационный одностраничный сайт B2B-производителя светодиодных светильников.
Проект для портфолио: современный тёмный дизайн, продуманная архитектура форм
заявок и production-ready бэкенд, который работает в демо-режиме без внешних
сервисов и легко подключается к настоящим интеграциям через переменные окружения.

> ⚠️ Проект использует **Next.js 16** с breaking-изменениями. Перед правкой
> нетривиальных API сверяйтесь с `node_modules/next/dist/docs/` (см. `AGENTS.md`).

## Возможности

- **13 секций**: hero, целевая аудитория, каталог, популярные модели, отправка ТЗ,
  подбор аналога, этапы работы, проекты, документы, отзывы, преимущества,
  оптовый прайс, финальная форма заявки.
- **6 типов форм заявок** с валидацией (Zod), honeypot-защитой и rate-limit.
- **Дублирующая доставка заявок**: Bitrix24 CRM + email (Resend).
- **Загрузка файлов** (ТЗ, фото) в Vercel Blob с graceful-демо-режимом.
- **Доступность**: focus-trap в модалках, skip-link, aria-разметка, контраст.
- **SEO**: метаданные, OpenGraph/Twitter, JSON-LD `LocalBusiness`, sitemap.

## Технологии

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript** (strict) + **Zod 4**
- **Tailwind CSS v4** (тема в `globals.css` через `@theme inline`)
- **react-hook-form** + **@hookform/resolvers**
- **lucide-react** (иконки)
- **@vercel/blob** (опциональное хранилище файлов)

## Структура

```
src/
├─ app/
│  ├─ layout.tsx          # корневой layout, метаданные, JSON-LD
│  ├─ page.tsx            # композиция секций
│  ├─ globals.css         # дизайн-система (@theme + component-классы)
│  ├─ error.tsx / loading.tsx / not-found.tsx
│  ├─ sitemap.ts
│  └─ api/lead/route.ts   # единый обработчик заявок
├─ components/
│  ├─ Header / Footer / Modal / FadeIn
│  ├─ LeadForm / CallbackForm        # переиспользуемые формы
│  └─ sections/                       # 13 секций лендинга
├─ data/mock.ts          # единственный источник контента (типизирован)
├─ lib/
│  ├─ validations.ts     # Zod-схемы форм
│  ├─ submit-lead.ts     # клиентский сабмит с обработкой ошибок
│  ├─ file-upload.ts     # загрузка в Vercel Blob (+ demo)
│  ├─ rate-limit.ts      # in-memory rate limiter
│  ├─ bitrix24.ts        # отправка лида в CRM
│  └─ site-config.ts     # контакты/реквизиты (env-driven)
└─ types/index.ts        # доменные типы
```

## Быстрый старт

```bash
npm install
cp .env.example .env.local   # опционально — для интеграций
npm run dev                  # http://localhost:3000
```

Сборка и проверка:

```bash
npm run lint
npm run build
npm run start
```

## Переменные окружения

Все интеграции **опциональны**. Без них проект работает в демо-режиме
(формы принимаются и показывают успех, но никуда не отправляются).

| Переменная                                 | Назначение                  | Обязательно |
| ------------------------------------------ | --------------------------- | ----------- |
| `NEXT_PUBLIC_SITE_URL`                     | canonical URL, sitemap, OG  | нет         |
| `NEXT_PUBLIC_COMPANY_PHONE`                | телефон в шапке/футере      | нет         |
| `NEXT_PUBLIC_COMPANY_EMAIL`                | email в шапке/футере        | нет         |
| `NEXT_PUBLIC_COMPANY_TELEGRAM`             | ссылка на Telegram          | нет         |
| `RESEND_API_KEY` + `MAIL_FROM` + `MAIL_TO` | email-уведомления о заявках | нет         |
| `BITRIX24_WEBHOOK_URL`                     | создание лидов в Bitrix24   | нет         |
| `BLOB_READ_WRITE_TOKEN`                    | хранение загруженных файлов | нет         |

## Подключение интеграций (production)

1. **Email (Resend)** — зарегистрируйтесь на [resend.com](https://resend.com),
   верифицируйте домен отправителя, задайте `RESEND_API_KEY`, `MAIL_FROM`
   (с верифицированного домена) и `MAIL_TO`.
2. **Bitrix24** — в портале: «Разработчикам → Другое → Входящий вебхук»,
   дайте права на `crm.lead.add`, URL вставьте в `BITRIX24_WEBHOOK_URL`.
3. **Файлы (Vercel Blob)** — создайте Blob Store на Vercel, токен вставьте
   в `BLOB_READ_WRITE_TOKEN`.
4. **Строгий rate-limit** — текущий лимитер in-memory и работает «в среднем»
   на serverless. Для строгого лимита подключите
   [`@upstash/ratelimit`](https://github.com/upstash/ratelimit) + Upstash Redis
   в `src/lib/rate-limit.ts`.

## Деплой

Проект заточен под **Vercel**: импортируйте репозиторий, задайте переменные
окружения, деплой произойдёт автоматически.

OG-превью ссылок генерируется динамически через `src/app/opengraph-image.tsx`
(Next.js metadata file convention → `ImageResponse` → PNG 1200×630).
Ручной `public/og-image.jpg` **не нужен** — тёмная тема + amber-акцент +
бренд/телефон берутся из `src/lib/site-config.ts`.

## Production deployment checklist

Пошаговый чеклист для боевого B2B-деплоя. Без пунктов, отмеченных «обязательно»,
часть функций молча откатывается в демо-режим (заявки принимаются, но никуда
не уходят).

1. **Resend (email-уведомления о заявках) — обязательно**
   - Зарегистрироваться на [resend.com](https://resend.com).
   - Верифицировать домен отправителя: добавить DNS-записи **SPF + DKIM**
     (раздел Domains → Add domain → скопировать TXT/CNAME в DNS-зону домена).
   - `MAIL_FROM` вида `LEDLight <info@yourdomain.ru>` — **с верифицированного
     домена**, не `onboarding@resend.dev` (письма с onboarding-домена
     отправляются только на адрес владельца аккаунта).
   - `RESEND_API_KEY` — API-ключ из Resend Dashboard.
   - `MAIL_TO` — ящик, куда будут приходить уведомления о заявках.

2. **Vercel Blob (загрузка ТЗ/фото из форм) — опционально, рекомендуется**
   - Vercel Dashboard → проект → вкладка **Storage** → **Blob** →
     **Create Blob Store**.
   - Привязать Store к проекту, скопировать `BLOB_READ_WRITE_TOKEN` в env.
   - Без токена файлы не сохраняются, но заявка принимается (graceful-fallback).

3. **Upstash Redis (строгий прод-rate-limit) — опционально, рекомендуется**
   - Создать БД на [upstash.com](https://upstash.com) (Redis), регион рядом с
     Vercel-деплоем.
   - Скопировать `UPSTASH_REDIS_REST_URL` и `UPSTASH_REDIS_REST_TOKEN` в env
     (обе переменные одновременно).
   - Без них используется in-memory fallback — на serverless каждый инстанс
     функции считает лимит отдельно (нестрого).

4. **NEXT_PUBLIC_SITE_URL = боевой домен**
   - `https://yourdomain.ru` (с протоколом, без слэша в конце).
   - Используется в `metadataBase`, `sitemap.ts`, OG-тегах, JSON-LD.
   - Обязательно для production: иначе canonical/OG-ссылки указывают на
     `localhost:3000`.

5. **Bitrix24 webhook (CRM) — опционально**
   - В портале Bitrix24: «Разработчикам → Другое → Входящий вебхук».
   - Дать права на `crm.lead.add`.
   - URL вставить в `BITRIX24_WEBHOOK_URL`.
   - Без него лиды не создаются в CRM (но идут на почту через Resend).

6. **Env → Vercel Project Settings → Environment Variables**
   - Внести ВСЕ переменные из `.env.example` для окружения **Production**
     (и при необходимости Preview/Development).
   - `NEXT_PUBLIC_*` применяются после пересборки; секретные (RESEND__,
     BLOB__, UPSTASH__, BITRIX24__) — сразу после redeploy функции.

7. **После деплоя — smoke-тесты**
   - **CSP-заголовки**: открыть DevTools → Network → главный документ →
     проверить `Content-Security-Policy` (нет `unsafe-inline` на скрипты,
     домены Resend/Blob/Upstash в allowlist при необходимости).
   - **POST без Origin → 403**: `curl -X POST <site>/api/lead -H 'Content-Type: application/json' -d '{}'`
     должен вернуть 403 (защита от CSRF по Origin/Referer).
   - **Форма → письмо**: отправить реальную заявку через форму на сайте,
     убедиться, что письмо дошло до `MAIL_TO` (проверить спам).
   - **OG-превью**: проверить через
     [opengraph.xyz](https://www.opengraph.xyz/) или
     [Meta Sharing Debugger](https://developers.facebook.com/tools/debug/) —
     должна подтянуться динамическая картинка 1200×630 (`/opengraph-image`).
   - **Rate-limit**: отправить >N заявок подряд → ожидать 429.

## Лицензия

Демонстрационный проект для портфолио.
