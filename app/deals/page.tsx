import AllAuction from "@/components/auctions/all-deals";
import { PageHeader } from "@/Shared/PageHeader";
import React, { Suspense } from "react";

export default function page() {
  return (
    <div className="">
      <PageHeader
        title="Alle Deals"
        imge="/assets/picture1.jpg"
      
      />
      <div className="lg:mt-28 container">
        <Suspense fallback={<div>Loading...</div>}>
          <AllAuction />
        </Suspense>
      </div>
    </div>
  );
}
