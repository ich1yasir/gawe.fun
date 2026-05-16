import type { Metadata } from "next";

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
    <div className="min-h-screen bg-zinc-50 antialiased dark:bg-zinc-950">
      {children}
    </div>
  );
}
