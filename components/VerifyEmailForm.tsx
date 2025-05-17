"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { verifyOTP, resendVerificationOTP } from "@/app/actions/auth"
import { CustomOtpInput } from "./custom-otp-input"

export function VerifyEmailForm() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const otpString = otp.join("")
    if (otpString.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-character verification code",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    if (!session?.user.email) {
      toast({
        title: "Error",
        description: "Email not found. Please sign in again.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    try {
      const result = await verifyOTP(session.user.email, otpString)

      if (result.success) {
        toast({
          title: "Success",
          description: "Email verified successfully",
        })

        router.push("/dashboard")
      } else {
        toast({
          title: "Error",
          description: result.message || "Invalid verification code",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (!session?.user.accessToken) {
      toast({
        title: "Error",
        description: "You must be logged in to resend the verification code",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    try {
      const result = await resendVerificationOTP(session.user.accessToken)

      if (result.success) {
        toast({
          title: "Success",
          description: "Verification code has been resent to your email",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to resend verification code",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CustomOtpInput value={otp} onChange={setOtp} disabled={isLoading} />

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleResendOtp}
          className="text-sm text-blue-500 hover:text-blue-400"
          disabled={isLoading}
        >
          Didn&apos;t Receive Code?
        </button>
        <button
          type="button"
          onClick={handleResendOtp}
          className="text-sm text-blue-500 hover:text-blue-400"
          disabled={isLoading}
        >
          RESEND CODE
        </button>
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-white py-2 font-medium text-gray-900 hover:bg-gray-200 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Verifying..." : "Verify"}
      </button>
    </form>
  )
}
