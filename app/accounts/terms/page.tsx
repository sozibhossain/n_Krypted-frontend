

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react"

interface PolicySection {
  _id: string;
  text: string;
}

export default function TermsConditionsPage() {   

  const [privacyData, setPrivacyData] = useState<PolicySection[]>([]);
  const session = useSession();
  const token = session?.data?.user?.accessToken;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/terms`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();
        setPrivacyData(data.data);
      } catch (error) {
        console.error("Failed to fetch privacy policy:", error);
      }
    };

    fetchData();
  }, [token]);

  console.log(privacyData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Terms & Conditions</CardTitle>
      </CardHeader>
      <CardContent className="prose max-w-non mt-5">
        {privacyData?.length === 0 ? (
          <p>Loading privacy policy...</p>
        ) : (
          privacyData?.map((section) => (
            <div key={section._id} className="mb-6">
              <div className="list-item list-none" dangerouslySetInnerHTML={{ __html: section.text ?? "Blog Description" }} />

            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

