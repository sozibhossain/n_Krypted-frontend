"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Gavel,
  Users,
  User,
  FileText,
  Settings,
  LogOut,
  HandCoins,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react";
import LogOutModal from "@/Shared/LogOutModal";

interface AppSidebarProps {
  isMobile?: boolean;
}

export function AppSidebar({ }: AppSidebarProps) {
  const pathname = usePathname();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const { data: session } = useSession();
  const role = session?.user?.role;

  const isActive = (path: string) => {
    return pathname === path;
  };

  const isSellerActive = (path: string) => {
    // For the dashboard paths, we want exact matches
    if (path === "/seller-dashboard" || path === "/dashboard") {
      return pathname === path || pathname === path + "/";
    }
    // For other paths, check if it starts with the path (but not the dashboards)
    return pathname.startsWith(path) && 
           path !== "/seller-dashboard" && 
           path !== "/dashboard";
  };


  return (
    <>
      <Sidebar className="border-r-0" collapsible="none">
        <SidebarHeader className="h-[72px] flex items-center justify-center border-b border-[#5c5343] bg-[#645949]">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/logo.png"
                alt="Diamond Auctions"
                width={100}
                height={100}
                className="w-[46px] h-[39px]"
              />
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-4 bg-[#6b614f]">
          <SidebarMenu className="space-y-2">
            {role === "admin" ? (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/dashboard")}
                    className="text-white py-6 hover:bg-[#7d7260] hover:text-white data-[active=true]:bg-[#BDA888] data-[active=true]:font-semibold"
                  >
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3">
                      <LayoutDashboard className="h-5 w-5 text-white" />
                      <span className="text-base font-medium text-white">Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/dashboard/categories")}
                    className="text-white py-6 hover:bg-[#7d7260] hover:text-white data-[active=true]:bg-[#BDA888] data-[active=true]:font-semibold"
                  >
                    <Link href="/dashboard/categories" className="flex items-center gap-3 px-4 py-3">
                      <Layers className="h-5 w-5 text-white" />
                      <span className="text-base font-medium text-white">Categories</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/dashboard/auctions")}
                    className="text-white py-6 hover:bg-[#7d7260] hover:text-white data-[active=true]:bg-[#BDA888] data-[active=true]:font-semibold"
                  >
                    <Link href="/dashboard/auctions" className="flex items-center gap-3 px-4 py-3">
                      <Gavel className="h-5 w-5 text-white" />
                      <span className="text-base font-medium text-white">Auctions</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/dashboard/bidders")}
                    className="text-white py-6 hover:bg-[#7d7260] hover:text-white data-[active=true]:bg-[#BDA888] data-[active=true]:font-semibold"
                  >
                    <Link href="/dashboard/bidders" className="flex items-center gap-3 px-4 py-3">
                      <Users className="h-5 w-5 text-white" />
                      <span className="text-base font-medium text-white">Bidders</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/dashboard/seller")}
                    className="text-white py-6 hover:bg-[#7d7260] hover:text-white data-[active=true]:bg-[#BDA888] data-[active=true]:font-semibold"
                  >
                    <Link href="/dashboard/seller" className="flex items-center gap-3 px-4 py-3">
                      <User className="h-5 w-5 text-white" />
                      <span className="text-base font-medium text-white">Seller</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive("/dashboard/blogs")}
                    className="text-white py-6 hover:bg-[#7d7260] hover:text-white data-[active=true]:bg-[#BDA888] data-[active=true]:font-semibold"
                  >
                    <Link href="/dashboard/blogs" className="flex items-center gap-3 px-4 py-3">
                      <FileText className="h-5 w-5 text-white" />
                      <span className="text-base font-medium text-white">Blogs Management</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith("/dashboard/settings")}
                    className="text-white py-6 hover:bg-[#7d7260] hover:text-white data-[active=true]:bg-[#BDA888] data-[active=true]:font-semibold"
                  >
                    <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3">
                      <Settings className="h-5 w-5 text-white" />
                      <span className="text-base font-medium text-white">Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            ) : (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isSellerActive("/seller-dashboard")}
                    className="text-white py-6 hover:bg-[#7d7260] hover:text-white data-[active=true]:bg-[#BDA888] data-[active=true]:font-semibold"
                  >
                    <Link href="/seller-dashboard" className="flex items-center gap-3 px-4 py-3">
                      <LayoutDashboard className="h-5 w-5 text-white" />
                      <span className="text-base font-medium text-white">Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isSellerActive("/seller-dashboard/auctions")}
                    className="text-white py-6 hover:bg-[#7d7260] hover:text-white data-[active=true]:bg-[#BDA888] data-[active=true]:font-semibold"
                  >
                    <Link href="/seller-dashboard/auctions" className="flex items-center gap-3 px-4 py-3">
                      <Gavel className="h-5 w-5 text-white" />
                      <span className="text-base font-medium text-white">Auctions</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isSellerActive("/seller-dashboard/bids")}
                    className="text-white py-6 hover:bg-[#7d7260] hover:text-white data-[active=true]:bg-[#BDA888] data-[active=true]:font-semibold"
                  >
                    <Link href="/seller-dashboard/bids" className="flex items-center gap-3 px-4 py-3">
                      <HandCoins className="h-5 w-5 text-white" />
                      <span className="text-base font-medium text-white">Bids</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}
          </SidebarMenu>
        </SidebarContent>
        <div className="mt-auto p-4 bg-[#6b614f] border-t border-[#5c5343]">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setIsLogoutDialogOpen(true)}
                className="text-white hover:bg-[#7d7260] hover:text-white flex items-center gap-3 px-4 py-3"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </Sidebar>

      <LogOutModal isLogoutDialogOpen={isLogoutDialogOpen} setIsLogoutDialogOpen={setIsLogoutDialogOpen}/>
    </>
  );
}