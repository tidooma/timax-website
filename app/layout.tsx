import type { Metadata } from "next";
import { Days_One } from "next/font/google";
import ScrollToTop from "@/components/ScrollToTop";
import "./globals.css";

const daysOne = Days_One({
  weight: "400",
  subsets: ["latin", "cyrillic"],
  variable: "--font-days",
  display: "swap",
  preload: true,
  fallback: ["Arial", "Helvetica", "sans-serif"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://timaxxx.ru"),
  title: "Timax — Профессиональный видеомонтаж",
  description: "Качественный монтаж видео для YouTube, TikTok, Instagram. Быстро и профессионально.",
  applicationName: "Timax", // <-- ДОБАВЛЕНО: Прямое указание имени приложения/сайта для Google
  alternates: {
    canonical: "https://timaxxx.ru"
  },
  openGraph: {
    title: "Timax — Профессиональный видеомонтаж",
    description: "Качественный монтаж видео для YouTube, TikTok, Instagram. Быстро и профессионально.",
    url: "https://timaxxx.ru",
    siteName: "Timax", // <-- УЖЕ БЫЛО: Отлично, оставляем
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Timax - видеомонтаж"
      }
    ],
    locale: "ru_RU",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Timax — видеомонтаж",
    description: "Профессиональный видеомонтаж для YouTube, TikTok, Instagram",
    images: ["/og-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${daysOne.variable} dark`} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark" />
        <link rel="canonical" href="https://timaxxx.ru" />
        
        {/* <-- ДОБАВЛЕНО: JSON-LD разметка, которая ЖЕЛЕЗНО говорит Google, как называть сайт */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Timax",
              "url": "https://timaxxx.ru",
            }),
          }}
        />
      </head>
      <body className="bg-[#050507] text-white antialiased">
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}