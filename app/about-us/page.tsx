import PathTracker from "@/Shared/PathTracker";
import OurMission from "./_components/OurMission";
import OurVision from "./_components/OurVision";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { TestimonialSection } from "@/components/testimonial-section";

const page = () => {
  return (
    <div className="mt-28 container">

      <div className="border-b border-black pb-5">
        <PathTracker />
      </div>

      <div className="text-center mt-8">
        <h1 className="text-5xl font-semibold">Let us help you sell your assets</h1>

        <p className="mt-3 text-[#645949]">At Diamond Auctions, we make selling your valuable assets simple, secure, and rewarding. Whether you are parting with fine jewelry, rare collectibles, or high-end items, our expert team is here to guide you every step of the way. With a trusted process, global reach, and dedicated support, we will help you get the best value for your assets—quickly and confidently. Let us help you sell your assets with ease!</p>
      </div>

      <div>
        <OurMission />
      </div>

      <div>
        <OurVision />
      </div>

      <div>
        <HowItWorksSection />
      </div>

      <div>
        <TestimonialSection />
      </div>

    </div>
  );
};

export default page;
