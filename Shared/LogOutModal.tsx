import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@radix-ui/react-dialog";
import { signOut } from "next-auth/react";
import Image from "next/image";
import React from "react";

interface LogOutModalProps {
  isLogoutDialogOpen: boolean;
  setIsLogoutDialogOpen: (open: boolean) => void;
}

const LogOutModal = ({ isLogoutDialogOpen, setIsLogoutDialogOpen }: LogOutModalProps) => {
  return (
    <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
      <DialogOverlay className="fixed inset-0 bg-black/50 z-50" />
      <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:max-w-md bg-[#6b614f] text-white border-none z-50 focus:outline-none p-5 rounded-lg w-[500px] backdrop-blur-lg">
        <div className="flex flex-col items-center justify-center py-4">
          <Image
            src="/assets/logo.png"
            alt="Diamond Auctions"
            width={50}
            height={50}
            className="mb-4"
          />
          <DialogTitle className="text-xl font-bold text-center">
            Are You Sure To Log Out?
          </DialogTitle>
          <div className="flex gap-4 mt-6 w-full">
            <Button
              onClick={() => {
                localStorage.clear();
                signOut({ callbackUrl: "/login" });
              }}
              className="flex-1 bg-[#6b614f] border border-white hover:bg-[#7d7260]"
              variant="outline"
            >
              Yes
            </Button>
            <Button
              onClick={() => setIsLogoutDialogOpen(false)}
              className="flex-1 border border-white !bg-black"
            >
              No
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LogOutModal;