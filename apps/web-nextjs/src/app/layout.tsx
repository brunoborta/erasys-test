import type { Metadata } from "next";
import { Roboto, Playfair_Display } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Profile Gallery - Erasys Test",
    template: "%s | Erasys Test",
  },
  description: "Browse professional photo gallery and profile information.",
  keywords: ["profile", "gallery", "photos", "portfolio"],
  authors: [{ name: 'Bruno "Borta" Bortagaray' }],
  openGraph: {
    title: "Profile Gallery - Erasys Test",
    description: "Browse professional photo gallery and profile information",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Profile Gallery - Erasys Test",
    description: "Browse professional photo gallery and profile information",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${playfair.variable} antialiased`}>{children}</body>
    </html>
  );
}
