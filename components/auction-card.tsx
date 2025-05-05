"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface AuctionCardProps {
  image: string;
  title: string;
  currentBid?: string;
  timeLeft?: string;
  badges?: string | undefined;
  auctionId?: string;
  startTime: string;
  endTime: string;
  status: string;
}

function calculateTimeLeft(endTime: string) {
  const difference = new Date(endTime).getTime() - new Date().getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return { days, hours, minutes, seconds };
}

export function AuctionCard({
  image,
  title,
  currentBid,
  auctionId,
  endTime,
  status
}: AuctionCardProps) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(endTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const session = useSession();
  const token = session?.data?.user?.accessToken;

  const handleWishlist = async () => {
    if (!token) {
      toast.error("You must be logged in to add to wishlist");
      return;
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/wishlist/add/${auctionId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      toast.error("Auction already in wishlist");
      return errorData;
    }
    toast.success("Added to wishlist!");
    return response.json();
  };
  
  return (
    <Card className="overflow-hidden border-none bg-[#dfc5a2] p-2">
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={300}
          height={300}
          className="h-full w-full mx-auto object-cover transition-transform duration-300 hover:scale-105 rounded-lg"
        />

        {status === "live" && (
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            <Badge
              variant="secondary"
              className="bg-black/50 text-white flex gap-1 items-center"
            >
              <Image
                src={"/assets/live.png"}
                alt="live"
                height={10}
                width={10}
              />
              {status}
            </Badge>
          </div>
        )}

        <div
          onClick={handleWishlist}
          className={`absolute right-2 top-2 bg-black/50 px-2 py-1 text-xs text-white h-[24px] w-[24px] rounded-full flex flex-col justify-center items-center cursor-pointer`}
        >
          <Heart
            className="h-[20px] w-[20px]"
          />
        </div>

        {/* Timer */}
        <div className="absolute bottom-2 flex translate-x-2 items-center gap-4 font-semibold text-white">
          <div>
            <div className="w-[35px] h-[35px] rounded-sm bg-black/30 flex flex-col items-center justify-center">
              {String(timeLeft.days).padStart(2, "0")}
            </div>
            <h1 className="text-center mt-1">DAY</h1>
          </div>
          :
          <div>
            <div className="w-[35px] h-[35px] rounded-sm bg-black/30 flex flex-col items-center justify-center">
              {String(timeLeft.hours).padStart(2, "0")}
            </div>
            <h1 className="text-center mt-1">HR</h1>
          </div>
          :
          <div>
            <div className="w-[35px] h-[35px] rounded-sm bg-black/30 flex flex-col items-center justify-center">
              {String(timeLeft.minutes).padStart(2, "0")}
            </div>
            <h1 className="text-center mt-1">MIN</h1>
          </div>
          :
          <div>
            <div className="w-[35px] h-[35px] rounded-sm bg-black/30 flex flex-col items-center justify-center">
              {String(timeLeft.seconds).padStart(2, "0")}
            </div>
            <h1 className="text-center mt-1">SEC</h1>
          </div>
        </div>
      </div>

      <CardContent className="my-2">
        <h3 className="font-medium text-xl my-1">{title}</h3>
        {currentBid && (
          <p className="text-sm text-white font-semibold">
            Current bid: {currentBid}
          </p>
        )}
      </CardContent>

      <Link href={`/auctions/${auctionId}`}>
        <CardFooter>
          <Button
            className="w-full bg-[#645949] text-white font-semibold">
            Bid now
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}
