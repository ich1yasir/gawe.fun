import type { Metadata } from "next";
import { Lato } from "next/font/google";
import Background from "../../../components/antrian/Background";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"], // adjust weights as needed
});

export const metadata: Metadata = {
  title: "Antrian Management App",
  description: "Antrian Management App for managing queues and customers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${lato.variable} antialiased`}>
      <Background />
      {children}
    </div>
  );
}
