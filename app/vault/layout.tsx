import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Vault Breakers - Techie Sleuths 26",
  description: "Unlock the vault to access the team dashboard",
};

export default function VaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
