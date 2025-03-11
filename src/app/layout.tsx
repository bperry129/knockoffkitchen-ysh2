import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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
  title: "KnockoffKitchen.com - Delicious Copycat Recipes of Famous Dishes",
  description: "Discover and cook perfect replicas of your favorite restaurant dishes with our collection of copycat recipes. Easy to follow, tested recipes that taste just like the original.",
  keywords: ["copycat recipes", "restaurant recipes", "famous dishes", "recipe collection", "cooking", "food"],
  authors: [{ name: "KnockoffKitchen.com Team" }],
  creator: "KnockoffKitchen.com",
  publisher: "KnockoffKitchen.com",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://knockoffkitchen.com",
    siteName: "KnockoffKitchen.com",
    title: "KnockoffKitchen.com - Delicious Copycat Recipes of Famous Dishes",
    description: "Discover and cook perfect replicas of your favorite restaurant dishes with our collection of copycat recipes.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "KnockoffKitchen.com",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KnockoffKitchen.com - Delicious Copycat Recipes of Famous Dishes",
    description: "Discover and cook perfect replicas of your favorite restaurant dishes with our collection of copycat recipes.",
    images: ["/og-image.jpg"],
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main className="pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
