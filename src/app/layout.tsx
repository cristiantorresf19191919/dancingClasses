import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SoulBalance | Clases de Salsa & Bachata",
  description:
    "Aprende a bailar Salsa y Bachata con los mejores instructores. Reserva tu clase ahora.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${geistSans.variable} font-[family-name:var(--font-geist-sans)] antialiased`}>
        {children}
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            style: {
              background: "rgba(20, 20, 35, 0.95)",
              border: "1px solid rgba(255, 45, 123, 0.3)",
              color: "#f0f0f5",
            },
          }}
        />
      </body>
    </html>
  );
}
