import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@radix-ui/react-dialog";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface LogOutModalProps {
  isLogoutDialogOpen: boolean;
  setIsLogoutDialogOpen: (open: boolean) => void;
  onConfirmLogout: () => void;
}

const LogOutModal = ({ isLogoutDialogOpen, setIsLogoutDialogOpen, onConfirmLogout }: LogOutModalProps) => {
  return (
    <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
      <DialogOverlay className="fixed inset-0 bg-black/50 z-50" />
      <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:max-w-md bg-[#212121] text-white border-none z-50 focus:outline-none p-5 rounded-lg w-[500px] backdrop-blur-lg">
        <div className="flex flex-col items-center justify-center py-4">
          {/* Logo */}
          <div>
            <Link href="/" className="">
              <div className="py-1">
                <div className="flex justify-center">
                  <Image
                    src="/assets/logo-icon.png"
                    alt="Logo"
                    width={1000}
                    height={1000}
                    className="h-[37px] w-[95px]"
                  />
                </div>
                <h1
                  className="text-[32px] logo-size font-normal font-benedict text-white leading-[120%]
                 [text-shadow:_0_0_1px_#fff,_0_0_15px_#fff,_0_0_15px_#fff] mt-[7px]"
                >
                  Walk Throughz
                </h1>
              </div>
            </Link>
          </div>
          <DialogTitle className="text-xl font-bold text-center">
            Möchten Sie sich wirklich abmelden?
          </DialogTitle>
          <div className="flex gap-4 mt-6 w-full">
            <button
              onClick={() => {
                localStorage.clear();
                signOut({ callbackUrl: "/login" });
              }}
              className="flex-1 bg-[#ffffff] border border-white hover:bg-[#7d7260] hover:text-white p-2 rounded-lg"
            >
              Yes
            </button>
            <button
              onClick={() => setIsLogoutDialogOpen(false)}
              className="flex-1 border border-white !bg-[#212211] hover:bg-[#7d7260] hover:text-white p-2 rounded-lg"
            >
              No
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogOutModal;