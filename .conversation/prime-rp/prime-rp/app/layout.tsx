import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prime RP | Roleplay Community",
  description: "Prime RP — a roleplay world built around detail, choices, and community.",
  icons: { icon: "/prime-rp-logo.png" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
