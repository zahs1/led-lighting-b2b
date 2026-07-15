"use client";

import { useEffect, useCallback, useRef, ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  const handleTab = useCallback((e: KeyboardEvent) => {
    const dialog = dialogRef.current;
    if (!dialog || e.key !== "Tab") return;
    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((el) => el.offsetParent !== null);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("keydown", handleTab);
      document.body.style.overflow = "hidden";
      const dialog = dialogRef.current;
      if (dialog) {
        const first = dialog.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
        (first ?? dialog).focus();
      }
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleTab);
      document.body.style.overflow = "";
      if (
        triggerRef.current &&
        typeof triggerRef.current.focus === "function"
      ) {
        triggerRef.current.focus();
      }
    };
  }, [isOpen, handleEscape, handleTab]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 animate-fade-in bg-foreground/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative max-h-[90vh] w-full max-w-lg animate-scale-in overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-xl outline-none md:p-8"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-subtle transition-colors hover:text-foreground"
          aria-label="Закрыть"
        >
          <X size={20} />
        </button>
        <h3
          id="modal-title"
          className="mb-6 pr-8 text-xl font-bold text-foreground"
        >
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
}
