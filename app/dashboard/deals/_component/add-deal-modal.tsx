"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, ImageIcon } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface Category {
  _id: string;
  categoryName: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  dealCount?: number;
}

interface AddDealModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
}

export default function AddDealModal({
  open,
  onOpenChange,
  categories,
}: AddDealModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [category, setCategory] = useState("");
  const [offers, setOffers] = useState<string[]>([""]);
  const [images, setImages] = useState<File[]>([]);
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const addDealMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/deals`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create deal");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      toast.success("Deal created successfully", { position: "top-right" });
      resetForm();
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Error creating deal:", error);
      toast.error("Failed to create deal", { position: "top-right" });
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Limit to 5 images total
      const remainingSlots = 5 - images.length;
      if (remainingSlots <= 0) {
        toast.error("You can only upload up to 5 images", {
          position: "top-right",
        });
        return;
      }

      const newFiles = Array.from(e.target.files).slice(0, remainingSlots);
      const newPreviews: string[] = [];

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPreviews.push(e.target.result as string);
            if (newPreviews.length === newFiles.length) {
              setImagesPreviews((prev) => [...prev, ...newPreviews]);
            }
          }
        };
        reader.readAsDataURL(file);
      });

      setImages((prev) => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });

    setImagesPreviews((prev) => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleOfferChange = (index: number, value: string) => {
    const newOffers = [...offers];
    newOffers[index] = value;
    setOffers(newOffers);
  };

  const addOffer = () => {
    setOffers([...offers, ""]);
  };

  const removeOffer = (index: number) => {
    const newOffers = [...offers];
    newOffers.splice(index, 1);
    setOffers(newOffers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("location", location);
    formData.append("category", category);

    // Add offers as JSON string
    formData.append(
      "offers",
      JSON.stringify(offers.filter((offer) => offer.trim() !== ""))
    );

    // Add images
    images.forEach((image) => {
      formData.append("images", image);
    });

    addDealMutation.mutate(formData);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setLocation("");
    setPlaceName("");
    setCategory("");
    setOffers([""]);
    setImages([]);
    setImagesPreviews([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Deals
            <div className="text-base font-normal text-[#595959] mt-1">
              Dashboard &gt; Deals &gt; Add Deal
            </div>
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="dealName">Deal Name</Label>
              <Input
                id="dealName"
                placeholder="Type category name here..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Type Deal description here..."
                className="min-h-[150px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                placeholder="$0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Type Location here..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="placeName">Place Name</Label>
              <Input
                id="placeName"
                placeholder="Type Place Name here..."
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="offers">Offers</Label>
              {offers.map((offer, index) => (
                <div key={index} className="flex items-center gap-2 mt-2">
                  <Input
                    placeholder={`Offer ${index + 1}`}
                    value={offer}
                    onChange={(e) => handleOfferChange(index, e.target.value)}
                  />
                  {offers.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOffer(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOffer}
                className="mt-2"
              >
                Add Offer
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="category">Deal Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Photo</Label>
              <div className="border-2 border-dashed rounded-lg p-4 mt-1 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  multiple
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex flex-col items-center justify-center min-h-[150px]">
                  <div className="flex justify-center mb-4">
                    <ImageIcon className="h-10 w-10 text-gray-400" />
                  </div>

                  <p className="text-sm text-gray-500 mb-2">
                    Drag and drop image here, or click add image
                  </p>

                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-[#212121] text-white hover:bg-[#212121]/90"
                  >
                    Add image
                  </Button>
                </div>

                {/* Image preview slots */}
                <div className="grid grid-cols-5 gap-2 mt-4">
                  {[...Array(5)].map((_, index) => {
                    const hasImage = index < imagesPreviews.length;
                    return (
                      <div
                        key={index}
                        className={`relative border ${
                          hasImage
                            ? "border-gray-300"
                            : "border-dashed border-gray-300"
                        } rounded p-1 h-20`}
                      >
                        {hasImage ? (
                          <>
                            <Image
                              src={imagesPreviews[index] || "/placeholder.svg"}
                              width={100}
                              height={100}
                              alt={`Preview ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                            <button
                              type="button"
                              className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <p className="text-xs text-gray-400">
                              Image {index + 1}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                className="bg-black hover:bg-black/90 text-white"
                disabled={addDealMutation.isPending}
              >
                {addDealMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
