"use client"

import { Star } from "lucide-react"

interface StarRatingProps {
    rating: number
    maxRating?: number
    size?: "sm" | "md" | "lg"
    interactive?: boolean
    onRatingChange?: (rating: number) => void
}

export default function StarRating({
    rating,
    maxRating = 5,
    size = "md",
    interactive = false,
    onRatingChange,
}: StarRatingProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
    }

    const handleClick = (index: number) => {
        if (interactive && onRatingChange) {
            onRatingChange(index + 1)
        }
    }

    return (
        <div className="flex">
            {[...Array(maxRating)].map((_, index) => (
                <Star
                    key={index}
                    className={`${sizeClasses[size]} ${index < rating ? "fill-yellow-400 text-yellow-400" : "fill-muted stroke-muted-foreground"
                        } ${interactive ? "cursor-pointer" : ""}`}
                    onClick={() => handleClick(index)}
                />
            ))}
        </div>
    )
}
