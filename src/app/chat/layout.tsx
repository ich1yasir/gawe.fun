import type { Metadata } from "next";
import { Lato } from "next/font/google";
import Background from "../../../components/chat/Background";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"], // adjust weights as needed
});

export const metadata: Metadata = {
  title: "Bisik - Your Private Conversation Sanctuary",
  description: "Experience truly secure conversations with end-to-end encryption. Your messages stay yours—nothing is stored on our servers. Chat freely, knowing your privacy is protected.",
};

export default function ChatLayout({
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
