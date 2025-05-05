import AllAuction from "@/components/auctions/all-auction";
import PathTracker from "@/Shared/PathTracker";
import React from "react";

export default function page() {
  return (
    <div className="mt-28 container">
      <div className="border-b border-black pb-5">
        <PathTracker />
      </div>
      <div className="">
        <AllAuction />
      </div>
    </div>
  );
}
