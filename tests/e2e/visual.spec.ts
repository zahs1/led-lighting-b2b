import { test, expect } from "@playwright/test";
import { mkdirSync } from "node:fs";

/**
 * Визуальная проверка тёмного редизайна: скриншоты ключевых брейкпоинтов и
 * prefers-reduced-motion. Это не assertions-тесты — артефакты складываются в
 * tests/screenshots/ для ручного просмотра (diff/ревью вёрстки).
 *
 * Снимки делаются после небольшой задержки, чтобы FadeIn/hero-атмосфера успели
 * отрисоваться. Полная страница (fullPage) — чтобы захватить все секции.
 */
const OUT_DIR = "tests/screenshots";

test.beforeAll(() => mkdirSync(OUT_DIR, { recursive: true }));

test.describe("Визуальные скриншоты редизайна", () => {
  test("desktop 1280 — главная целиком", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    // Геро-атмосфера (spotlight/glow) + первый FadeIn.
    await page.waitForTimeout(1200);
    await page.screenshot({
      path: `${OUT_DIR}/desktop-1280-full.png`,
      fullPage: true,
    });
  });

  test("desktop 1280 — hero (above the fold)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${OUT_DIR}/desktop-1280-hero.png` });
  });

  test("mobile 375 — главная целиком", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 740 });
    await page.goto("/");
    await page.waitForTimeout(1200);
    await page.screenshot({
      path: `${OUT_DIR}/mobile-375-full.png`,
      fullPage: true,
    });
  });

  test("desktop 1280 + reduced-motion — главная целиком", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.waitForTimeout(1200);
    await page.screenshot({
      path: `${OUT_DIR}/desktop-1280-reduced-motion-full.png`,
      fullPage: true,
    });
    // Санируем: под reduced-motion страница должна рендериться без анимаций.
    await expect(page.locator("h1")).toBeVisible();
  });
});
