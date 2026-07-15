import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowUpRight,
  Send,
  MessageCircle,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contacts" className="border-t border-border">
      <div className="container-custom py-16 md:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div>
            <div className="mb-5 flex items-center gap-2.5 text-xl font-bold">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-800 text-sm font-bold text-white">
                L
              </span>
              <span>LED<span className="text-copper-400">Light</span></span>
            </div>
            <p className="text-sm leading-relaxed text-muted">
              Производство и поставка светодиодных светильников для бизнеса.
              Работаем по всей РФ с 2014 года.
            </p>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-foreground">
              Навигация
            </h4>
            <ul className="space-y-3">
              {[
                ["Каталог", "#categories"],
                ["Для B2B", "#target-audience"],
                ["Этапы работы", "#how-we-work"],
                ["Проекты", "#projects"],
                ["Документы", "#documents"],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-foreground">
              Контакты
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={siteConfig.phoneHref}
                  className="flex items-center gap-3 whitespace-nowrap text-sm text-muted transition-colors hover:text-foreground"
                >
                  <Phone size={15} className="shrink-0 text-copper-400" />
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.emailHref}
                  className="flex items-center gap-3 whitespace-nowrap text-sm text-muted transition-colors hover:text-foreground"
                >
                  <Mail size={15} className="shrink-0 text-copper-400" />
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <span className="flex items-center gap-3 text-sm text-muted">
                  <MapPin size={15} className="shrink-0 text-copper-400" />
                  {siteConfig.address}
                </span>
              </li>
              <li>
                <span className="flex items-center gap-3 text-sm text-muted">
                  <Clock size={15} className="shrink-0 text-copper-400" />
                  {siteConfig.hours}
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-foreground">
              Реквизиты
            </h4>
            <div className="mb-6 space-y-1 text-sm leading-relaxed text-muted">
              <p>{siteConfig.company.legal}</p>
              <p>ИНН: {siteConfig.company.inn}</p>
              <p>ОГРН: {siteConfig.company.ogrn}</p>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href={siteConfig.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-copper-400 transition-colors hover:text-copper-300"
              >
                <MessageCircle size={15} />
                Написать в WhatsApp
                <ArrowUpRight size={14} />
              </a>
              <a
                href={siteConfig.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-copper-400 transition-colors hover:text-copper-300"
              >
                <Send size={15} />
                Написать в Telegram
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-subtle">
            © {currentYear} {siteConfig.name}. Все права защищены.
          </p>
          <p className="text-xs text-subtle">
            Демонстрационный проект · Next.js 16 · React 19
          </p>
        </div>
      </div>
    </footer>
  );
}
