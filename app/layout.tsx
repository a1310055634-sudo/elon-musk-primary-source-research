import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://elon-musk-primary-source-research.a1310055634.workers.dev"),
  title: {
    default: "马斯克一手资料档案",
    template: "%s | 马斯克一手资料档案",
  },
  description: "直接进入马斯克的原话、署名文本、完整活动、投资者问答、媒体采访、法律与监管行动记录。",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "马斯克一手资料档案",
    title: "马斯克一手资料档案",
    description: "直接进入原话、完整活动、正式文件与可核验行动记录。",
    images: [{ url: "/og-v2.png", width: 1792, height: 896, alt: "马斯克一手资料档案：原话、活动与行动记录" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "马斯克一手资料档案",
    description: "直接进入原话、完整活动、正式文件与可核验行动记录。",
    images: ["/og-v2.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
