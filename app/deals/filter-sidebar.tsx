"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useQuery } from "@tanstack/react-query"
import useAxios from "@/hooks/useAxios"

// Type for category from API
interface Category {
    _id: string
    categoryName: string
    image: string
    createdAt: string
    updatedAt: string
    location: string
}

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

const DEAL_TYPES = [
    { id: "popular", name: "Popular" },
    { id: "latest", name: "Latest" },
    { id: "ends-soon", name: "Ends Soon" },
    { id: "upcoming", name: "Upcoming" },
]

function FilterSidebar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const axiosInstance = useAxios()

    // State for categories and their loading/error status
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoadingCategories, setIsLoadingCategories] = useState(true)
    const [categoryError, setCategoryError] = useState<string | null>(null)

    // Current filter values from URL
    const currentCategory = searchParams.get("categoryName") || ""
    const currentLocation = searchParams.get("location") || "all"
    const currentMinPrice = searchParams.get("minPrice") || "0"
    const currentMaxPrice = searchParams.get("maxPrice") || "1000"
    const currentDealType = searchParams.get("dealType") || ""

    // Local state for filters
    const [selectedCategory, setSelectedCategory] = useState<string>(currentCategory)
    const [selectedLocation, setSelectedLocation] = useState<string>(currentLocation)
    const [priceRange, setPriceRange] = useState<[number, number]>([
        parseInt(currentMinPrice) || 0,
        parseInt(currentMaxPrice) || 1000,
    ])
    const [selectedDealType, setSelectedDealType] = useState<string>(currentDealType)

    // Fetch deals with filters
    const { data: response, isLoading: isLoadingDeals, error: dealsError } = useQuery({
        queryKey: ["deals", selectedCategory, selectedLocation, priceRange, selectedDealType],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (selectedCategory) params.set("categoryName", selectedCategory)
            if (selectedLocation && selectedLocation !== "all") params.set("location", selectedLocation)
            params.set("minPrice", priceRange[0].toString())
            params.set("maxPrice", priceRange[1].toString())
            if (selectedDealType) params.set("dealType", selectedDealType)

            const { data } = await axiosInstance.get(`/api/deals?${params.toString()}`)
            return data
        },
    })

    // Memoize dealsData to prevent recomputation on every render
    const dealsData = useMemo(() => response?.deals || [], [response])

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoadingCategories(true)
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)

                if (!response.ok) {
                    throw new Error(`Failed to fetch categories: ${response.status}`)
                }

                const data = await response.json()

                if (data.success && Array.isArray(data.categories)) {
                    setCategories(data.categories)
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

        fetchCategories()
    }, [])

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())

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

        params.set("minPrice", priceRange[0].toString())
        params.set("maxPrice", priceRange[1].toString())

        if (selectedDealType) {
            params.set("dealType", selectedDealType)
        } else {
            params.delete("dealType")
        }

        params.set("page", "1")

        router.push(`?${params.toString()}`, { scroll: false })
    }, [selectedCategory, selectedLocation, priceRange, selectedDealType, router, searchParams])

    // Handle filter changes
    const handleCategoryChange = (categoryName: string, checked: boolean | "indeterminate") => {
        const isChecked = checked === true
        if (isChecked) {
            setSelectedCategory(categoryName)
        } else if (selectedCategory === categoryName) {
            setSelectedCategory("")
        }
    }

    const handleDealTypeChange = (dealType: string, checked: boolean | "indeterminate") => {
        const isChecked = checked === true
        if (isChecked) {
            setSelectedDealType(dealType)
        } else if (selectedDealType === dealType) {
            setSelectedDealType("")
        }
    }

    const handlePriceChange = (value: number[]) => {
        setPriceRange([value[0], value[1]])
    }

    // Memoize unique locations
    const uniqueLocations = useMemo(() => {
        return Array.from(new Set(dealsData.map((deal: Deal) => deal.location)))
    }, [dealsData])

    return (
        <div className="space-y-6 bg-white p-4 sm:p-5 rounded-lg shadow-sm w-full max-w-full lg:max-w-[300px]">
            {/* Categories */}
            <div>
                <h3 className="text-xl sm:text-2xl lg:text-[32px] font-semibold text-[#212121] mb-3 sm:mb-4">
                    Kategorien
                </h3>
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
                <h3 className="text-xl sm:text-2xl lg:text-[32px] font-semibold text-[#212121] mb-3 sm:mb-4">
                    Locations
                </h3>
                {isLoadingDeals ? (
                    <div className="py-2 text-sm sm:text-base">Loading locations...</div>
                ) : dealsError ? (
                    <div className="text-red-500 py-2 text-sm sm:text-base">Error loading locations</div>
                ) : (
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger className="w-full border border-[#4E4E4E] text-sm sm:text-base">
                            <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                                    <SelectItem value="all">All Locations</SelectItem>
                                    {/* eslint-disable @typescript-eslint/no-explicit-any */}
                            {uniqueLocations.map((location:any) => (
                                <SelectItem key={location} value={location}>
                                    {location}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>

            {/* Deal Types */}
            <div>
                <h3 className="text-xl sm:text-2xl lg:text-[32px] font-semibold text-[#212121] mb-3 sm:mb-4">
                    Type Of Deals
                </h3>
                <div className="space-y-2">
                    {DEAL_TYPES.map((dealType) => (
                        <div key={dealType.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={`deal-type-${dealType.id}`}
                                checked={selectedDealType === dealType.id}
                                onCheckedChange={(checked) => handleDealTypeChange(dealType.id, checked)}
                            />
                            <Label
                                htmlFor={`deal-type-${dealType.id}`}
                                className="text-sm sm:text-base font-normal cursor-pointer"
                            >
                                {dealType.name}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price Range Slider */}
            <div>
                <h3 className="text-xl sm:text-2xl lg:text-[32px] font-semibold text-[#212121] mb-3 sm:mb-4">
                    Price
                </h3>
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
}

export default function LatestSidebar() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FilterSidebar />
        </Suspense>
    )
}