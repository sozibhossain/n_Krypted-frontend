import { useEffect, useState } from "react";
import { Auction } from "@/app/wishlist/_components/type";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { X } from "lucide-react"; // Added X icon
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner"; // For toast notifications

export function WishlistCard({
  wishlistItems = [],
  onRemove, // Add onRemove callback prop
}: {
  wishlistItems?: Auction[];
  onRemove?: (id: string) => void; // Callback function type
}) {
  const auctionData = wishlistItems[0];

  const auction = auctionData
    ? {
      title: auctionData.title,
      description: auctionData.description,
      caratWeight: auctionData.caratWeight,
      currentBid: auctionData.currentBid,
      images: auctionData.images,
      startTime: auctionData.startTime,
      endTime: auctionData.endTime,
      status: auctionData.status,
      seller: auctionData.seller,
      _id: auctionData._id,
    }
    : null;

  // Format bid amount with commas and two decimal places
  const formattedBid = auction?.currentBid
    ? `$${auction.currentBid.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
    : "$0.00";

  const auctionStatus = auction?.status?.toLowerCase() || "completed";

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!auction?.endTime) return;

    const interval = setInterval(() => {
      const end = new Date(auction.endTime).getTime();
      const now = new Date().getTime();
      const distance = end - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [auction?.endTime]);

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Stop event bubbling

    if (!auction?._id || !onRemove) return;

    try {
      onRemove(auction._id); // Call the parent's remove function
      toast.success("Item removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove item");
      console.error("Error removing item:", error);
    }
  };

  return (
    <Card className="overflow-hidden shadow-sm border-none bg-[#dfc5a2] p-2 group">
      <Link href={`/auctions/${auction?._id}`} className="block">
        <div
          className="h-[254px] bg-gray-200 relative rounded-lg"
          style={{
            backgroundImage: auction?.images?.length
              ? `url(${auction.images[0]})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <CardHeader>
            <div className="flex justify-between p-4">
              <span
                className={`flex gap-2 items-center rounded-md px-3 py-1 text-sm font-medium text-white ${auctionStatus === "live"
                    ? "bg-[#0000004D] backdrop-blur-sm"
                    : auctionStatus === "completed"
                      ? "bg-gray-600"
                      : "bg-blue-600"
                  }`}
              >
                <Image
                  src={"/assets/live.png"}
                  alt="live"
                  height={50}
                  width={50}
                  className="h-4 w-4"
                />
                {auctionStatus.toUpperCase()}
              </span>
              <div>
                <button
                  onClick={handleRemove}
                  className="px-[10px] py-[10px] rounded-full bg-[#0000004D] backdrop-blur-sm text-white hover:bg-[#00000066] transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </CardHeader>

          {/* Countdown timer positioned at the bottom */}
          <div className="absolute bottom-0 left-0 right-0 text-white p-3">
            <div className="flex justify-between">
              <div className="text-center">
                <div className="text-xl font-bold">{timeLeft.days}</div>
                <div className="text-xs">DAY</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">{timeLeft.hours}</div>
                <div className="text-xs">HR</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">{timeLeft.minutes}</div>
                <div className="text-xs">MIN</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">{timeLeft.seconds}</div>
                <div className="text-xs">SEC</div>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="py-4 space-y-2">
          <div className="space-y-2">
            <h3 className="text-[14px] font-normal text-[#645949]">
              {auction?.title}
            </h3>

            <p 
              className="list-item list-none overflow-hidden text-ellipsis"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
            }}
              dangerouslySetInnerHTML={{
                __html: auction?.description ?? "Blog Description",
              }}
            />
          </div>

          <div className="flex items-centermt-4 gap-2">
            <p className="text-[16px] font-normal text-[#FFF3F3]">
              Current bid:
            </p>
            <p className="text-[16px] font-normal text-[#FFF3F3]">
              {formattedBid}
            </p>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <Button
            className="w-full bg-[#645949] hover:bg-gray-800 text-white"
            disabled={auctionStatus !== "live"}
          >
            {auctionStatus === "completed" ? "Auction Ended" : "Bid Now"}
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}
