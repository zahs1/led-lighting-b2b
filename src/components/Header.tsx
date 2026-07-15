"use client";

import { useState, useEffect } from "react";
import { Phone, Mail, Menu, X, MessageCircle, Send } from "lucide-react";
import Modal from "@/components/Modal";
import CallbackForm from "@/components/CallbackForm";
import LeadForm from "@/components/LeadForm";
import { siteConfig } from "@/lib/site-config";

const navLinks = [
  { href: "#categories", label: "Каталог" },
  { href: "#target-audience", label: "Для B2B" },
  { href: "#how-we-work", label: "Этапы" },
  { href: "#projects", label: "Проекты" },
  { href: "#documents", label: "Документы" },
  { href: "#contacts", label: "Контакты" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cpModal, setCpModal] = useState(false);
  const [callbackModal, setCallbackModal] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-border/80 bg-background/85 backdrop-blur-xl"
            : "border-transparent bg-background"
        }`}
      >
        <div className="container-custom">
          <div className="flex h-16 items-center justify-between md:h-20">
            <a
              href="#hero"
              className="flex items-center gap-2.5 text-xl font-bold text-foreground"
              aria-label={`${siteConfig.name} — на главную`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-800 text-sm font-bold text-white">
                L
              </span>
              <span className="hidden sm:inline">
                LED<span className="text-copper-400">Light</span>
              </span>
            </a>

            <nav className="hidden items-center gap-8 lg:flex">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="hidden items-center gap-5 md:flex">
              <a
                href={siteConfig.phoneHref}
                className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-foreground transition-colors hover:text-copper-400"
              >
                <Phone size={15} className="text-copper-400" />
                {siteConfig.phoneDisplay}
              </a>
              <a
                href={siteConfig.emailHref}
                className="hidden items-center gap-2 text-sm text-muted transition-colors hover:text-foreground xl:flex"
              >
                <Mail size={15} className="text-subtle" />
                {siteConfig.email}
              </a>
              <a
                href={siteConfig.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-subtle transition-colors hover:text-copper-400"
                aria-label="Написать в WhatsApp"
              >
                <MessageCircle size={20} />
              </a>
              <a
                href={siteConfig.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-subtle transition-colors hover:text-copper-400"
                aria-label="Написать в Telegram"
              >
                <Send size={20} />
              </a>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCallbackModal(true)}
                className="hidden text-sm font-medium text-copper-400 transition-colors hover:text-copper-300 md:inline-flex"
              >
                Заказать звонок
              </button>
              <button
                onClick={() => setCpModal(true)}
                className="btn-primary !px-5 !py-2.5"
              >
                Получить КП
              </button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 text-muted transition-colors hover:text-foreground lg:hidden"
                aria-label="Меню"
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
            menuOpen ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-border bg-surface">
            <div className="container-custom flex flex-col gap-2 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
              <hr className="my-2 border-border" />
              <a
                href={siteConfig.phoneHref}
                className="whitespace-nowrap py-1 text-sm font-semibold text-foreground"
              >
                {siteConfig.phoneDisplay}
              </a>
              <a
                href={siteConfig.emailHref}
                className="py-1 text-sm text-muted"
              >
                {siteConfig.email}
              </a>
              <div className="flex gap-3 py-1">
                <a
                  href={siteConfig.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition-colors hover:text-copper-400"
                  aria-label="Написать в WhatsApp"
                >
                  <MessageCircle size={20} />
                </a>
                <a
                  href={siteConfig.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition-colors hover:text-copper-400"
                  aria-label="Написать в Telegram"
                >
                  <Send size={20} />
                </a>
              </div>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setCallbackModal(true);
                }}
                className="py-1 text-left text-sm font-medium text-copper-400"
              >
                Заказать звонок
              </button>
            </div>
          </div>
        </div>
      </header>

      <Modal
        isOpen={cpModal}
        onClose={() => setCpModal(false)}
        title="Получить коммерческое предложение"
      >
        <LeadForm onSuccess={() => setCpModal(false)} />
      </Modal>

      <Modal
        isOpen={callbackModal}
        onClose={() => setCallbackModal(false)}
        title="Заказать звонок"
      >
        <CallbackForm onSuccess={() => setCallbackModal(false)} />
      </Modal>
    </>
  );
}
