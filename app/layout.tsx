import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/providers";
import { MobileTabBar } from "@/components/layout";
import { Toaster } from "@/components/ui";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "宠灵感 PetSoul - AI 宠物内心戏生成器",
  description: "上传宠物照片，AI 生成趣味内心独白，一键制作表情包",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <ThemeProvider>
          <main className="min-h-screen pb-16">{children}</main>
          <MobileTabBar />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
