"use client";

import Layout from "@/components/dashboard/layout";
import Link from "next/link";
import ProfileCard from "./_components/ProfileCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditProfileForm from "./_components/EditProfileForm";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function PersonalInformationPage() {
  const { data: sessionData, status: sessionStatus } = useSession();
  const userId = sessionData?.user?.id;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileFormData, setProfileFormData] = useState<{
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    bio: string;
    image: File | null;
    username: string;
  }>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    bio: "",
    image: null,
    username: "",
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/get/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionData?.user?.accessToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }
      return await response.json();
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (profileData?.data) {
      const { data } = profileData;
      setProfileFormData({
        email: data.email || "",
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        phone: data.phone || "",
        bio: data.bio || "",
        image: data.image || null,
        username: data.username || "",
      });

      if (data.image) {
        setPreviewUrl(
          typeof data.image === "string"
            ? data.image
            : URL.createObjectURL(data.image)
        );
      }
    }
  }, [profileData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setProfileFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append("email", profileFormData.email);
    formDataToSend.append("firstName", profileFormData.firstName);
    formDataToSend.append("lastName", profileFormData.lastName);
    formDataToSend.append("phone", profileFormData.phone);
    formDataToSend.append("bio", profileFormData.bio);
    formDataToSend.append("username", profileFormData.username);

    if (
      profileFormData.image !== null &&
      profileFormData.image instanceof File
    ) {
      formDataToSend.append("image", profileFormData.image);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/update/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${sessionData?.user?.accessToken}`,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      await response.json();
      toast.success("Profile updated successfully");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || sessionStatus === "loading") {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6b614f]"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-4">Settings</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <span>→</span>
            <Link href="/dashboard/settings" className="hover:underline">
              Setting
            </Link>
            <span>›</span>
            <span>personal-information</span>
          </div>
        </div>

        <ProfileCard
          firstName={profileFormData.firstName}
          lastName={profileFormData.lastName}
          username={profileFormData.username}
          previewUrl={previewUrl}
          onEditClick={() => setIsModalOpen(true)}
        />

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Personal Information</DialogTitle>
            </DialogHeader>
            <EditProfileForm
              formData={profileFormData}
              previewUrl={previewUrl}
              isSubmitting={isSubmitting}
              onInputChange={handleInputChange}
              onImageChange={handleImageChange}
              onSubmit={handleSubmit}
              onCancel={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
