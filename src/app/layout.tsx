import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
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
  title: "TuringStore - Tu tienda online de confianza",
  description: "Encuentra los mejores productos en TuringStore. Ofertas exclusivas, envío rápido y atención personalizada.",
  keywords: ["tienda online", "productos", "ofertas", "ecommerce"],
  authors: [{ name: "TuringStore" }],
  openGraph: {
    title: "TuringStore - Tu tienda online de confianza",
    description: "Encuentra los mejores productos en TuringStore. Ofertas exclusivas, envío rápido y atención personalizada.",
    type: "website",
    locale: "es_ES",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
