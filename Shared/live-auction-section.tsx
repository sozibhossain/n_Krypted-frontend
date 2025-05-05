"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import useAxios from "@/hooks/useAxios"
import { AuctionCard } from "@/components/auction-card"
import { MoveLeft, MoveRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AuctionItem {
  _id: number;
  images: string[];
  title: string;
  currentBid: string;
  startTime: string;
  endTime: string;
  status: string;
  auctionId: string;
}

export function LiveAuctionSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsToShow, setItemsToShow] = useState(4)
  const axiosInstance = useAxios()

  // Responsive items to show
  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(1)
      } else if (window.innerWidth < 768) {
        setItemsToShow(2)
      } else if (window.innerWidth < 1024) {
        setItemsToShow(3)
      } else {
        setItemsToShow(4)
      }
    }

    updateItemsToShow()
    window.addEventListener('resize', updateItemsToShow)
    return () => window.removeEventListener('resize', updateItemsToShow)
  }, [])

  const { data: liveAuctionData = [] } = useQuery({
    queryKey: ["live-auction"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/auctions/get-live-auctions`)
      return data.data
    },
  })

  const nextSlide = () => {
    if (currentIndex + itemsToShow < liveAuctionData.length) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const visibleAuctions = liveAuctionData.slice(
    currentIndex,
    currentIndex + itemsToShow
  )

  useEffect(() => {
    if (liveAuctionData.length > 0 && currentIndex + itemsToShow > liveAuctionData.length) {
      setCurrentIndex(Math.max(0, liveAuctionData.length - itemsToShow))
    }
  }, [itemsToShow, liveAuctionData.length, currentIndex])

  return (
    <section className="">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Live Auctions</h1>
            <p className="text-gray-600">Browse the current live auctions</p>
          </div>

          {liveAuctionData.length > itemsToShow && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-[48px] w-[80px] rounded-sm border-[#645949]"
                onClick={prevSlide}
                disabled={currentIndex === 0}
              >
                <MoveLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-[48px] w-[80px] rounded-sm border-[#645949]"
                onClick={nextSlide}
                disabled={currentIndex + itemsToShow >= liveAuctionData.length}
              >
                <MoveRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {visibleAuctions.map((auction: AuctionItem) => (
            <AuctionCard
              key={auction._id}
              image={auction.images[0]}
              title={auction.title}
              currentBid={auction.currentBid}
              startTime={auction.startTime}
              endTime={auction.endTime}
              auctionId={auction._id.toString()}
              status={status}
            />
          ))}
        </div>
      </div>
    </section>
  )
}