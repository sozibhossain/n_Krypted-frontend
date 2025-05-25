import { Poppins } from "next/font/google";
import "./globals.css";
import AppProvider from "@/Provider/AppProvider";
import LayoutShell from "./layout-shell";
import { SocketProvider } from "@/Provider/SocketProvider";
import { Toaster } from "@/components/ui/sonner";

// Load Google Font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-poppins",
});


export const metadata = {
  title: " Walk Throughz",
  icons: {
    icon: "/assets/favicon.ico", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-poppins antialiased bg-[#212121]`}>
        <AppProvider>
          <SocketProvider>
            <Toaster position="top-right" />
            <LayoutShell>
              {children}
            </LayoutShell>
          </SocketProvider>
        </AppProvider>
      </body>
    </html>
  );
}
