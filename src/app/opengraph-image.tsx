import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

// Next.js metadata file convention: динамическая OG-картинка 1200×630.
// Рендерится через ImageResponse (next/og → Satori + Resvg → PNG).
// Автоматически добавляет og:image / og:image:width / og:image:height /
// og:image:type / og:image:alt в <head>. Заменяет ручной public/og-image.jpg.
//
// Референс: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/
// 01-metadata/opengraph-image.md и .../04-functions/image-response.md

export const alt = `${siteConfig.name} — B2B светодиодное освещение оптом`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#0a0a0b",
        padding: "80px",
        fontFamily: "sans-serif",
      }}
    >
      {/* Бренд + amber-акцент */}
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <div
          style={{
            width: "10px",
            height: "72px",
            backgroundColor: "#f59e0b",
            borderRadius: "6px",
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: "56px",
            fontWeight: 700,
            color: "#fafafa",
            letterSpacing: "-0.02em",
          }}
        >
          {siteConfig.name}
        </div>
      </div>

      {/* Слоган */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "72px",
            fontWeight: 800,
            color: "#fafafa",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
          }}
        >
          <div style={{ display: "flex" }}>B2B светодиодное</div>
          <div style={{ display: "flex" }}>освещение оптом</div>
        </div>
        <div style={{ display: "flex", fontSize: "30px", color: "#a1a1aa" }}>
          Собственное производство • Гарантия до 5 лет • Доставка по РФ
        </div>
      </div>

      {/* Контакты */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "36px",
            fontWeight: 600,
            color: "#f59e0b",
          }}
        >
          {siteConfig.phoneDisplay}
        </div>
        <div style={{ display: "flex", fontSize: "26px", color: "#71717a" }}>
          {siteConfig.email}
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
