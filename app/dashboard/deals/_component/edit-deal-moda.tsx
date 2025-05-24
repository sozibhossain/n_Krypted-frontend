"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { X, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import Image from "next/image"

interface EditDealModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  dealId: string | null
}

interface DealData {
  title: string
  description: string
  price: number
  location: string
  offers: string[]
  images: string[]
  participationsLimit: number
  time: string
}

export default function EditDealModal({ open, onOpenChange, dealId }: EditDealModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  // const [dealData, setDealData] = useState<DealData | null>(null)
  const [offerInput, setOfferInput] = useState("")
  const [offers, setOffers] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])

  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DealData>()

  // Fetch deal data when modal opens
  useEffect(() => {
    if (open && dealId) {
      const fetchDealData = async (id: string) => {
        setIsLoading(true)
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deals/${id}`)
          if (!response.ok) {
            throw new Error("Failed to fetch deal data")
          }
          const data = await response.json()

          // Set form values
          setValue("title", data.deal.title)
          setValue("description", data.deal.description)
          setValue("price", data.deal.price)
          setValue("location", data.deal.location)
          setValue("participationsLimit", data.deal.participationsLimit)

          // Set time field as-is from API
          setValue("time", data.deal.time || "")

          // Set offers and images
          setOffers(data.deal.offers || [])
          setExistingImages(data.deal.images || [])
          // setDealData(data.deal)
        } catch (error) {
          console.error("Error fetching deal data:", error)
          toast.error("Failed to load deal data")
        } finally {
          setIsLoading(false)
        }
      }

      fetchDealData(dealId)
    }
  }, [open, dealId, setValue])

  const updateMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/deals/${dealId}`, {
        method: "PUT",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to update deal")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] })
      toast.success("Deal updated successfully", { position: "top-right" })
      onOpenChange(false)
    },
    onError: (error) => {
      console.error("Error updating deal:", error)
      toast.error("Failed to update deal", { position: "top-right" })
    },
  })

  const onSubmit = async (data: DealData) => {
    if (!dealId) return

    const formData = new FormData()
    formData.append("title", data.title)
    formData.append("description", data.description)
    formData.append("price", data.price.toString())
    formData.append("location", data.location)
    formData.append("participationsLimit", data.participationsLimit.toString())

    formData.append("time", data.time)

    // Add offers
    offers.forEach((offer, index) => {
      formData.append(`offers[${index}]`, offer)
    })

    // Add existing images to keep
    existingImages.forEach((image, index) => {
      formData.append(`existingImages[${index}]`, image)
    })

    // Add new files
    selectedFiles.forEach((file) => {
      formData.append("images", file)
    })

    updateMutation.mutate(formData)
  }

  const handleAddOffer = () => {
    if (offerInput.trim()) {
      setOffers([...offers, offerInput.trim()])
      setOfferInput("")
    }
  }

  const handleRemoveOffer = (index: number) => {
    setOffers(offers.filter((_, i) => i !== index))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setSelectedFiles([...selectedFiles, ...filesArray])
    }
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
  }

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index))
  }

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
    )
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
              <Input id="title" {...register("title", { required: "Title is required" })} className="w-full" />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description", { required: "Description is required" })}
                className="w-full min-h-[100px]"
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
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
              {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...register("location", { required: "Location is required" })} className="w-full" />
              {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
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
                <p className="text-red-500 text-sm">{errors.participationsLimit.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="time">Deal Time</Label>
              <Input
                id="time"
                type="text"
                {...register("time", { required: "Deal time is required" })}
                className="w-full"
                placeholder="Enter deal time"
              />
              {errors.time && <p className="text-red-500 text-sm">{errors.time.message}</p>}
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
                  <div key={index} className="flex items-center bg-muted px-3 py-1 rounded-full">
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
                  <p className="text-sm text-muted-foreground mb-2">Drag and drop or click to upload</p>
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
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
