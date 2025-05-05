import Faq from "@/components/faq";
import { PageHeader } from "@/Shared/PageHeader";
import Image from "next/image";

const page = () => {
  return (
    <div>
      <PageHeader
        title="Frequently Asked Questions"
        items={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "FAQ",
            href: "/faq",
          },
        ]}
      />
      <div className="container ">
        <div className="grid grid-cols-3 gap-4 py-16">
          <div className="hidden lg:block lg:col-span-1">
            <Image
              src="/assets/faq.png"
              alt=""
              width={500}
              height={500}
              className="hidden lg:block w-[350px] h-[450px]"
            />
          </div>
          <div className="col-span-3 lg:col-span-2">
            <Faq />
          </div>
        </div>

      </div>
    </div>
  );
};

export default page;
