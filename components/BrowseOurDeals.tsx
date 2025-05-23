"use client"
import { Button } from "@/components/ui/button"
import { MoveRight } from "lucide-react"
import Link from "next/link"
import { DealsCard } from "./DealsCard"
import { useQuery } from "@tanstack/react-query"
import useAxios from "@/hooks/useAxios"
import { DealsCardSkeleton } from "./skeleton/dealsSkeleton"


interface Deal {
  participationsLimit: number | undefined
  _id: string
  title: string
  description: string
  participations: number
  price: number
  location: string
  images: string[]
  offers: string[]
  status: string
  category: string
  createdAt: string
  updatedAt: string
}

export function BrowseOurDeals() {
  const axiosInstance = useAxios()

  const { data: response, isLoading } = useQuery({
    queryKey: ["deals"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/api/deals`)
      return data
    },
  })
  const dealsData = response?.deals || []

  // Create placeholder skeletons when loading
  const skeletonItems = Array(6)
    .fill(0)
    .map((_, index) => (
      <div key={`skeleton-${index}`}>
        <div className="mx-auto w-full">
          <DealsCardSkeleton />
        </div>
      </div>
    ))

  return (
    <section className="container mt-24">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4">
            <div className="w-5 h-9 bg-white rounded" />
            <div>
              <h1 className="font-benedict text-[40px] font-normal mb-2 text-white">Our Deal</h1>
            </div>
          </div>
          <p className="text-[20px] lg:text-[40px] font-bold text-white">Browse Our Deals</p>
        </div>
        <Link href={"/deals"}>
          <Button className="bg-white text-black">
            Explore All <MoveRight />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 space-y-5 md:space-y-0 gap-6 md:grid-cols-2 lg:grid-cols-3 pt-6">
        {isLoading
          ? skeletonItems
          : dealsData.map((deal: Deal) => (
            <div key={deal._id}>
              <div className="mx-auto w-full md:max-[32%]">
                <DealsCard
                  id={deal._id}
                  title={deal.title}
                  status={deal.status}
                  image={deal.images[0] || "/assets/deals.png"}
                  description={deal.description}
                  price={deal.price}
                  participations={deal.participations}
                  maxParticipants={deal.participationsLimit}
                />
              </div>
            </div>
          ))}
      </div>
    </section>
  )
}
