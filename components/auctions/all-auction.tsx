"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Map, FilterIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { DealsCard } from "../DealsCard"
import { Pagination } from "../dashboard/pagination"

import { useQuery } from "@tanstack/react-query"
import useAxios from "@/hooks/useAxios"
import LatestSidebar from "@/app/deals/filter-sidebar"

interface Deal {
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

export default function DealsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const axiosInstance = useAxios()

  // State for UI controls
  const [currentPage, setCurrentPage] = useState<number>(parseInt(searchParams.get("page") || "1"))
  const [showMap, setShowMap] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Get filter values from URL
  const categoryName = searchParams.get("categoryName") || ""
  const location = searchParams.get("location") || "all"
  const minPrice = searchParams.get("minPrice") || "0"
  const maxPrice = searchParams.get("maxPrice") || "1000"
  const dealType = searchParams.get("dealType") || ""

  // Fetch deals using useQuery
  const { data, isLoading, error } = useQuery({
    queryKey: ["deals", categoryName, location, minPrice, maxPrice, dealType, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (categoryName) params.set("categoryName", categoryName)
      if (location && location !== "all") params.set("location", location)
      if (minPrice) params.set("minPrice", minPrice)
      if (maxPrice) params.set("maxPrice", maxPrice)
      if (dealType) params.set("dealType", dealType)
      params.set("page", currentPage.toString())
      params.set("limit", "10")

      const { data } = await axiosInstance.get(`/api/deals?${params.toString()}`)
      return data
    },
  })

  const deals: Deal[] = data?.deals || []
  const totalPages: number = data?.pagination?.totalPages || 5

  // Update URL when page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`?${params.toString()}`, { scroll: false })
  }

  // Toggle map view
  const toggleMap = () => {
    setShowMap(!showMap)
  }

  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0
    if (categoryName) count++
    if (location && location !== "all") count++
    if (dealType) count++
    if (minPrice !== "0" || maxPrice !== "1000") count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="md:hidden">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <FilterIcon className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-primary text-primary-foreground">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] sm:w-[350px] p-0">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold">Filters</h2>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </SheetClose>
              </div>
              <div className="overflow-y-auto h-[calc(100vh-60px)]">
                <LatestSidebar />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Button variant="outline" className="flex items-center gap-2" onClick={toggleMap}>
          <Map className="h-4 w-4" />
          {showMap ? "Hide Map" : "Show Map"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar with filters - hidden on mobile */}
        <div className="hidden md:block md:col-span-1">
          <LatestSidebar />
        </div>

        {/* Deals grid */}
        <div className="md:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-80 bg-gray-200 animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-10">
              <p className="text-red-500">Error loading deals. Please try again later.</p>
            </div>
          ) : (
            <>
              {showMap ? (
                <div className="h-[500px] bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Map View (Placeholder)</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 space-y-3 md:space-y-0">
                  {deals.length > 0 ? (
                    deals.map((deal) => (
                      <DealsCard
                        key={deal._id}
                        id={deal._id}
                        title={deal.title}
                        image={deal.images[0] || "/assets/deals.png"}
                        description={deal.description}
                        price={deal.price}
                        participations={deal.participations}
                        maxParticipants={deal.participations} // Adjust if maxParticipants is available in API
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-10">
                      <p className="text-gray-500">No deals found matching your filters.</p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}