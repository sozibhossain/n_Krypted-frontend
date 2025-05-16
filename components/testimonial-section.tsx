"use client";

import Image from "next/image";
import { MoveLeft, MoveRight, Quote } from "lucide-react";
// import { Button } from "@/components/ui/button";
import { useState } from "react";

const testimonials = [
  {
    text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.`,
    name: "Courtney Henry",
    role: "CEO at Company",
    image: "/assets/hero.png",
  },
  {
    text: `Ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet.`,
    name: "Tommy Rivers",
    role: "CTO at Startup",
    image: "/assets/hero.png",
  },
  {
    text: `Nunc ut sem vitae risus tristique posuere. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.`,
    name: "Alexa Smith",
    role: "CMO at Brand",
    image: "/assets/hero.png",
  },
];

export function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const testimonial = testimonials[currentIndex];

  return (
    <section className="container lg:mt-24 py-[50px]">
      <div className="grid gap-8 grid-cols-6">
        <div className="col-span-6 md:col-span-2 lg:col-span-2">
          <h2 className="text-white lg:mb-4 text-2xl lg:text-5xl font-bold tracking-tight">
            What does our client say?
          </h2>
        </div>

        <div className="col-span-6 md:col-span-4 lg:col-span-4">
          <div className="relative mb-5 pl-6">
            <Quote className="absolute left-0 top-0 h-5 w-5 text-white" />
            <p className="text-white text-lg italic text-muted-foreground">{testimonial.text}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-white text-sm lg:text-lg font-medium">{testimonial.name}</h4>
              <p className="text-white text-sm text-muted-foreground">{testimonial.role}</p>
            </div>

            <div className="ml-auto flex gap-2">
              <button
                className="px-[35px] py-[15px] rounded-sm border flex items-center justify-center border-white bg-[#212121] hover:bg-white hover:text-black"
                onClick={handlePrev}
              >
                <MoveLeft className="h-4 w-4 -rotate-45 text-white hover:text-black" />
                <span className="sr-only ">Previous</span>
              </button>
              <button
                className="px-[35px] py-[15px] rounded-sm border flex items-center justify-center border-white bg-[#212121] hover:bg-white hover:text-black"
                onClick={handleNext}
              >
                <MoveRight className="h-4 w-4 -rotate-45 text-white hover:text-black" />
                <span className="sr-only">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
