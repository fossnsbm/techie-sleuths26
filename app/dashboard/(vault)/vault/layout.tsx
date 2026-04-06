import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Vault Breakers - Techie Sleuths 26",
  description: "Unlock the vault to access the team dashboard",
};

// Empty layout to override parent dashboard layout
// This page will only inherit from root layout (with custom cursor)
export default function VaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
