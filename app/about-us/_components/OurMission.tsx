import Image from "next/image";

const OurMission = () => {
  return (
    <section className="mt-24">
      <div className="flex flex-col md:flex-row items-center gap-10 justify-between">
        {/* Text Section */}
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
            Our Mission
          </h2>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            At Diamond Auctions, our mission is to provide a trusted and dynamic
            platform where buyers and sellers connect to discover rare,
            high-quality items through transparent and exciting auctions. We are
            committed to delivering exceptional service, ensuring authenticity,
            and creating opportunities for collectors, enthusiasts, and sellers
            to engage in a seamless, secure, and rewarding auction experience.
            Our goal is to build a vibrant community driven by trust, integrity,
            and a shared passion for remarkable finds.
          </p>
        </div>

        {/* Image Section */}
        <div className="flex-1 flex justify-end">
          <Image
            src="/assets/mission.png"
            alt="Auction speaker"
            height={550}
            width={470}
            className="rounded-xl "
          />
        </div>
      </div>
    </section>
  );
};

export default OurMission;
