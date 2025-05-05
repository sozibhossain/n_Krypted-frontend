"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send OTP");
      }

      // Store email in session storage for later use
      sessionStorage.setItem("resetEmail", email);

      // Redirect to OTP verification page
      router.push("/verify-otp");
    } catch (error) {
      toast("Failed to send OTP. Please try again.");
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
              Forgot Password
            </h1>
            <p className="text-[#6b5d4d]">
              Enter your email to receive the OTP
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 py-6 bg-transparent border-[#6b5d4d] border-opacity-30 focus:border-[#6b5d4d] focus:ring-0 lg:w-[500px]"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6b5d4d] h-5 w-5" />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-6 bg-[#6b5d4d] hover:bg-[#5a4d3d] text-white"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
