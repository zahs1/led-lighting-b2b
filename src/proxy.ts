import { NextResponse, type NextRequest } from "next/server";

/**
 * Proxy генерирует per-request nonce и устанавливает Content-Security-Policy.
 *
 * Next.js (App Router) парсит 'nonce-<value>' из CSP header во время
 * server-side рендеринга и автоматически применяет nonce к своим инлайн-скриптам
 * (React/Next runtime, RSC flight data, гидрация) и инлайн-стилям. Поэтому
 * 'unsafe-inline' для скриптов и стилей в production больше не нужен.
 *
 * CSP ставится в два места:
 *  - request headers (через NextResponse.next({ request: { headers } })) —
 *    чтобы Next.js извлёк nonce при рендеринге;
 *  - response headers — чтобы браузер получил итоговую политику.
 *
 * В dev к script-src добавляется 'unsafe-eval', так как React использует eval
 * для отладочной информации (рекомендация из docs Next.js). В production
 * 'unsafe-eval' отсутствует. Аналогично style-src в dev использует
 * 'unsafe-inline', а в production — 'nonce-<nonce>' (Next.js применяет nonce
 * к инлайн-<style> во время SSR).
 *
 * ВАЖНО: nonce применяется только при dynamic rendering. Static-страницы
 * генерируются в build time без nonce, поэтому в src/app/layout.tsx и
 * src/app/global-error.tsx выставлен `export const dynamic = 'force-dynamic'`.
 * См. docs: node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md
 *
 * Next.js 16: файл `middleware.ts` и функция `middleware` депрекированы в пользу
 * `proxy.ts` / функции `proxy` (логика идентична, runtime — nodejs).
 * См. node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md
 */
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}'${isDev ? " 'unsafe-eval'" : ""};
    style-src 'self' ${isDev ? "'unsafe-inline'" : `'nonce-${nonce}'`};
    img-src 'self' data:;
    font-src 'self' data:;
    connect-src 'self' https://api.resend.com https://*.bitrix24.ru;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
  `;

  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Применять proxy ко всем путям, кроме:
     * - api (API routes)
     * - _next/static (статические файлы)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     *
     * prefetch-запросы (next/link) также пропускаются — им CSP не нужен.
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
