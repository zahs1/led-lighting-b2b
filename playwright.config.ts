import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config для smoke-e2e критического пути B2B LED-лендинга.
 *
 * webServer запускает `npm run dev` и переиспользует уже поднятый инстанс
 * (reuseExistingServer в локальном режиме), чтобы не конфликтовать с другими
 * процессами, работающими в .next/.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",

  use: {
    baseURL: "http://localhost:3000",
    // Отключаем артефакты для скорости smoke-прогонов.
    trace: "off",
    screenshot: "off",
    video: "off",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60 * 1000,
    // Высокий лимит для e2e, чтобы форма-тесты не падали от in-memory rate-limit
    // (5/мин на общий IP 127.0.0.1). На проде env не задан → дефолт 5.
    env: { RATE_LIMIT_MAX: "1000" },
  },
});
