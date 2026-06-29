import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ウンポポ君のおさんぽマッチング | 保護犬とあなたをつなぐ",
  description:
    "ワンコイン500円で保護犬とおさんぽ。気軽に犬と触れ合いながら、保護活動を応援できるマッチングサービスです。",
  openGraph: {
    title: "ウンポポ君のおさんぽマッチング",
    description: "ワンコイン500円で保護犬とおさんぽ。保護活動を応援できます。",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FCE14B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
