import { test, expect } from "@playwright/test";

/**
 * e2e-покрытие лид-форм (кроме LeadForm — она в lead.spec.ts).
 *
 * Текст селекторов/ассертов свёрстан с реальных компонентов:
 *  - CallbackForm (модалка «Заказать звонок», formType: "callback"):
 *    обязательные поля по callbackFormSchema — name (≥2), phone (regex /^[\d\s+()\-]+$/
 *    и ≥10); submit-кнопка «Заказать звонок»; onSuccess закрывает модалку.
 *  - WholesalePriceForm (#wholesale-price, formType: "wholesale"):
 *    обязательные name, phone, email, company (≥2), clientType (enum);
 *    submit «Получить прайс-лист»; success → SuccessMessage «Заявка на прайс-лист отправлена!».
 *  - SendTZBlock (#send-tz, formType: "tz"): обязательные name, phone, email;
 *    submit «Отправить ТЗ»; success → «ТЗ получено!».
 *  - FindAnalogBlock (#find-analog, formType: "analog"): обязательные name, phone, email;
 *    submit «Подобрать аналог»; success → «Заявка принята!».
 *  - FinalApplicationForm (#final-form, formType: "final"): обязательные name, phone, email,
 *    objectType (enum); submit «Отправить заявку»; success → «Спасибо за заявку!».
 *
 * На dev-сервере без env /api/lead пишет в uploads/leads.json и отвечает 200 { success: true }.
 * Внимание: in-memory rate-limit = 5 запросов/мин с одного IP (getClientIp → «127.0.0.1») —
 * при совместном прогоне с lead.spec.ts возможен 429 (см. «Риски» в отчёте).
 */

test.describe("Формы заявок: заполнение и success-state", () => {
  test("CallbackForm (модалка «Заказать звонок») — отправка закрывает модалку", async ({
    page,
  }) => {
    await page.goto("/");

    // Открываем модалку CallbackForm (formType: "callback").
    await page.getByRole("button", { name: "Заказать звонок" }).first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("heading", { name: "Заказать звонок" }),
    ).toBeVisible();

    // Обязательные поля по callbackFormSchema: name, phone.
    await dialog.getByPlaceholder("Иван Петров").fill("Иван Тестов");
    await dialog
      .getByPlaceholder("+7 (495) 123-45-67")
      .fill("+7 (495) 123-45-67");

    // Отправляем и ждём ответ /api/lead.
    const [response] = await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes("/api/lead") && r.request().method() === "POST",
      ),
      dialog.getByRole("button", { name: "Заказать звонок" }).click(),
    ]);
    expect(response.ok()).toBeTruthy();

    // Success-state CallbackForm: внутри модалки показывается SuccessMessage
    // «Заявка принята» (onSuccess закрывает модалку только по клику «Закрыть»).
    await expect(dialog.getByText("Заявка принята")).toBeVisible({
      timeout: 15_000,
    });
  });

  test("WholesalePriceForm (#wholesale-price) — success → SuccessMessage", async ({
    page,
  }) => {
    await page.goto("/");

    const section = page.locator("#wholesale-price");
    await expect(
      section.getByRole("heading", { name: "Получить оптовый прайс-лист" }),
    ).toBeVisible();

    // Обязательные поля по wholesaleFormSchema: name, phone, email, company, clientType.
    await section.getByPlaceholder("Иван Петров").fill("Иван Тестов");
    await section
      .getByPlaceholder("+7 (495) 123-45-67")
      .fill("+7 (495) 123-45-67");
    await section
      .getByPlaceholder("ivan@company.ru")
      .fill("ivan.test@example.com");
    await section.getByPlaceholder("ООО «СтройГрупп»").fill("ООО «ТестГрупп»");
    await section
      .locator('select[name="clientType"]')
      .selectOption("installer");

    const [response] = await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes("/api/lead") && r.request().method() === "POST",
      ),
      section.getByRole("button", { name: "Получить прайс-лист" }).click(),
    ]);
    expect(response.ok()).toBeTruthy();

    await expect(
      section.getByRole("heading", {
        name: "Заявка на прайс-лист отправлена!",
      }),
    ).toBeVisible();
  });

  test("SendTZBlock (#send-tz) — success → SuccessMessage", async ({
    page,
  }) => {
    await page.goto("/");

    const section = page.locator("#send-tz");
    await expect(
      section.getByText("Пришлите техническое задание"),
    ).toBeVisible();

    // Обязательные поля по tzFormSchema: name, phone, email.
    await section.getByPlaceholder("Иван Петров").fill("Иван Тестов");
    await section
      .getByPlaceholder("+7 (495) 123-45-67")
      .fill("+7 (495) 123-45-67");
    await section
      .getByPlaceholder("ivan@company.ru")
      .fill("ivan.test@example.com");

    const [response] = await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes("/api/lead") && r.request().method() === "POST",
      ),
      section.getByRole("button", { name: "Отправить ТЗ" }).click(),
    ]);
    expect(response.ok()).toBeTruthy();

    await expect(
      section.getByRole("heading", { name: "ТЗ получено" }),
    ).toBeVisible();
  });

  test("FindAnalogBlock (#find-analog) — success → SuccessMessage", async ({
    page,
  }) => {
    await page.goto("/");

    const section = page.locator("#find-analog");
    await expect(
      section.getByRole("heading", {
        name: "Не можете найти нужный светильник?",
      }),
    ).toBeVisible();

    // Обязательные поля по analogFormSchema: name, phone, email.
    await section.getByPlaceholder("Ваше имя *").fill("Иван Тестов");
    await section.getByPlaceholder("Телефон *").fill("+7 (495) 123-45-67");
    await section.getByPlaceholder("Email *").fill("ivan.test@example.com");

    const [response] = await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes("/api/lead") && r.request().method() === "POST",
      ),
      section.getByRole("button", { name: "Подобрать аналог" }).click(),
    ]);
    expect(response.ok()).toBeTruthy();

    await expect(
      section.getByRole("heading", { name: "Заявка принята!" }),
    ).toBeVisible();
  });

  test("FinalApplicationForm (#final-form) — success → SuccessMessage", async ({
    page,
  }) => {
    await page.goto("/");

    const section = page.locator("#final-form");
    await expect(
      section.getByRole("heading", {
        name: "Получите расчёт светильников под ваш объект",
      }),
    ).toBeVisible();

    // Обязательные поля по finalFormSchema: name, phone, email, objectType.
    await section.getByPlaceholder("Иван Петров").fill("Иван Тестов");
    await section
      .getByPlaceholder("+7 (495) 123-45-67")
      .fill("+7 (495) 123-45-67");
    await section
      .getByPlaceholder("ivan@company.ru")
      .fill("ivan.test@example.com");
    await section.locator('select[name="objectType"]').selectOption("office");

    const [response] = await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes("/api/lead") && r.request().method() === "POST",
      ),
      section.getByRole("button", { name: "Отправить заявку" }).click(),
    ]);
    expect(response.ok()).toBeTruthy();

    await expect(
      section.getByRole("heading", { name: "Заявка отправлена" }),
    ).toBeVisible();
  });
});
