import ContactUsFrom from "@/components/ContactUsFrom";
import { FaqSection } from "@/components/faq-section";
import { PageHeader } from "@/Shared/PageHeader";
import Image from "next/image";

const page = () => {
  return (
    <div>
      <PageHeader
        title="Contact Us"
        imge="/assets/herobg.png"
        items={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "Contact",
            href: "/faq",
          },
        ]}
      />
    <div className="lg:mt-28 container">
      <div className="flex flex-col md:flex-row  items-center">
        <div className="w-full md:w-[30%] hidden md:block">
          <Image
            src="/assets/contact.png"
            alt="Auction speaker"
            height={472}
            width={370}
            className="rounded-xl w-full max-w-[470px] h-auto sm:h-[550px] object-cover"
            priority
          />
        </div>
        <div className="w-full md:w-[70%]">
          <ContactUsFrom />
        </div>
      </div>
      <div className="lg:mt-[120px] mb-[120px]">
        <FaqSection />
      </div>
      </div>
    </div>
  );
};

export default page;
