import type React from "react";
import { Inter } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={inter.className}>
      <SidebarProvider>{children}</SidebarProvider>
    </div>
  );
}

export const metadata = {
  generator: "Fahim",
};
