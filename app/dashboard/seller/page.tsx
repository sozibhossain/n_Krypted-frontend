"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/dashboard/layout";
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
import { Search, Trash2 } from "lucide-react";
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
import { User } from "lucide-react";
import { useAllSellers, useDeleteSeller } from "@/hooks/use-queries";
import { useSession } from "next-auth/react";
import { apiService } from "@/lib/api-service";

interface Seller {
  _id: string;
  username: string;
  email: string;
  phone: string;
  sellerId: string;
  joinDate: string;
  totalAuctions: number;
  liveAuctions: number;
  totalSales: number;
  sellAmount: number;
}

export default function SellersPage() {
  const { data: sellersData, isLoading } = useAllSellers();

  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const session = useSession();
  const user = session.data?.user;

  // Set token whenever user changes
  useEffect(() => {
    if (user?.accessToken) {
      apiService.setToken(user.accessToken);
    }
  }, [user]);

  const deleteSellerMutation = useDeleteSeller();

  useEffect(() => {
    if (sellersData?.data) {
      setSellers(sellersData.data as Seller[]);
      setFilteredSellers(sellersData.data as Seller[]);
      setTotalPages(sellersData.totalPages || 1);
    }
  }, [sellersData]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = sellers.filter(
        (seller) =>
          seller.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          seller.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSellers(filtered);
    } else {
      setFilteredSellers(sellers);
    }
  }, [searchTerm, sellers]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteSeller = (id: string) => {
    deleteSellerMutation.mutate(id);
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sellers</h1>
          <p className="text-muted-foreground">Manage your Sellers accounts</p>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search sellers..."
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
            {isLoading ? (
              <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#6b614f]"></div>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-[#F9FAFB] h-14 border-none">
                  <TableRow>
                    <TableHead className="text-center">Seller</TableHead>
                    <TableHead className="text-center">Contact</TableHead>
                    <TableHead className="text-center">Seller ID</TableHead>
                    <TableHead className="text-center">Join Date</TableHead>
                    <TableHead className="text-center">
                      Total Auctions
                    </TableHead>
                    <TableHead className="text-center">Live Auctions</TableHead>
                    <TableHead className="text-center">Total Sales</TableHead>
                    <TableHead className="text-center">Sell Amount</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSellers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-4">
                        No sellers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSellers.map((seller) => (
                      <TableRow
                        key={seller._id}
                        className="text-center h-20 !border-b border-[#E5E7EB]"
                      >
                        <TableCell className="flex items-center gap-3 pl-6 pt-5">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                          <span className="font-medium">{seller.username}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{seller.email}</span>
                            <span className="text-muted-foreground">
                              {seller.phone}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{seller.sellerId}</TableCell>
                        <TableCell>{seller.joinDate}</TableCell>
                        <TableCell>{seller.totalAuctions}</TableCell>
                        <TableCell>{seller.liveAuctions}</TableCell>
                        <TableCell>{seller.totalSales}</TableCell>
                        <TableCell>{seller.sellAmount}</TableCell>
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
                                  permanently delete the seller account.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteSeller(seller._id)}
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
