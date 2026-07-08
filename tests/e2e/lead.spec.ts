import { test, expect } from "@playwright/test";

/**
 * Smoke-e2e критического пути B2B LED-лендинга.
 *
 * Текст селекторов/ассертов свёрстан с реальными компонентами:
 *  - HeroSection (h1 «LED-светильники» / «для вашего бизнеса», бейдж «Собственное
 *    производство в РФ», кнопка «Получить КП»).
 *  - Header (кнопки «Получить КП» и «Заказать звонок» открывают модалки).
 *  - Footer#contacts (телефон, заголовок «Контакты»).
 *  - LeadForm (модалка «Получить коммерческое предложение», formType: "cp"):
 *    обязательные поля по leadFormSchema — name (≥2), phone (regex /^[\d\s+()\-]+$/
 *    и ≥10 символов), email; submit-кнопка «Отправить».
 *
 * На dev-сервере без env-интеграций /api/lead пишет в uploads/leads.json
 * (saveLeadLocally) и отвечает 200 { success: true } — onSuccess закрывает модалку.
 */

test.describe("Smoke-e2e: критический путь B2B LED-лендинга", () => {
  test("главная отдаёт 200 и содержит ключевые секции (Hero, контакты)", async ({
    page,
  }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle(/LEDLight/);

    // Hero
    await expect(page.locator("h1")).toContainText("LED-светильники");
    await expect(page.locator("h1")).toContainText("для вашего бизнеса");
    await expect(
      page.getByText("Собственное производство в РФ").first(),
    ).toBeVisible();
    await expect(page.getByText("Гарантия до 5 лет").first()).toBeVisible();

    // Контакты (Footer, id="contacts")
    await expect(
      page.getByText("Контакты", { exact: true }).first(),
    ).toBeVisible();
    await expect(page.getByText("+7 (495) 123-45-67").first()).toBeVisible();
  });

  test("на странице присутствуют кнопки открытия форм и секционная форма", async ({
    page,
  }) => {
    await page.goto("/");

    // Кнопки открытия модалок (Header)
    await expect(
      page.getByRole("button", { name: "Получить КП" }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Заказать звонок" }).first(),
    ).toBeVisible();

    // Секционная форма WholesalePriceForm отрендерена (h2 + <form>)
    await expect(
      page.getByText("Получить оптовый прайс-лист").first(),
    ).toBeVisible();
    await expect(page.locator("form").first()).toBeVisible();
  });

  test("форма заявки в модалке «Получить КП» отправляется (dev → local-leads)", async ({
    page,
  }) => {
    await page.goto("/");

    // Открываем модалку LeadForm (formType: "cp")
    await page.getByRole("button", { name: "Получить КП" }).first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByText("Получить коммерческое предложение"),
    ).toBeVisible();

    // Валидные данные по leadFormSchema (name, phone, email — обязательны)
    await dialog.getByPlaceholder("Иван Петров").fill("Иван Тестов");
    await dialog
      .getByPlaceholder("+7 (495) 123-45-67")
      .fill("+7 (495) 123-45-67");
    await dialog
      .getByPlaceholder("ivan@company.ru")
      .fill("ivan.test@example.com");

    // Отправляем и ждём ответ /api/lead
    const [response] = await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes("/api/lead") && r.request().method() === "POST",
      ),
      dialog.getByRole("button", { name: "Отправить" }).click(),
    ]);
    expect(response.ok()).toBeTruthy();

    // onSuccess закрывает модалку — это и есть success-state формы LeadForm
    await expect(page.getByRole("dialog")).toHaveCount(0, { timeout: 15000 });
  });
});
