import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site-config";

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "LEDLight — Производство светодиодных светильников в РФ",
    description:
      "Собственное производство LED-светильников для бизнеса. Офисные, промышленные, уличные и линейные светильники. Гарантия до 5 лет.",
    images: ["/og-image.jpg"],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LEDLight — Производство светодиодных светильников в РФ",
    description:
      "Собственное производство LED-светильников для бизнеса. Гарантия до 5 лет. Доставка по всей РФ.",
    images: ["/og-image.jpg"],
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
