"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/dashboard/layout";
import { apiService } from "@/lib/api-service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trash2, User } from "lucide-react";
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
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface Bidder {
  userId: string;
  bidder: string;
  contact: {
    email: string;
    phone: string;
  };
  joinDate: string;
  totalBids: number;
  winAuctions: number;
}

export default function BiddersPage() {
  const [bidders, setBidders] = useState<Bidder[]>([]);
  const [filteredBidders, setFilteredBidders] = useState<Bidder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isBidderLoading, setIsBidderLoading] = useState(false);
  const session = useSession();
  const user = session.data?.user;

  // Set token whenever user changes
  useEffect(() => {
    if (user?.accessToken) {
      apiService.setToken(user.accessToken);
    }
  }, [user]);

  const fetchBidders = async () => {
    setIsBidderLoading(true);
    try {
      const response = await apiService.getAllBidders();
      if (response.status === true && response.data) {
        setBidders(response.data as Bidder[]);
        setFilteredBidders(response.data as Bidder[]);
        setTotalPages(response.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching bidders:", error);
      toast.error("Failed to fetch bidders");
    } finally {
      setIsBidderLoading(false);
    }
  };

  useEffect(() => {
    fetchBidders();
  }, [currentPage]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = bidders.filter(
        (bidder) =>
          bidder.bidder.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bidder.contact.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBidders(filtered);
    } else {
      setFilteredBidders(bidders);
    }
  }, [searchTerm, bidders]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteBidder = async (id: string) => {
    try {
      const response = await apiService.deleteBidder(id);
      if (response.status === true) {
        toast.success("Bidder deleted successfully");
        fetchBidders();
      }
    } catch (error) {
      console.error("Error deleting bidder:", error);
      toast.error("Failed to delete bidder");
    }
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bidders</h1>
          <p className="text-muted-foreground">Manage your bidder accounts</p>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search bidders..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button> */}
        </div>

        <div className="bg-white rounded-md">
          <div className="rounded-md">
            {isBidderLoading ? (
              <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#6b614f]"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F9FAFB] h-14 border-none">
                    <TableHead className="pl-20">Bidder</TableHead>
                    <TableHead className="text-center">Contact</TableHead>
                    <TableHead className="text-center">Join Date</TableHead>
                    <TableHead className="text-center">Total Bids</TableHead>
                    <TableHead className="text-center">Win Auctions</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBidders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No bidders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBidders.map((bidder) => (
                      <TableRow
                        key={bidder.userId}
                        className="text-center h-20 !border-b border-[#E5E7EB]"
                      >
                        <TableCell className="flex items-center gap-3 pl-6 pt-5">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                          <span className="font-medium">{bidder.bidder}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{bidder.contact.email}</span>
                            <span className="text-muted-foreground">
                              {bidder.contact.phone}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{bidder.joinDate}</TableCell>
                        <TableCell>{bidder.totalBids}</TableCell>
                        <TableCell>{bidder.winAuctions}</TableCell>
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
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the bidder account.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteBidder(bidder.userId)
                                  }
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
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </Layout>
  );
}
