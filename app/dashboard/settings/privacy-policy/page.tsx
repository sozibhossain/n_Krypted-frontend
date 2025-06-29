"use client";

import React, { useState, useEffect } from "react";
import Layout from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import QuillEditor from "../../blogs/_components/QuillEditor";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface TermsData {
  _id?: string;
  text?: string;
}

export default function PrivacyPolicyPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken || "";

  const [terms, setTerms] = useState<TermsData | null>(null);
  const [content, setContent] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/policy`);
        if (!response.ok) {
          throw new Error("Failed to fetch terms");
        }
        const res = await response.json();
        const data = res.data[0].text;
        setTerms(data);
        setContent(data || "hello");
      } catch (error) {
        console.error("Error fetching terms:", error);
      }
    };

    fetchTerms();
  }, []);

  console.log("terms", terms);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/policy/update/6805fb8db656d802be836463`, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: content }),
      });

      if (!response.ok) {
        throw new Error("Failed to save terms");
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error saving terms:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Privacy Policy</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <span>→</span>
            <Link href="/dashboard/settings" className="hover:underline">
              Setting
            </Link>
            <span>›</span>
            <span>PrivacyPolicy</span>
          </div>
        </div>


        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="content">Description</Label>
            <div className="rounded-md border">
              <QuillEditor id="content" value={content} onChange={setContent} />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#6b614f] hover:bg-[#5c5343]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
