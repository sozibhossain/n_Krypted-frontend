"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import useAxios from "@/hooks/useAxios"
import { DealsCard } from "@/components/DealsCard"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { ChevronLeft, ChevronRight } from "lucide-react"

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

export function DealsSection() {
  const [itemsToShow, setItemsToShow] = useState(4)
  const axiosInstance = useAxios()

  // Responsive items to show
  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(1) // Mobile
      } else if (window.innerWidth < 1024) {
        setItemsToShow(2) // Tablet
      } else if (window.innerWidth < 1280) {
        setItemsToShow(3) // Laptop
      } else {
        setItemsToShow(4) // Desktop
      }
    }

    updateItemsToShow()
    window.addEventListener("resize", updateItemsToShow)
    return () => window.removeEventListener("resize", updateItemsToShow)
  }, [])

  const { data: response, isLoading } = useQuery({
    queryKey: ["deals"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/api/deals`)
      return data
    },
  })

  const dealsData = response?.deals || []

  const [sliderRef, instanceRef] = useKeenSlider({
    slides: {
      perView: itemsToShow,
      spacing: 16,
    },
    mode: "snap",
    loop: false,
    breakpoints: {
      "(max-width: 639px)": {
        slides: { perView: 1, spacing: 8 },
      },
      "(min-width: 640px) and (max-width: 1023px)": {
        slides: { perView: 2, spacing: 12 },
      },
      "(min-width: 1024px) and (max-width: 1279px)": {
        slides: { perView: 3, spacing: 14 },
      },
      "(min-width: 1280px)": {
        slides: { perView: 4, spacing: 16 },
      },
    },
  })

  // Update slider when itemsToShow changes
  useEffect(() => {
    instanceRef.current?.update({
      slides: {
        perView: itemsToShow,
        spacing: itemsToShow === 1 ? 8 : itemsToShow === 2 ? 12 : itemsToShow === 3 ? 14 : 16,
      },
    })
  }, [itemsToShow, instanceRef])

  return (
    <section className="bg-black py-4 sm:py-6 md:py-8 lg:py-10 xl:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 md:mb-8 lg:mb-10">
          <div className="mb-4 sm:mb-0">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <div className="w-2 sm:w-3 md:w-4 lg:w-5 h-5 sm:h-6 md:h-7 lg:h-8 bg-white rounded" />
              <div>
                <h1 className="font-benedict text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-[40px] font-normal mb-1 text-white">
                  Popular
                </h1>
              </div>
            </div>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[40px] font-bold text-white">
              Our Popular Deals
            </p>
          </div>

          <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-0">
            <button
              onClick={() => instanceRef.current?.prev()}
              disabled={dealsData.length <= itemsToShow}
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full bg-white flex items-center justify-center transition-all hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 text-black" />
            </button>

            <button
              onClick={() => instanceRef.current?.next()}
              disabled={dealsData.length <= itemsToShow}
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full bg-white flex items-center justify-center transition-all hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 text-black" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-32 sm:h-40 md:h-48 lg:h-64">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : dealsData.length === 0 ? (
          <div className="flex justify-center items-center h-32 sm:h-40 md:h-48 lg:h-64">
            <p className="text-white text-center text-sm sm:text-base md:text-lg lg:text-xl">
              No deals available at the moment.
            </p>
          </div>
        ) : (
          <div className="relative px-0 sm:px-2 md:px-3 lg:px-4">
            <div ref={sliderRef} className="keen-slider">
              {dealsData.map((deal: Deal) => (
                <div key={deal._id} className="keen-slider__slide px-1 sm:px-2 md:px-2.5 lg:px-3">
                  <div className="mx-auto w-full max-w-[300px] sm:max-w-[360px] md:max-w-[400px] lg:max-w-[450px] xl:max-w-[500px]">
                    <DealsCard
                      id={deal._id}
                      title={deal.title}
                      description={deal.description}
                      price={deal.price}
                      participations={deal.participations}
                      maxParticipants={deal.participations}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}