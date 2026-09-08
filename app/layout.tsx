import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fayms.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  verification: {
google: "9FYpQ460DPuM3ccVpY5o9YXCejjVZf-_NPn2HGwufxw",
},
  title: {
    default: "FAYMS — Digital Solutions for Modern Businesses",
    template: "%s — FAYMS",
  },
  description:
    "FAYMS designs and builds websites, e-commerce stores, mobile apps and UI/UX for businesses in Saudi Arabia. We turn your ideas into digital experiences.",
  keywords: [
    "FAYMS",
    "web development Saudi Arabia",
    "e-commerce development KSA",
    "mobile app development Saudi Arabia",
    "UI/UX design agency",
    "digital solutions company",
  ],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "FAYMS — Digital Solutions for Modern Businesses",
    description:
      "We turn your ideas into digital experiences: websites, e-commerce, mobile apps and UI/UX design for businesses in Saudi Arabia.",
    url: siteUrl,
    siteName: "FAYMS",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "FAYMS" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAYMS — Digital Solutions for Modern Businesses",
    description:
      "We turn your ideas into digital experiences: websites, e-commerce, mobile apps and UI/UX design.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
