"use client"

import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/format"
import { useSession } from "next-auth/react"
import Link from "next/link"

interface BidHistoryProps {
    auctionId: string
}

interface Bid {
    _id: string
    amount: number
    user: { _id: string, username: string }
    createdAt: string
    isAuto: boolean
}

export default function BidHistory({ auctionId }: BidHistoryProps) {

    const session = useSession();

    const token = session?.data?.user?.accessToken;

    // Fetch bid history
    const { data: bidHistoryData, isLoading } = useQuery({
        queryKey: ["bidHistory", auctionId],
        queryFn: async () => {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/bids/auction/${auctionId}/history`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch bid history");
            }
            return response.json();
        },
        refetchInterval: 5000,
        refetchIntervalInBackground: false,

    });

    const bidHistory = bidHistoryData?.data;


    if (!token) {
        return (
            <div className="text-center text-lg font-semibold border-2 py-2 rounded-md">
                <h3>Please login to view bid history</h3>
                <Link href={"/login"} className="underline pt-2">Login</Link>
            </div>
        )
    }


    if (isLoading) {
        return <div>Loading bid history...</div>
    }



    if (!bidHistory) {
        return (
            <div>
                <h3>No bid history available</h3>
            </div>
        )
    }


    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 mb-4">
                <div className="flex gap-2 items-center text-base font-medium text-[#645949]">
                    <p className="">Starting Bid:</p>
                    <p className="">{formatCurrency(bidHistory.startingBid || 5000)}</p>
                </div>
                <div className="flex gap-2 items-center text-base font-medium text-[#645949]">
                    <p className="">Current Bid:</p>
                    <p className="">{bidHistory.winningBid || formatCurrency(11200)}</p>
                </div>
                <div className="flex gap-2 items-center text-base font-medium text-[#645949]">
                    <p className="">Increment:</p>
                    <p className="">{formatCurrency(100)}</p>
                </div>
            </div>

            <div className="border rounded-none overflow-x-auto bg-[#f9f4e8]">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-[#f9f4e8] hover:bg-[#f9f4e8]">
                            <TableHead className="border font-medium text-foreground py-3 px-4 w-1/4 min-w-[120px]">Date</TableHead>
                            <TableHead className="border font-medium text-foreground py-3 px-4 w-1/4 min-w-[100px]">Bid</TableHead>
                            <TableHead className="border font-medium text-foreground py-3 px-4 w-1/4 min-w-[100px]">User</TableHead>
                            <TableHead className="border font-medium text-foreground py-3 px-4 w-1/4 min-w-[80px]">Auto</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {token && bidHistory.map((bid: Bid, index: number) => (
                            <TableRow key={index} className="bg-[#f9f4e8] hover:bg-[#f9f4e8]">
                                <TableCell className="border py-3 px-4">
                                    {format(new Date(bid.createdAt), "MMMM d, yyyy h:mm a")}
                                </TableCell>
                                <TableCell className="border py-3 px-4">{formatCurrency(bid.amount)}</TableCell>
                                <TableCell className="border py-3 px-4">{bid?.user?.username}</TableCell>
                                <TableCell className="border py-3 px-4">{bid.isAuto ? "Yes" : "No"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
