"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  const sharch = useSearchParams();

  useEffect(() => {
    const storedEmail = sharch.get("email");
    if (!storedEmail) {
      toast.error("E-Mail nicht in URL-Parametern gefunden");
    } else {
      setEmail(storedEmail);
    }

    if (sharch.get("token") === null && sharch.get("email") === null) {
      window.location.href = "/";
    }
  }, [sharch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwörter stimmen nicht überein");
      return;
    }

    if (password.length < 8) {
      toast.error("Das Passwort muss mindestens 8 Zeichen lang sein");
      return;
    }

    setIsLoading(true);
    const resetToken = sharch.get("token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            token: resetToken,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Passwort erfolgreich zurückgesetzt!");
        sessionStorage.removeItem("resetEmail");
        sessionStorage.removeItem("resetToken");
        router.push("/login");
      } else {
        toast.error(
          data.message || "Das Zurücksetzen des Passworts ist fehlgeschlagen."
        );
      }
    } catch {
      toast.error(
        "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-[#212121] px-[24px] py-[5px] rounded-lg text-white"
    >
      <div className="space-y-2">
        <Label htmlFor="password" className="text-white">
          Neues Passwort
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-300" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Neues Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pl-10 pr-10 bg-[#4b4b4b] border border-gray-600 text-white placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-300"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-white">
          Passwort bestätigen
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-300" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Passwort bestätigen"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="pl-10 pr-10 bg-[#4b4b4b] border border-gray-600 text-white placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-gray-300"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-white text-black hover:bg-gray-200"
        disabled={isLoading}
      >
        {isLoading ? "Passwort wird zurückgesetzt..." : "Zurücksetzen"}
      </Button>
    </form>
  );
}
