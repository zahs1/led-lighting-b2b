/**
 * In-memory rate limiter. Работает в рамках одного инстанса функции,
 * поэтому на serverless (Vercel) ограничение срабатывает «в среднем»
 * по числу инстансов. Для строгого лимита в проде используйте
 * @upstash/ratelimit + Upstash Redis (см. README).
 */
const rateMap = new Map<string, { count: number; resetAt: number }>();

export const RATE_LIMIT_MAX = 5;
export const RATE_LIMIT_WINDOW_MS = 60_000;

export function checkRateLimit(
  key: string,
  maxRequests: number = RATE_LIMIT_MAX,
  windowMs: number = RATE_LIMIT_WINDOW_MS
): { allowed: boolean; remaining: number; retryAfter: number } {
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
