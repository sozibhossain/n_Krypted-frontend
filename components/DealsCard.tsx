"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ChevronRight, Users } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { PaymentForm } from "./pyment/Pyment"

interface DealsCardProps {
  id: string
  title: string
  description: string
  price: number
  participations: number
  maxParticipants?: number
  image?: string
  status?: string
  time?: number // in minutes
  createdAt?: string | Date
  updatedAt?: string | Date
}

interface TimeLeft {
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

export function DealsCard({
  id,
  title,
  description,
  price,
  participations,
  maxParticipants,
  createdAt,
  updatedAt,
  image,
  status,
  time = 0,
}: DealsCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  })

  // Timer logic
  useEffect(() => {
    if (time <= 0 || (!createdAt && !updatedAt)) {
      setTimeLeft({
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
      })
      return
    }

    const timer = setInterval(() => {
      const startTime = updatedAt || createdAt

      if (!startTime) {
        clearInterval(timer)
        setTimeLeft({
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        })
        return
      }

      const endTime = new Date(new Date(startTime).getTime() + time * 60000)
      const now = new Date()
      const difference = endTime.getTime() - now.getTime()

      if (difference <= 0) {
        clearInterval(timer)
        setTimeLeft({
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        })
        return
      }

      const hours = Math.floor(difference / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({
        hours,
        minutes,
        seconds,
        isExpired: false,
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [time, createdAt, updatedAt])

  const handleBooking = async (notifyMe: boolean) => {
    if (!session?.user?.id) {
      toast.success("Please log in to book this deal")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          dealsId: id,
          notifyMe: notifyMe,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setBookingId(data.booking._id)
        setIsModalOpen(true)
      } else {
        const error = await response.json()
        throw new Error(error.message || "Something went wrong")
      }
    } catch (error) {
      toast.error("Something went wrong" + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  // Helper functions for better readability
  const isDealExpired = timeLeft.isExpired
  const isDealAtCapacity = maxParticipants ? participations >= maxParticipants : false
  const hasTimeLimit = time > 0
  const hasAvailableSpots = maxParticipants ? participations < maxParticipants : true
  // const shouldShowTimer = hasTimeLimit && !isDealExpired && (createdAt || updatedAt)

  // Updated participant display logic with all three conditions
  const shouldShowParticipants = hasTimeLimit && !isDealExpired && maxParticipants && hasAvailableSpots
  // const shouldShowFullCapacityWarning = hasTimeLimit && !isDealExpired && maxParticipants && !hasAvailableSpots

  const renderActionButton = () => {
    // Priority 1: If time has expired
    if (isDealExpired) {
      return (
        <Button
          className="w-full bg-black text-white font-semibold mt-2 hover:bg-black/80"
          onClick={() => handleBooking(true)}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Notify me"}
        </Button>
      )
    }

    // Priority 2: If deal is fully booked (participations reached max)
    if (isDealAtCapacity) {
      return (
        <Button
          className="w-full bg-black text-white font-semibold mt-2 hover:bg-black/80"
          onClick={() => handleBooking(true)}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Notify me"}
        </Button>
      )
    }

    // Priority 3: Regular status-based rendering
    if (status === "activate") {
      return (
        <Button
          className="w-full bg-black text-white font-semibold mt-2 hover:bg-black/80"
          onClick={() => handleBooking(false)}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Book now"}
        </Button>
      )
    } else if (status === "deactivate") {
      return (
        <Button
          className="w-full bg-black text-white font-semibold mt-2 hover:bg-black/80"
          onClick={() => handleBooking(true)}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Notify me"}
        </Button>
      )
    }

    // Default fallback
    return (
      <Button className="w-full bg-gray-400 text-white font-semibold mt-2" disabled>
        Unavailable
      </Button>
    )
  }

  return (
    <>
      <Card className="overflow-hidden border-none bg-white p-2 max-w-[370px] hover:shadow-[0px_0px_10px_2px_#FFFFFF] transition-shadow duration-300 h-full">
        <Link href={`/deals/${id}`} className="no-underline">
          <div
            className="relative overflow-hidden rounded-lg"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Image
              src={image || "/placeholder.svg?height=222&width=370&query=deal image"}
              alt={title || "Deal Image"}
              width={600}
              height={400}
              className={`w-[370px] h-[222px] aspect-[5/4] object-cover rounded-lg ${
                isHovered ? "scale-105" : "scale-100"
              } transition-transform duration-300`}
            />

            {/* Timer - Only show if deal has time and isn't expired */}
            {shouldShowParticipants && (
              <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center gap-2 font-semibold text-white">
                <div className="flex items-center gap-2 bg-black/30 px-2 py-1 rounded">
                  <div className="text-center">
                    <div className="w-[35px] h-[35px] rounded-sm flex items-center justify-center">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </div>
                    <h1 className="text-xs">HR</h1>
                  </div>
                  :
                  <div className="text-center">
                    <div className="w-[35px] h-[35px] rounded-sm flex items-center justify-center">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </div>
                    <h1 className="text-xs">MIN</h1>
                  </div>
                  :
                  <div className="text-center">
                    <div className="w-[35px] h-[35px] rounded-sm flex items-center justify-center">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </div>
                    <h1 className="text-xs">SEC</h1>
                  </div>
                </div>
              </div>
            )}
          </div>

          <CardContent className="space-y-2 pt-4">
            <h3 className="font-bold text-[18px] my-1 line-clamp-1 text-[#212121]">{title}</h3>
            <p className="text-[16px] font-normal text-[#737373]">
              <div
                className="text-[#737373] truncate max-w-full"
                style={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                dangerouslySetInnerHTML={{
                  __html: description ?? "Deals Description",
                }}
              />
            </p>
            <Link href={`/deals/${id}`}>
              <div className="flex items-center gap-1 text-black font-normal cursor-pointer">
                <span>Read More</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>

            {/* Price and Participants Display */}
            <div className="flex items-center justify-between">
              <span className="font-semibold">${price?.toFixed(2)}</span>

              {/* Show participants when all conditions are met:
                  1. time > 0 (hasTimeLimit)
                  2. !timeLeft.isExpired 
                  3. maxParticipants exists
                  4. participations < maxParticipants (hasAvailableSpots)
              */}
              {shouldShowParticipants && (
                <div className="flex gap-2 items-center text-black">
                  <Users className="w-4 h-4" />
                  <span>
                    {participations}/{maxParticipants} Participants
                  </span>
                </div>  
              )}


              {/* Show participants for deals without time limits but with capacity */}
              {!hasTimeLimit && maxParticipants && (
                <div className="flex gap-2 items-center text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>
                    {participations}/{maxParticipants} participants
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Link>

        <CardFooter>{renderActionButton()}</CardFooter>
      </Card>

      {/* Success Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="p-10">
          <PaymentForm amount={price} bookingId={bookingId ?? ""} userId={session?.user?.id ?? ""} />
        </DialogContent>
      </Dialog>
    </>
  )
}
