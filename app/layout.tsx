import type { Metadata } from "next";
import { exo2, plusJakartaSans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portfolio - Léon Gallet",
  description: "From sapiens to Ludens.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${exo2.variable} ${plusJakartaSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
