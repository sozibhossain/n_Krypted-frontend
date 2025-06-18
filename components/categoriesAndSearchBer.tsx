"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, MapPin, Search, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useQuery } from "@tanstack/react-query"
import useAxios from "@/hooks/useAxios"
import Hideon from "@/Provider/Hideon"

interface Category {
  _id: string
  categoryName: string
  image: string
  createdAt: string
  updatedAt: string
}

export function CategoriesAndSearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const axiosInstance = useAxios()

  // Get current filter values from URL
  const currentCategory = searchParams.get("categoryName") || ""
  const currentLocation = searchParams.get("location") || "all"
  const currentSearchQuery = searchParams.get("search") || ""

  // Local state
  const [searchQuery, setSearchQuery] = useState(currentSearchQuery)
  const [selectedCategory, setSelectedCategory] = useState(currentCategory)
  const [selectedLocation, setSelectedLocation] = useState(currentLocation)

  // Fetch categories
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get("/api/categories")
        return data || []
      } catch (error) {
        console.error("Error fetching categories:", error)
        return []
      }
    },
  })

  // Fetch deals to get unique locations
  const { data: dealsData } = useQuery({
    queryKey: ["deals-locations"],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get("/api/deals")
        return data.deals || []
      } catch (error) {
        console.error("Error fetching deals:", error)
        return []
      }
    },
  })

  // Extract unique locations from deals
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const uniqueLocations: string[] = Array.from(new Set(dealsData?.map((deal: any) => deal.location) || [])).filter(
    Boolean,
  ) as string[]

  // Apply filters and search
  const applyFilters = () => {
    const params = new URLSearchParams()

    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim())
    }

    if (selectedCategory) {
      params.set("categoryName", selectedCategory)
    }

    if (selectedLocation && selectedLocation !== "all") {
      params.set("location", selectedLocation)
    }

    // Reset to page 1 when filters change
    params.set("page", "1")

    // Navigate to deals page with all parameters
    const queryString = params.toString()
    router.push(`/deals${queryString ? `?${queryString}` : ""}`)
  }

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    const newCategory = category === selectedCategory ? "" : category
    setSelectedCategory(newCategory)

    // Apply filters immediately
    setTimeout(() => {
      applyFilters()
    }, 0)
  }

  // Handle location selection
  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location)

    // Apply filters immediately
    setTimeout(() => {
      applyFilters()
    }, 0)
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  // Handle clearing search and reload the page
  const handleClearSearch = () => {
    // Navigate to deals page without parameters first
    router.push("/deals")

    // Then reload the page
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  // Update filters when URL params change
  useEffect(() => {
    setSearchQuery(currentSearchQuery)
    setSelectedCategory(currentCategory)
    setSelectedLocation(currentLocation)
  }, [currentSearchQuery, currentCategory, currentLocation])

  const HIDDEN_ROUTES = ["/dashboard", "/login", "/sign-up", "/reset-password", "/forgot-password"]

  return (
    <div className="sticky top-[100px] z-50 bg-[#212121] w-full">
      <Hideon routes={HIDDEN_ROUTES}>
        <div className="">
          <header className="container py-3 ">
            <form onSubmit={handleSearchSubmit}>
              <div className="grid grid-cols-4 gap-2 md:gap-4 lg:gap-8">
                {/* Categories Dropdown */}
                <div className="col-span-4 md:col-span-4 lg:col-span-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="bg-transparent border-white text-white h-[52px] hover:bg-gray-800 hover:text-white w-full justify-between"
                      >
                        <span>{selectedCategory || "Kategorien"}</span>
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[270px]">
                      <DropdownMenuItem
                        onClick={() => handleCategorySelect("")}
                        className={!selectedCategory ? "bg-gray-100" : ""}
                      >
                        All Categories
                      </DropdownMenuItem>
                      {isLoadingCategories ? (
                        <DropdownMenuItem disabled>Loading categories...</DropdownMenuItem>
                      ) : (
                        categoriesData?.data?.map((category: Category) => (
                          <DropdownMenuItem
                            key={category._id}
                            onClick={() => handleCategorySelect(category.categoryName)}
                            className={selectedCategory === category.categoryName ? "bg-gray-100" : ""}
                          >
                            {category.categoryName}
                          </DropdownMenuItem>
                        ))
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="col-span-4 md:col-span-4 lg:col-span-3">
                  {/* Search Input */}
                  <div className="flex items-center border border-white justify-between rounded-lg">
                    <div className="relative flex-1 max-w-2xl">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search by title..."
                        className="pl-10 pr-10 placeholder:text-[12px] lg:placeholder:text-[14px] bg-transparent !text-white border-transparent placeholder:text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            applyFilters()
                          }
                        }}
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={handleClearSearch}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200 transition-colors duration-200 p-1 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                          aria-label="Clear search and reload page"
                        >
                          <X className="h-4 w-4 stroke-2" />
                        </button>
                      )}
                    </div>
                    {/* Location Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="bg-white py-[25px] lg:h-[52px] text-black !rounded-l-none hover:bg-gray-100 border-0 gap-2"
                        >
                          <MapPin className="h-4 w-4" />
                          <span>{selectedLocation === "all" ? "location" : selectedLocation}</span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleLocationSelect("all")}
                          className={selectedLocation === "all" ? "bg-gray-100" : ""}
                        >
                          All Locations
                        </DropdownMenuItem>
                        {uniqueLocations.map((location: string) => (
                          <DropdownMenuItem
                            key={location}
                            onClick={() => handleLocationSelect(location)}
                            className={selectedLocation === location ? "bg-gray-100" : ""}
                          >
                            {location}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </form>
          </header>
        </div>
      </Hideon>
    </div>
  )
}
