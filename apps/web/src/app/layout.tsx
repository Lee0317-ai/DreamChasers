import type { Metadata } from "next";
import "./globals.css";
import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";

export const metadata: Metadata = {
  title: "工具与游戏站",
  description: "免费实用工具 + 休闲小游戏"
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
