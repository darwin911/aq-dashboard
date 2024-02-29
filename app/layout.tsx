import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AQ Dashboard",
  description: "Air Quality Dashboard based on user location",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="container flex min-h-[calc(100dvh)] flex-col items-center p-10 xl:p-24 tracking-tighter">
          {children}
        </main>
      </body>
    </html>
  );
}
