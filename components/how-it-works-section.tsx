import { ProcessStep } from "@/components/process-step";
import Image from "next/image";

const steps = [
  {
    number: "/assets/01.png",
    title: "Registration",
    description:
      "Create your free account in minutes by clicking the Register button. Verify your email to activate your profile and get ready to explore exclusive auctions.",
    icon: "/assets/work1.png",
    color: "#d0e8ff",
  },
  {
    number: "/assets/02.png",
    title: "Select Product",
    description:
      "Browse our curated catalog of rare, high-quality items. From fine jewelry to unique collectibles, find the piece that catches your eye and fits your interest.",
    icon: "/assets/work2.png",
    color: "#e2ffe7",
  },
  {
    number: "/assets/03.png",
    title: "Go to Bidding",
    description:
      "Place your bid with confidence. You can bid manually or set a max bid so our system does the work for you. Transparent bidding ensures a fair and exciting experience.",
    icon: "/assets/work3.png",
    color: "#ffe1db",
  },
  {
    number: "/assets/04.png",
    title: "Make Payment",
    description:
      "If you win, complete your purchase using secure payment options. We’ll process and ship your item promptly, keeping you informed every step of the way.",
    icon: "/assets/work4.png",
    color: "#fff9dd",
  },
];

export function HowItWorksSection() {
  return (
    <section className="mt-24">
      <div className="relative mx-auto">
        {/* Title */}
        <h1 className="text-2xl md:text-5xl lg:text-5xl font-semibold text-center mb-10">
          How does it work?
        </h1>

        {/* Background Line */}
        <div className="absolute top-[40%] z-0 pointer-events-none w-full">
          <Image
            src="/assets/work-liner.png"
            alt="work liner"
            width={1440}
            height={210}
            className="w-full"
          />
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 relative z-10 container">
          {steps.map((step, index) => (
            <ProcessStep
              key={index}
              number={step.number}
              title={step.title}
              icon={step.icon}
              description={step.description}
              color={step.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
