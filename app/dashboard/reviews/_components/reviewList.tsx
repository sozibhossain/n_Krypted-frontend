"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Trash } from "lucide-react";

// shadcn/ui components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";

// Types
interface User {
  _id: string;
  name: string;
  email: string;
}

interface Deal {
  _id: string;
  title: string;
  // other deal properties omitted for brevity
}

interface Review {
  _id: string;
  userID: User;
  dealID: Deal;
  reviewComment: string;
  ratings: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ReviewsApiResponse {
  success: boolean;
  data: Review[];
}

function ReviewList() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  const queryClient = useQueryClient();

  const session = useSession();
  const token = session?.data?.user?.accessToken;

  // Fetch reviews data
  const { data, isLoading, error } = useQuery<ReviewsApiResponse>({
    queryKey: ["reviews"],
    queryFn: async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request
        },
      });
      return response.data;
    },
  });

  // Mutation for deleting review
  const deleteReview = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      setIsDeleteModalOpen(false);
    },
  });

  const handleDeleteClick = (review: Review) => {
    setReviewToDelete(review);
    setIsDeleteModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Error: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Reviews</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Deal Title</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((review) => (
              <TableRow key={review._id}>
                <TableCell className="font-medium">
                  {review.userID.name}
                </TableCell>
                <TableCell>
                  <div className="line-clamp-2">{review.reviewComment}</div>
                </TableCell>
                <TableCell>
                  <div className="line-clamp-2">{review.dealID.title}</div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(review)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review by{" "}
              {reviewToDelete?.userID.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                reviewToDelete && deleteReview.mutate(reviewToDelete._id)
              }
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ReviewList;
