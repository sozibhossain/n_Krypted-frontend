"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import useAxios from "@/hooks/useAxios"
import { CategoryCard } from "./category-card"

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { CategoryCardSkeleton } from "./card/skeleton"

export function CategoriesSection() {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [api, setApi] = useState<any>()
  const [currentIndex, setCurrentIndex] = useState(0)
  const axiosPublic = useAxios()

  const { data: allCategory, isLoading } = useQuery({
    queryKey: ["allCategory"],
    queryFn: async () => {
      const { data } = await axiosPublic("/api/categories")
      return data?.categories
    },
  })

  useEffect(() => {
    if (!api) return

    const handleSelect = () => {
      setCurrentIndex(api.selectedScrollSnap())
    }

    api.on("select", handleSelect)

    return () => {
      api.off("select", handleSelect)
    }
  }, [api])

  // Create placeholder skeletons when loading
  const skeletonItems = Array(4)
    .fill(0)
    .map((_, index) => (
      <CarouselItem key={`skeleton-${index}`} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 px-2">
        <CategoryCardSkeleton />
      </CarouselItem>
    ))

  return (
    <section className="mt-24 ">
      <div className="container px-4 md:px-6 lg:px-8 space-y-12">

        <div className="space-y-4">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="w-3 md:w-5 h-6 md:h-9 bg-white rounded" />
            <h1
              className="font-benedict text-2xl md:text-[40px] font-normal text-white"
              style={{ fontFamily: "cursive" }}
            >
              Categories
            </h1>
          </div>
          <p className="text-xl md:text-3xl lg:text-[40px] font-bold text-white mt-1 md:mt-2">Explore Our Category</p>
        </div>

        <div className="w-full">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {isLoading
                ? // Show skeleton items when loading
                skeletonItems
                : // Show actual category items when data is loaded
                /* eslint-disable @typescript-eslint/no-explicit-any */
                allCategory?.map((category: any, index: number) => (
                  <CarouselItem
                    key={category._id || index}
                    className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 pl-2 md:pl-4"
                  >
                    <CategoryCard title={category.categoryName} icon={category.image || ""} />
                  </CarouselItem>
                ))}
            </CarouselContent>
            <div className="flex items-center justify-center gap-1 md:gap-2 mt-6 md:mt-10">
              <div className="flex gap-1 md:gap-2">
                {isLoading
                  ? // Show skeleton dots when loading
                  Array(4)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={`skeleton-dot-${index}`}
                        className={`h-1.5 md:h-2 rounded-full transition-all ${index === 0 ? "bg-gray-600 w-4 md:w-6" : "bg-gray-700 w-1.5 md:w-2"}`}
                      />
                    ))
                  : // Show actual dots when data is loaded
                  /* eslint-disable @typescript-eslint/no-explicit-any */
                  allCategory?.map((category: any, index: number) => (
                    <div
                      key={index}
                      className={`h-1.5 md:h-2 rounded-full transition-all ${currentIndex === index ? "bg-white w-4 md:w-6" : "bg-gray-500/50 w-1.5 md:w-2"
                        }`}
                    />
                  ))}
              </div>
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  )
}
