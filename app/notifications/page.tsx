import Notifications from "@/components/Notifications";
import { PageHeader } from "@/Shared/PageHeader";
import React from "react";

const page = () => {
  return (
    <div className="">
      <PageHeader
        title="Notifications"
        imge="/assets/herobg.png"
        items={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "notifications",
            href: "/notifications",
          },
        ]}
      />
      <div className="py-28 container">
        <Notifications />
      </div>
    </div>
  );
};

export default page;
