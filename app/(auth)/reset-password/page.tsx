"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get email from session storage
    const storedEmail = sessionStorage.getItem("resetEmail");
    if (!storedEmail) {
      router.push("/forgot-password");
      return;
    }

    setEmail(storedEmail);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            newPassword: password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reset password");
      }

      toast.success("Your password has been reset successfully");

      // Clear session storage
      sessionStorage.removeItem("resetEmail");

      // Redirect to login page after a delay

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      toast("Failed to reset password. Please try again.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-l from-[#F5EDE2] to-[#645949] w-full h-screen flex flex-col items-center justify-center">
      <div className="container lg:p-8 bg-[#f8f3ea] rounded-3xl shadow-xl h-[500px]">
        <div className="space-y-6 lg:max-w-xl mx-auto h-full flex flex-col items-center justify-center">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold text-[#6b5d4d]">
              Reset Password
            </h1>
            <p className="text-[#6b5d4d]">
              Please kindly set your new password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled
                  className="pl-10 py-6 bg-transparent border-[#6b5d4d] border-opacity-30 focus:border-[#6b5d4d] focus:ring-0 opacity-70"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b5d4d] h-5 w-5 opacity-70" />
              </div>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 py-6 bg-transparent border-[#6b5d4d] border-opacity-30 focus:border-[#6b5d4d] focus:ring-0 lg:w-[500px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6b5d4d]"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-6 bg-[#6b5d4d] hover:bg-[#5a4d3d] text-white"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Continue"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
