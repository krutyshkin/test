import "./globals.css";
import type { Metadata } from "next";
import ServiceWorkerRegister from "../components/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "Unique 9:16 Studio",
  description: "Browser-first уникализация вертикальных видео для TikTok / Reels / Shorts.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg"
  },
  themeColor: "#0b0f1a"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
