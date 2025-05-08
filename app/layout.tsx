
import { Poppins } from "next/font/google";  // Google Font (Poppins)
import "./globals.css";
import AppProvider from "@/Provider/AppProvider";
import LayoutShell from "./layout-shell";
import { Toaster } from "sonner";
import { SocketProvider } from "@/Provider/SocketProvider";
import { Navbar } from "@/components/navbar";

// Import Poppins font from Google Fonts
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-poppins",
});

// Root layout component with fonts and structure
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
            <LayoutShell>
              <Navbar />
              {children}
            </LayoutShell>
            <Toaster />
          </SocketProvider>
        </AppProvider>
      </body>
    </html>
  );
}
