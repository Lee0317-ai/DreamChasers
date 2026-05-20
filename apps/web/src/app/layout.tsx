import type { Metadata } from "next";
import "./globals.css";
import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";

export const metadata: Metadata = {
  title: "DreamChasers",
  description: "免费工具和小游戏门户"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <AppHeader />
        <main className="page-shell">{children}</main>
        <AppFooter />
      </body>
    </html>
  );
}
