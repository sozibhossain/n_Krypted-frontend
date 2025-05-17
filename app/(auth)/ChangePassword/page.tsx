import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { ChangePasswordForm } from "@/components/ChangePasswordForm"
import { authOptions } from "@/lib/auth"

export default async function ChangePasswordPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/signin")
  }

  return (
    <div className="container mx-auto max-w-md py-12">
      <div className="rounded-lg bg-gray-800 p-8 text-white">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Change Password</h1>
          <p className="text-gray-400">Update your password</p>
        </div>
        <ChangePasswordForm />
      </div>
    </div>
  )
}
