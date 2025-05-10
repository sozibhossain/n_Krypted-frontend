import Image from "next/image";

const OurMission = () => {
  return (
    <section className="mt-12 md:mt-24 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-10 justify-between max-w-7xl mx-auto">
        {/* Text Section */}
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div className="w-4 h-7 sm:w-5 sm:h-9 bg-white rounded" />
            <h1
              className="font-benedict text-4xl sm:text-5xl lg:text-[60px] font-normal text-white"
              style={{ fontFamily: "cursive" }}
            >
              Mission
            </h1>
          </div>
          <h3 className="text-xl sm:text-2xl lg:text-[32px] text-white font-semibold mt-4 sm:mt-5">
            What is Walk Throughz current purpose?
          </h3>
          <p className="text-white text-sm sm:text-base lg:text-xl leading-[150%] font-normal mt-4 sm:mt-5 text-justify">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis molestie, sapien et vulputate porttitor, eros
            magna laoreet mauris, eu suscipit tortor turpis in elit. Sed tristique pharetra ligula. Aenean eu tempor lorem.
            Sed posuere ante id laoreet finibus. Vivamus a pulvinar ex. Quisque nec metus rutrum diam pulvinar rutrum. Sed
            enim tortor, accumsan ac dignissim in, finibus placerat lorem. Cras rhoncus hendrerit diam nec vestibulum. Cras
            vehicula neque augue, vel posuere neque blandit vel nisi.
          </p>
        </div>

        {/* Image Section */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <Image
            src="/assets/mission.png"
            alt="Auction speaker"
            height={550}
            width={470}
            className="rounded-xl w-full max-w-[470px] h-auto sm:h-[550px] object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default OurMission;