"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Edit2 } from "lucide-react";
import Link from "next/link";
// import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react";

// Static user ID for now
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

const placeholderImg =
  "data:image/jpeg;base64,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";

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  bio: string;
  image: string;
  sellerId: string;
  address: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
    taxId: string;
  };
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  // const router = useRouter();
  const session = useSession();

  const userID = session?.data?.user.id;
  const token = session?.data?.user?.accessToken;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${BASE_URL}/profile/get/${userID}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        console.log(data);

        if (data.status) {
          setProfile(data.data);
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
  }, [userID, token]);

  if (loading) {
    return <div className="flex justify-center p-8">Loading profile...</div>;
  }

  if (!profile) {
    return (
      <div className="flex justify-center p-8">Failed to load profile</div>
    );
  }

  return (
    <>
      <Card className="mb-8 bg-[#eee5da] text-[#645949]">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Avatar className="h-24 w-24 border-2 border-[#645949]">
              <AvatarImage
                src={profile.image || placeholderImg}
                alt={profile.username}
              />
              <AvatarFallback>
                {profile.firstName?.charAt(0)}
                {profile.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-semibold">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-muted-foreground">@{profile.username}</p>
              <p className="mt-1">
                {profile.address?.street}, {profile.address?.city},{" "}
                {profile.address?.country} {profile.address?.postalCode}
              </p>
              <Button className="mt-4 bg-[#645949] text-white" asChild>
                <Link href="/seller-dashboard">
                  <span className="flex items-center">
                    Go To Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8 bg-[#eee5da] p-8 text-[#645949]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <h3 className="text-xl font-bold mb-5">Personal Information</h3>
          <Button className="bg-[#645949]" asChild>
            <Link href="/accounts/settings">
              <Edit2 className="h-4 w-4" /> Edit
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" value={profile.firstName} readOnly />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" value={profile.lastName} readOnly />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" value={profile.email} readOnly />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              readOnly
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#eee5da] p-8 text-[#645949]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <h3 className="text-xl font-bold mb-5">Address</h3>
          <Button className="bg-[#645949]" asChild>
            <Link href="/accounts/settings">
              <Edit2 className="h-4 w-4" /> Edit
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" value={profile.address?.country} readOnly />
          </div>
          <div>
            <Label htmlFor="city">City/State</Label>
            <Input id="city" value={profile.address?.city} readOnly />
          </div>
          <div>
            <Label htmlFor="street">Road/Area</Label>
            <Input id="street" value={profile.address?.street} readOnly />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={profile.address?.postalCode}
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="taxId">TAX ID</Label>
              <Input id="taxId" value={profile.address?.taxId} readOnly />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
