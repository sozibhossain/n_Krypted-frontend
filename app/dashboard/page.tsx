"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/dashboard/layout";
import { apiService } from "@/lib/api-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Users, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";

interface Auction {
  _id: string;
  title: string;
  currentBid: number;
  status: string;
  endsIn?: string;
  bidCount: number; // Added bidCount property
}

interface TopBidder {
  _id: string;
  username: string;
  auctionsWon: number;
  totalAmount: number;
}

export default function Dashboard() {
  const [recentAuctions, setRecentAuctions] = useState<Auction[]>([]);
  const [topBidders, setTopBidders] = useState<TopBidder[]>([]);
  const stats = useState({
    revenue: 11020,
    sellers: 8020,
    bidders: 6020,
    liveAuctions: 20,
  });
  const session = useSession();
  const user = session.data?.user;

  // Set token whenever user changes
  useEffect(() => {
    if (user?.accessToken) {
      apiService.setToken(user.accessToken);
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auctionsResponse = (await apiService.getAllAuctions()) as {
          status: string;
          data: Auction[];
        };
        if (auctionsResponse.status === "success" && auctionsResponse.data) {
          setRecentAuctions(auctionsResponse.data.slice(0, 8));
        }

        const biddersResponse = await apiService.getTopBidders();
        if (biddersResponse.status === true && biddersResponse.data) {
          setTopBidders(biddersResponse.data as TopBidder[]);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <div className="space-y-6 ">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-[#4B5563] text-sm font-normal">
            Welcome back to your auction admin panel
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="flex items-center justify-between p-4 bg-white">
            <div className="space-y-1">
              <p className="text-[12px] font-normal text-[#6B7280]">
                Total Revenue
              </p>
              <div className="text-2xl font-bold">${stats[0].revenue}</div>
              <p className="text-[16px] font-normal text-[#6B7280]">All Time</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2695FF] text-white">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
          </Card>

          <Card className="flex items-center justify-between p-4 bg-white">
            <div className="space-y-1">
              <p className="text-[12px] font-normal text-[#6B7280]">
                Total Seller
              </p>
              <div className="text-2xl font-bold">{stats[0].sellers}</div>
              <p className="text-[16px] font-normal text-[#6B7280]">All Time</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#10B981] text-white">
              <Store className="h-8 w-8 text-white" />
            </div>
          </Card>

          <Card className="flex items-center justify-between p-4 bg-white">
            <div className="space-y-1">
              <p className="text-[12px] font-normal text-[#6B7280]">
                Total Bidders
              </p>
              <div className="text-2xl font-bold">{stats[0].bidders}</div>
              <p className="text-[16px] font-normal text-[#6B7280]">All Time</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F59E0B] text-white">
              <Users className="h-8 w-8 text-white" />
            </div>
          </Card>

          <Card className="flex items-center justify-between p-4 bg-white">
            <div className="space-y-1">
              <p className="text-[12px] font-normal text-[#6B7280]">
                Live Auctions
              </p>
              <div className="text-2xl font-bold">{stats[0].liveAuctions}</div>
              <p className="text-[16px] font-normal text-[#6B7280]">All Time</p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EF4444] text-white">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1 p-4 bg-white">
            <CardHeader className="mb-4">
              <CardTitle>Recent Auctions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="grid grid-cols-5 text-sm font-medium text-muted-foreground">
                  <div className="text-center">Item</div>
                  <div className="text-center">Bids</div>
                  <div className="text-center">Highest Bid</div>
                  <div className="text-center">Ends In</div>
                  <div className="text-center">Status</div>
                </div>
                <div className="space-y-4">
                  {recentAuctions.map((auction) => (
                    <div
                      key={auction._id}
                      className="grid grid-cols-5 items-center border-b border-gray-200 last:border-b-0 py-2"
                    >
                      <div className="font-medium text-center">{auction.title}</div>
                      <div className="text-center">{auction.bidCount}</div>
                      <div className="text-center">${auction.currentBid || 2022}</div>
                      <div className="text-center">2 hours</div>
                      <div className="text-center">
                        <Badge
                          variant="outline"
                          className={` capitalize
    ${auction.status === "completed" &&
                            "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                            }
    ${auction.status === "live" &&
                            "bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800"
                            }
    ${auction.status === "pending" &&
                            "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800"
                            }
    ${auction.status === "cancelled" &&
                            "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800"
                            }
    ${auction.status === "scheduled" &&
                            "bg-purple-100 text-purple-800 hover:bg-purple-100 hover:text-purple-800"
                            }
  `}
                        >
                          {auction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-blue-500 hover:underline cursor-pointer">
                  View All Auctions →
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 p-4 bg-white">
            <CardHeader className="mb-4">
              <CardTitle>Top Bidders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {" "}
                {/* Changed from space-y-8 to space-y-0 */}
                {topBidders.map((bidder) => (
                  <div
                    key={bidder._id}
                    className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{bidder.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {bidder.auctionsWon} auctions won
                      </p>
                    </div>
                    <div className="font-medium text-green-600">
                      ${bidder.totalAmount.toLocaleString()}
                    </div>
                  </div>
                ))}
                {Array.from({ length: 8 - topBidders.length }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">John Smith</p>
                      <p className="text-sm text-muted-foreground">
                        12 auctions won
                      </p>
                    </div>
                    <div className="font-medium text-green-600">$14,250</div>
                  </div>
                ))}
                <div className="pt-4 text-sm text-blue-500 hover:underline cursor-pointer">
                  View All Bidders →
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
