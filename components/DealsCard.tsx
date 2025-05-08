"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Users } from "lucide-react";
import Link from "next/link";
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



export function DealsCard({
  title,
  auctionId,
}: AuctionCardProps) {



  const session = useSession();
  const token = session?.data?.user?.accessToken;



  return (
    <Card className="overflow-hidden border-none bg-white p-2 shadow-[0px_0px_20px_2px_#FFFFFF]" >
      <div className="relative overflow-hidden rounded-lg">
        <Image
          src="/assets/deals.png"
          alt={title}
          width={300}
          height={300}
          className="w-full aspect-5/4 mx-auto object-cover transition-transform duration-300 hover:scale-105 rounded-lg"
        />

        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          <Badge
            variant="secondary"
            className="bg-black/50 text-white flex gap-1 items-center"
          >
            <p>Maximum 12 participants</p>
          </Badge>
        </div>
      </div>

      <CardContent className="space-y-2">
        <h3 className="font-bold text-[18px] my-1">Lorem ipsum is a dummy or text..</h3>
        <p className="text-[16px] font-normal text-[#737373]">Lorem ipsum is a dummy or text commonly used in graphic design.</p>
        <button className="flex items-center gap-1 text-black font-normal">Read More <ChevronRight className="w-4 h-4" /></button>
        <div className="flex items-center justify-between">
          <span>$17</span>
          <div className="flex gap-2 items-center">
            <Users className="w-4 h-4" />
            <span>5/12 participants</span>
          </div>
        </div>
      </CardContent>

      <Link href={`/auctions/${auctionId}`}>
        <CardFooter>
          <Button
            className="w-full bg-black text-white font-semibold mt-2">
            Book now!
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}
