import { Button } from "@/components/ui/button"
import { MoveRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function ContactSection() {
  return (
    <section className="mt-20 lg:mt-44">
      <div className="container rounded-2xl text-white bg-[#c8b291] flex justify-between relative p-16">
        <div className="-mt-52">
          <Image
            src={'/assets/women.png'}
            alt="women"
            width={336}
            height={462}
            className="w-full h-full hidden lg:block object-cover"
          />
        </div>

        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl">Get in touch with us</h2>
          <p className="mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum
            tristique. Duis cursus, mi quis viverra ornare.
          </p>
          <Link href={"/contact"} >
          
          <Button className="bg-[#8a7357] hover:bg-[#6d5a44] text-white">Get Started <MoveRight /></Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
