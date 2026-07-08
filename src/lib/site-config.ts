/**
 * Централизованная конфигурация контактов и реквизитов сайта.
 * Значения по умолчанию можно переопределить переменными окружения
 * (NEXT_PUBLIC_COMPANY_PHONE / NEXT_PUBLIC_COMPANY_EMAIL /
 * NEXT_PUBLIC_COMPANY_TELEGRAM / NEXT_PUBLIC_COMPANY_ADDRESS /
 * NEXT_PUBLIC_COMPANY_HOURS / NEXT_PUBLIC_COMPANY_LEGAL_NAME).
 */
const PHONE_DISPLAY =
  process.env.NEXT_PUBLIC_COMPANY_PHONE || "+7 (495) 123-45-67";
const PHONE_DIGITS = PHONE_DISPLAY.replace(/\D/g, "");
const EMAIL = process.env.NEXT_PUBLIC_COMPANY_EMAIL || "info@ledlight.ru";
const TELEGRAM =
  process.env.NEXT_PUBLIC_COMPANY_TELEGRAM || "https://t.me/ledlight";
const ADDRESS =
  process.env.NEXT_PUBLIC_COMPANY_ADDRESS || "Московская обл., г. Люберцы";
const HOURS = process.env.NEXT_PUBLIC_COMPANY_HOURS || "Пн–Пт: 9:00–18:00";
const COMPANY_LEGAL_NAME =
  process.env.NEXT_PUBLIC_COMPANY_LEGAL_NAME || "ООО «ЛЕДЛАЙТ»";

export const siteConfig = {
  name: "LEDLight",
  phoneDisplay: PHONE_DISPLAY,
  phoneHref: `tel:${PHONE_DIGITS}`,
  whatsapp: `https://wa.me/${PHONE_DIGITS}`,
  telegram: TELEGRAM,
  email: EMAIL,
  emailHref: `mailto:${EMAIL}`,
  address: ADDRESS,
  hours: HOURS,
  company: {
    legal: COMPANY_LEGAL_NAME,
    inn: "1234567890",
    ogrn: "1234567890123",
  },
} as const;
