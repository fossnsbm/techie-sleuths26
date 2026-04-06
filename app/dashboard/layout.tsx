import type { Metadata } from "next";
import DashboardNav from "./components/DashboardNav";

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
    <>
      <DashboardNav />
      <main className="flex-1 pt-20">
        {children}
      </main>
    </>
  );
}
