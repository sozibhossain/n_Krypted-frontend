import { Button } from "@/components/ui/button"
import { MoveRight } from "lucide-react"
import Link from "next/link"
import Faq from "./faq"

export function FaqSection() {
  return (
    <section className="container mt-24">
      <div className="grid gap-8 md:grid-cols-6">

        <div className="col-span-2">
          <h2 className="text-xl font-bold tracking-tight md:text-5xl mt-2">Frequently Asked Questions</h2>
          <p className=" text-[#595959] text-[16px] my-3">
            Have questions? We&apos;re here to help! Below are answers to some of the most common inquiries about registering, bidding, and making purchases on our auction platform. Whether you&apos;re new to auctions or a seasoned collector, you&apos;ll find the guidance you need right here.
          </p>
          <Link href="/faq" >
            <Button className="bg-[#645949]">
              Explore All <MoveRight />
            </Button>
          </Link>
        </div>

        <div className="col-span-4">
          <Faq/>
        </div>
      </div>
    </section>
  )
}
