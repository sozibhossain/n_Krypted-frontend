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
  image,
  status,
  time = 0, // Default to 0 if not provided
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
    isExpired: false
  })

  useEffect(() => {
    if (time <= 0) {
      setTimeLeft({
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true
      })
      return
    }

    // Calculate total seconds from the time prop (minutes)
    let totalSeconds = time * 60

    const timer = setInterval(() => {
      if (totalSeconds <= 0) {
        clearInterval(timer)
        setTimeLeft({
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true
        })
        return
      }

      totalSeconds -= 1

      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60

      setTimeLeft({
        hours,
        minutes,
        seconds,
        isExpired: false
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [time])

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

  const renderActionButton = () => {
    if (timeLeft.isExpired) {
      return (
        <Button
          className="w-full bg-black text-white font-semibold mt-2 hover:bg-black/80"
        >
          Notify me
        </Button>
      )
    }

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
  }

  return (
    <>
      <Card className="overflow-hidden border-none bg-white p-2 max-w-[370px] hover:shadow-[0px_0px_10px_2px_#FFFFFF] transition-shadow duration-300 h-full">
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
            className={`w-[370px] h-[222px] aspect-[5/4] object-cover rounded-lg ${
              isHovered ? "scale-105" : "scale-100"
            } transition-transform duration-300`}
          />

          {/* Timer - Only show if deal has time and isn't expired */}
          {time > 0 && !timeLeft.isExpired && (
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
                textOverflow: "ellipsis"
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