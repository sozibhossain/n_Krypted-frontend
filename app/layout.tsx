// app/layout.tsx or app/layout.js

import { Poppins } from "next/font/google";
import "./globals.css";
import AppProvider from "@/Provider/AppProvider";
import LayoutShell from "./layout-shell";
import { SocketProvider } from "@/Provider/SocketProvider";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import StripeProvider from "@/components/pyment/StripeProvider";

// Load Poppins font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-poppins",
});

// Site metadata
export const metadata = {
  title: "Walk Throughz",
  icons: {
    icon: "/assets/fav.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  return (
    <html lang="en">
      <body
        className={`${poppins.variable} font-poppins antialiased bg-[#212121]`}
      >
        {/* Dynamically injected PayPal Script */}
        {paypalClientId && (
          <Script
            src={`https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=USD&intent=capture&disable-funding=paylater,venmo`}
            data-sdk-integration-source="button-factory"
            strategy="afterInteractive"
          />
        )}

        <AppProvider>
          <SocketProvider>
            <Toaster position="top-right" />
            <LayoutShell>
              <StripeProvider>{children}</StripeProvider>
            </LayoutShell>
          </SocketProvider>
        </AppProvider>
      </body>
    </html>
  );
}
