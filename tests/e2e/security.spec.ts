import { test, expect } from "@playwright/test";

/**
 * Негативные e2e-кейсы безопасности лид-форм.
 *
 * Текст селекторов/ассертов свёрстан с реальных компонентов:
 *  - CallbackForm (модалка «Заказать звонок»): honeypot input[name="website_url"]
 *    (Honeypot.tsx), валидируется как z.string().max(0).optional() — заполненное
 *    поле фейлит zodResolver на клиенте, onSubmit не вызывается, /api/lead не уходит.
 *  - FindAnalogBlock (#find-analog): поля name/phone/email с placeholder'ами
 *    «Ваше имя *» / «Телефон *» / «Email *»; ошибки phone/email из validations.ts
 *    («Введите корректный номер телефона», «Введите корректный email»).
 *
 * Все негативные кейсы блокируются client-side zod-валидацией (react-hook-form),
 * поэтому до /api/lead запросы не доходят — это и проверяется через page.route-счётчик.
 */

test.describe("Безопасность форм: honeypot и валидация", () => {
  test("Honeypot: заполненный website_url блокирует отправку (бот-блок)", async ({
    page,
  }) => {
    let apiCalls = 0;
    await page.route("**/api/lead", (route) => {
      apiCalls++;
      return route.continue();
    });

    await page.goto("/");

    // Открываем модалку CallbackForm (минимум обязательных полей: name, phone).
    await page.getByRole("button", { name: "Заказать звонок" }).first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // Заполняем обязательные поля валидными данными.
    await dialog.getByPlaceholder("Иван Петров").fill("Иван Тестов");
    await dialog
      .getByPlaceholder("+7 (495) 123-45-67")
      .fill("+7 (495) 123-45-67");

    // Заполняем honeypot — поле, которое реальный пользователь не видит
    // (tabIndex=-1, aria-hidden, off-screen). Боты его заполняют.
    await dialog.locator('input[name="website_url"]').fill("spam-bot-content");

    // Пытаемся отправить.
    await dialog.getByRole("button", { name: "Заказать звонок" }).click();

    // Модалка НЕ должна закрыться (success-state не достигнут) ...
    await expect(dialog).toBeVisible();
    // ... и /api/lead НЕ должен быть вызван: client-side zod (website_url: max(0))
    // блокирует onSubmit ещё до fetch.
    expect(apiCalls).toBe(0);
  });

  test("Невалидный телефон: zod блокирует отправку, видна ошибка поля", async ({
    page,
  }) => {
    let apiCalls = 0;
    await page.route("**/api/lead", (route) => {
      apiCalls++;
      return route.continue();
    });

    await page.goto("/");

    const section = page.locator("#find-analog");
    await expect(
      section.getByRole("heading", {
        name: "Не можете найти нужный светильник?",
      }),
    ).toBeVisible();

    // name и email валидны, телефон невалиден: «123» → min(10) фейлится.
    await section.getByPlaceholder("Ваше имя *").fill("Иван Тестов");
    await section.getByPlaceholder("Телефон *").fill("123");
    await section.getByPlaceholder("Email *").fill("ivan.test@example.com");

    await section.getByRole("button", { name: "Подобрать аналог" }).click();

    // Ожидаем сообщение об ошибке телефона из validations.ts.
    await expect(
      section.getByText("Введите корректный номер телефона"),
    ).toBeVisible();
    // API не вызывается (zodResolver блокирует onSubmit).
    expect(apiCalls).toBe(0);
  });

  test("Невалидный email: zod блокирует отправку, видна ошибка поля", async ({
    page,
  }) => {
    let apiCalls = 0;
    await page.route("**/api/lead", (route) => {
      apiCalls++;
      return route.continue();
    });

    await page.goto("/");

    const section = page.locator("#find-analog");
    await expect(
      section.getByRole("heading", {
        name: "Не можете найти нужный светильник?",
      }),
    ).toBeVisible();

    // name и телефон валидны, email невалиден: «not-an-email» → .email() фейлится.
    await section.getByPlaceholder("Ваше имя *").fill("Иван Тестов");
    await section.getByPlaceholder("Телефон *").fill("+7 (495) 123-45-67");
    await section.getByPlaceholder("Email *").fill("not-an-email");

    await section.getByRole("button", { name: "Подобрать аналог" }).click();

    await expect(section.getByText("Введите корректный email")).toBeVisible();
    expect(apiCalls).toBe(0);
  });

  // rate-limit: in-memory лимит 5 запросов/мин с одного IP (getClientIp → «127.0.0.1»
  // для локальных запросов). Тест нестабилен при совместном прогоне с forms/lead-спеками
  // (общий счётчик на сервере), а также пишет 6 лидов в uploads/leads.json. Пропускаем —
  // проверять вручную изолированно: npx playwright test security.spec.ts -g "rate-limit".
  // test.skip(title, body) объявляет пропущенный тест: body не выполняется,
  // а служит документацией того, что проверяется вручную (см. playwright docs).
  test.skip("rate-limit: 6+ быстрых POST → 429", async ({ request }) => {
    for (let i = 0; i < 6; i++) {
      const res = await request.post("/api/lead", {
        multipart: {
          formType: "callback",
          name: "Иван Тестов",
          phone: "+7 (495) 123-45-67",
        },
        headers: { origin: "http://localhost:3000" },
      });
      if (i < 5) {
        expect(res.ok()).toBeTruthy();
      } else {
        expect(res.status()).toBe(429);
      }
    }
  });
});
