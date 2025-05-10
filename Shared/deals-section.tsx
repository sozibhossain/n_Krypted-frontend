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
  const [itemsToShow, setItemsToShow] = useState(3)
  const axiosInstance = useAxios()

  // Responsive items to show
  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(1)
      } else if (window.innerWidth < 1024) {
        setItemsToShow(2)
      } else {
        setItemsToShow(3)
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
      "(max-width: 640px)": {
        slides: { perView: 1, spacing: 0 },
      },
      "(max-width: 1024px)": {
        slides: { perView: 2, spacing: 12 },
      },
    },
  })

  // Update slider when itemsToShow changes
  useEffect(() => {
    instanceRef.current?.update({
      slides: {
        perView: itemsToShow,
        spacing: 16,
      },
    })
  }, [itemsToShow, instanceRef])

  return (
    <section className=" ">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8">
          <div className="mb-4 sm:mb-0">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-3 sm:w-5 h-6 sm:h-9 bg-white rounded" />
              <div>
                <h1 className="font-benedict text-2xl sm:text-3xl md:text-[40px] font-normal mb-1 sm:mb-2 text-white">
                  Popular
                </h1>
              </div>
            </div>
            <p className="text-xl sm:text-2xl md:text-[40px] font-bold text-white">Our Popular Deals</p>
          </div>

          <div className="flex gap-2 mt-2 sm:mt-0">
            <button
              onClick={() => instanceRef.current?.prev()}
              disabled={dealsData.length <= itemsToShow}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-[60px] md:h-[60px] lg:w-[80px] lg:h-[70px] rounded-full bg-white flex items-center justify-center transition-all hover:bg-gray-100 disabled:opacity-50"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black" />
            </button>

            <button
              onClick={() => instanceRef.current?.next()}
              disabled={dealsData.length <= itemsToShow}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-[60px] md:h-[60px] lg:w-[80px] lg:h-[70px] rounded-full bg-white flex items-center justify-center transition-all hover:bg-gray-100 disabled:opacity-50"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40 sm:h-64">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : dealsData.length === 0 ? (
          <div className="flex justify-center items-center h-40 sm:h-64">
            <p className="text-white text-center text-sm sm:text-base">No deals available at the moment.</p>
          </div>
        ) : (
          <div className="relative px-0 sm:px-4">
            <div ref={sliderRef} className="keen-slider">
              {dealsData.map((deal: Deal) => (
                <div key={deal._id} className="keen-slider__slide px-2 sm:px-4 p-5">
                  <div className="mx-auto w-full md:max-[32%]">
                    <DealsCard
                      id={deal._id}
                      title={deal.title}
                      image={deal.images[0] || "/assets/deals.png"}
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