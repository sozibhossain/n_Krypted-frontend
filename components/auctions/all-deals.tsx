"use client";

import { useState, useEffect, useMemo, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/useAxios";
import { DealsCard } from "../DealsCard";
import { Pagination } from "../dashboard/pagination";

// Type definitions
interface Location {
  country: string;
  city: string;
}

interface Category {
  _id: string;
  categoryName: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  location: Location;
}

interface Deal {
  time: number | undefined;
  bookingCount: number;
  participationsLimit: number | undefined;
  _id: string;
  title: string;
  description: string;
  participations: number;
  price: number;
  location: Location;
  images: string[];
  offers: string[];
  status: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

// Custom hook for managing URL parameters
function useURLParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === "all") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      // Always reset to page 1 when filters change (except when only page is being updated)
      if (!updates.page && Object.keys(updates).length > 0) {
        params.set("page", "1");
      }

      const queryString = params.toString();
      router.push(`?${queryString}`, { scroll: false });
    },
    [router, searchParams]
  );

  return { searchParams, updateParams };
}

export default function DealsPage() {
  const { searchParams, updateParams } = useURLParams();
  const axiosInstance = useAxios();

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // State for categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  // State for all available locations
  const [allLocations, setAllLocations] = useState<string[]>([]);

  // Get current values from URL
  const currentCategory = searchParams.get("categoryName") || "";
  const currentLocation = searchParams.get("location") || "";
  const currentMinPrice = searchParams.get("minPrice") || "0";
  const currentMaxPrice = searchParams.get("maxPrice") || "1000";
  const currentDealType = searchParams.get("dealType") || "";
  const currentPage = Number.parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";

  // Local state for filters (synchronized with URL)
  const [selectedCategory, setSelectedCategory] =
    useState<string>(currentCategory);
  const [selectedLocation, setSelectedLocation] =
    useState<string>(currentLocation);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number.parseInt(currentMinPrice) || 0,
    Number.parseInt(currentMaxPrice) || 1000,
  ]);
  const [selectedDealType, setSelectedDealType] =
    useState<string>(currentDealType);

  // Sync local state with URL params
  useEffect(() => {
    setSelectedCategory(currentCategory);
    setSelectedLocation(currentLocation);
    setPriceRange([
      Number.parseInt(currentMinPrice) || 0,
      Number.parseInt(currentMaxPrice) || 1000,
    ]);
    setSelectedDealType(currentDealType);
  }, [
    currentCategory,
    currentLocation,
    currentMinPrice,
    currentMaxPrice,
    currentDealType,
  ]);

  // Fetch all deals to get all available locations
  const { data: allDealsData } = useQuery({
    queryKey: ["all-deals-locations"],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get("/api/deals");
        return data.deals || [];
      } catch (error) {
        console.error("Error fetching all deals:", error);
        return [];
      }
    },
  });

  const city = searchParams.get("city");
  const country = searchParams.get("country");

  // Fetch deals with filters
  const {
    data: response,
    isLoading: isLoadingDeals,
    error: dealsError,
  } = useQuery({
    queryKey: [
      "deals",
      currentCategory,
      currentLocation,
      currentMinPrice,
      currentMaxPrice,
      currentDealType,
      currentPage,
      search,
      city,
      country,

    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (currentCategory) params.set("categoryName", currentCategory);
      if (currentLocation && currentLocation !== "all") {
        params.set("location", currentLocation);
      }
      params.set("minPrice", currentMinPrice);
      params.set("maxPrice", currentMaxPrice);
      if (currentDealType) params.set("dealType", currentDealType);
      params.set("page", currentPage.toString());
      params.set("limit", "10");
      if (search.trim()) params.set("title", search.trim());
      if (city) params.set("city", city);
      if (country) params.set("country", country);

      console.log("Query params:", params.toString());
      const { data } = await axiosInstance.get(
        `/api/deals?${params.toString()}`
      );
      return data;
    },
  });

  // Memoize deals data
  const filteredDealsData = useMemo(
    () => response?.deals || [],
    [response?.deals]
  );
  const totalPages: number = response?.pagination?.totalPages || 5;

  // Fetch categories and extract locations
  useEffect(() => {
    const fetchCategoriesAndLocations = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          throw new Error("Invalid data format received from API");
        }
      } catch (err) {
        setCategoryError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Error fetching categories:", err);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategoriesAndLocations();
  }, []);

  // Extract all unique locations
  useEffect(() => {
    if (allDealsData && allDealsData.length > 0) {
      const uniqueLocations = Array.from(
        new Set(
          allDealsData
            .map(
              (deal: Deal) => `${deal.location.city}, ${deal.location.country}`
            )
            .filter(Boolean)
        )
      ) as string[];
      setAllLocations(uniqueLocations);
    }
  }, [allDealsData]);

  // Handle filter changes
  const handleCategoryChange = (
    categoryName: string,
    checked: boolean | "indeterminate"
  ) => {
    const isChecked = checked === true;
    const newCategory = isChecked
      ? categoryName
      : selectedCategory === categoryName
      ? ""
      : categoryName;
    setSelectedCategory(newCategory);
    updateParams({ categoryName: newCategory });
    setIsFilterOpen(false);
  };

  const handlePriceChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setPriceRange(newRange);
    updateParams({
      minPrice: newRange[0].toString(),
      maxPrice: newRange[1].toString(),
    });
    setIsFilterOpen(false);
  };

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
    updateParams({ location: value === "all" ? null : value });
    setIsFilterOpen(false);
  };

  const handlePageChange = (page: number) => {
    updateParams({ page: page.toString() });
  };

  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategory) count++;
    if (selectedLocation && selectedLocation !== "all") count++;
    if (selectedDealType) count++;
    if (priceRange[0] !== 0 || priceRange[1] !== 1000) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  // Filter Sidebar Component
  const FilterSidebar = () => (
    <div className="space-y-6 bg-white p-4 sm:p-5 rounded-lg shadow-sm w-full max-w-full lg:max-w-[300px]">
      {/* Categories */}
      <div>
        <h3 className="text-xl sm:text-2xl lg:text-[32px] font-semibold text-[#212121] mb-3 sm:mb-4">
          Kategorien
        </h3>
        {isLoadingCategories ? (
          <div className="py-2 text-sm sm:text-base">Loading categories...</div>
        ) : categoryError ? (
          <div className="text-red-500 py-2 text-sm sm:text-base">
            Error: {categoryError}
          </div>
        ) : categories.length === 0 ? (
          <div className="py-2 text-sm sm:text-base text-gray-500">
            No categories available
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {categories.map((category) => (
              <div key={category._id} className="flex items-center space-x-3">
                <Checkbox
                  id={`category-${category.categoryName}`}
                  checked={selectedCategory === category.categoryName}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(category.categoryName, checked)
                  }
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
        {allLocations.length === 0 ? (
          <div className="py-2 text-sm sm:text-base text-gray-500">
            Loading locations...
          </div>
        ) : (
          <Select
            value={selectedLocation || "all"}
            onValueChange={handleLocationChange}
          >
            <SelectTrigger className="w-full border border-[#4E4E4E] text-sm sm:text-base">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {allLocations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Price Range Slider */}
      <div>
        <h3 className="text-xl sm:text-2xl lg:text-[32px] font-semibold text-[#212121] mb-3 sm:mb-4">
          Price Range
        </h3>
        <div className="space-y-4 sm:space-y-6">
          {/* Price Input Fields */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-sm text-gray-600 mb-1 block">
                Min Price
              </label>
              <input
                type="number"
                min="0"
                max="1000"
                value={priceRange[0]}
                onChange={(e) => {
                  const newMin = Math.max(
                    0,
                    Math.min(Number(e.target.value), priceRange[1] - 10)
                  );
                  const newRange: [number, number] = [newMin, priceRange[1]];
                  setPriceRange(newRange);
                  updateParams({
                    minPrice: newMin.toString(),
                    maxPrice: priceRange[1].toString(),
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <span className="text-gray-400 mt-6">-</span>
            <div className="flex-1">
              <label className="text-sm text-gray-600 mb-1 block">
                Max Price
              </label>
              <input
                type="number"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => {
                  const newMax = Math.min(
                    1000,
                    Math.max(Number(e.target.value), priceRange[0] + 10)
                  );
                  const newRange: [number, number] = [priceRange[0], newMax];
                  setPriceRange(newRange);
                  updateParams({
                    minPrice: priceRange[0].toString(),
                    maxPrice: newMax.toString(),
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1000"
              />
            </div>
          </div>

          {/* Price Range Slider */}
          <Slider
            defaultValue={priceRange}
            min={0}
            max={1000}
            step={10}
            value={priceRange}
            onValueChange={handlePriceChange}
            className="mt-4 sm:mt-6"
          />

          {/* Price Display */}
          <div className="flex justify-between items-center text-xs sm:text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>

          {/* Quick Price Presets */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                const newRange: [number, number] = [0, 100];
                setPriceRange(newRange);
                updateParams({ minPrice: "0", maxPrice: "100" });
              }}
              className="px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              $0 - $100
            </button>
            <button
              onClick={() => {
                const newRange: [number, number] = [100, 300];
                setPriceRange(newRange);
                updateParams({ minPrice: "100", maxPrice: "300" });
              }}
              className="px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              $100 - $300
            </button>
            <button
              onClick={() => {
                const newRange: [number, number] = [300, 500];
                setPriceRange(newRange);
                updateParams({ minPrice: "300", maxPrice: "500" });
              }}
              className="px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              $300 - $500
            </button>
            <button
              onClick={() => {
                const newRange: [number, number] = [500, 1000];
                setPriceRange(newRange);
                updateParams({ minPrice: "500", maxPrice: "1000" });
              }}
              className="px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              $500+
            </button>
          </div>

          {/* Clear Price Filter */}
          <button
            onClick={() => {
              const newRange: [number, number] = [0, 1000];
              setPriceRange(newRange);
              updateParams({ minPrice: "0", maxPrice: "1000" });
            }}
            className="w-full px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Clear Price Filter
          </button>
        </div>
      </div>
    </div>
  );

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
                  <div
                    key={item}
                    className="h-80 bg-gray-200 animate-pulse rounded-lg"
                  ></div>
                ))}
              </div>
            ) : dealsError ? (
              <div className="col-span-full text-center py-10">
                <p className="text-red-500">
                  Error loading deals. Please try again later.
                </p>
              </div>
            ) : (
              <>
               
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 space-y-3 md:space-y-0">
                    {filteredDealsData.length > 0 ? (
                      filteredDealsData.map((deal: Deal) => (
                        <DealsCard
                          id={deal._id}
                          key={deal._id}
                          status={deal.status}
                          title={deal.title}
                          image={deal.images[0] || "/assets/deals.png"}
                          description={deal.description}
                          price={deal.price}
                          time={deal.time}
                          createdAt={deal.createdAt}
                          updatedAt={deal.updatedAt}
                          participations={deal.bookingCount}
                          maxParticipants={deal.participationsLimit}
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-10">
                        <p className="text-gray-500">
                          No deals found matching your filters.
                        </p>
                      </div>
                    )}
                  </div>

                {filteredDealsData.length > 0 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      totalItems={0}
                      itemsPerPage={0}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
