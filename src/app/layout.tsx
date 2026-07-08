import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site-config";

// nonce-based CSP требует dynamic rendering: Next.js применяет nonce к
// инлайн-скриптам (RSC flight data, гидрация) во время server-side рендеринга
// на основе CSP header из middleware. Static-страницы генерируются в build
// time без nonce и были бы заблокированы браузером.
// См. node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md
export const dynamic = "force-dynamic";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LEDLight — Производство светодиодных светильников в РФ",
  description:
    "Собственное производство LED-светильников для бизнеса. Офисные, промышленные, уличные и линейные светильники. Гарантия до 5 лет. Доставка по всей РФ.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  openGraph: {
    title: "LEDLight — Производство светодиодных светильников в РФ",
    description:
      "Собственное производство LED-светильников для бизнеса. Офисные, промышленные, уличные и линейные светильники. Гарантия до 5 лет.",
    // og:image* генерируется автоматически из src/app/opengraph-image.tsx
    // (Next.js metadata file convention → ImageResponse → PNG 1200×630).
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LEDLight — Производство светодиодных светильников в РФ",
    description:
      "Собственное производство LED-светильников для бизнеса. Гарантия до 5 лет. Доставка по всей РФ.",
    // twitter:image не задаём явно: при отсутствии twitter-image.* Next.js
    // использует opengraph-image, а Twitter сам берёт og:image как fallback.
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-amber-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black"
        >
          Перейти к содержимому
        </a>
        <Header />
        <main id="content" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: siteConfig.name,
              description:
                "Производство и поставка светодиодных светильников для бизнеса",
              telephone: siteConfig.phoneDisplay,
              email: siteConfig.email,
              address: {
                "@type": "PostalAddress",
                addressLocality: siteConfig.address,
                addressCountry: "RU",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
