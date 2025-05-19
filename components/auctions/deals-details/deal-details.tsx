"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { useQuery } from "@tanstack/react-query"
import { Calendar, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import StarRating from "@/app/deals/Star-rating"


interface AuctionDetailsProps {
    auctionId: string
}

interface AuctionImageGalleryProps {
    images: string[] | undefined
    selectedIndex: number
    onSelect: (index: number) => void
}

const AuctionImageGallery: React.FC<AuctionImageGalleryProps> = ({ images, selectedIndex, onSelect }) => {
    if (!images || images.length === 0) {
        return <div>No images available</div>
    }

    return (
        <div className="flex flex-col gap-5">
            {images.map((image, index) => (
                <button
                    key={index}
                    onClick={() => onSelect(index)}
                    className={`relative w-20 h-20 rounded-md overflow-hidden border-2 ${selectedIndex === index ? "border-blue-500" : "border-transparent"
                        }`}
                >
                    <Image
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                    />
                </button>
            ))}
        </div>
    )
}

export default function DealDetails({ auctionId }: AuctionDetailsProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [reviewRating, setReviewRating] = useState(0)
    const [reviewComment, setReviewComment] = useState("")

    // Fetch auction details
    const {
        data: auctionData,
        isLoading: isLoadingAuction,
        error: errorAuction,
    } = useQuery({
        queryKey: ["singledeal", auctionId],
        queryFn: async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deals/${auctionId}`)
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Failed to fetch auction details")
            }
            return response.json()
        },
        refetchInterval: 5000,
        refetchIntervalInBackground: false,
    })

    const auction = auctionData?.deal

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault()
        console.log({ rating: reviewRating, comment: reviewComment })
    }

    if (isLoadingAuction) {
        return <div className="text-center py-10">Loading auction details...</div>
    }

    if (errorAuction) {
        return <div className="text-center py-10 text-red-500">Error loading auction details</div>
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Image Gallery - Left Side */}
                <div className="md:col-span-1 order-2 md:order-1">
                    <AuctionImageGallery
                        images={auction?.images}
                        selectedIndex={selectedImageIndex}
                        onSelect={setSelectedImageIndex}
                    />
                </div>

                {/* Main Image - Middle */}
                <div className="md:col-span-6 space-y-4 order-1 md:order-2">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted">
                        <Image
                            src={auction?.images?.[selectedImageIndex] || "/placeholder.svg"}
                            alt={auction?.title || "Property image"}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Auction Details - Right Side */}
                <div className="md:col-span-5 order-3 ">
                    <div className="space-y-4">
                        <h1 className="text-[40px] font-semibold text-[#FFFFFF]">{auction?.title || "Property Title"}</h1>
                        <p className="text-xl text-[#E0E0E0] font-normal leading-[150%]">
                            {auction?.description ||
                                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tincidunt porta faucet. Praesent a leo et leo amet mollis quis quis erat. Integer aliquam dapibus justo at dapibus."}
                        </p>
                        <div className="flex items-center gap-2 text-gray-500">
                            <MapPin className="w-4 h-4 text-white" />
                            <span className="text-xl text-[#E0E0E0] font-medium">Lorem ipsum dolor sit amet.</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xl text-[#E0E0E0] font-medium">consectetur efficitur.</span>
                        </div>
                        <div>
                            <span className="text-2xl font-semibold text-[#FFFFFF]">
                                {auction?.price ? `$${auction.price.toFixed(2)}` : "$0.00"}
                            </span>
                        </div>
                        <div>
                            <span className="text-xl text-[#E0E0E0] font-medium">
                                {auction?.participations} of {auction?.maxParticipants} participants
                            </span>
                        </div>
                        <Button className="w-full bg-[#FFFFFF] text-[#212121] h-[32px]">Book now!</Button>
                    </div>
                </div>
            </div>

            {/* Description Section */}
            <div className="space-y-6">
                <h2 className="text-[32px] text-[#FFFFFF] font-normal">What will you get?</h2>
                <p className="text-xl text-[#E0E0E0] font-medium leading-[150%]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi quis dolor urna. Sed sed felis dui. Suspendisse
                    nec ligula vel nulla ullamcorper volutpat. Integer luctus facilisis nunc, sit amet mattis odio vestibulum sit
                    amet vestibulum sed egestas augue. Nullam ac cursus felis. Vivamus mattis quam ut leo finibus finibus.
                    Pellentesque vehicula lorem vitae vehicula ultrices. Quisque sit amet dui ex. Sed vitae maximus odio, et
                    pretium diam. Vestibulum consequat egestas massa, at aliquet justo eu.
                </p>
                <h4 className="text-[24px] text-[#FFFFFF] font-semibold">Lorem ipsum dolor sit amet.</h4>
                <ul className="space-y-2 list-disc pl-5 text-gray-500">
                    <li className="text-xl text-[#E0E0E0] font-normal">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                    <li className="text-xl text-[#E0E0E0] font-normal">Morbi varius sapien in mauris rutrum, non commodo arcu egestas.</li>
                    <li className="text-xl text-[#E0E0E0] font-normal">Integer vel nulla placerat, convallis risus eget, condimentum ligula.</li>
                    <li className="text-xl text-[#E0E0E0] font-normal">Nulla sit amet felis id urna ultrices condimentum et vitae odio.</li>
                    <li className="text-xl text-[#E0E0E0] font-normal">Nam sed risus feugiat, dapibus turpis nec, pharetra turpis.</li>
                    <li className="text-xl text-[#E0E0E0] font-normal">Sed mattis quam non elit tristique, non rutrum dui finibus.</li>
                    <li className="text-xl text-[#E0E0E0] font-normal">Nullam laoreet tortor at dolor ultrices, a blandit lectus tristique.</li>
                    <li className="text-xl text-[#E0E0E0] font-normal">Morbi in sapien non nulla feugiat dapibus.</li>
                </ul>
            </div>

            {/* Second Description Section */}
            <div className="space-y-6">
                <p className="text-xl text-[#E0E0E0] font-medium leading-[150%]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi quis dolor urna. Sed sed felis dui. Suspendisse
                    nec ligula vel nulla ullamcorper volutpat. Integer luctus facilisis nunc, sit amet mattis odio vestibulum sit
                    amet vestibulum sed egestas augue. Nullam ac cursus felis. Vivamus mattis quam ut leo finibus finibus.
                    Pellentesque vehicula lorem vitae vehicula ultrices. Quisque sit amet dui ex. Sed vitae maximus odio, et
                    pretium diam. Vestibulum consequat egestas massa, at aliquet justo eu.
                </p>
            </div>

            {/* Review Section */}
            <div className="space-y-6 pb-[120px]">
                <h2 className="text-[32px] text-[#FFFFFF] font-semibold">Customer Reviews</h2>
                <div>
                    <p className="text-xl text-[#FFFFFF] font-medium">Be the first to review “This Deals”</p>
                </div>
                <div className="gap-2">
                    <span className="text-base text-[#FFFFFF] font-medium mb-5">Your rating:</span>
                    <StarRating rating={reviewRating} interactive={true} onRatingChange={setReviewRating} />
                </div>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                    <Textarea
                        placeholder="Your review"
                        className="min-h-[150px] border border-[#FFFFFF] text-[#FFFFFF] placeholder:text-white"
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                        <Input className="border border-[#FFFFFF] placeholder:text-white text-white" placeholder="Name" required />
                        <Input className="border border-[#FFFFFF] placeholder:text-white text-white" placeholder="Email" type="email" required />
                    </div>
                    <Button className="p-4 bg-[#FFFFFF] text-base text-[#212121] font-medium" type="submit">Submit</Button>
                </form>
            </div>
        </div>
    )
}