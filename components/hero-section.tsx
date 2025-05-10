import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroBanner() {
  return (
    <section 
      className="relative w-full h-[500px] md:h-[600px] lg:h-[720px] overflow-hidden mb-[80px]"
      style={{
        backgroundImage: "url('/assets/banner.png')",
        backgroundSize: "cover",
        backgroundPosition: "top",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container">
          <div className="max-w-xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Lorem ipsum dolor sit amet, consectetur cras amet.
            </h1>
            <p className="text-white/90 text-sm md:text-base mb-8 max-w-md">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin efficitur diam non sodales eleifend.
              Vivamus ut hendrerit neque. Nunc nec eleifend magna. Donec posuere nisi quis lorem pellentesque ornare.
            </p>
            <Button asChild variant="outline" className="bg-white text-black hover:bg-white/90 border-none group">
              <Link href="/booking" className="flex items-center">
                Book now!
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}