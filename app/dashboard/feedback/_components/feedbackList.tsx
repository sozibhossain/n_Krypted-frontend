"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Trash, Eye } from 'lucide-react';

// shadcn/ui components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// types/feedback.ts
interface Feedback {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface FeedbackApiResponse {
  success: boolean;
  feedbacks: Feedback[];
}

function FeedbackList() {
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState<Feedback | null>(null);

  const queryClient = useQueryClient();

  // Fetch feedback data
  const { data, isLoading, error } = useQuery<FeedbackApiResponse>({
    queryKey: ['feedback'],
    queryFn: async () => {
      const response = await axios.get<FeedbackApiResponse>(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback`);
      return response.data;
    },
  });

  // Mutation for toggling approval
  const toggleApproval = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback/${id}/approve-toggle`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });

  // Mutation for deleting feedback
  const deleteFeedback = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      setIsDeleteModalOpen(false);
    },
  });

  const handleToggleApproval = (id: string) => {
    toggleApproval.mutate(id);
  };

  const handleDeleteClick = (feedback: Feedback) => {
    setFeedbackToDelete(feedback);
    setIsDeleteModalOpen(true);
  };

  const handleDetailsClick = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setIsDetailsModalOpen(true);
  };

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {(error as Error).message}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Feedback List</h1>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Approved</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.feedbacks?.map((feedback) => (
              <TableRow key={feedback._id}>
                <TableCell className="font-medium">{feedback.name}</TableCell>
                <TableCell>{feedback.email}</TableCell>
                <TableCell>{feedback.phoneNumber}</TableCell>
                <TableCell>
                  <Switch
                    checked={feedback.isApproved}
                    onCheckedChange={() => handleToggleApproval(feedback._id)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDetailsClick(feedback)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteClick(feedback)}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
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
              Are you sure you want to delete feedback from {feedbackToDelete?.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => feedbackToDelete && deleteFeedback.mutate(feedbackToDelete._id)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Details Dialog */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p>{selectedFeedback.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{selectedFeedback.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p>{selectedFeedback.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Message</p>
                <p className="whitespace-pre-line">{selectedFeedback.message}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created At</p>
                <p>{new Date(selectedFeedback.createdAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default FeedbackList;