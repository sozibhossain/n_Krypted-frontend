import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { ChangePasswordForm } from "@/components/ChangePasswordForm"
import { authOptions } from "@/lib/auth"
import { Suspense } from "react"

export default async function ChangePasswordPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/signin")
  }

  return (
    <div className="container mx-auto max-w-md py-12">
      <div className="rounded-lg bg-gray-800 p-8 text-white">
        <div className="mb-6 text-center">
          <h1 className="text-[26px] lg:text-[32px] font-semibold leading-[120%]">Change Password</h1>
          <p className="text-white text-[14px] lg:text-[16px] font-normal">Update your password</p>
        </div>
        <Suspense fallback={<div>Loading...</div>}><ChangePasswordForm /></Suspense>
      </div>
    </div>
  )
}
