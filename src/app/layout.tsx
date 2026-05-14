import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
