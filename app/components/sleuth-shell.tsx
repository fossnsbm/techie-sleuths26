import type { ReactNode } from "react";
import MainNav from "./main-nav";

type SleuthShellProps = {
  children: ReactNode;
};

export default function SleuthShell({ children }: SleuthShellProps) {
  return (
    <main className="sleuth-page">
      <MainNav />
      {children}
    </main>
  );
}
