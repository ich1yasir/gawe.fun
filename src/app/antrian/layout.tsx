import type { Metadata } from "next";
import Background from "../../../components/antrian/Background";

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
    <div className="antialiased">
      <Background />
      {children}
    </div>
  );
}
