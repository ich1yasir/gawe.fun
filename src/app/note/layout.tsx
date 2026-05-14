import type { Metadata } from "next";
import { Lato } from "next/font/google";
import Background from "../../../components/note/Background";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"], // adjust weights as needed
});


export const metadata: Metadata = {
  title: "OxNote - Secure Your Personal Note",
  description: "This note is totally your data, only available on your device. We never store anything on our server. OxNote is your personal, private, and secure note-taking app—your notes, your control!",
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
