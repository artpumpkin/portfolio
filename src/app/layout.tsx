import type { Metadata, Viewport } from "next";
import { seoTitle, seoDescription, siteUrl } from "@/data/seo";
import { profile } from "@/data/portfolio";
import "./globals.css";
import { OfflineSupport } from "@/components/offline-support";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: seoTitle,
  description: seoDescription,
  authors: [{ name: profile.name, url: siteUrl }],
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Lachkar",
    title: seoTitle,
    description: seoDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: seoTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoTitle,
    description: seoDescription,
    images: [{ url: "/opengraph-image", alt: seoTitle }],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/brand/lachkar-v2-32.png", type: "image/png", sizes: "32x32" },
      { url: "/brand/lachkar-v2.svg", type: "image/svg+xml", sizes: "any" },
    ],
    shortcut: "/brand/lachkar-v2.ico",
    apple: {
      url: "/brand/lachkar-v2-180.png",
      sizes: "180x180",
      type: "image/png",
    },
  },
};
export const viewport: Viewport = { themeColor: "#f7f5ef" };
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <OfflineSupport />
      </body>
    </html>
  );
}
