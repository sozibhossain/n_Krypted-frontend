"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Pencil } from "lucide-react"

export default function ProfileCard({
  firstName,
  lastName,
  username,
  previewUrl,
  onEditClick
}: {
  firstName: string
  lastName: string
  username: string
  previewUrl: string
  onEditClick: () => void
}) {
  return (
    <div className="border rounded-lg p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
          <Image
            src={previewUrl || "/placeholder.svg"}
            alt="Profile"
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold">
            {firstName} {lastName}
          </h2>
          <p className="text-muted-foreground">@{username || "username"}</p>
        </div>
      </div>
      <Button
        variant="outline"
        className="bg-[#6b614f] hover:bg-[#9c732c] text-white hover:text-white"
        onClick={onEditClick}
      >
        <Pencil className="h-4 w-4 mr-2" /> Edit
      </Button>
    </div>
  )
}