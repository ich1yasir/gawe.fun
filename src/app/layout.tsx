import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";

// Use Lato font from next/font/google
const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"], // Add weights as needed
});

export const metadata: Metadata = {
  title: "Gawe App",
  description: "Gawe App only for fun",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.variable} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
