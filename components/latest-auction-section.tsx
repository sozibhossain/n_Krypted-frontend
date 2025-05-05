"use client";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/section-header";
import { AuctionCard } from "@/components/auction-card";
import { MoveRight } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface AuctionItem {
  _id: number;
  images: string[];
  title: string;
  currentBid: string;
  startTime: string;
  endTime: string;
  badges?: string[];
  auctionId: string;
  status: string;
}

export function LatestAuctionSection() {
  const [latestData, setLatestData] = useState<AuctionItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auctions/get-latest-auctions`,
          {
            method: "GET",
          }
        );

        const data = await response.json();
        setLatestData(data.data);
      } catch (error) {
        console.error("Failed to fetch privacy policy:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="container mt-24">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <SectionHeader title="Latest Auction" />
        <Link
        href={'/auctions'}
        >
          <Button className="bg-[#645949]">
            Explore All <MoveRight />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {latestData &&
          latestData
            .slice(0, 8)
            .map((auction: AuctionItem) => (
              <AuctionCard
                status={auction.status}
                key={auction._id}
                image={auction.images[0]}
                title={auction.title}
                currentBid={auction.currentBid}
                startTime={auction.startTime}
                endTime={auction.endTime}
                auctionId={auction._id.toString()}
              />
            ))}
      </div>
    </section>
  );
}
