"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile-nav";
import { BellRing, Heart, Menu, Search, UserRound } from "lucide-react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSocketContext } from "@/Provider/SocketProvider";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Auctions", href: "/auctions" },
  { name: "About Us", href: "/about-us" },
  { name: "FAQ", href: "/faq" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

const fetchWishlist = async (token: string | undefined) => {
  if (!token) return null;
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch wishlist");
  }
  return response.json();
};

export function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const isMobile = useMobile();
  const pathname = usePathname();
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  const session = useSession();
  const token = session?.data?.user?.accessToken;

  const { data: wishlistData } = useQuery({
    queryKey: ["wishlist-length"],
    queryFn: () => fetchWishlist(token),
    enabled: isLoggedIn,
    refetchInterval: 5000,
  });

  const wishlists = wishlistData?.data?.auctions || [];

  const { notificationCount, setNotificationCount } = useSocketContext();

  const markNotificationsAsRead = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bids/notifications/mark-as-read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("notificationCount");
      setNotificationCount(null);
      if (!res.ok) throw new Error("Failed to mark notifications as read");
    } catch (error) {
      console.error(error);
    }
  };

  const iconLinks = [
    { icon: Heart, href: "/wishlist", count: wishlists?.length },
    { icon: BellRing, href: "/notifications", count: notificationCount },
    { icon: UserRound, href: "/accounts" },
  ];

  const getIconClasses = (href: string) => `
    relative border-2 rounded-full p-2 transition-colors
    ${
      pathname.startsWith(href)
        ? "border-[#E6C475]"
        : "border-[#D1D1D1] hover:border-[#E4C072] hover:bg-[#E4C072]"
    }
  `;

  const getIconColor = (href: string) =>
    pathname.startsWith(href) ? "text-[#E6C475]" : "text-white";

  const isActive = (href: string) => {
    if (href === "/") return pathname === href;
    return pathname.startsWith(href);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      router.push(`/auctions?searchTerm=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-[#817667] h-[83px] flex justify-center flex-col">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/logo.png"
              alt="Logo"
              width={46}
              height={39}
              className="h-[39px] w-[46px]"
            />
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <div>
          {!isMobile && (
            <nav className="hidden md:flex md:gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[16px] font-medium text-white transition-colors hover:text-[#E4C072] ${
                    isActive(link.href) ? "text-[#E4C072]" : ""
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative w-full max-w-[160px] sm:max-w-sm">
            <Input
              placeholder="Search..."
              className="pr-8 h-[32px] w-full border border-[#D1D1D1] focus:outline-none placeholder:text-gray-400 text-white text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
            />
            <Search className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-white" />
          </div>

          {/* Login Button */}
          {!isLoggedIn && (
            <Link href="/login" className="hidden md:block">
              <Button variant="default" className="px-6 hidden lg:block">
                Login
              </Button>
            </Link>
          )}

          {/* Icons when logged in */}
          {isLoggedIn && (
            <div className="flex items-center gap-2 sm:gap-4">
              {iconLinks.map(({ icon: Icon, href, count }) =>
                href === "/notifications" ? (
                  <button
                    key={href}
                    onClick={async (e) => {
                      e.preventDefault();
                      await markNotificationsAsRead();
                      router.push("/notifications");
                    }}
                    className={getIconClasses(href)}
                  >
                    <Icon className={getIconColor(href)} size={20} />
                    {count > 0 && (
                      <span className="absolute top-[-8px] right-[-8px] bg-[#E4C072] text-white rounded-full text-[10px] px-[6px] font-semibold">
                        {count}
                      </span>
                    )}
                  </button>
                ) : (
                  <Link key={href} href={href} className={getIconClasses(href)}>
                    <Icon className={getIconColor(href)} size={20} />
                    {count > 0 && (
                      <span className="absolute top-[-8px] right-[-8px] bg-[#E4C072] text-white rounded-full text-[10px] px-[6px] font-semibold">
                        {count}
                      </span>
                    )}
                  </Link>
                )
              )}
            </div>
          )}

          {/* Mobile Menu */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5 text-white" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[300px] bg-[#f5f0e8]">
                <nav className="flex flex-col gap-4 pt-10">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`text-base font-medium text-muted-foreground transition-colors hover:text-foreground ${
                        isActive(link.href) ? "text-foreground" : ""
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                  {!isLoggedIn ? (
                    <Link
                      href="/login"
                      className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Login
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/wishlist"
                        className={`relative text-base font-medium text-muted-foreground transition-colors hover:text-foreground ${
                          isActive("/wishlist") ? "text-foreground" : ""
                        }`}
                      >
                        Wishlist
                        {wishlists?.length > 0 && (
                          <span className="absolute top-[-8px] right-[-8px] bg-[#E4C072] text-white rounded-full text-[10px] px-[6px] font-semibold">
                            {wishlists.length}
                          </span>
                        )}
                      </Link>
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          await markNotificationsAsRead();
                          router.push("/notifications");
                        }}
                        className={`relative text-base font-medium text-muted-foreground transition-colors hover:text-foreground ${
                          isActive("/notifications") ? "text-foreground" : ""
                        }`}
                      >
                        Notifications
                        {typeof notificationCount === "number" && notificationCount > 0 && (
                          <span className="absolute top-[-8px] right-[-8px] bg-[#E4C072] text-white rounded-full text-[10px] px-[6px] font-semibold">
                            {notificationCount}
                          </span>
                        )}
                      </button>
                      <Link
                        href="/accounts"
                        className={`text-base font-medium text-muted-foreground transition-colors hover:text-foreground ${
                          isActive("/accounts") ? "text-foreground" : ""
                        }`}
                      >
                        My Account
                      </Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}
