import { z } from "zod";

const nameField = (msg = "Имя должно содержать минимум 2 символа") =>
  z.string().min(2, msg).max(100, "Слишком длинное имя").trim();

const phoneField = () =>
  z
    .string()
    .min(10, "Введите корректный номер телефона")
    .max(30, "Слишком длинный номер")
    .regex(/^[\d\s+()\-]+$/, "Некорректные символы в номере")
    .trim();

const emailField = () =>
  z
    .string()
    .email("Введите корректный email")
    .max(254, "Слишком длинный email")
    .trim();

/** Honeypot-поле. Заполняется только ботами — должно быть пустым. */
const honeypot = () => z.string().max(0).optional();

export const CLIENT_TYPES = [
  "installer",
  "contractor",
  "designer",
  "dealer",
  "private",
] as const;

export const OBJECT_TYPES = [
  "office",
  "shop",
  "warehouse",
  "industrial",
  "sport",
  "parking",
  "home",
  "other",
] as const;

export const FORM_TYPES = [
  "cp",
  "tz",
  "callback",
  "wholesale",
  "final",
  "analog",
] as const;

export const leadFormSchema = z.object({
  name: nameField(),
  phone: phoneField(),
  email: emailField(),
  company: z.string().max(200).optional(),
  message: z.string().max(5000).optional(),
  website_url: honeypot(),
});

export const tzFormSchema = z.object({
  name: nameField(),
  phone: phoneField(),
  email: emailField(),
  company: z.string().max(200).optional(),
  description: z.string().max(5000).optional(),
  website_url: honeypot(),
});

export const callbackFormSchema = z.object({
  name: nameField(),
  phone: phoneField(),
  website_url: honeypot(),
});

export const wholesaleFormSchema = z.object({
  name: nameField(),
  phone: phoneField(),
  email: emailField(),
  company: z.string().min(2, "Введите название компании").max(200).trim(),
  clientType: z.enum(CLIENT_TYPES, { message: "Выберите тип клиента" }),
  website_url: honeypot(),
});

export const finalFormSchema = z.object({
  name: nameField(),
  phone: phoneField(),
  email: emailField(),
  company: z.string().max(200).optional(),
  objectType: z.enum(OBJECT_TYPES, { message: "Выберите тип объекта" }),
  message: z.string().max(5000).optional(),
  website_url: honeypot(),
});

export const analogFormSchema = z.object({
  name: nameField(),
  phone: phoneField(),
  email: emailField(),
  message: z.string().max(5000).optional(),
  quantity: z.string().max(10).optional(),
  website_url: honeypot(),
});

export type LeadFormType = z.infer<typeof leadFormSchema>;
export type TZFormType = z.infer<typeof tzFormSchema>;
export type CallbackFormType = z.infer<typeof callbackFormSchema>;
export type WholesaleFormType = z.infer<typeof wholesaleFormSchema>;
export type FinalFormType = z.infer<typeof finalFormSchema>;
export type AnalogFormType = z.infer<typeof analogFormSchema>;
