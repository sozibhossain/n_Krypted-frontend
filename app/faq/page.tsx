import Faq from "@/components/faq";
import PathTracker from "@/Shared/PathTracker";
import Image from "next/image";

const page = () => {
  return (
    <div className="container mt-28">

      <div className=" border-b border-black pb-5">
        <PathTracker />
      </div>

      <div className=" container text-center mt-8">
        <h1 className="text-xl md:text-2xl lg:text-5xl font-semibold">Frequently Asked Questions</h1>

        <div className="max-w-3xl text-center mx-auto mt-5">
          <p className="mt-3  text-[#645949]">Have questions? We’re here to help! Below are answers to some of the most common inquiries about registering, bidding, and making purchases on our auction platform.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 py-10">
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
  );
};

export default page;
