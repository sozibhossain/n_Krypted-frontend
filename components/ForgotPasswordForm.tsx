"use client";

import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setOpenDialog(true);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Reset konnte nicht gesendet werden");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 px-6 py-8 rounded-xl border border-white shadow-lg max-w-lg mx-auto"
      >
        <div className="text-center">
          <h1 className="text-[26px] lg:text-[32px] font-semibold leading-[120%] mb-2">
            Link anfordern
          </h1>
          <div className="text-white text-[14px] lg:text-[16px] font-normal">
            Gib deine E-Mail ein, um den Link zum Zurücksetzen deines Passworts
            zu erhalten.
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">
            E-Mail
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="Gib deine E-Mail ein"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 bg-[#4b4b4b] border border-gray-600 text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-white text-black hover:bg-gray-200"
          disabled={isLoading}
        >
          {isLoading ? "Link wird verschickt..." : "Passwort zurücksetzen"}
        </Button>
      </form>

      {/* Success Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-lg bg-black border border-gray-700 text-white rounded-xl shadow-xl">
          <DialogHeader className="flex flex-col items-center space-y-3">
            <CheckCircle2 className="text-green-400 w-14 h-14" />
            <DialogTitle className="text-xl font-semibold text-white">
              Überprüfe deine E-Mails
            </DialogTitle>
            <DialogDescription className="text-center text-gray-300">
              Wir haben einen Link zum Zurücksetzen des Passworts an{" "}
              <span className="font-semibold text-white">{email}</span>{" "}
              gesendet.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center">
            <Button
              onClick={() => {
                setOpenDialog(false);
                router.push("/login");
              }}
              className="bg-white text-black hover:bg-gray-200"
            >
              Zum Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
