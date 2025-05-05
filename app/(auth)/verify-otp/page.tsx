"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Check if email exists in session storage
    const email = sessionStorage.getItem("resetEmail");
    if (!email) {
      router.push("/forgot-password");
    }

    // Focus on first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendDisabled && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendDisabled, countdown]);

  const handleChange = (index: number, value: string) => {
    // Allow only numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Move to previous input on backspace if current input is empty
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);

      // Focus on the last input
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp: otpValue }),
        }
      );

      if (!response.ok) {
        throw new Error("Invalid OTP");
      }

      // Redirect to reset password page
      router.push("/reset-password");
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    const email = sessionStorage.getItem("resetEmail");
    if (!email) {
      router.push("/forgot-password");
      return;
    }

    setResendDisabled(true);
    setCountdown(60);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/resend-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to resend OTP");
      }

      toast("OTP has been resent to your email");
    } catch (error) {
      toast("Failed to resend OTP. Please try again.");
      console.log(error);
      setResendDisabled(false);
    }
  };

  return (
    <div className="bg-gradient-to-l from-[#F5EDE2] to-[#645949] w-full h-screen flex flex-col items-center justify-center">
      <div className="container lg:p-8 bg-[#f8f3ea] rounded-3xl shadow-xl h-[500px]">
        <div className="space-y-6 lg:max-w-xl mx-auto h-full flex flex-col items-center justify-center">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold text-[#6b5d4d]">Enter OTP</h1>
            <p className="text-[#6b5d4d] text-center px-4">
              An OTP has been sent to your email address
              <br />
              please verify it below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={otp[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-14 text-center text-xl font-semibold border border-[#6b5d4d] border-opacity-30 rounded-md bg-transparent focus:border-[#6b5d4d] focus:ring-0 text-[#6b5d4d]"
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full py-6 bg-[#6b5d4d] hover:bg-[#5a4d3d] text-white"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resendDisabled}
              className="text-[#6b5d4d] text-sm underline disabled:opacity-50 disabled:no-underline"
            >
              {resendDisabled
                ? `Resend OTP in ${countdown}s`
                : "Didn't receive OTP? Resend"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
