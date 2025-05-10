import Image from "next/image";

const OurVision = () => {
  return (
    <section className="mt-12 md:mt-24 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 justify-between max-w-7xl mx-auto">
        {/* Image Section */}
        <div className="flex-1 flex justify-center lg:justify-start relative">
          <Image
            src="/assets/vision.png"
            alt="Auction speaker"
            height={468}
            width={400}
            className="rounded-xl w-full max-w-[400px] h-auto sm:h-[468px] object-cover"
            priority
          />
          <Image
            src="/assets/vision-2.png"
            alt="Auction speaker"
            height={338}
            width={330}
            className="rounded-xl hidden lg:block absolute z-10 bottom-[-10px] -left-[-150px] lg:-left-[-200px] w-[200px] lg:w-[330px] h-auto"
          />
        </div>

        {/* Text Section */}
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div className="w-4 h-7 sm:w-5 sm:h-9 bg-white rounded" />
            <h1
              className="font-benedict text-3xl sm:text-4xl lg:text-[40px] font-normal text-white"
              style={{ fontFamily: "cursive" }}
            >
              Our Vision
            </h1>
          </div>
          <h3 className="text-xl sm:text-2xl lg:text-[32px] text-white font-semibold mt-4 sm:mt-5">
            What does Walk Throughz want in the long term?
          </h3>
          <p className="text-white text-sm sm:text-base lg:text-xl leading-[150%] font-normal mt-4 sm:mt-5 text-justify">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis molestie, sapien et vulputate porttitor, eros
            magna laoreet mauris, eu suscipit tortor turpis in elit. Sed tristique pharetra ligula. Aenean eu tempor lorem.
            Sed posuere ante id laoreet finibus. Vivamus a pulvinar ex. Quisque nec metus rutrum diam pulvinar rutrum. Sed
            enim tortor, accumsan ac dignissim in, finibus placerat lorem.
          </p>
          <ul className="list-disc list-inside mt-4 sm:mt-5 text-white text-sm sm:text-base lg:text-[18px] leading-[150%] font-normal ml-4 sm:ml-5 md:text-nowrap space-y-2">
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default OurVision;