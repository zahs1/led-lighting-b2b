export async function sendToBitrix24(
  data: Record<string, unknown>,
): Promise<boolean> {
  const webhookUrl = process.env.BITRIX24_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn(
      "BITRIX24_WEBHOOK_URL not configured, skipping Bitrix24 integration",
    );
    return false;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      // Не логируем тело ответа — оно может содержать PII лида.
      console.error(
        "Bitrix24 API error:",
        response.status,
        response.statusText,
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error(
      "Bitrix24 send error:",
      error instanceof Error ? error.message : "unknown",
    );
    return false;
  }
}
