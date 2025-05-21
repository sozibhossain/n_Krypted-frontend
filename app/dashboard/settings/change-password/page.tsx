"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { useSession } from "next-auth/react"


import Layout from "@/components/dashboard/layout"
import { Eye, EyeOff, Check, X } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export default function ChangePasswordPage() {
  const { data: session } = useSession()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Password strength validation
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  })

  // Validate password strength
  const validatePasswordStrength = (password: string) => {
    const hasMinLength = password.length >= 8
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)

    // Calculate score (0-5)
    const criteria = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar]
    const score = criteria.filter(Boolean).length

    setPasswordStrength({
      score,
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
    })
  }

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNewPassword(value)
    validatePasswordStrength(value)
  }

  const getStrengthColor = () => {
    if (passwordStrength.score === 0) return "bg-gray-200"
    if (passwordStrength.score < 3) return "bg-red-500"
    if (passwordStrength.score < 5) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getStrengthLabel = () => {
    if (newPassword.length === 0) return ""
    if (passwordStrength.score < 3) return "Weak"
    if (passwordStrength.score < 5) return "Medium"
    return "Strong"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (passwordStrength.score < 3) {
      setError("Password is too weak. Please create a stronger password.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      return
    }

    if (!session?.user?.id) {
      setError("User session not found")
      return
    }

    startTransition(async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/change-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            userId: session.user.id,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to change password")
        }

        toast.success("Password changed successfully")
        // Clear form
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setPasswordStrength({
          score: 0,
          hasMinLength: false,
          hasUppercase: false,
          hasLowercase: false,
          hasNumber: false,
          hasSpecialChar: false,
        })
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred")
      }
    })
  }

  return (
    <Layout>
      <div className="space-y-6 p-4">
        <div>
          <h1 className="text-[40px] text-[#1F2937] font-bold tracking-tigh pb-4">Change Password</h1>
     
          <div className="flex items-center gap-2 text-xl text-[#595959]">
            <Link  href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <span>&gt;</span>
            <Link href="/dashboard/settings" className="hover:underline">
              Settings
            </Link>
            <span>&gt;</span>
            <span>Change Password</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 max-w-md">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md">{error}</div>}

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="block text-sm font-medium">
                Current Password
              </label>
              <div className="relative">
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-sm font-medium">
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password strength meter */}
              {newPassword.length > 0 && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm">
                      Password strength: <span className="font-medium">{getStrengthLabel()}</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStrengthColor()} transition-all duration-300`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>

                  {/* Password requirements */}
                  <ul className="space-y-1 text-sm mt-2">
                    <li className="flex items-center gap-2">
                      {passwordStrength.hasMinLength ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span>At least 8 characters</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {passwordStrength.hasUppercase ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span>At least one uppercase letter</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {passwordStrength.hasLowercase ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span>At least one lowercase letter</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {passwordStrength.hasNumber ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span>At least one number</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {passwordStrength.hasSpecialChar ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span>At least one special character</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-red-500 mt-1">Passwords don&apos; t match</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending || passwordStrength.score < 3 || newPassword !== confirmPassword}
            className="px-4 py-2 bg-[#212121] text-white rounded-md hover:bg-[#212121]/90 focus:outline-none focus:ring-2 focus:ring-[#212121] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Changing Password..." : "Change Password"}
          </Button>
        </form>
      </div>
    </Layout>
  )
}
