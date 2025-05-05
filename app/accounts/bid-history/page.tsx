"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import Link from "next/link";

type Bid = {
  _id: string;
  amount: number;
  auction: {
    _id: string;
    title: string;
    currentBid: number;
    endTime: string;
  } | null;
  user: string;
  isAuto: boolean;
  createdAt: string;
};

const ITEMS_PER_PAGE = 10;

export default function BidHistoryPage() {
  const [bidHistory, setBidHistory] = useState<Bid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  useEffect(() => {
    const fetchBidHistory = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/bids/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.status) {
          setBidHistory(response.data.data);
        } else {
          setError("Failed to fetch bids.");
        }
      } catch (err) {
        setError("An error occurred while fetching bids.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchBidHistory();
  }, [token]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getStatus = (endTime: string) => {
    const now = new Date();
    const end = new Date(endTime);
    return now > end ? "Ended" : "Live";
  };

  const getStatusColor = (status: string) => {
    if (status === "Ended") return "text-red-600";
    if (status === "Live") return "text-green-600";
    return "";
  };

  // Filter out invalid bids with missing auction
  const validBids = bidHistory.filter((bid) => bid.auction !== null);
  const totalPages = Math.ceil(validBids.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBids = validBids.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Card>
      <CardContent className="overflow-x-auto">
        {validBids.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No Bid History Found
          </div>
        ) : (
          <>
            <Table>
              <TableHeader className="bg-[#bcac98] text-black">
                <TableRow>
                  <TableHead>Auction Name</TableHead>
                  <TableHead>Bid Amount</TableHead>
                  {!isMobile && <TableHead>Bidding Time</TableHead>}
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-[#e7dfd3]">
                {currentBids.map((bid) => {
                  const status = bid.auction
                    ? getStatus(bid.auction.endTime)
                    : "Unknown";
                  return (
                    <TableRow key={bid._id}>
                      <TableCell className="font-medium px-5 truncate">
                        {bid.auction ? bid.auction.title : "Auction Deleted"}
                      </TableCell>
                      <TableCell>${bid.amount}</TableCell>
                      {!isMobile && (
                        <TableCell>
                          {format(
                            new Date(bid.createdAt),
                            "dd MMM yyyy, h:mm a"
                          )}
                        </TableCell>
                      )}
                      <TableCell className={getStatusColor(status)}>
                        {status}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link
                          href={
                            bid.auction
                              ? `/auctions/${bid.auction._id}`
                              : "#"
                          }
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={!bid.auction}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <div className="flex justify-center md:justify-end gap-3 items-center mt-4">
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="bg-[#645949] text-white"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-700">
                Page {currentPage} / {totalPages}
              </span>
              <Button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="bg-[#645949] text-white"
              >
                Next
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}