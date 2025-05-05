import { HeroBanner } from "@/components/hero-section"
import { LiveAuctionSection } from "@/Shared/live-auction-section"
import { AuctionCategoriesSection } from "@/components/auction-categories-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { LatestAuctionSection } from "@/components/latest-auction-section"
import { FaqSection } from "@/components/faq-section"
import { ArticlesSection } from "@/components/articles-section"
import { TestimonialSection } from "@/components/testimonial-section"
import { CategoriesAndSearchBar } from "@/components/categoriesAndSearchBer"

export default function Home() {
  return (
    <div className="bg-[#212121]">
      <CategoriesAndSearchBar/>
      <HeroBanner />
      <LiveAuctionSection />
      <AuctionCategoriesSection />
      <HowItWorksSection />
      <LatestAuctionSection />
      <FaqSection />
      <ArticlesSection />
      <TestimonialSection />
    </div>
  )
}
