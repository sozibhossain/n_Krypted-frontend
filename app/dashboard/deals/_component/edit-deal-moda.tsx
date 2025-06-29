"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { X, Upload } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

interface Location {
  country: string;
  city: string;
}

interface DealData {
  title: string;
  description: string;
  price: number;
  location: Location;
  offers: string[];
  images: string[];
  participationsLimit: number;
  time: string; // Changed to string for decimal format
  status?: string;
  category?: string;
  scheduleDates: { active: boolean; day: string; _id?: string }[];
}

interface Category {
  _id: string;
  categoryName: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoriesResponse {
  success: boolean;
  data: Category[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

interface EditDealModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dealId: string;
}

export default function EditDealModal({
  open,
  onOpenChange,
  dealId,
}: EditDealModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [offerInput, setOfferInput] = useState("");
  const [offers, setOffers] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [scheduleDates, setScheduleDates] = useState<{ day: Date; active: boolean }[]>([]);

  const queryClient = useQueryClient();

  const { data: categoriesData } = useQuery<CategoriesResponse>({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        return data;
      } catch (err) {
        console.error("Error fetching categories:", err);
        throw err;
      }
    },
  });

  const categories = categoriesData?.data || [];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DealData>();

  const convertMinutesToDecimalHours = (minutes: number): string => {
    if (!minutes) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}.${mins.toString().padStart(2, "0")}`;
  };

  const convertDecimalHoursToMinutes = (timeString: string): number => {
    if (!timeString) return 0;
    const [hours, minutes] = timeString.split(".").map(Number);
    return (hours || 0) * 60 + (minutes || 0);
  };

  // Fetch deal data when modal opens
  useEffect(() => {
    if (open && dealId) {
      const fetchDealData = async (id: string) => {
        setIsLoading(true);
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/deals/${id}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch deal data");
          }
          const data = await response.json();

          // Set form values
          setValue("title", data.deal.title);
          setValue("description", data.deal.description);
          setDescription(data.deal.description);
          setValue("price", data.deal.price);
          setValue("location.country", data.deal.location.country);
          setValue("location.city", data.deal.location.city);
          setValue("participationsLimit", data.deal.participationsLimit);
          setValue("time", convertMinutesToDecimalHours(data.deal.time)); // Convert minutes to decimal hours
          setCategory(data.deal.category?._id || "");
          setOffers(data.deal.offers || []);
          setExistingImages(data.deal.images || []);
          // Set scheduleDates
          setScheduleDates(
            data.deal.scheduleDates
              ? data.deal.scheduleDates.map((dateObj: { day: string; active: boolean }) => ({
                  day: new Date(dateObj.day),
                  active: dateObj.active,
                }))
              : []
          );
        } catch (error) {
          console.error("Error fetching deal data:", error);
          toast.error("Failed to load deal data");
        } finally {
          setIsLoading(false);
        }
      };

      fetchDealData(dealId);
    }
  }, [open, dealId, setValue]);

  const updateMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/deals/${dealId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update deal");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      toast.success("Deal updated successfully", { position: "top-right" });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Error updating deal:", error);
      const errorMessage =
        error.message.includes("scheduleDates")
          ? "Invalid schedule dates format"
          : "Failed to update deal";
      toast.error(errorMessage, { position: "top-right" });
    },
  });

  const onSubmit = async (data: DealData) => {
    if (!dealId) return;

    if (scheduleDates.length === 0) {
      toast.error("Please select at least one schedule date", {
        position: "top-right",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("location[country]", data.location.country);
    formData.append("location[city]", data.location.city);
    formData.append("participationsLimit", data.participationsLimit.toString());
    formData.append("time", String(convertDecimalHoursToMinutes(data.time))); // Convert decimal hours to minutes
    if (category) {
      formData.append("category", category);
    }
    // Add offers
    offers.forEach((offer, index) => {
      formData.append(`offers[${index}]`, offer);
    });
    // Add existing images
    existingImages.forEach((image, index) => {
      formData.append(`existingImages[${index}]`, image);
    });
    // Add new files
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });
    // Add scheduleDates
    formData.append(
      "scheduleDates",
      JSON.stringify(
        scheduleDates.map((dateObj) => ({
          day: dateObj.day.toISOString(),
          active: dateObj.active,
        }))
      )
    );

    updateMutation.mutate(formData);
  };

  const handleAddOffer = () => {
    if (offerInput.trim()) {
      setOffers([...offers, offerInput.trim()]);
      setOfferInput("");
    }
  };

  const handleRemoveOffer = (index: number) => {
    setOffers(offers.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles([...selectedFiles, ...filesArray]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading deal data...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Deal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register("title", { required: "Title is required" })}
                className="w-full"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <div className="border rounded-md">
                <ReactQuill
                  id="description"
                  value={description}
                  onChange={(content) => {
                    setValue("description", content);
                    setDescription(content);
                  }}
                  className=""
                  theme="snow"
                />
              </div>
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description.message}</p>
              )}
            </div>

            <div className="grid gap-2">
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

            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", {
                  required: "Price is required",
                  valueAsNumber: true,
                  min: { value: 0, message: "Price must be positive" },
                })}
                className="w-full"
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  {...register("location.country", {
                    required: "Country is required",
                  })}
                  className="w-full"
                />
                {errors.location?.country && (
                  <p className="text-red-500 text-sm">
                    {errors.location.country.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  {...register("location.city", { required: "City is required" })}
                  className="w-full"
                />
                {errors.location?.city && (
                  <p className="text-red-500 text-sm">
                    {errors.location.city.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="participationsLimit">Participation Limit</Label>
              <Input
                id="participationsLimit"
                type="number"
                {...register("participationsLimit", {
                  required: "Participation limit is required",
                  valueAsNumber: true,
                  min: { value: 1, message: "Participation limit must be at least 1" },
                })}
                className="w-full"
              />
              {errors.participationsLimit && (
                <p className="text-red-500 text-sm">
                  {errors.participationsLimit.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="time">Deal Time (hours.minutes)</Label>
              <Input
                id="time"
                type="text"
                {...register("time", {
                  required: "Deal time is required",
                  pattern: {
                    value: /^\d*\.?\d*$/,
                    message: "Enter time in hours.minutes format (e.g., 2.30)",
                  },
                })}
                className="w-full"
                placeholder="e.g., 2.30 (2 hours 30 minutes)"
              />
              {errors.time && (
                <p className="text-red-500 text-sm">{errors.time.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="scheduleDates">Schedule Dates</Label>
              <DatePicker
                id="scheduleDates"
                selected={null}
                onChange={(date: Date | null) => {
                  if (date) {
                    const isDuplicate = scheduleDates.some(
                      (existingDate) =>
                        existingDate.day.toISOString().split("T")[0] ===
                        date.toISOString().split("T")[0]
                    );
                    if (!isDuplicate) {
                      setScheduleDates((prev) => [
                        ...prev,
                        { day: date, active: true },
                      ]);
                    } else {
                      toast.error("This date is already selected", {
                        position: "top-right",
                      });
                    }
                  }
                }}
                placeholderText="Select schedule dates..."
                minDate={new Date()}
                className="w-full border rounded p-2 bg-[#f5f1eb] ml-2"
              />
              <div className="mt-2">
                {scheduleDates.length === 0 && (
                  <p className="text-sm text-gray-500">No dates selected</p>
                )}
                {scheduleDates.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {scheduleDates.map((dateObj, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full"
                      >
                        <span>{dateObj.day.toISOString().split("T")[0]}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-1"
                          onClick={() =>
                            setScheduleDates((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.scheduleDates && (
                <p className="text-red-500 text-sm">{errors.scheduleDates.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Offers</Label>
              <div className="flex gap-2">
                <Input
                  value={offerInput}
                  onChange={(e) => setOfferInput(e.target.value)}
                  placeholder="Add an offer"
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddOffer}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {offers.map((offer, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-muted px-3 py-1 rounded-full"
                  >
                    <span>{offer}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 ml-1"
                      onClick={() => handleRemoveOffer(index)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Images</Label>
              <div className="border-2 border-dashed border-muted rounded-md p-4">
                <div className="flex items-center justify-center flex-col">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop or click to upload
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("image-upload")?.click()}
                  >
                    Select Files
                  </Button>
                </div>
              </div>

              {existingImages.length > 0 && (
                <div>
                  <Label className="mb-2 block">Existing Images</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {existingImages.map((image, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={image || "/placeholder.svg"}
                          width={100}
                          height={100}
                          alt={`Existing image ${index}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => handleRemoveExistingImage(index)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedFiles.length > 0 && (
                <div>
                  <Label className="mb-2 block">New Images</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={URL.createObjectURL(file) || "/placeholder.svg"}
                          width={100}
                          height={100}
                          alt={`New image ${index}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}