"use client"

import { useState, useEffect } from "react"
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

export function FilterSidebar() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const currentCategory = searchParams.get("categoryName") || ""
    const currentLocation = searchParams.get("location") || "all"
    const currentMinPrice = searchParams.get("minPrice") || "0"
    const currentMaxPrice = searchParams.get("maxPrice") || "1000"
    const currentDealType = searchParams.get("dealType") || ""

    const [selectedCategory, setSelectedCategory] = useState<string>(currentCategory)
    const [selectedLocation, setSelectedLocation] = useState<string>(currentLocation)
    const [priceRange, setPriceRange] = useState<[number, number]>([
        parseInt(currentMinPrice) || 0,
        parseInt(currentMaxPrice) || 1000
    ])
    const [selectedDealType, setSelectedDealType] = useState<string>(currentDealType)
    const axiosInstance = useAxios()

    const { data: response } = useQuery({
        queryKey: ["deals"],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/api/deals`)
            return data
        },
    })
    const dealsData: Deal[] = response?.deals || []

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoading(true)
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
                setError(err instanceof Error ? err.message : "An unknown error occurred")
                console.error("Error fetching categories:", err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCategories()
    }, [])

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

    const handleCategoryChange = (categoryId: string, checked: boolean) => {
        if (checked) {
            setSelectedCategory(categoryId)
        } else if (selectedCategory === categoryId) {
            setSelectedCategory("")
        }
    }

    const handleDealTypeChange = (dealType: string, checked: boolean) => {
        if (checked) {
            setSelectedDealType(dealType)
        } else if (selectedDealType === dealType) {
            setSelectedDealType("")
        }
    }

    const handlePriceChange = (value: number[]) => {
        setPriceRange([value[0], value[1]])
    }

    // ✅ Properly typed unique locations
    const uniqueLocations: string[] = Array.from(new Set(dealsData.map((deal: Deal) => deal.location)))

    return (
        <div className="space-y-8 bg-white p-5 rounded-lg shadow-sm">
            {/* Categories */}
            <div>
                <h3 className="text-2xl md:text-[32px] font-semibold text-[#212121] mb-4">Kategorien</h3>
                {isLoading ? (
                    <div className="py-2">Loading categories...</div>
                ) : error ? (
                    <div className="text-red-500 py-2">Error: {error}</div>
                ) : (
                    <div className="space-y-3">
                        {categories.map((category) => (
                            <div key={category._id} className="flex items-center space-x-3">
                                <Checkbox
                                    id={`category-${category.categoryName}`}
                                    checked={selectedCategory === category.categoryName}
                                    onCheckedChange={(checked) => handleCategoryChange(category.categoryName, checked as boolean)}
                                />
                                <div className="flex items-center gap-2">
                                    <Label htmlFor={`category-${category.categoryName}`} className="text-base md:text-xl cursor-pointer text-[#4E4E4E] font-medium">
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
                <h3 className="text-2xl md:text-[32px] font-semibold text-[#212121] mb-4">Locations</h3>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="w-full border border-[#4E4E4E]">
                        <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {uniqueLocations.map((location: string) => (
                            <SelectItem key={location} value={location}>
                                {location}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Deal Types */}
            <div>
                <h3 className="text-2xl md:text-[32px] font-semibold text-[#212121] mb-4">Type Of Deals</h3>
                <div className="space-y-2">
                    {DEAL_TYPES.map((dealType) => (
                        <div key={dealType.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={`deal-type-${dealType.id}`}
                                checked={selectedDealType === dealType.id}
                                onCheckedChange={(checked) => handleDealTypeChange(dealType.id, checked as boolean)}
                            />
                            <Label htmlFor={`deal-type-${dealType.id}`} className="text-sm font-normal cursor-pointer">
                                {dealType.name}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price Range Slider */}
            <div>
                <h3 className="text-2xl md:text-[32px] font-semibold text-[#212121] mb-4">Price</h3>
                <div className="space-y-6">
                    <Slider
                        defaultValue={priceRange}
                        min={0}
                        max={1000}
                        step={10}
                        value={priceRange}
                        onValueChange={handlePriceChange}
                        className="mt-6"
                    />
                    <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
