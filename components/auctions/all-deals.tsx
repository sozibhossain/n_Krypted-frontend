"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { FilterIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useQuery } from "@tanstack/react-query"
import useAxios from "@/hooks/useAxios"
import { DealsCard } from "../DealsCard"
import { Pagination } from "../dashboard/pagination"

// Type definitions
interface Category {
  _id: string
  categoryName: string
  image: string
  createdAt: string
  updatedAt: string
  location: string
}

interface Deal {
  time: number | undefined
  bookingCount: number
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

// const DEAL_TYPES = [
//   { id: "popular", name: "Popular" },
//   { id: "latest", name: "Latest" },
//   { id: "ends-soon", name: "Ends Soon" },
//   { id: "upcoming", name: "Upcoming" },
// ]

export default function DealsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const axiosInstance = useAxios()

  // State for UI controls
  const [currentPage, setCurrentPage] = useState<number>(Number.parseInt(searchParams.get("page") || "1"))
  const [showMap, setShowMap] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  console.log(setShowMap)

  // State for categories
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [categoryError, setCategoryError] = useState<string | null>(null)

  // State for all available locations
  const [allLocations, setAllLocations] = useState<string[]>([])

  // Current filter values from URL
  const currentCategory = searchParams.get("categoryName") || ""
  const currentLocation = searchParams.get("location") || "all"
  const currentMinPrice = searchParams.get("minPrice") || "0"
  const currentMaxPrice = searchParams.get("maxPrice") || "1000"
  const currentDealType = searchParams.get("dealType") || ""

  const category = searchParams.get('category');
  const location = searchParams.get('location');
  const search = searchParams.get('search');
  

  // Local state for filters
  const [selectedCategory, setSelectedCategory] = useState<string>(currentCategory)
  const [selectedLocation, setSelectedLocation] = useState<string>(currentLocation)
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number.parseInt(currentMinPrice) || 0,
    Number.parseInt(currentMaxPrice) || 1000,
  ])
  const [selectedDealType, setSelectedDealType] = useState<string>(currentDealType)
  const [searchQuery, setSearchQuery] = useState<string>(search || "")

  console.log(setSelectedDealType)

  // Fetch deals with filters
  const {
    data: response,
    isLoading: isLoadingDeals,
    error: dealsError,
  } = useQuery({
    queryKey: ["deals", selectedCategory, priceRange, selectedDealType, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (selectedCategory) params.set("categoryName", selectedCategory)
      // Remove the location filter from the API call
      params.set("minPrice", priceRange[0].toString())
      params.set("maxPrice", priceRange[1].toString())
      if (selectedDealType) params.set("dealType", selectedDealType)
      params.set("page", currentPage.toString())
      params.set("limit", "10")
      if (searchQuery) params.set("title", searchQuery)
      if (selectedLocation && selectedLocation !== "all") {
        params.set("location", selectedLocation)
      }

      const { data } = await axiosInstance.get(`/api/deals?${params.toString()}`)
      return data
    },
  })


  // Memoize deals data
  const dealsData = useMemo(() => response?.deals || [], [response])
  const totalPages: number = response?.pagination?.totalPages || 5

  // Filter deals by location on the client side if needed
  const filteredDealsData = useMemo(() => {
    const deals = response?.deals || []

    // If "all" is selected or no location is selected, show all deals
    if (!selectedLocation || selectedLocation === "all") {
      return deals
    }

    // Otherwise, filter by the selected location
    return deals.filter((deal: Deal) => deal.location === selectedLocation)
  }, [response?.deals, selectedLocation])

  // Fetch categories and all locations
  useEffect(() => {
    const fetchCategoriesAndLocations = async () => {
      try {
        setIsLoadingCategories(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)

        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`)
        }

        const data = await response.json()

        if (data.success && Array.isArray(data.data)) {
          setCategories(data.data)

          // Extract all unique locations from categories for the dropdown
          const allLocations = Array.from(
            new Set(data.data.map((cat: Category) => cat.location).filter(Boolean)),
          ) as string[]
          setAllLocations(allLocations)
        } else {
          throw new Error("Invalid data format received from API")
        }
      } catch (err) {
        setCategoryError(err instanceof Error ? err.message : "An unknown error occurred")
        console.error("Error fetching categories:", err)
      } finally {
        setIsLoadingCategories(false)
      }
    }

    fetchCategoriesAndLocations()
  }, [])

  // Update URL when filters or page change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (selectedCategory) {
      params.set("categoryName", selectedCategory)
    } else {
      params.delete("categoryName")
    }

    // Keep the location in the URL for UI state
    if (selectedLocation && selectedLocation !== "all") {
      params.set("location", selectedLocation)
    } else {
      params.delete("location")
    }

    params.set("minPrice", priceRange[0].toString())
    params.set("maxPrice", priceRange[1].toString())

    if (selectedDealType) {
      params.set("dealType", selectedDealType)
    } else {
      params.delete("dealType")
    }

    params.set("page", currentPage.toString())

    router.push(`?${params.toString()}`, { scroll: false })
  }, [selectedCategory, selectedLocation, priceRange, selectedDealType, currentPage, router, searchParams])

  // Handle filter changes
  const handleCategoryChange = (categoryName: string, checked: boolean | "indeterminate") => {
    const isChecked = checked === true
    if (isChecked) {
      setSelectedCategory(categoryName)
    } else if (selectedCategory === categoryName) {
      setSelectedCategory("")
    }
    setIsFilterOpen(false) // Close the Sheet on mobile
  }
  useEffect(() =>{
    if(category){
      setSelectedCategory(category)
    }
    if (search) { 
      setSearchQuery(search)
    }
  }, [category, search])
  useEffect(() =>{
    if(location){
      setSelectedLocation(location)
    }
  }, [location])



  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]])
    setIsFilterOpen(false) // Close the Sheet on mobile
  }

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value)
    setIsFilterOpen(false) // Close the Sheet on mobile
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Toggle map view
  // const toggleMap = () => {
  //   setShowMap(!showMap)
  // }

  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0
    if (selectedCategory) count++
    if (selectedLocation && selectedLocation !== "all") count++
    if (selectedDealType) count++
    if (priceRange[0] !== 0 || priceRange[1] !== 1000) count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  // Use allLocations instead of deriving from filtered deals
  const locationsForDropdown = useMemo(() => {
    return allLocations.length > 0 ? allLocations : Array.from(new Set(dealsData.map((deal: Deal) => deal.location)))
  }, [allLocations, dealsData])

  // Filter Sidebar Component
  const FilterSidebar = () => (
    <div className="space-y-6 bg-white p-4 sm:p-5 rounded-lg shadow-sm w-full max-w-full lg:max-w-[300px]">
      {/* Categories */}
      <div>
        <h3 className="text-xl sm:text-2xl lg:text-[32px] font-semibold text-[#212121] mb-3 sm:mb-4">Kategorien</h3>
        {isLoadingCategories ? (
          <div className="py-2 text-sm sm:text-base">Loading categories...</div>
        ) : categoryError ? (
          <div className="text-red-500 py-2 text-sm sm:text-base">Error: {categoryError}</div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {categories.map((category) => (
              <div key={category._id} className="flex items-center space-x-3">
                <Checkbox
                  id={`category-${category.categoryName}`}
                  checked={selectedCategory === category.categoryName}
                  onCheckedChange={(checked) => handleCategoryChange(category.categoryName, checked)}
                />
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor={`category-${category.categoryName}`}
                    className="text-sm sm:text-base lg:text-xl cursor-pointer text-[#4E4E4E] font-medium"
                  >
                    {category.categoryName}
                  </Label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Locations */}
      <div>
        <h3 className="text-xl sm:text-2xl lg:text-[32px] font-semibold text-[#212121] mb-3 sm:mb-4">Locations</h3>
        {isLoadingDeals ? (
          <div className="py-2 text-sm sm:text-base">Loading locations...</div>
        ) : dealsError ? (
          <div className="text-red-500 py-2 text-sm sm:text-base">Error loading locations</div>
        ) : (
          <Select value={selectedLocation} onValueChange={handleLocationChange}>
            <SelectTrigger className="w-full border border-[#4E4E4E] text-sm sm:text-base">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locationsForDropdown.map((location) => (
                <SelectItem key={String(location)} value={String(location)}>
                  {String(location)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Deal Types */}
      {/* <div>
        <h3 className="text-xl sm:text-2xl lg:text-[32px] font-semibold text-[#212121] mb-3 sm:mb-4">Type Of Deals</h3>
        <div className="space-y-2">
          {DEAL_TYPES.map((dealType) => (
            <div key={dealType.id} className="flex items-center space-x-2">
              <Checkbox
                id={`deal-type-${dealType.id}`}
                checked={selectedDealType === dealType.id}
                onCheckedChange={(checked) => handleDealTypeChange(dealType.id, checked)}
              />
              <Label htmlFor={`deal-type-${dealType.id}`} className="text-sm sm:text-base font-normal cursor-pointer">
                {dealType.name}
              </Label>
            </div>
          ))}
        </div>
      </div> */}

      {/* Price Range Slider */}
      <div>
        <h3 className="text-xl sm:text-2xl lg:text-[32px] font-semibold text-[#212121] mb-3 sm:mb-4">Price</h3>
        <div className="space-y-4 sm:space-y-6">
          <Slider
            defaultValue={priceRange}
            min={0}
            max={1000}
            step={10}
            value={priceRange}
            onValueChange={handlePriceChange}
            className="mt-4 sm:mt-6"
          />
          <div className="flex justify-between items-center text-xs sm:text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="lg:hidden">
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
                </div>
                <div className="overflow-y-auto h-[calc(100vh-60px)]">
                  <FilterSidebar />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* <Button variant="outline" className="flex items-center gap-2" onClick={toggleMap}>
            <Map className="h-4 w-4" />
            {showMap ? "Hide Map" : "Show Map"}
          </Button> */}
        </div>

        <div className="grid grid-cols-6">
          {/* Sidebar with filters - hidden on mobile */}
          <div className="hidden lg:block col-span-6 md:col-span-6 lg:col-span-2">
            <FilterSidebar />
          </div>

          {/* Deals grid */}
          <div className="col-span-6 md:col-span-6 lg:col-span-4">
            {isLoadingDeals ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-80 bg-gray-200 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : dealsError ? (
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 space-y-3 md:space-y-0">
                    {filteredDealsData.length > 0 ? (
                      filteredDealsData.map((deal: Deal) => (
                        <DealsCard
                          key={deal._id}
                          status={deal.status}
                          id={deal._id}
                          title={deal.title}
                          image={deal.images[0] || "/assets/deals.png"}
                          description={deal.description}
                          price={deal.price}
                          time = {deal.time}
                          participations={deal.bookingCount}
                          maxParticipants={deal.participationsLimit}
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
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} totalItems={0} itemsPerPage={0} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  )
}
