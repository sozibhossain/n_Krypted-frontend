
import { Poppins } from "next/font/google";  // Google Font (Poppins)
import "./globals.css";
import AppProvider from "@/Provider/AppProvider";
import LayoutShell from "./layout-shell";
// import { Toaster } from "";
import { SocketProvider } from "@/Provider/SocketProvider";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { CategoriesAndSearchBar } from "@/components/categoriesAndSearchBer";

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
            <Toaster position="top-right"/>
            <LayoutShell>
              <Navbar />
              <CategoriesAndSearchBar />
              {children}
            </LayoutShell>
          </SocketProvider>
        </AppProvider>
      </body>
    </html>
  );
}
