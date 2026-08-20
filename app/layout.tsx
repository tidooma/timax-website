import type { Metadata } from "next";
import { Days_One } from "next/font/google";
import "./globals.css";

const daysOne = Days_One({
  weight: "400",
  subsets: ["latin", "cyrillic"],
  variable: "--font-days"
});

export const metadata: Metadata = {
  title: "Timax — видеомонтаж",
  description: "Профессиональный видеомонтаж для YouTube, TikTok, Instagram* и др.",
  icons: {
    icon: "/apple-touch-icon.png",
    apple: "/apple-touch-icon.png",
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${daysOne.variable} dark`} suppressHydrationWarning>
      <body className="bg-[#050507] text-white antialiased">{children}</body>
    </html>
  );
}
