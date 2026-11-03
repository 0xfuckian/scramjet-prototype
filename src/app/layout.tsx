import type { Metadata } from "next";
import { AppShell } from "../components/layout/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "SCRAMJET // Mainnet Beta - One platform. Every token operation.",
  description: "Launch across 12 launchpads. Manage wallets, trade, automate and monitor execution from one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#08090C] text-[#F8FAFC] min-h-screen font-sans selection:bg-[#FF3E00]/30 selection:text-white">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}



