"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface AuctionImageGalleryProps {
    images: string[]
    selectedIndex: number
    onSelect: (index: number) => void
}

export default function AuctionImageGallery({ images, selectedIndex, onSelect }: AuctionImageGalleryProps) {
    return (
        <div className="grid grid-cols-4 gap-3">
            {images.map((image, index) => (
                <button
                    key={index}
                    className={cn(
                        "relative w-full h-24 flex-shrink-0 overflow-hidden rounded-md border",
                        selectedIndex === index ? "border-primary" : "border-muted",
                    )}
                    onClick={() => onSelect(index)}
                >
                    <Image src={image || "/placeholder.svg"} alt={`Product image ${index + 1}`} fill className="object-cover" />
                </button>
            ))}
        </div>
    )
}
