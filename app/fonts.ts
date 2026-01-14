import { Anton, JetBrains_Mono } from "next/font/google";

// Heading font
export const anton = Anton({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

// Body font
export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});