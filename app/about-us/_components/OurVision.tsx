import Image from "next/image";

const OurVision = () => {
  return (
    <section className="mt-12 md:mt-24 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 justify-between max-w-7xl mx-auto">
        {/* Image Section */}
        <div className="flex-1 flex justify-center lg:justify-start relative">
          <Image
            src="/assets/newcontact1.jpg"
            alt="Auction speaker"
            height={468}
            width={400}
            className="rounded-xl w-full max-w-[400px] h-auto sm:h-[468px] object-cover"
            priority
          />
          <Image
            src="/assets/newcontact2.jpg"
            alt="Auction speaker"
            height={1000}
            width={1000}
            className="rounded-xl hidden lg:block absolute z-10 bottom-[-100px] -left-[-150px] lg:left-[250px] w-[200px] lg:w-[300px] h-[400px] object-cover"
          />
        </div>

        {/* Text Section */}
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div className="w-4 h-7 sm:w-5 sm:h-9 bg-white rounded" />
            <h1
              className="text-[40px] font-normal font-benedict text-white leading-[120%] tracking-[0.04em] 
                 [text-shadow:_0_0_1px_#fff,_0_0_15px_#fff,_0_0_15px_#fff]"
              style={{ fontFamily: "cursive" }}
            >
              Unsere Vision
            </h1>
          </div>
          <h3 className="text-xl sm:text-2xl lg:text-[32px] text-white font-semibold mt-4 sm:mt-5">
            Was möchte Walk Throughz langfristig erreichen?
          </h3>
          <p className="text-white text-sm sm:text-base lg:text-xl leading-[150%] font-normal mt-4 sm:mt-5 text-justify">
            Wir träumen von Städten, die nicht nur bewohnt, sondern wirklich
            gelebt werden – von Menschen, die sich wieder als Teil eines
            größeren Ganzen fühlen. Langfristig wollen wir mit Walk Throughz ein
            neues Stadtgefühl etablieren: eine Kultur der Offenheit, der Neugier
            und des lokalen Engagements. Walk Throughz soll in vielen Städten
            der Welt wachsen, als Netzwerk für urbane Inspiration,
            Mikro-entdeckungen und echte Verbindung. Denn je mehr wir teilen,
            desto mehr entsteht.
          </p>
          {/* <ul className="list-disc list-inside mt-4 sm:mt-5 text-white text-sm sm:text-base lg:text-[18px] leading-[150%] font-normal ml-4 sm:ml-5 md:text-nowrap space-y-2">
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
          </ul> */}
        </div>
      </div>
    </section>
  );
};

export default OurVision;
