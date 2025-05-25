import { HeroBanner } from "@/components/hero-section"
import { DealsSection } from "@/Shared/deals-section"
import { CategoriesSection } from "@/components/categories-section"
import { BrowseOurDeals, } from "@/components/BrowseOurDeals"
import { FaqSection } from "@/components/faq-section"
import { BlogsSection } from "@/components/blogs-section"
import { TestimonialSection } from "@/components/testimonial-section"
import ContactUsForm from "@/components/ContactUsFrom"

export default function Home() {
  return (
    <div>
      
      <HeroBanner />
      <DealsSection />
      <CategoriesSection />
      <BrowseOurDeals />
      <TestimonialSection />
      <BlogsSection />
      <FaqSection />
      <ContactUsForm />
    </div>
  )
}
