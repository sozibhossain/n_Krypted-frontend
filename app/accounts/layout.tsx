"use client";
import type React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { LogOut } from "lucide-react";
import PathTracker from "@/Shared/PathTracker";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LogOutModal from "@/Shared/LogOutModal";

export default function AccountsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/accounts") {
      setActiveTab("profile");
    } else if (pathname === "/accounts/settings") {
      setActiveTab("settings");
    } else if (pathname === "/accounts/bid-history") {
      setActiveTab("bid-history");
    } else if (pathname === "/accounts/privacy-policy") {
      setActiveTab("privacy-policy");
    } else if (pathname === "/accounts/terms") {
      setActiveTab("terms");
    }
  }, [pathname]);

  return (
    <div className="container mt-28 min-h-screen">
      <div className="border-b border-black pb-5">
        <PathTracker />
      </div>

      <div className="mt-5">
        <h1 className="text-3xl font-bold text-center mb-6">Accounts</h1>

        <Tabs value={activeTab} className="w-full">
          <TabsList className="w-full flex flex-wrap justify-between bg-background border-b rounded-none h-auto p-0 gap-2 sm:gap-4">
            <TabsTrigger
              value="profile"
              asChild
              className="flex-1 min-w-[120px] text-center rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-2 px-4"
            >
              <Link href="/accounts">My Profile</Link>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              asChild
              className="flex-1 min-w-[120px] text-center rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-2 px-4"
            >
              <Link href="/accounts/settings">Settings</Link>
            </TabsTrigger>
            <TabsTrigger
              value="bid-history"
              asChild
              className="flex-1 min-w-[120px] text-center rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-2 px-4"
            >
              <Link href="/accounts/bid-history">Bid History</Link>
            </TabsTrigger>
            <TabsTrigger
              value="privacy-policy"
              asChild
              className="flex-1 min-w-[120px] text-center rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-2 px-4"
            >
              <Link href="/accounts/privacy-policy">Privacy Policy</Link>
            </TabsTrigger>
            <TabsTrigger
              value="terms"
              asChild
              className="flex-1 min-w-[120px] text-center rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-2 px-4"
            >
              <Link href="/accounts/terms">Terms & Conditions</Link>
            </TabsTrigger>
            <TabsTrigger
              value="logout"
              className="flex-1 min-w-[120px] text-center rounded-none text-red-500 py-2 px-4"
              onClick={() => setIsLogoutDialogOpen(true)}
            >
              <div 
              className="flex items-center justify-center w-full">
                <LogOut className="h-4 w-4 mr-1" /> Log out
              </div>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <LogOutModal 
        isLogoutDialogOpen={isLogoutDialogOpen}  
        setIsLogoutDialogOpen={setIsLogoutDialogOpen}
        />

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}