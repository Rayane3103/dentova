import type { Metadata } from "next";
import { Darker_Grotesque, Inter } from "next/font/google";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { TopLoader } from "@/components/layout/TopLoader";
import { PixelScripts } from "@/components/layout/PixelScripts";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const darkerGrotesque = Darker_Grotesque({
  subsets: ["latin"],
  variable: "--font-darker-grotesque",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: "Dentova | Formations et evenements dentaires",
    template: "%s | Dentova"
  },
  description:
    "Dentova organise des formations et evenements dentaires premium pour les praticiens en Algerie.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  icons: {
    icon: "/brand/logomark.svg",
    shortcut: "/brand/logomark.svg",
    apple: "/brand/logomark.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${darkerGrotesque.variable}`}
    >
      <body className="font-sans antialiased" suppressHydrationWarning>
        <TopLoader />
        {children}
        <Toaster richColors position="top-right" />
        <Suspense fallback={null}>
          <PixelScripts />
        </Suspense>
      </body>
    </html>
  );
}
