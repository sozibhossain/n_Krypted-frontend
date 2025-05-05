import { Button } from "@/components/ui/button"
import { MoveRight } from "lucide-react"
import Link from "next/link"
import Faq from "./faq"

export function FaqSection() {
  return (
    <section className="container mt-24">
      <div className="grid gap-8 md:grid-cols-6">

        <div className="col-span-2">
          <h2 className="text-white text-[20px] font-semibold tracking-tight md:text-[30px] lg:text-[40px] mt-2 mb-4">Frequently Asked Questions</h2>
          <Link href="/faq">
            <Button className="bg-white text-black">
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
