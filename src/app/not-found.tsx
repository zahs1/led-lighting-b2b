import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-gradient-amber mb-4 text-7xl font-bold">404</p>
      <h1 className="mb-3 text-2xl font-bold text-foreground">
        Страница не найдена
      </h1>
      <p className="mb-6 text-muted">
        Возможно, страница была удалена или вы перешли по неверной ссылке.
      </p>
      <Link href="/" className="btn-primary">
        На главную
      </Link>
    </div>
  );
}
