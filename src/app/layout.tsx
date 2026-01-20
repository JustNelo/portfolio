import type { Metadata } from "next";
import { anton, jetbrainsMono } from "@/app/fonts";
import "@/app/globals.css";
import Scene from "@/components/Scene";

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
        className={`${anton.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Scene />
        {children}
      </body>
    </html>
  );
}
