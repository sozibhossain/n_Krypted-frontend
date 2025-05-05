"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/dashboard/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pagination } from "@/components/dashboard/pagination";
import {
  useActiveAuctions,
  usePendingAuctions,
  useScheduledAuctions,
  useEndedAuctions,
  useAcceptAuction,
  useRejectAuction,
  useDeleteAuction,
} from "@/hooks/use-queries";
import { useSession } from "next-auth/react";
import { apiService } from "@/lib/api-service";

interface Auction {
  _id: string;
  title: string;
  category: {
    _id: string;
    name: string;
  };
  sku: string;
  seller: {
    _id: string;
    username: string;
    sellerId?: string;
    displayName?: string;
  };
  startTime: string;
  endTime: string;
  currentBid: number;
  bidCount: number;
  status: string;
  approved: boolean;
  total: number;
}

export default function AuctionsPage() {
  const [activeTab, setActiveTab] = useState("active");
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(1);

  const session = useSession();
  const user = session.data?.user;

  // Set token whenever user changes
  useEffect(() => {
    if (user?.accessToken) {
      apiService.setToken(user.accessToken);
    }
  }, [user]);

  // TanStack Query hooks
  const activeAuctionsQuery = useActiveAuctions();
  const pendingAuctionsQuery = usePendingAuctions();
  const scheduledAuctionsQuery = useScheduledAuctions();
  const endedAuctionsQuery = useEndedAuctions();

  const acceptAuctionMutation = useAcceptAuction();
  const rejectAuctionMutation = useRejectAuction();
  const deleteAuctionMutation = useDeleteAuction();

  // Determine which query to use based on active tab
  const currentQuery = {
    active: activeAuctionsQuery,
    pending: pendingAuctionsQuery,
    scheduled: scheduledAuctionsQuery,
    end: endedAuctionsQuery,
  }[activeTab] as typeof activeAuctionsQuery;

  useEffect(() => {
    if (currentQuery?.data?.data) {
      setAuctions(currentQuery.data.data as Auction[]);
      setTotalPages(currentQuery.data.totalPages || 1);
      setTotalCount(currentQuery.data.total || 1);
    }
  }, [currentQuery?.data, activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAcceptAuction = async (id: string) => {
    acceptAuctionMutation.mutate(id);
  };

  const handleRejectAuction = async (id: string) => {
    rejectAuctionMutation.mutate(id);
  };

  const handleDeleteAuction = async (id: string) => {
    deleteAuctionMutation.mutate(id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}PM`;
  };

  const isLoading = currentQuery?.isLoading;

  console.log(auctions)

  return (
    <Layout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Auctions</h1>
          <p className="text-muted-foreground">Manage your auction Listings</p>
        </div>

        <div className="bg-white rounded-md">
          <Tabs
            defaultValue="active"
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 rounded-lg bg-[#e9dcc9] h-16 border border-[#645949]">
              <TabsTrigger
                value="active"
                className="rounded-md data-[state=active]:bg-[#6b614f] data-[state=active]:text-white h-full"
              >
                Active
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="rounded-md data-[state=active]:bg-[#6b614f] data-[state=active]:text-white h-full"
              >
                Pending
              </TabsTrigger>
              <TabsTrigger
                value="scheduled"
                className="rounded-md data-[state=active]:bg-[#6b614f] data-[state=active]:text-white h-full"
              >
                Scheduled
              </TabsTrigger>
              <TabsTrigger
                value="end"
                className="rounded-md data-[state=active]:bg-[#6b614f] data-[state=active]:text-white h-full"
              >
                End
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-4">
              <AuctionsTable
                auctions={auctions}
                onDelete={handleDeleteAuction}
                formatDate={formatDate}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="pending" className="mt-4">
              <PendingAuctionsTable
                auctions={auctions}
                onAccept={handleAcceptAuction}
                onReject={handleRejectAuction}
                onDelete={handleDeleteAuction}
                formatDate={formatDate}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="scheduled" className="mt-4">
              <AuctionsTable
                auctions={auctions}
                onDelete={handleDeleteAuction}
                formatDate={formatDate}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="end" className="mt-4">
              <AuctionsTable
                auctions={auctions}
                onDelete={handleDeleteAuction}
                formatDate={formatDate}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>

          <Pagination
            totalCount={totalCount}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </Layout>
  );
}

interface AuctionsTableProps {
  auctions: Auction[];
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
  isLoading?: boolean;
}

function AuctionsTable({
  auctions,
  onDelete,
  formatDate,
  isLoading,
}: AuctionsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#6b614f]"></div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-[#F9FAFB] h-14 border-none">
          <TableHead className="text-center">Auction</TableHead>
          <TableHead className="text-center">Category</TableHead>
          <TableHead className="text-center">SKU</TableHead>
          <TableHead className="text-center">Seller</TableHead>
          <TableHead className="text-center">Start Date</TableHead>
          <TableHead className="text-center">End Date</TableHead>
          <TableHead className="text-center">Current Bid</TableHead>
          <TableHead className="text-center">Bids</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {auctions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9} className="text-center py-4">
              No auctions found
            </TableCell>
          </TableRow>
        ) : (
          auctions.map((auction) => (
            <TableRow
              key={auction._id}
              className="text-center h-16 !border-b border-[#E5E7EB]"
            >
              <TableCell className="font-medium">{auction.title}</TableCell>
              <TableCell>{auction.category?.name}</TableCell>
              <TableCell>{auction.sku || "#212-121"}</TableCell>
              <TableCell>
                <h5>
                  {auction.seller?.displayName?.split("#")[0] ||
                    `Mr. John #2561`}
                </h5>
                #
                {auction.seller?.displayName?.split("#")[1] || `Mr. John #2561`}
              </TableCell>
              <TableCell>
                {formatDate(auction.startTime || "2023-01-15T10:00:00.000Z")}
              </TableCell>
              <TableCell>
                {formatDate(auction.endTime || "2023-01-20T10:00:00.000Z")}
              </TableCell>
              <TableCell>${auction.currentBid || 12450}</TableCell>
              <TableCell>{auction.bidCount || 12}</TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the auction.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(auction._id)}
                        className="bg-red-500 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

interface PendingAuctionsTableProps extends AuctionsTableProps {
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

function PendingAuctionsTable({
  auctions,
  onAccept,
  onReject,
  onDelete,
  formatDate,
  isLoading,
}: PendingAuctionsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#6b614f]"></div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-[#F9FAFB] h-14 border-none">
          <TableHead className="text-center">Auction</TableHead>
          <TableHead className="text-center">Category</TableHead>
          <TableHead className="text-center">SKU</TableHead>
          <TableHead className="text-center">Seller</TableHead>
          <TableHead className="text-center">Start Date</TableHead>
          <TableHead className="text-center">End Date</TableHead>
          <TableHead className="text-center">Current Bid</TableHead>
          <TableHead className="text-center">Bids</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {auctions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9} className="text-center py-4">
              No pending auctions found
            </TableCell>
          </TableRow>
        ) : (
          auctions.map((auction) => (
            <TableRow key={auction._id} className="text-center h-16 !border-b">
              <TableCell className="font-medium">{auction.title}</TableCell>
              <TableCell className="capitalize">
                {auction.category.name}
              </TableCell>
              <TableCell>{auction.sku || "#212-121"}</TableCell>
              <TableCell>
                <h5>
                  {auction.seller?.displayName?.split("#")[0] ||
                    `Mr. John #2561`}
                </h5>
                #
                {auction.seller?.displayName?.split("#")[1] || `Mr. John #2561`}
              </TableCell>
              <TableCell>
                {formatDate(auction.startTime || "2023-01-15T10:00:00.000Z")}
              </TableCell>
              <TableCell>
                {formatDate(auction.endTime || "2023-01-20T10:00:00.000Z")}
              </TableCell>
              <TableCell>${auction.currentBid || 12450}</TableCell>
              <TableCell>{auction.bidCount || 12}</TableCell>
              <TableCell className="flex space-x-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 border-green-600 hover:bg-green-50"
                  onClick={() => onAccept(auction._id)}
                >
                  Accept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  onClick={() => onReject(auction._id)}
                >
                  Reject
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the auction.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(auction._id)}
                        className="bg-red-500 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
