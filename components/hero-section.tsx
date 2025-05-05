"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect } from "react";

export function HeroSection() {
  // Sample auction items data
  const auctionItems = [
    {
      id: "1",
      title: "Diamond Ring",
      description: "Turn Your Luck To Buy Diamond - Auction It to the Highest Bidder!",
      price: "$5,000",
      image: "/assets/carouselimg1.png",
      seller: "@Seller/Shop-name"
    },
    {
      id: "2",
      title: "Luxury Watch",
      description: "Bid on this exclusive timepiece - Limited Edition",
      price: "$3,500",
      image: "/assets/carouselimg1.png",
      seller: "@Seller/Shop-name"
    },
    {
      id: "3",
      title: "Designer Handbag",
      description: "Own this rare collector's item - Only 10 made worldwide",
      price: "$2,800",
      image: "/assets/carouselimg1.png",
      seller: "@Seller/Shop-name"
    }
  ];

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleRadioChange = (value: string) => {
    const index = auctionItems.findIndex(item => item.id === value);
    if (index >= 0 && api) {
      api.scrollTo(index);
    }
  };

  return (
    <section className="relative w-full overflow-hidden mt-16">
      <div className="container grid items-center gap-6 py-12 grid-cols-1 lg:grid-cols-2 md:py-16 lg:py-20">
        {/* Left Content */}
        <div className="flex flex-col relative">
          <div className="z-20">
            <div className="text-[16px] border border-[#6459494D] w-[150px] text-center rounded-sm font-medium text-[#8a7357]">
              Bid Now & Win Big!
            </div>
            <h1 className="text-4xl text-[#645949] font-bold tracking-tight md:text-5xl lg:text-6xl my-6">
              Discover Exclusive Auctions for Luxury Own Your Dream
            </h1>
            <p className="text-[16px] text-[#595959]">
              Explore Exclusive Auctions and Bid on Premium Products.Win Big
              and Own the Luxury You Deserve!
            </p>
            <div className="flex gap-4 mt-4">
              <Link href="/sign-up">
                <Button className="bg-[#8a7357] hover:bg-[#6d5a44] text-white h-[51px] lg:w-[191px] text-[16px]">
                  Register
                </Button>
              </Link>
              <Link href="/auctions">
                <Button
                  variant="outline"
                  className="border-[#8a7357] text-[#8a7357] h-[51px] lg:w-[191px] text-[16px]"
                >
                  View current auctions
                </Button>
              </Link>
            </div>
          </div>

          <div>
            <Image
              src={"/assets/hero-union.png"}
              alt="hero union"
              width={493}
              height={112}
              className="absolute top-8 right-0"
            />
          </div>
        </div>

        {/* Right Carousel */}
        <div className="relative w-full h-[500px] lg:h-[600px]">
          <Carousel
            className="w-full h-full bg-[#64594933] p-2"
            setApi={setApi}
          >
            <CarouselContent className="h-full">
              {auctionItems.map((item) => (
                <CarouselItem key={item.id} className="h-full p-0">
                  <div className="relative w-full h-full overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={500}
                      height={500}
                      className="object-cover w-[500px] h-[480px] md:w-full lg:w-[600px] lg:h-[580px]"
                      priority
                    />
                    {/* Text overlay matching the design */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="space-y-2">
                        <p className="text-lg leading-tight font-medium">
                          {item.description}
                        </p>
                        <p className="text-sm opacity-80">{item.seller}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          
          {/* Radio Button Controls */}
          <div className="absolute bottom-6 right-6 z-20">
            <RadioGroup
              value={auctionItems[current]?.id || "1"}
              className="flex gap-4"
              onValueChange={handleRadioChange}
            >
              {auctionItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={item.id}
                    id={item.id}
                    className="h-2 w-2 border-white data-[state=checked]:bg-white p-[5px]"
                  />
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>
    </section>
  );
}