"use client"

import { useQuery } from "@tanstack/react-query"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { AuctionCard } from "../auction-card"

interface AuctionCategory {
    name: string
}

interface AuctionItem {
    _id: number
    images: string[]
    title: string
    currentBid: string
    startTime: string
    endTime: string
    badges?: string[]
    status: string
}

export default function RelatedAuction({ name }: AuctionCategory) {
    const {
        data: relatedAuctions,
        error: errorRelatedAuctions,
    } = useQuery({
        queryKey: ["relatedAuctions"],
        queryFn: async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auctions/related-auctions?category=${name}`)

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Failed to fetch auction details")
            }

            return response.json()
        },
        select: (responseData) => responseData?.data,
    })

    if (!relatedAuctions) {
        return <div className="text-xl font-semibold">No related auctions</div>
    }

    if (errorRelatedAuctions) {
        return <div>Error: {errorRelatedAuctions.message}</div>
    }

    return (
        <div className="pt-10 py-12">
            <div className="pb-10">
                <h2 className="text-3xl md:text-5xl font-bold">Related Products</h2>
            </div>

            <div className="relative">
                <Carousel
                    opts={{
                        align: "start",
                        slidesToScroll: 1,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4">
                        {relatedAuctions?.map((auction: AuctionItem) => (
                            <CarouselItem key={auction._id} className="lg:pl-4 basis-full md:basis-1/2 lg:basis-1/4">
                                <AuctionCard
                                    status={auction.status}
                                    key={auction._id}
                                    image={auction.images[0]}
                                    title={auction.title}
                                    currentBid={auction.currentBid}
                                    auctionId={auction._id.toString()}
                                    startTime={auction.startTime}
                                    endTime={auction.endTime}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute lg:left-[92%] left-[83%] md:left-[90%] lg:-top-16 -top-14 bg-[#5d5749] hover:bg-[#4a4539] text-white border-none lg:h-10 h-8 lg:w-10 w-8 rounded-full" />
                    <CarouselNext className="absolute lg:right-2 -right-0 lg:-top-16 -top-14 transform -translate-y-1/2 bg-[#5d5749] hover:bg-[#4a4539] text-white border-none lg:h-10 h-8 lg:w-10 w-8 rounded-full" />
                </Carousel>
            </div>
        </div >
    )
}
