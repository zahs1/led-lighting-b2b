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

| Переменная | Назначение | Обязательно |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | canonical URL, sitemap, OG | нет |
| `NEXT_PUBLIC_COMPANY_PHONE` | телефон в шапке/футере | нет |
| `NEXT_PUBLIC_COMPANY_EMAIL` | email в шапке/футере | нет |
| `NEXT_PUBLIC_COMPANY_TELEGRAM` | ссылка на Telegram | нет |
| `RESEND_API_KEY` + `MAIL_FROM` + `MAIL_TO` | email-уведомления о заявках | нет |
| `BITRIX24_WEBHOOK_URL` | создание лидов в Bitrix24 | нет |
| `BLOB_READ_WRITE_TOKEN` | хранение загруженных файлов | нет |

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

Перед релизом добавьте `public/og-image.jpg` (1200×630) для превью ссылок.

## Лицензия

Демонстрационный проект для портфолио.
