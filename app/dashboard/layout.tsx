import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import DashboardNav from "./components/DashboardNav";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Team Dashboard - Techie Sleuths 26",
  description: "Team dashboard for Techie Sleuths 26",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="site-background min-h-full flex flex-col">
        <DashboardNav />
        <main className="flex-1 pt-20">
          {children}
        </main>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
