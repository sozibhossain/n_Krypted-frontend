"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

import Image from "next/image"
import { useSession } from "next-auth/react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Pencil, X, Camera } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import Layout from "@/components/dashboard/layout"

interface UserData {
  _id: string
  name: string
  lastName?: string
  email: string
  phoneNumber: string
  country: string
  cityState: string
  image?: string
  role: string
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]

export default function PersonalInformation() {

  const { data: session } = useSession()
  const userId = session?.user?.id
  const fileInputRef = useRef<HTMLInputElement>(null)

  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<UserData>>({})
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Fetch user data
  const { data: userData,  } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/single-user/${userId}`)
      if (!res.ok) throw new Error("Failed to fetch user data")
      return res.json()
    },
    enabled: !!session?.user?.id,
  })

  // Update form data when user data is loaded
  useEffect(() => {
    if (userData?.data) {
      setFormData({
        name: userData.data.name,
        lastName: userData.data.lastName,
        email: userData.data.email,
        phoneNumber: userData.data.phoneNumber,
        country: userData.data.country,
        cityState: userData.data.cityState,
      })
      setPreviewImage(userData.data.avatar || null)
    }
  }, [userData])

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: FormData) => {
      setIsUploading(true)
      setUploadError(null)

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/update-profile`, {
          method: "PUT",
          body: data,
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.message || "Failed to update profile")
        }

        return res.json()
      } finally {
        setIsUploading(false)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData"] })
      toast.success("Profile updated successfully")
      setIsEditing(false)
    },
    onError: (error) => {
      setUploadError(error.message || "Failed to update profile")
      toast.error(error.message || "Failed to update profile")
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateImageFile = (file: File): boolean => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setUploadError(`File size exceeds 5MB limit (${(file.size / (1024 * 1024)).toFixed(2)}MB)`)
      return false
    }

    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setUploadError("Only JPEG, PNG, GIF and WebP images are allowed")
      return false
    }

    setUploadError(null)
    return true
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      if (validateImageFile(file)) {
        setImageFile(file)
        setPreviewImage(URL.createObjectURL(file))
      } else {
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formDataToSend = new FormData()

    // Append all form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined) {
        formDataToSend.append(key, value.toString())
      }
    })

    // Append image if selected
    if (imageFile) {
      formDataToSend.append("avatar", imageFile)
    }

    // Append userId to the form data
    if (userId) {
      formDataToSend.append("userId", userId)
    }

    updateProfileMutation.mutate(formDataToSend)
  }

  const resetForm = () => {
    if (userData?.data) {
      setFormData({
        name: userData.data.name,
        lastName: userData.data.lastName,
        email: userData.data.email,
        phoneNumber: userData.data.phoneNumber,
        country: userData.data.country,
        cityState: userData.data.cityState,
      })
      setPreviewImage(userData?.data.avatar || null)
      setImageFile(null)
      setUploadError(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

 

  return (
    <Layout>
      <div className="">
        <div className="space-y-0.5">
          <h2 className="text-[40px] text-[#1F2937] font-bold tracking-tigh">Settings</h2>
          <div className="text-xl text-[#595959]">
            <span>Dashboard</span> &gt; <span>Settings</span> &gt; <span>Personal Information</span>
          </div>
        </div>

        <div className="grid md:grid-cols-[2fr_1fr] gap-6 mt-10">
          <Card className="bg-white shadow-lg rounded-[8px] p-6">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Personal Information</h3>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1"
                  >
                    <Pencil className="h-4 w-4" /> Edit
                  </Button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">First Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
            
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cityState">City/State</Label>
                    <Input
                      id="cityState"
                      name="cityState"
                      value={formData.cityState || ""}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false)
                        resetForm()
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending || isUploading}
                      className="min-w-[120px]"
                    >
                      {updateProfileMutation.isPending || isUploading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg rounded-[8px] p-6">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="relative w-32 h-32 mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2 border-gray-200">
                  {previewImage ? (
                    <Image
                      src={previewImage || "/placeholder.svg"}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-3xl font-bold text-muted-foreground">
                        {formData.name?.[0]}
                        {formData.lastName?.[0]}
                      </span>
                    </div>
                  )}
                </div>

                {isEditing && previewImage && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <h3 className="text-lg font-semibold">
                {formData.name} {formData.lastName}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">{userData?.data?.role || "User"}</p>

              {isEditing && (
                <div className="w-full space-y-3">
                  <Label htmlFor="profileImage" className="block text-sm font-medium mb-1">
                    Profile Image
                  </Label>
                  <Input
                    id="profileImage"
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => document.getElementById("profileImage")?.click()}
                    >
                      <Camera className="h-4 w-4" />
                      {previewImage ? "Change Avatar" : "Upload Avatar"}
                    </Button>

                    {uploadError && <p className="text-red-500 text-xs mt-1">{uploadError}</p>}
                    <p className="text-xs text-muted-foreground mt-1">
                      Supported formats: JPEG, PNG, GIF, WebP. Max size: 5MB
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
