"use client";

import type React from "react";
import { useState } from "react";
import { AppSidebar } from "./app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Menu, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSession, signOut } from "next-auth/react";
import "../../app/globals.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const user = session?.user;

  const handleSignOut = async () => {
    localStorage.clear();
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <AppSidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 left-3 z-50"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[250px]">
          <AppSidebar isMobile />
        </SheetContent>
      </Sheet>

      <SidebarInset className="bg-gray-100 w-full flex flex-col h-screen">
        <header className="flex h-16 items-center justify-between border-b bg-white px-6 py-4">
          <div className="md:hidden w-6"></div> {/* Spacer for mobile */}
          <div className="hidden md:block"></div> {/* Empty div for desktop */}
          <div className="flex items-center gap-4">
            {/* <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                1
              </span>
            </Button> */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {user?.name || "User"}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user?.image || "https://github.com/shadcn.png"}
                      />
                      <AvatarFallback>
                        {user?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard/settings")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </div>
  );
}
