"use client"

import { useState } from "react"
import { useTransition } from "react"
import { Edit, Trash, Plus } from "lucide-react"
// import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import Layout from "@/components/dashboard/layout"
import { Pagination } from "@/components/dashboard/pagination"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface Category {
  _id: string
  categoryName: string
  image: string
  createdAt: string
  updatedAt: string
}

interface Deal {
  _id: string
  title: string
  description: string
  participations: number
  price: number
  location: string
  images: string[]
  offers: string[]
  status: string
  category: Category | null
  createdAt: string
  updatedAt: string
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

interface ApiResponse {
  success: boolean
  deals: Deal[]
  pagination: PaginationInfo
}

export default function DealsManagement() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ["deals", page],
    queryFn: async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deals?page=${page}&limit=10`)
        if (!response.ok) {
          throw new Error("Failed to fetch deals")
        }
        return await response.json()
      } catch (err) {
        console.error("Error fetching deals:", err)
        throw err
      }
    },
  })

  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deals/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete deal")
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalidate and refetch the deals query
      queryClient.invalidateQueries({ queryKey: ["deals"] })
      toast.success("Deal deleted successfully", { position: "top-right" })
    },
    onError: (error) => {
      console.error("Error deleting deal:", error)
      toast.error("Failed to delete deal", { position: "top-right" })
    },
  })

  const deals = data?.deals || []
  const pagination = data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  }

  const [isPending, startTransition] = useTransition()
  // const router = useRouter()

  const handlePageChange = (page: number) => {
    startTransition(() => {
      setPage(page)
    })
  }

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    try {
      // In a real application, you would update the status via API
      console.log(
        `Toggling status for deal ${id} from ${currentStatus} to ${currentStatus === "activate" ? "deactivate" : "activate"}`,
      )

      // Optimistically update UI would be handled with a proper mutation
      // For now, just refetch the data
      queryClient.invalidateQueries({ queryKey: ["deals"] })
    } catch (error) {
      console.error("Error updating deal status:", error)
    }
  }

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [dealToDelete, setDealToDelete] = useState<string | null>(null)
  console.log("dealToDelete", dealToDelete)

  const handleDelete = async (id: string) => {
    try {
      setDealToDelete(id)
      setDeleteDialogOpen(true)
    } catch (error) {
      console.error("Error preparing to delete deal:", error)
    }
  }

  const confirmDelete = async () => {
    if (!dealToDelete) return

    try {
      deleteMutation.mutate(dealToDelete)
    } finally {
      setDeleteDialogOpen(false)
      setDealToDelete(null)
    }
  }

  return (
    <Layout>
      <div className="">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-[40px] text-[#1F2937] font-bold tracking-tigh">Deals</CardTitle>
            <p className="text-xl text-[#595959]">Dashboard &gt; Deals</p>
          </div>
          <Button className="bg-[#212121] hover:bg-[#212121]/90 text-white h-[52px]">
            <Plus className="mr-2 h-4 w-4" /> Add Deal
          </Button>
        </CardHeader>
        <Card className="bg-[#FFFFFF] mt-10">
          <CardContent>
            <div className="rounded-md border border-[#BABABA]">
              <Table>
                <TableHeader>
                  <TableRow className="text-[#595959] text-base font-medium py-4 hover:bg-transparent">
                    <TableHead>Deals</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Location</TableHead>
                    {/* <TableHead>Place Name</TableHead> */}
                    <TableHead>Price</TableHead>
                    <TableHead>Activate</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : deals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10">
                        No deals found
                      </TableCell>
                    </TableRow>
                  ) : (
                    deals.map((deal) => (
                      <TableRow key={deal._id} className="border-b border-[#BABABA] hover:bg-[#BABABA]/10">
                        <TableCell className="text-[#212121] text-base font-medium py-4">
                          {deal.title || "Lorem ipsum is a dummy or text."}
                        </TableCell>
                        <TableCell className="text-[#595959] text-base font-medium py-4">
                          {deal.category?.categoryName || "Restaurants"}
                        </TableCell>
                        <TableCell className="text-[#595959] text-base font-medium py-4">
                          {`#${deal._id.substring(0, 3)}-${deal._id.substring(3, 6)}` || "#212-121"}
                        </TableCell>
                        <TableCell className="text-[#595959] text-base font-medium py-4">
                          {deal.location || "Lorem ipsum dolor sit amet."}
                        </TableCell>
                        {/* <TableCell className="text-[#595959] text-base font-medium py-4">{deal.description?.substring(0, 20) || "consectetur efficitur."}</TableCell> */}
                        <TableCell className="text-[#595959] text-base font-medium py-4">
                          ${deal.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-[#595959] text-base font-medium py-4">
                          <Switch
                            checked={deal.status === "activate"}
                            onCheckedChange={() => handleStatusToggle(deal._id, deal.status)}
                          />
                        </TableCell>
                        <TableCell className="text-[#595959] text-base font-medium py-4">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(deal._id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-3 pb-2 px-3">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                onPageChange={handlePageChange}
                isLoading={isLoading || isPending}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this deal?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the deal from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  )
}
