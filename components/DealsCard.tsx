"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Users } from 'lucide-react'
import Link from "next/link"
import { useState } from "react"

interface DealsCardProps {
  id: string
  title: string
  description: string
  price: number
  participations: number
  maxParticipants?: number
  image?: string
  status?: string
}

export function DealsCard({
  id,
  title,
  description,
  price,
  participations,
  maxParticipants,
  image,
}: DealsCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card className="overflow-hidden border-none bg-white p-2 w-full hover:shadow-[0px_0px_10px_2px_#FFFFFF] transition-shadow duration-300 h-full">
      <div
        className="relative overflow-hidden rounded-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src={image || "/placeholder.svg"}
          alt={title || "Deal Image"}
          width={600}
          height={400}
          className={`w-full h-[222px] aspect-[5/4] object-cover rounded-lg ${
            isHovered ? "scale-105" : "scale-100"
          } transition-transform duration-300`}
        />

        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          <Badge variant="secondary" className="bg-black/50 text-white flex gap-1 items-center">
            <p>Maximum {maxParticipants} participants</p>
          </Badge>
        </div>
      </div>

      <CardContent className="space-y-2 pt-4">
        <h3 className="font-bold text-[18px] my-1 line-clamp-1">{title}</h3>
        <p className="text-[16px] font-normal text-[#737373] line-clamp-2">{description}</p>
        <Link href={`/deals/${id}`}>
          <div className="flex items-center gap-1 text-black font-normal cursor-pointer">
            <span>Read More</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </Link>

        <div className="flex items-center justify-between">
          <span className="font-semibold">${price?.toFixed(2)}</span>
          <div className="flex gap-2 items-center">
            <Users className="w-4 h-4" />
            <span>
              {participations}/{maxParticipants} participants
            </span>
          </div>
        </div>
      </CardContent>

      <Link href={`/deals/${id}/book`}>
        <CardFooter>
          <Button className="w-full bg-black text-white font-semibold mt-2 hover:bg-black/80">
            Book now!
          </Button>
        </CardFooter>
      </Link>
    </Card>
  )
}
