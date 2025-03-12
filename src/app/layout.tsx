import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MainContent } from "@/components/layout/MainContent";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "KnockoffKitchen.com - Homemade Copycat Recipes of Famous Brand Products",
  description: "Discover how to make homemade versions of your favorite brand products with our collection of copycat recipes. Easy to follow, tested recipes that taste just like the original.",
  keywords: ["homemade copycat recipes", "brand recipes", "copycat recipes", "homemade recipes", "DIY recipes", "cooking", "food"],
  authors: [{ name: "KnockoffKitchen.com Team" }],
  creator: "KnockoffKitchen.com",
  publisher: "KnockoffKitchen.com",
  alternates: {
    canonical: "https://knockoffkitchen.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://knockoffkitchen.com",
    siteName: "KnockoffKitchen.com",
    title: "KnockoffKitchen.com - Homemade Copycat Recipes of Famous Brand Products",
    description: "Discover how to make homemade versions of your favorite brand products with our collection of copycat recipes. Save money and enjoy healthier alternatives.",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "KnockoffKitchen.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KnockoffKitchen.com - Homemade Copycat Recipes of Famous Brand Products",
    description: "Discover how to make homemade versions of your favorite brand products with our collection of copycat recipes. Save money and enjoy healthier alternatives.",
    images: ["/images/logo.png"],
    creator: "@knockoffkitchen",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/logo.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <MainContent>
          {children}
        </MainContent>
        <Footer />
      </body>
    </html>
  );
}
