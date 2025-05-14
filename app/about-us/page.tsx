
import ContactUsForm from "@/components/ContactUsFrom";
import OurMission from "./_components/OurMission";
import OurVision from "./_components/OurVision";

import { TestimonialSection } from "@/components/testimonial-section";
import { PageHeader } from "@/Shared/PageHeader";

const page = () => {
  return (
    <div className="">
      <PageHeader
        title="About Us"
        imge="/assets/about-us.png"
        items={[
          {
            label: "Home",
            href: "/",
          },
          {
            label: "About Us",
            href: "/blogs",
          },
        ]}
      />
      <div className="mt-18 lg:mt-24 container">
      <div className="text-center mt-8">
        <h1 className="text-[25px] lg:text-[40px] font-semibold text-[#FFFFFF]">What are Walk Throughz?</h1>

        <p className="mt-3 text-base lg:text-xl text-[#E0E0E0] leading-[150%]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis molestie, sapien et vulputate porttitor, eros magna laoreet mauris, eu suscipit tortor turpis in elit. Sed tristique pharetra ligula. Aenean eu tempor lorem. Sed posuere ante id laoreet finibus. Vivamus a pulvinar ex. Quisque nec metus rutrum diam pulvinar rutrum. Sed enim tortor, accumsan ac dignissim in, finibus placerat lorem. Cras rhoncus hendrerit diam nec vestibulum. Cras vehicula neque augue, vel posuere neque blandit vel nisi.</p>
      </div>

      <div>
        <OurMission />
      </div>

      <div>
        <OurVision />
      </div>

   

      <div>
        <TestimonialSection />
      </div>
      <div>
        <ContactUsForm/>
      </div>

      </div>
    </div>
  );
};

export default page;
