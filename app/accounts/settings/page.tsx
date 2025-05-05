"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Image from "next/image";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

const placeholderImg = "data:image/jpeg;base64,/9j/..."; // Truncated for brevity

interface Address {
  street: string;
  city: string;
  country: string;
  postalCode: string;
  taxId: string;
}

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  bio: string;
  image: string;
  address: Address;
}

interface FormValues {
  firstName: string;
  lastName: string;
  bio: string;
  address: Address;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SettingsPage() {
  const session = useSession();

  const userID = session?.data?.user.id;
  const token = session?.data?.user?.accessToken;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>();

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userID || !token) return;
      try {
        const response = await fetch(`${BASE_URL}/profile/get/${userID}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data.status) {
          const profile: UserProfile = data.data;
          reset({
            firstName: profile.firstName,
            lastName: profile.lastName,
            bio: profile.bio,
            address: profile.address,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          setPreviewImage(profile.image || null);
        } else {
          console.error("Failed to fetch profile:", data.message);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userID, token, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (data: FormValues) => {
    if (!userID || !token) return;
    setSavingProfile(true);

    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("bio", data.bio);
      formData.append("address[street]", data.address.street);
      formData.append("address[city]", data.address.city);
      formData.append("address[country]", data.address.country);
      formData.append("address[postalCode]", data.address.postalCode);
      formData.append("address[taxId]", data.address.taxId);

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const profileResponse = await fetch(
        `${BASE_URL}/profile/update/${userID}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const profileData = await profileResponse.json();

      if (profileData.status === true) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(profileData.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (data: FormValues) => {
    if (!userID || !token) return;

    if (data.newPassword !== data.confirmPassword) {
      setError("confirmPassword", { message: "New passwords do not match" });
      return;
    }

    setChangingPassword(true);

    try {
      const passwordResponse = await fetch(
        `${BASE_URL}/profile/password/${userID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword,
          }),
        }
      );

      const passwordData = await passwordResponse.json();

      if (passwordData.status) {
        toast.success("Password updated successfully!");
      } else {
        toast.error(passwordData.message || "Failed to update password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Something went wrong");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading profile...</div>;
  }

  return (
    <form>
      <div className="space-y-8 text-[#645949]">
        {/* Personal Info */}
        <Card className="bg-[#eee5da] p-5">
          <CardHeader>
            <CardTitle className="text-xl font-bold mb-5">
              Edit Personal Information
            </CardTitle>
          </CardHeader>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <Image
                src={previewImage || placeholderImg}
                alt="Profile"
                width={96}
                height={96}
                className="h-24 w-24 border-2 border-[#645949] rounded-full"
              />
              <label
                htmlFor="profileImage"
                className="absolute bottom-0 right-0 bg-[#645949] p-1 rounded-full cursor-pointer"
              >
                ✏️
              </label>
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  className="p-3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...register("lastName")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                {...register("bio")}
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card className="bg-[#eee5da] p-5">
          <CardHeader>
            <CardTitle className="text-xl font-bold mb-5">
              Edit Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address.country">Country</Label>
              <Input id="address.country" {...register("address.country")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address.city">City/State</Label>
              <Input id="address.city" {...register("address.city")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address.street">Road/Area</Label>
              <Input id="address.street" {...register("address.street")} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address.postalCode">Postal Code</Label>
                <Input
                  id="address.postalCode"
                  {...register("address.postalCode")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address.taxId">TAX ID</Label>
                <Input id="address.taxId" {...register("address.taxId")} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSubmit(handleProfileUpdate)}
            disabled={savingProfile}
            className="bg-[#645949] px-10"
          >
            {savingProfile ? "Saving..." : "Save Profile"}
          </Button>
        </div>

        {/* Password */}
        <Card className="bg-[#eee5da] p-5">
          <CardHeader>
            <CardTitle className="text-xl font-bold mb-5">
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                {...register("currentPassword")}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...register("newPassword")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handleSubmit(handleChangePassword)}
                disabled={changingPassword}
                className="bg-[#645949] px-10"
              >
                {changingPassword ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
