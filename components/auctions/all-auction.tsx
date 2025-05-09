"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Map, FilterIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { DealsCard } from "../DealsCard"
import { Pagination } from "../dashboard/pagination"
import { FilterSidebar } from "@/app/auctions/filter-sidebar"

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

  // State for filters
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(5)
  const [showMap, setShowMap] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Get filter values from URL
  const categoryName = searchParams.get("categoryName")
  const location = searchParams.get("location")
  const minPrice = searchParams.get("minPrice")
  const maxPrice = searchParams.get("maxPrice")
  const dealType = searchParams.get("dealType")
  const page = searchParams.get("page") || "1"

  // Fetch deals based on filters
  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true)
      try {
        // Build query string from all filters
        const params = new URLSearchParams()
        if (categoryName) params.set("categoryName", categoryName)
        if (location) params.set("location", location)
        if (minPrice) params.set("minPrice", minPrice)
        if (maxPrice) params.set("maxPrice", maxPrice)
        if (dealType) params.set("dealType", dealType)
        params.set("page", page)

        // Fetch from your actual API
        const response = await fetch(`http://localhost:5000/api/deals?${params.toString()}page=${page}&limit=10`, )
        const data = await response.json()

        setDeals(data.deals || data)
        setTotalPages(data.pagination?.totalPages || data.totalPages || 5)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching deals:", error)
        setLoading(false)
      }
    }

    fetchDeals()
  }, [categoryName, location, minPrice, maxPrice, dealType, page])

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
    if (minPrice || maxPrice) count++
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
                <FilterSidebar />
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
          <FilterSidebar />
        </div>

        {/* Deals grid */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-80 bg-gray-200 animate-pulse rounded-lg"></div>
              ))}
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
                        maxParticipants={deal.participations}
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
