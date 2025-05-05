"use client"

import { useEffect, useState } from "react"

interface CountdownProps {
    endTime: string
}

export default function AuctionCountdown({ endTime }: CountdownProps) {
    const [timeLeft, setTimeLeft] = useState({
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
    })

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(endTime).getTime() - new Date().getTime()

            if (difference <= 0) {
                setTimeLeft({
                    days: "00",
                    hours: "00",
                    minutes: "00",
                    seconds: "00",
                })
                return
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24))
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((difference % (1000 * 60)) / 1000)

            setTimeLeft({
                days: days.toString().padStart(2, "0"),
                hours: hours.toString().padStart(2, "0"),
                minutes: minutes.toString().padStart(2, "0"),
                seconds: seconds.toString().padStart(2, "0"),
            })
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)

        return () => clearInterval(timer)
    }, [endTime])

    return (
        <div className="grid grid-cols-4 gap-2 pb-6">
            <div className="flex flex-col items-center justify-center border border-[#645949] rounded-md p-4">
                <span className="text-3xl font-semibold">{timeLeft.days}</span>
                <span className="text-xs text-muted-foreground">Days</span>
            </div>
            <div className="flex flex-col items-center justify-center border border-[#645949] rounded-md p-4">
                <span className="text-3xl font-bold">{timeLeft.hours}</span>
                <span className="text-xs text-muted-foreground">Hours</span>
            </div>
            <div className="flex flex-col items-center justify-center border border-[#645949] rounded-md p-4">
                <span className="text-3xl font-bold">{timeLeft.minutes}</span>
                <span className="text-xs text-muted-foreground">Minutes</span>
            </div>
            <div className="flex flex-col items-center justify-center border border-[#645949] rounded-md p-4">
                <span className="text-3xl font-bold">{timeLeft.seconds}</span>
                <span className="text-xs text-muted-foreground">Seconds</span>
            </div>
        </div>
    )
}
