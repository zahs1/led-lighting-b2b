# Production Backlog

Проект **production-ready по коду**: security по OWASP, nonce-based CSP, e2e-тесты, динамическая OG-картинка, строгий tsconfig.

Этот файл — что осталось **подключить/доделать для боевого B2B с реальными лидами** (не для портфолио-демо).

---

## 🔴 Критично — без этого прод не боевой

env-переменные внести в **Vercel → Project → Settings → Environment Variables**:

- [ ] **`UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`** — прод-rate-limit. Создать БД на [upstash.com](https://upstash.com), скопировать REST URL и токен. Без этого rate-limit in-memory (не работает на serverless — каждый инстанс считает сам).
- [ ] **`BLOB_READ_WRITE_TOKEN`** — загрузка ТЗ/фото клиентами. Включить Vercel Blob (Vercel → Storage → Blob), получить токен. Без этого файлы валидируются, но не сохраняются (`file-upload.ts` вернёт `null`).
- [ ] **`MAIL_FROM` → свой домен** — сейчас `onboarding@resend.dev` (shared testing domain Resend, письма идут **только владельцу аккаунта**). Заверить свой домен в Resend + настроить SPF/DKIM, поставить `MAIL_FROM=info@yourdomain.ru`.
- [ ] **`MAIL_TO`** — куда падают заявки (напр. `sales@yourdomain.ru`).
- [ ] **`NEXT_PUBLIC_SITE_URL`** — боевой домен (canonical, sitemap, OG, JSON-LD).
- [ ] **`RESEND_API_KEY`** — валидный ключ `re_...` (формат проверяется `isValidResendKey`, плейсхолдеры отсекаются).

## 🟡 Рекомендуется

- [ ] **`BITRIX24_WEBHOOK_URL`** — если нужна CRM (лиды авто-попадают в Bitrix24). Опционально, но для B2B удобно.
- [ ] **Проверить OG-превью** через [opengraph.xyz](https://www.opengraph.xyz/) — кириллица рендерится системным шрифтом Satori; если «плывёт» — добавить шрифт Inter (`fetch` `.ttf` из CDN → `fonts` в `ImageResponse`, `src/app/opengraph-image.tsx`).
- [ ] **Smoke-прогон после деплоя:**
  - `curl -X POST https://yourdomain.ru/api/lead` без Origin → **403** (CSRF fail-closed);
  - отправить реальную заявку → письмо на `MAIL_TO`;
  - DevTools → Console — нет CSP-violations;
  - превысить 5 запросов/мин → **429** (rate-limit).

## ⚪ Опционально / техдолг

- [ ] **`src/app/global-error.tsx` → `force-dynamic`** — error page сейчас static; при срабатывании CSP его инлайн-скрипты заблокируются (HTML отобразится, JS — нет).
- [ ] **`src/middleware.ts` → `src/proxy.ts`** — Next 16 deprecates `middleware` в пользу `proxy`. Миграция: `npx @next/codemod@canary middleware-to-proxy .`.
- [ ] **`style-src` nonce** — сейчас `'unsafe-inline'` (Tailwind v4 инлайнит стили). Ужесточить до nonce, если нужна строгая защита от CSS-инъекций.
- [ ] **Расширить e2e** — добавить тесты остальных форм (CallbackForm, FinalApplicationForm, SendTZBlock, FindAnalogBlock) и негативные кейсы (невалидный телефон, honeypot заполнен → бот-блок).

---

## ✅ Уже сделано (контекст)

- CSRF fail-closed (Origin/Referer) — POST без Origin → 403
- CSP **nonce-based** (`script-src 'self' 'nonce-XXX'`, без `unsafe-inline`/`unsafe-eval`)
- env-валидация ключей (плейсхолдеры не воспринимаются как «настроено» → нет 502)
- `local-leads` fail-loudly (503 в проде без интеграций, а не молчаливая потеря)
- `@upstash/ratelimit` + in-memory fallback для dev
- PII убран из логов (`bitrix24.ts`, `route.ts`)
- Honeypot реально регистрируется в RHF (раньше мёртвый декор) → блокирует ботов
- Динамическая OG-картинка (`next/og`, 1200×630)
- Playwright smoke-e2e (3 теста, `npm run test:e2e`)
- tsconfig strict (`noUnusedLocals`/`noUnusedParameters`/`noImplicitReturns`)
- `robots.ts` env-based, `site-config` env-driven (phone/email/address/hours/legal)
- Рефакторинг 6 форм (`Honeypot`/`useLeadSubmit`/`SuccessMessage`)
