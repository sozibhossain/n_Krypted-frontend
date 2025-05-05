import Notifications from "@/components/Notifications";
import PathTracker from "@/Shared/PathTracker";
import React from "react";

const page = () => {
  return (
    <div className="mt-28 container">
      <div className="border-b border-black pb-5">
        <PathTracker />
      </div>

      <div className="mt-5">
        <Notifications />
      </div>
    </div>
  );
};

export default page;
