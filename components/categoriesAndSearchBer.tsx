"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, MapPin, Search } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useQuery } from "@tanstack/react-query"
import useAxios from "@/hooks/useAxios"

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
        return data.categories || []
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
  const uniqueLocations: string[] = Array.from(new Set(dealsData?.map((deal: any) => deal.location) || [])).filter(Boolean) as string[]

  // Apply filters and search
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (searchQuery) {
      params.set("search", searchQuery)
    } else {
      params.delete("search")
    }

    if (selectedCategory) {
      params.set("categoryName", selectedCategory)
    } else {
      params.delete("categoryName")
    }

    if (selectedLocation && selectedLocation !== "all") {
      params.set("location", selectedLocation)
    } else {
      params.delete("location")
    }

    // Reset to page 1 when filters change
    params.set("page", "1")

    router.push(`?${params.toString()}`, { scroll: false })
  }

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category === selectedCategory ? "" : category)
  }

  // Handle location selection
  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location)
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

  // Update filters when URL params change
  useEffect(() => {
    setSearchQuery(currentSearchQuery)
    setSelectedCategory(currentCategory)
    setSelectedLocation(currentLocation)
  }, [currentSearchQuery, currentCategory, currentLocation])

  return (
    <header className="container py-3 mt-20">
      <form onSubmit={handleSearchSubmit}>
        <div className="grid grid-cols-4 gap-8">
          {/* Categories Dropdown */}
          <div className="col-span-1">
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
                  categoriesData?.map((category: Category) => (
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

          <div className="col-span-3">
            {/* Search Input */}
            <div className="flex items-center border border-white justify-between rounded-lg">
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Walk Through: Durchsuchen"
                  className="pl-10 bg-transparent !text-white border-transparent placeholder:text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      applyFilters()
                    }
                  }}
                />
              </div>
              {/* Location Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-white h-[52px] text-black !rounded-l-none hover:bg-gray-100 border-0 gap-2"
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
  )
}
