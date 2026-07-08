/**
 * Rate limiter с двумя режимами:
 *
 * 1. Upstash Redis (@upstash/ratelimit) — serverless-friendly: состояние
 *    хранится в Upstash Redis и общее для всех инстансов функции на Vercel.
 *    Включается env-переменными UPSTASH_REDIS_REST_URL и
 *    UPSTASH_REDIS_REST_TOKEN.
 *
 * 2. In-memory Map (fallback) — только для локальной разработки/демо.
 *    На serverless строгий лимит НЕ обеспечивается: каждый инстанс функции
 *    имеет собственный Map, поэтому реальный лимит ≈ max × число инстансов.
 *
 * Публичный API (checkRateLimit/getClientIp, RATE_LIMIT_*) сохранён.
 * checkRateLimit теперь async: путь через Upstash делает HTTP-запрос к Redis
 * REST, что принципиально асинхронно. Вызов в route.ts нужно делать через await.
 */
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const RATE_LIMIT_MAX = 5;
export const RATE_LIMIT_WINDOW_MS = 60_000;

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// In-memory fallback (один инстанс функции — своё состояние).
const rateMap = new Map<string, { count: number; resetAt: number }>();

let ratelimit: Ratelimit | null = null;

if (upstashUrl && upstashToken) {
  ratelimit = new Ratelimit({
    redis: new Redis({ url: upstashUrl, token: upstashToken }),
    limiter: Ratelimit.fixedWindow(RATE_LIMIT_MAX, "60 s"),
    prefix: "lead-api",
  });
} else {
  // Однократный warn при загрузке модуля (на cold start инстанса).
  console.warn(
    "rate-limit in-memory: не для прода, задайте UPSTASH_REDIS_REST_URL и UPSTASH_REDIS_REST_TOKEN",
  );
}

export async function checkRateLimit(
  key: string,
  maxRequests: number = RATE_LIMIT_MAX,
  windowMs: number = RATE_LIMIT_WINDOW_MS,
): Promise<{ allowed: boolean; remaining: number; retryAfter: number }> {
  // Путь Upstash: строгий лимит, общий для всех инстансов.
  // maxRequests/windowMs здесь не учитываются — лимит задаётся при создании
  // Ratelimit (5 запросов/60 с). route.ts вызывает с дефолтами — совпадает.
  if (ratelimit) {
    const result = await ratelimit.limit(key);
    return {
      allowed: result.success,
      remaining: result.remaining,
      retryAfter: result.success
        ? 0
        : Math.max(0, Math.ceil((result.reset - Date.now()) / 1000)),
    };
  }

  // In-memory fallback.
  const now = Date.now();
  const entry = rateMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, retryAfter: 0 };
  }

  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    retryAfter: 0,
  };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // На Vercel CDN перезаписывает XFF, первый сегмент — клиентский IP.
    return forwarded.split(",")[0].trim();
  }
  return "127.0.0.1";
}
