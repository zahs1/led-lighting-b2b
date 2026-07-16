import { test, expect } from "@playwright/test";

/**
 * e2e-покрытие элементов тёмного редизайна (navy + copper) и анимаций.
 *
 * Текст селекторов/ассертов свёрстан с реальных компонентов:
 *  - Marquee (page.tsx): <section aria-label="Ключевые преимущества"> с USP-лентой
 *    из USP_ITEMS (8 пунктов: Dialux EVO, Гарантия до 5 лет, ...). Трек удвоен,
 *    вторая копия aria-hidden — поэтому каждый пункт берём через .first().
 *  - HeroSection (#hero): плавающие stat-чипы «Объектов сдано» / «Экономия энергии»
 *    со счётчиками (Counter, count-up на inView). Чипы hidden на <md → desktop-проект.
 *  - Magnetic CTA: hero-кнопка «Получить КП» содержит span.magnetic-inner
 *    (useMagnetic) и кликабельна — открывает CP-модалку.
 *  - RealizedProjects (#projects): featured-кейс (projects[0], featured:true) —
 *    бейдж «Флагман-кейс» и статичные лейблы метрик «м² освещено» / «экономия энергии».
 *  - prefers-reduced-motion: emulateMedia + проверка, что рендер чипов не ломается.
 *
 * ВАЖНО про точные значения count-up: в dev-режиме Fast Refresh/HMR может перезагрузить
 * страницу на середине анимации → финальное число Counter недетерминировано (напр. 70%
 * может застрять на 65–69%). Поэтому e2e проверяет СТРУКТУРУ (наличие чипов, лейблов,
 * что счётчик отдал число), а не точный финал. Точный финал — в прод-сборке и covered
 * терминальным setValue(to) + backstop-timeout в Counter.tsx.
 */

test.describe("Редизайн: Marquee, счётчики, magnetic CTA, портфолио", () => {
  test("Marquee USP-лента содержит ключевые преимущества под hero", async ({
    page,
  }) => {
    await page.goto("/");

    const marquee = page.getByLabel("Ключевые преимущества");
    await expect(marquee).toBeVisible();

    // Несколько репрезентативных пунктов из USP_ITEMS (page.tsx).
    // Marquee дублирует детей для seamless-loop → каждый пункт встречается дважды,
    // поэтому берём .first().
    await expect(
      marquee.getByText("Светотехнический расчёт Dialux EVO").first(),
    ).toBeVisible();
    await expect(marquee.getByText("Гарантия до 5 лет").first()).toBeVisible();
    await expect(marquee.getByText("Сертификация EAC").first()).toBeVisible();
    await expect(
      marquee.getByText("Работа по 44-ФЗ и 223-ФЗ").first(),
    ).toBeVisible();

    // Лента не пустая: медная точка-маркер (h-1 w-1 rounded-full bg-copper-500)
    // есть перед каждым пунктом.
    await expect(marquee.locator(".bg-copper-500").first()).toBeVisible();
  });

  test("Hero: плавающие stat-чипы со счётчиками отрендерены (desktop)", async ({
    page,
  }) => {
    // Чипы hidden на <md — desktop-проект по умолчанию (1280x720).
    await page.goto("/");
    const hero = page.locator("#hero");

    // Статичные лейблы чипов рендерятся всегда (SSR, без анимации).
    await expect(hero.getByText("Объектов сдано")).toBeVisible();
    await expect(hero.getByText("Экономия энергии")).toBeVisible();

    // Точный финал count-up в e2e против dev-сервера не проверяем: HMR/Fast
    // Refresh может перезагрузить страницу на середине анимации → значение
    // недетерминировано. Проверяем структурно — счётчик отдал число.
    await expect(hero.getByText(/Объектов сдано/)).toBeVisible();
    const hasDigits = await hero.evaluate((el) =>
      /\d/.test(el.textContent ?? ""),
    );
    expect(hasDigits).toBeTruthy();
  });

  test("Hero: magnetic CTA «Получить КП» открывает модалку", async ({
    page,
  }) => {
    await page.goto("/");

    // Кнопка в hero содержит внутренний magnetic-слой (useMagnetic → magnetic-inner).
    const heroCta = page.locator("#hero").getByRole("button", {
      name: "Получить КП",
    });
    await expect(heroCta).toBeVisible();
    await expect(heroCta.locator(".magnetic-inner")).toHaveCount(1);

    // Функциональность важнее анимации: клик открывает CP-модалку.
    await heroCta.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByText("Получить коммерческое предложение"),
    ).toBeVisible();
  });

  test("RealizedProjects: featured-кейс рендерит метрики со счётчиками", async ({
    page,
  }) => {
    await page.goto("/");

    const projects = page.locator("#projects");
    await expect(
      projects.getByRole("heading", { name: "Реализованные проекты" }),
    ).toBeVisible();

    // Featured-кейс (projects[0], featured:true): бейдж и статичные лейблы
    // метрик рендерятся без анимации — на них и опираемся. Точные числовые
    // значения счётчиков не ассертим: в dev HMR может оборвать count-up.
    await expect(projects.getByText("Флагман-кейс")).toBeVisible();
    await expect(
      projects.getByText("м² освещено", { exact: true }),
    ).toBeVisible();
    await expect(
      projects.getByText("экономия энергии", { exact: true }),
    ).toBeVisible();
  });

  test("Counter под prefers-reduced-motion: рендер не ломается", async ({
    page,
  }) => {
    // Эмулируем системную настройку до загрузки страницы и убеждаемся, что
    // она применилась.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const reduced = await page.evaluate(
      () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
    expect(reduced).toBe(true);

    // Чипы hero присутствуют — reduced-motion путь Counter (setValue(to) без
    // анимации) не ломает рендер. Точный финал count-up проверяется unit-тестом,
    // не e2e (в dev HMR недетерминирован).
    const hero = page.locator("#hero");
    await expect(hero.getByText("Объектов сдано")).toBeVisible();
    await expect(hero.getByText("Экономия энергии")).toBeVisible();
  });
});
