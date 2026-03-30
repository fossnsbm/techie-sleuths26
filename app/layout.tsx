import type { Metadata } from "next";
import { Cinzel, Libre_Baskerville } from "next/font/google";
import CustomCursor from "./components/custom-cursor";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  weight: ["400", "700", "900"],
  subsets: ["latin"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-baskerville",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Techie Sleuths 26",
  description: "Welcome to Techie Sleuths 26",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${libreBaskerville.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
