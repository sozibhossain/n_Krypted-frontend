import ContactUsForm from "@/components/ContactUsFrom";
import FaqPage from "@/components/faqpage";
import { PageHeader } from "@/Shared/PageHeader";
import Image from "next/image";

const page = () => {
  return (
    <div>
      <PageHeader
        title="Frequently Asked Questions"
        imge="/assets/faq2.png"
       
      />
      <div className="container">
        <div className="grid grid-cols-3 gap-4 pt-16">
          <div className="hidden lg:block lg:col-span-1 ">
            <Image
              src="/assets/faq.png"
              alt=""
              width={500}
              height={500}
              className="hidden lg:block w-[350px] h-[450px] sticky top-[190px]"
            />
          </div>
          <div className="col-span-3 lg:col-span-2">
            <FaqPage />
          </div>
        </div>
        <div>
          <ContactUsForm/>
        </div>
      </div>
    </div>
  );
};

export default page;
