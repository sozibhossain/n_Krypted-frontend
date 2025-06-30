// "use client";

// import type React from "react";
// import { useState, useRef } from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { X, ImageIcon } from "lucide-react";
// import { toast } from "sonner";

// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import Image from "next/image";

// import QuillEditor from "../../blogs/_components/QuillEditor";

// interface Category {
//   _id: string;
//   categoryName: string;
//   image?: string;
//   createdAt?: string;
//   updatedAt?: string;
//   __v?: number;
//   dealCount?: number;
// }

// interface LocationData {
//   country: string;
//   city: string;
// }

// interface AddDealModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   categories: Category[];
// }

// interface Deal {
//   time: number | undefined;
//   bookingCount: number;
//   participationsLimit: number | undefined;
//   _id: string;
//   title: string;
//   description: string;
//   participations: number;
//   price: number;
//   location: LocationData;
//   images: string[];
//   offers: string[];
//   status: string;
//   category: string;
//   createdAt: string;
//   updatedAt: string;
//   scheduleDates: { active: boolean; day: string; _id?: string }[];
// }

// export default function AddDealModal({
//   open,
//   onOpenChange,
//   categories,
// }: AddDealModalProps) {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [location, setLocation] = useState<LocationData>({
//     country: "",
//     city: "",
//   });
//   const [time, setTime] = useState("");
//   const [category, setCategory] = useState("");
//   const [offers, setOffers] = useState<string[]>([""]);
//   const [images, setImages] = useState<File[]>([]);
//   const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);
//   const [participationsLimit, setParticipationsLimit] = useState("");
//   const [scheduleDates, setScheduleDates] = useState<
//     { day: Date; active: boolean }[]
//   >([]);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const queryClient = useQueryClient();

//   const addDealMutation = useMutation<Deal, Error, FormData>({
//     mutationFn: async (formData: FormData) => {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/deals`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(errorText || "Failed to create deal");
//       }

//       return response.json();
//     },
//     onSuccess: (data: Deal) => {
//       queryClient.invalidateQueries({ queryKey: ["deals"] });

//       queryClient.setQueryData(
//         ["deals"],
//         (
//           oldData:
//             | Deal[]
//             | { deals: Deal[]; [key: string]: unknown }
//             | undefined
//         ) => {
//           if (oldData && Array.isArray(oldData)) {
//             return [data, ...oldData];
//           } else if (
//             oldData &&
//             "deals" in oldData &&
//             Array.isArray(oldData.deals)
//           ) {
//             return {
//               ...oldData,
//               deals: [data, ...oldData.deals],
//             };
//           }
//           return oldData;
//         }
//       );

//       toast.success("Deal created successfully", { position: "top-right" });
//       resetForm();
//       onOpenChange(false);
//     },
//     onError: (error: Error) => {
//       console.error("Error creating deal:", error);
//       const errorMessage = error.message.includes("scheduleDates")
//         ? "Invalid schedule dates format"
//         : error.message || "Failed to create deal";
//       toast.error(errorMessage, { position: "top-right" });
//     },
//   });

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const remainingSlots = 5 - images.length;
//       if (remainingSlots <= 0) {
//         toast.error("You can only upload up to 5 images", {
//           position: "top-right",
//         });
//         return;
//       }

//       const newFiles = Array.from(e.target.files).slice(0, remainingSlots);
//       const newPreviews: string[] = [];

//       newFiles.forEach((file) => {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           if (e.target?.result) {
//             newPreviews.push(e.target.result as string);
//             if (newPreviews.length === newFiles.length) {
//               setImagesPreviews((prev) => [...prev, ...newPreviews]);
//             }
//           }
//         };
//         reader.readAsDataURL(file);
//       });

//       setImages((prev) => [...prev, ...newFiles]);
//     }
//   };

//   const removeImage = (index: number) => {
//     setImages((prev) => {
//       const newImages = [...prev];
//       newImages.splice(index, 1);
//       return newImages;
//     });

//     setImagesPreviews((prev) => {
//       const newPreviews = [...prev];
//       newPreviews.splice(index, 1);
//       return newPreviews;
//     });
//   };

//   const handleOfferChange = (index: number, value: string) => {
//     const newOffers = [...offers];
//     newOffers[index] = value;
//     setOffers(newOffers);
//   };

//   const addOffer = () => {
//     setOffers([...offers, ""]);
//   };

//   const removeOffer = (index: number) => {
//     const newOffers = [...offers];
//     newOffers.splice(index, 1);
//     setOffers(newOffers);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (scheduleDates.length === 0) {
//       toast.error("Please select at least one schedule date", {
//         position: "top-right",
//       });
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("description", description);
//     formData.append("price", price);
//     formData.append("location", JSON.stringify(location));
//     formData.append("time", time);
//     formData.append("category", category);
//     formData.append("participationsLimit", participationsLimit);
//     formData.append(
//       "offers",
//       JSON.stringify(offers.filter((offer) => offer.trim() !== ""))
//     );
//     formData.append(
//       "scheduleDates",
//       JSON.stringify(
//         scheduleDates.map((dateObj) => ({
//           day: dateObj.day.toISOString(),
//           active: dateObj.active,
//         }))
//       )
//     );
//     images.forEach((image) => {
//       formData.append("images", image);
//     });

//     addDealMutation.mutate(formData);
//   };

//   const resetForm = () => {
//     setTitle("");
//     setDescription("");
//     setPrice("");
//     setLocation({ country: "", city: "" });
//     setTime("");
//     setCategory("");
//     setOffers([""]);
//     setImages([]);
//     setImagesPreviews([]);
//     setParticipationsLimit("");
//     setScheduleDates([]);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="text-2xl font-bold">
//             Deals
//             <div className="text-base font-normal text-[#595959] mt-1">
//               Dashboard Deals Add Deal
//             </div>
//           </DialogTitle>
//         </DialogHeader>

//         <form
//           onSubmit={handleSubmit}
//           className="grid grid-cols-1 md:grid-cols-2 gap-6"
//         >
//           <div className="space-y-4">
//             <div>
//               <Label htmlFor="dealName">Deal Name</Label>
//               <Input
//                 id="dealName"
//                 placeholder="Type deal name here..."
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 required
//               />
//             </div>

//             <div>
//               <Label htmlFor="description">Description</Label>
//               <div className="mt-1">
//                 {/* <ReactQuill
//                   id="description"
//                   theme="snow"
//                   value={description}
//                   onChange={setDescription}
//                   placeholder="Type deal description here..."
//                   className=""
//                 /> */}
//                 <QuillEditor
//                   id="description"
//                   value={description}
//                   onChange={setDescription}
//                 />
//               </div>
//             </div>

//             <div>
//               <Label htmlFor="price">Price</Label>
//               <Input
//                 id="price"
//                 type="text"
//                 placeholder="$0.00"
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//                 required
//               />
//             </div>

//             <div>
//               <Label htmlFor="country">Country</Label>
//               <Input
//                 id="country"
//                 placeholder="Type country here..."
//                 value={location.country}
//                 onChange={(e) =>
//                   setLocation({ ...location, country: e.target.value })
//                 }
//                 required
//               />
//             </div>
//             <div>
//               <Label htmlFor="city">City</Label>
//               <Input
//                 id="city"
//                 placeholder="Type city here..."
//                 value={location.city}
//                 onChange={(e) =>
//                   setLocation({ ...location, city: e.target.value })
//                 }
//               />
//             </div>

//             <div>
//               <Label htmlFor="time">Time (hours)</Label>
//               <Input
//                 id="time"
//                 type="number"
//                 min="0"
//                 max="24"
//                 step="0.25" // allows 15-minute increments (0.25 hours)
//                 placeholder="Enter time in hours..."
//                 value={time ? Number(time) / 3600 : ""} // convert stored seconds back to hours for display
//                 onChange={(e) => {
//                   const hours = parseFloat(e.target.value);
//                   setTime(String(Math.round(hours * 3600)));
//                 }}
//                 required
//               />
//             </div>

//             <div>
//               <Label htmlFor="scheduleDates">Schedule Dates</Label>
//               <DatePicker
//                 id="scheduleDates"
//                 selected={null}
//                 onChange={(date: Date | null) => {
//                   if (date) {
//                     const isDuplicate = scheduleDates.some(
//                       (existingDate) =>
//                         existingDate.day.toISOString().split("T")[0] ===
//                         date.toISOString().split("T")[0]
//                     );
//                     if (!isDuplicate) {
//                       setScheduleDates((prev) => [
//                         ...prev,
//                         { day: date, active: true },
//                       ]);
//                     } else {
//                       toast.error("This date is already selected", {
//                         position: "top-right",
//                       });
//                     }
//                   }
//                 }}
//                 placeholderText="Select schedule dates..."
//                 minDate={new Date()}
//                 inline={false}
//                 className="w-full border rounded p-2 bg-[#f5f1eb] ml-2"
//               />
//               <div className="mt-2">
//                 {scheduleDates.length === 0 && (
//                   <p className="text-sm text-gray-500">No dates selected</p>
//                 )}
//                 {scheduleDates.length > 0 && (
//                   <div className="flex flex-wrap gap-2">
//                     {scheduleDates.map((dateObj, index) => (
//                       <div
//                         key={index}
//                         className="flex items-center gap-1 bg-gray-100 p-2 rounded"
//                       >
//                         <span>{dateObj.day.toISOString().split("T")[0]}</span>
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="icon"
//                           onClick={() =>
//                             setScheduleDates((prev) =>
//                               prev.filter((_, i) => i !== index)
//                             )
//                           }
//                         >
//                           <X className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div>
//               <Label htmlFor="participationsLimit">Participations Limit</Label>
//               <Input
//                 id="participationsLimit"
//                 type="number"
//                 placeholder="Enter maximum number of participants..."
//                 value={participationsLimit}
//                 onChange={(e) => setParticipationsLimit(e.target.value)}
//               />
//             </div>

//             <div>
//               <Label htmlFor="offers">Offers</Label>
//               {offers.map((offer, index) => (
//                 <div key={index} className="flex items-center gap-2 mt-2">
//                   <Input
//                     placeholder={`Offer ${index + 1}`}
//                     value={offer}
//                     onChange={(e) => handleOfferChange(index, e.target.value)}
//                   />
//                   {offers.length > 1 && (
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => removeOffer(index)}
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   )}
//                 </div>
//               ))}
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={addOffer}
//                 className="mt-2"
//               >
//                 Add Offer
//               </Button>
//             </div>
//           </div>

//           <div className="space-y-4">
//             <div>
//               <Label htmlFor="category">Deal Category</Label>
//               <Select value={category} onValueChange={setCategory} required>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select a category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {categories?.map((cat) => (
//                     <SelectItem key={cat._id} value={cat._id}>
//                       {cat.categoryName}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label>Photo</Label>
//               <div className="border-2 border-dashed rounded-lg p-4 mt-1 text-center">
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   onChange={handleImageChange}
//                   multiple
//                   accept="image/*"
//                   className="hidden"
//                 />

//                 <div className="flex flex-col items-center justify-center min-h-[150px]">
//                   <div className="flex justify-center mb-4">
//                     <ImageIcon className="h-10 w-10 text-gray-400" />
//                   </div>

//                   <p className="text-sm text-gray-500 mb-2">
//                     Drag and drop image here, or click add image
//                   </p>

//                   <Button
//                     type="button"
//                     variant="secondary"
//                     size="sm"
//                     onClick={() => fileInputRef.current?.click()}
//                     className="bg-[#212121] text-white hover:bg-[#212121]/90"
//                   >
//                     Add image
//                   </Button>
//                 </div>

//                 <div className="grid grid-cols-5 gap-2 mt-4">
//                   {[...Array(5)].map((_, index) => {
//                     const hasImage = index < imagesPreviews.length;
//                     return (
//                       <div
//                         key={index}
//                         className={`relative border ${
//                           hasImage
//                             ? "border-gray-300"
//                             : "border-dashed border-gray-300"
//                         } rounded p-1 h-20`}
//                       >
//                         {hasImage ? (
//                           <>
//                             <Image
//                               src={imagesPreviews[index] || "/placeholder.svg"}
//                               width={100}
//                               height={100}
//                               alt={`Preview ${index + 1}`}
//                               className="h-full w-full object-cover"
//                             />
//                             <button
//                               type="button"
//                               className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow"
//                               onClick={() => removeImage(index)}
//                             >
//                               <X className="h-3 w-3" />
//                             </button>
//                           </>
//                         ) : (
//                           <div className="flex items-center justify-center h-full">
//                             <p className="text-xs text-gray-400">
//                               Image {index + 1}
//                             </p>
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-end mt-6">
//               <Button
//                 type="submit"
//                 className="bg-black hover:bg-black/90 text-white"
//                 disabled={addDealMutation.isPending}
//               >
//                 {addDealMutation.isPending ? "Saving..." : "Save"}
//               </Button>
//             </div>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }


"use client";

import type React from "react";
import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, ImageIcon } from "lucide-react";
import { toast } from "sonner";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Image from "next/image";

import QuillEditor from "../../blogs/_components/QuillEditor";

interface Category {
  _id: string;
  categoryName: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  dealCount?: number;
}

interface LocationData {
  country: string;
  city: string;
}

interface AddDealModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
}

interface Deal {
  time: number | undefined;
  bookingCount: number;
  participationsLimit: number | undefined;
  _id: string;
  title: string;
  description: string;
  participations: number;
  price: number;
  location: LocationData;
  images: string[];
  offers: string[];
  status: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  scheduleDates: { active: boolean; day: string; _id?: string }[];
}

export default function AddDealModal({
  open,
  onOpenChange,
  categories,
}: AddDealModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState<LocationData>({
    country: "",
    city: "",
  });
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("");
  const [offers, setOffers] = useState<string[]>([""]);
  const [images, setImages] = useState<File[]>([]);
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);
  const [participationsLimit, setParticipationsLimit] = useState("");
  const [scheduleDates, setScheduleDates] = useState<
    { day: Date; active: boolean }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const addDealMutation = useMutation<Deal, Error, FormData>({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/deals`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create deal");
      }

      return response.json();
    },
    onSuccess: (data: Deal) => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });

      queryClient.setQueryData(
        ["deals"],
        (
          oldData:
            | Deal[]
            | { deals: Deal[]; [key: string]: unknown }
            | undefined
        ) => {
          if (oldData && Array.isArray(oldData)) {
            return [data, ...oldData];
          } else if (
            oldData &&
            "deals" in oldData &&
            Array.isArray(oldData.deals)
          ) {
            return {
              ...oldData,
              deals: [data, ...oldData.deals],
            };
          }
          return oldData;
        }
      );

      toast.success("Deal created successfully", { position: "top-right" });
      resetForm();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      console.error("Error creating deal:", error);
      const errorMessage = error.message.includes("scheduleDates")
        ? "Invalid schedule dates format"
        : error.message || "Failed to create deal";
      toast.error(errorMessage, { position: "top-right" });
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const remainingSlots = 5 - images.length;
      if (remainingSlots <= 0) {
        toast.error("You can only upload up to 5 images", {
          position: "top-right",
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      const maxSizeInBytes = 10 * 1024 * 1024; // 10MB in bytes
      const allowedTypes = ["image/jpeg", "image/png"];
      const newFiles = Array.from(e.target.files).slice(0, remainingSlots);
      const validFiles: File[] = [];
      const newPreviews: string[] = [];

      newFiles.forEach((file) => {
        // Check file size
        if (file.size > maxSizeInBytes) {
          toast.error(`Image "${file.name}" exceeds 10MB limit`, {
            position: "top-right",
          });
          return;
        }

        // Check file type
        if (!allowedTypes.includes(file.type)) {
          toast.error(`Image "${file.name}" must be JPEG or PNG`, {
            position: "top-right",
          });
          return;
        }

        validFiles.push(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPreviews.push(e.target.result as string);
            if (newPreviews.length === validFiles.length) {
              setImagesPreviews((prev) => [...prev, ...newPreviews]);
            }
          }
        };
        reader.readAsDataURL(file);
      });

      if (validFiles.length > 0) {
        setImages((prev) => [...prev, ...validFiles]);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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

    if (scheduleDates.length === 0) {
      toast.error("Please select at least one schedule date", {
        position: "top-right",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("location", JSON.stringify(location));
    formData.append("time", time);
    formData.append("category", category);
    formData.append("participationsLimit", participationsLimit);
    formData.append(
      "offers",
      JSON.stringify(offers.filter((offer) => offer.trim() !== ""))
    );
    formData.append(
      "scheduleDates",
      JSON.stringify(
        scheduleDates.map((dateObj) => ({
          day: dateObj.day.toISOString(),
          active: dateObj.active,
        }))
      )
    );
    images.forEach((image) => {
      formData.append("images", image);
    });

    addDealMutation.mutate(formData);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setLocation({ country: "", city: "" });
    setTime("");
    setCategory("");
    setOffers([""]);
    setImages([]);
    setImagesPreviews([]);
    setParticipationsLimit("");
    setScheduleDates([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Deals
            <div className="text-base font-normal text-[#595959] mt-1">
              Dashboard Deals Add Deal
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
                placeholder="Type deal name here..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <div className="mt-1">
                <QuillEditor
                  id="description"
                  value={description}
                  onChange={setDescription}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="text"
                placeholder="$0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="Type country here..."
                value={location.country}
                onChange={(e) => setLocation({ ...location, country: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="Type city here..."
                value={location.city}
                onChange={(e) => setLocation({ ...location, city: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="time">Time (hours)</Label>
              <Input
                id="time"
                type="number"
                min="0"
                max="24"
                step="0.25"
                placeholder="Enter time in hours..."
                value={time ? Number(time) / 3600 : ""}
                onChange={(e) => {
                  const hours = parseFloat(e.target.value);
                  setTime(String(Math.round(hours * 3600)));
                }}
                required
              />
            </div>

            <div>
              <Label htmlFor="scheduleDates">Schedule Dates</Label>
              <style jsx global>{`
                .react-datepicker__day--selected,
                .react-datepicker__day--keyboard-selected {
                  background-color: #ff0000 !important;
                  color: white !important;
                  border-radius: 50% !important;
                }
                .react-datepicker__day--highlighted {
                  background-color: #ff0000 !important;
                  color: white !important;
                  border-radius: 50% !important;
                }
              `}</style>
              <DatePicker
                id="scheduleDates"
                selected={null}
                onChange={(date: Date | null) => {
                  if (date) {
                    const isDuplicate = scheduleDates.some(
                      (existingDate) =>
                        existingDate.day.toDateString() === date.toDateString()
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
                inline={false}
                className="w-full border rounded p-2 bg-[#f5f1eb]"
                highlightDates={scheduleDates.map((d) => d.day)}
                dayClassName={(date) => {
                  const isSelected = scheduleDates.some(
                    (d) => d.day.toDateString() === date.toDateString()
                  );
                  return isSelected ? "react-datepicker__day--highlighted" : "";
                }}
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
                        className="flex items-center gap-1 bg-gray-100 p-2 rounded"
                      >
                        <span>{dateObj.day.toLocaleDateString()}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setScheduleDates((prev) => prev.filter((_, i) => i !== index))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="participationsLimit">Participations Limit</Label>
              <Input
                id="participationsLimit"
                type="number"
                placeholder="Enter maximum number of participants..."
                value={participationsLimit}
                onChange={(e) => setParticipationsLimit(e.target.value)}
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
                  accept="image/jpeg,image/png"
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