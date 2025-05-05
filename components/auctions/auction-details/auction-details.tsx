"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarClock, Heart, Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import AuctionCountdown from "./auction-countdown";
import { formatCurrency } from "@/lib/format";
import AuctionImageGallery from "./auction-image-gallery";
import BidHistory from "./bid-history";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RelatedAuction from "../related-auction";
import { useSession } from "next-auth/react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";

interface AuctionDetailsProps {
    auctionId: string;
}

interface PlaceBidParams {
    auctionId: string;
    amount: number;
}

interface WishListParams {
    auctionId: string;
    token: string
}


const formSchema = z.object({
    fullName: z.string().min(1, { message: "Full name is required" }),
    address: z.string().min(1, { message: "Address is required" }),
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
    phone: z.string().min(1, { message: "Phone number is required" }),
    saveInfo: z.boolean().optional(),
})

export default function AuctionDetails({ auctionId }: AuctionDetailsProps) {
    const router = useRouter();
    const [bidAmount, setBidAmount] = useState<string>("");
    const [activeTab, setActiveTab] = useState<string>("description");
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const queryClient = useQueryClient();
    const [isProcessing, setIsProcessing] = useState(false)

    const session = useSession();



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            address: "",
            email: "",
            phone: ""
        },
    })


    // Fetch auction details
    const {
        data: auctionData,
        isLoading: isLoadingAuction,
        error: errorAuction,
    } = useQuery({
        queryKey: ["auction", auctionId],
        queryFn: async () => {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auctions/get-auction/${auctionId}`
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch auction details");
            }
            return response.json();
        },
        refetchInterval: 5000,
        refetchIntervalInBackground: false,
    });

    const auction = auctionData?.data?.auction;

    const token = session?.data?.user?.accessToken


    // Fetch billing details
    const {
        data: billingData,
    } = useQuery({
        queryKey: ["billing-info", token],
        queryFn: async () => {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/billing/get`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            return response.json();
        },

        select: (data) => data?.data

    });

    console.log(token)
    console.log(billingData)

    const isPaid = billingData?.some(
        /* eslint-disable @typescript-eslint/no-explicit-any */
        (item: any) => item.auction._id === auctionId && item.paymentStatus === "paid"
    );


    // Handle bidding
    async function placeBid({ auctionId, amount }: PlaceBidParams) {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/bids/auctions/${auctionId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ amount }),
            }
        );


        if (!token) {
            toast.error("You must be logged in to place a bid");
        }


        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to place bid");
        }

        toast.success("Bid placed successfully");

        return response.json(); // Or handle the response as needed
    }


    const {
        mutate,
        status,
    } = useMutation({
        mutationFn: placeBid,
        onSuccess: () => {
            setBidAmount("");
            // console.log(data);
            queryClient.invalidateQueries({ queryKey: ["bidHistory"] });
            queryClient.invalidateQueries({ queryKey: ["auction"] });
        },
        onError: (err) => {
            console.error("Error placing bid:", err.message);
            // Optionally show an error message
        },
    });

    const isPlacingBid = status === 'pending';



    // Handle Bidding
    const handleBid = () => {
        if (bidAmount && Number.parseFloat(bidAmount) > auction?.currentBid) {
            mutate({
                auctionId: auctionId,
                amount: Number.parseFloat(bidAmount),
            });
        } else if (auction) {
            console.warn(
                `Bid amount must be greater than the current bid: ${formatCurrency(
                    auction.currentBid
                )}`
            );
            // Optionally show a message to the user
        } else {
            console.warn("Auction details not loaded yet.");
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBidAmount(event.target.value);
    };



    // Handle add to wishlist

    const handleAddToWishlist = async ({ auctionId, token }: WishListParams) => {
        if (!token) {
            toast.error("You must be logged in to add to wishlist");
            return;
        }
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/wishlist/add/${auctionId}`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            toast.error("Auction already in wishlist");
            return errorData;
        }
        toast.success("Added to wishlist!");
        return response.json();
    };

    // Handle add to wishlis


    // Check if the user has already added the auction to their wishlist

    const { data: wishlist } = useQuery({
        queryKey: ['wishlist', token],
        queryFn: async () => {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/wishlist`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
            if (!response.ok) throw new Error('Failed to fetch wishlist');
            return response.json();
        },
        select: (apiData) => apiData?.data?.auctions
    });
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const isInWishlist = !!wishlist?.some((item: any) => item._id === auctionId);


    useMutation({
        mutationFn: handleAddToWishlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wishlist", token] });
        },
        onError: (err) => {
            console.log("Error: ", err);
        },
    });




    // Handle bid increment/decrement
    const handleIncrement = () => {
        if (!auction) return;
        const currentValue = bidAmount ? Number.parseFloat(bidAmount) : auction.currentBid;
        setBidAmount((currentValue + auction.bidIncrement).toString());
    };

    const handleDecrement = () => {
        if (!auction) return;
        const currentValue = bidAmount ? Number.parseFloat(bidAmount) : auction.currentBid;
        const newValue = Math.max(
            currentValue - auction.bidIncrement,
            auction.currentBid
        );
        setBidAmount(newValue.toString());
    };

    if (isLoadingAuction) {
        return <div>Loading auction details...</div>;
    }

    if (errorAuction) {
        return <div>Error loading auction details: {errorAuction.message}</div>;
    }

    if (!auction) {
        return <div>Auction not found.</div>;
    }



    const winner = auction?.winner?._id

    const user = session?.data?.user?.id



    // Handle form submission / billing
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsProcessing(true)
        // Simulate payment processing
        const paymentData = {
            userId: session?.data?.user?.id,
            auctionId: auctionId,
            price: auction.currentBid
        }

        setTimeout(() => {
            setIsProcessing(false)
        }, 1500)

        const billingResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/billing/create/${auctionId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    fullName: values.fullName,
                    address: values.address,
                    email: values.email,
                    phoneNumber: values.phone,
                    userId: session?.data?.user?.id, // Assuming you want to associate billing with the user
                }),
            }
        );


        if (!billingResponse.ok) {
            return <div>Error processing billing</div>
        }


        queryClient.invalidateQueries({ queryKey: ["billing-info", token] });



        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/payment-intent`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(paymentData),
            }
        )

        const paymentResponse = await response.json()

        router.push(paymentResponse.url);

    }



    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                        <Image
                            src={auction.images[selectedImageIndex] || "/placeholder.svg"}
                            alt={auction.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <AuctionImageGallery
                        images={auction.images}
                        selectedIndex={selectedImageIndex}
                        onSelect={setSelectedImageIndex}
                    />
                </div>

                {/* Auction Details */}
                <div className="space-y-4">
                    <div>
                        <p className="text-lg font-medium text-[#645949] lg:pb-6 pb-2">
                            SKU #{auction.sku}
                        </p>
                        <div className="flex justify-between items-center lg:pb-6 pb-2">
                            <h1 className="text-[40px] font-bold inline-block">
                                {auction.title}
                            </h1>

                            {
                                (auction.status === "live" || auction.status === "pending" || auction.status === "scheduled") &&
                                <div className="">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 bg-[#C8B291]"
                                        onClick={() => handleAddToWishlist({ auctionId: auction._id, token: session?.data?.user?.accessToken || "" })}
                                    >
                                        <Heart fill={isInWishlist ? "#8a8170" : "none"} className="!h-5 !w-5 !border-none" />
                                    </Button>
                                </div>
                            }

                        </div>
                    </div>

                    <p
                        className="list-item list-none overflow-hidden text-ellipsis"
                        style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: "vertical",
                        }}
                        dangerouslySetInnerHTML={{
                            __html: auction.description ?? "Blog Description",
                        }}
                    />


                    {auction.status === "live"
                        ?
                        (
                            <div className="">
                                <div className="space-y-1 text-[#645949] pb-6">
                                    <p className="text-base pb-2">Current bid:</p>
                                    <p className="text-2xl font-semibold">
                                        {formatCurrency(auction.currentBid)}
                                    </p>
                                </div>

                                {auction.status === "live" && (
                                    <div className="text-[#645949]">
                                        <div>
                                            <p className="text-sm font-medium mb-3">Time left:</p>
                                            <AuctionCountdown endTime={auction.endTime} />
                                        </div>

                                        <div className="space-y-3 text-[#645949] pb-6">
                                            <p className="text-base">
                                                Auction ends: {format(new Date(auction.endTime), "MMM d, yyyy h:mm a")}
                                            </p>
                                        </div>

                                        <div className="space-y-6">
                                            <p className="text-base font-medium">
                                                {auction.reserveMet
                                                    ? "Reserve price has been met"
                                                    : "Reserve price not met"}
                                            </p>
                                            <p className="text-xs pb-2 text-muted-foreground">
                                                (Enter more than or equal to:{" "}
                                                {formatCurrency(auction.currentBid)})
                                            </p>
                                        </div>

                                        <div className="flex justify-between items-center space-x-2">
                                            <div className="w-2/3 flex justify-between items-center space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={handleDecrement}
                                                    disabled={!auction || isPlacingBid}
                                                    className="text-white w-12 bg-[#645949] hover:bg-[#645949]/90"
                                                >
                                                    <Minus className="h-6 w-6" />
                                                </Button>
                                                <Input
                                                    type="text"
                                                    value={bidAmount || ""}
                                                    onChange={handleInputChange}
                                                    placeholder={auction ? auction.currentBid.toString() : ""}
                                                    className="text-center"
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={handleIncrement}
                                                    disabled={!auction || isPlacingBid}
                                                    className="text-white w-12 bg-[#645949] hover:bg-[#645949]/90"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <Button
                                                className="text-white w-52 bg-[#645949] hover:bg-[#645949]/90"
                                                onClick={handleBid}
                                                disabled={
                                                    !bidAmount ||
                                                    Number.parseFloat(bidAmount) <= auction.currentBid ||
                                                    isPlacingBid
                                                }
                                            >
                                                {isPlacingBid ? "Bidding..." : "Bid"}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                        :
                        auction.status === "pending" || auction.status === "scheduled" ? (
                            <Card className="border border-[#a39a85] overflow-hidden bg-[#f5f1e8]">
                                <div className="bg-[#8a8170] py-3 px-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-[#f5f1e8] font-semibold text-lg">Auction Coming Soon</h3>
                                        <Badge variant="outline" className="bg-[#f5f1e8]/10 text-[#f5f1e8] border-[#f5f1e8]/30">
                                            Exclusive
                                        </Badge>
                                    </div>
                                </div>

                                <CardContent className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#e6e0d4] rounded-full p-2.5">
                                            <CalendarClock className="h-5 w-5 text-[#8a8170]" />
                                        </div>
                                        <p className="text-[#5d5545] font-medium">This item will be available for auction soon</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                            :
                            auction.status === "completed" ? (
                                <div className="">
                                    <Card className="border border-[#a39a85] overflow-hidden bg-[#f5f1e8]">
                                        <div className="bg-[#8a8170] py-3 px-4">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-[#f5f1e8] font-semibold text-lg">Auction Has Completed</h3>
                                                <Badge variant="outline" className="bg-[#f5f1e8]/10 text-[#f5f1e8] border-[#f5f1e8]/30">
                                                    Exclusive
                                                </Badge>
                                            </div>
                                        </div>

                                        <CardContent className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-[#e6e0d4] rounded-full p-2.5">
                                                    <CalendarClock className="h-5 w-5 text-[#8a8170]" />
                                                </div>
                                                <p className="text-[#5d5545] font-medium">This item will not be available for auction</p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Winner Payment*/}

                                    <div className="pt-6 max-w-4xl mx-auto">
                                        {winner === user && (
                                            <div className="pt-6">
                                                <h4 className="font-semibold text-[#645949] pb-4">You won the bid: ${auction.currentBid}</h4>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setIsOpen(true)}
                                                    disabled={!auction || isPlacingBid || isPaid}
                                                    className="text-white lg:h-12 h-9 lg:w-32 w-28 bg-[#645949] hover:bg-[#645949]/90 hover:text-white"
                                                >
                                                    {isPaid ? "Paid" : "Pay Now"}
                                                </Button>
                                                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                                    <DialogContent className="sm:max-w-[900px] p-0 bg-[#F5EDE2] text-[#645949] w-[95vw] max-h-[90vh] overflow-y-auto">
                                                        <div className="flex flex-col md:flex-row">
                                                            {/* Close button */}
                                                            <button
                                                                onClick={() => setIsOpen(false)}
                                                                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                                            >
                                                                <X className="h-4 w-4" />
                                                                <span className="sr-only">Close</span>
                                                            </button>

                                                            <Form {...form}>
                                                                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col md:flex-row w-full">
                                                                    {/* Billing Information */}
                                                                    <div className="w-full md:w-1/2 p-4 sm:p-6 border-b md:border-b-0 md:border-r">
                                                                        <h2 className="text-xl font-semibold mb-4">Billing Information</h2>

                                                                        <div className="space-y-4">
                                                                            <FormField
                                                                                control={form.control}
                                                                                name="fullName"
                                                                                render={({ field }) => (
                                                                                    <FormItem>
                                                                                        <FormLabel>
                                                                                            Full Name <span className="text-red-500">*</span>
                                                                                        </FormLabel>
                                                                                        <FormControl>
                                                                                            <Input placeholder="e.g. John Doe" {...field} />
                                                                                        </FormControl>
                                                                                        <FormMessage />
                                                                                    </FormItem>
                                                                                )}
                                                                            />

                                                                            <FormField
                                                                                control={form.control}
                                                                                name="address"
                                                                                render={({ field }) => (
                                                                                    <FormItem>
                                                                                        <FormLabel>
                                                                                            Address <span className="text-red-500">*</span>
                                                                                        </FormLabel>
                                                                                        <FormControl>
                                                                                            <Input placeholder="e.g. 123 Main St, City, Country" {...field} />
                                                                                        </FormControl>
                                                                                        <FormMessage />
                                                                                    </FormItem>
                                                                                )}
                                                                            />

                                                                            <FormField
                                                                                control={form.control}
                                                                                name="email"
                                                                                render={({ field }) => (
                                                                                    <FormItem>
                                                                                        <FormLabel>
                                                                                            Email address <span className="text-red-500">*</span>
                                                                                        </FormLabel>
                                                                                        <FormControl>
                                                                                            <Input type="email" placeholder="e.g. your@email.com" {...field} />
                                                                                        </FormControl>
                                                                                        <FormMessage />
                                                                                    </FormItem>
                                                                                )}
                                                                            />

                                                                            <FormField
                                                                                control={form.control}
                                                                                name="phone"
                                                                                render={({ field }) => (
                                                                                    <FormItem>
                                                                                        <FormLabel>
                                                                                            Phone Number <span className="text-red-500">*</span>
                                                                                        </FormLabel>
                                                                                        <FormControl>
                                                                                            <Input placeholder="e.g. +1 (555) 123-4567" {...field} />
                                                                                        </FormControl>
                                                                                        <FormMessage />
                                                                                    </FormItem>
                                                                                )}
                                                                            />

                                                                            <FormField
                                                                                control={form.control}
                                                                                name="saveInfo"
                                                                                render={({ field }) => (
                                                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                                                                                        <FormControl>
                                                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                                                        </FormControl>
                                                                                        <div className="space-y-1 leading-none">
                                                                                            <FormLabel className="text-sm font-normal">
                                                                                                Save this information for faster check out next time
                                                                                            </FormLabel>
                                                                                        </div>
                                                                                    </FormItem>
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* Order Summary */}
                                                                    <div className="w-full md:w-1/2 p-4 sm:p-6">
                                                                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                                                                        <div className="flex items-center mb-4">
                                                                            <div className="w-12 h-12 bg-gray-100 rounded mr-3 overflow-hidden">
                                                                                <Image
                                                                                    src={auction?.images[0] || "/placeholder.svg"}
                                                                                    alt={auction?.title}
                                                                                    width={48}
                                                                                    height={48}
                                                                                    className="object-cover w-full h-full"
                                                                                />
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <div className="font-medium">{auction?.title}</div>
                                                                            </div>
                                                                            <div className="font-medium">${auction?.currentBid}</div>
                                                                        </div>

                                                                        <div className="space-y-2 border-t pt-4">
                                                                            <div className="flex justify-between">
                                                                                <span>Subtotal</span>
                                                                                <span>${auction?.currentBid}</span>
                                                                            </div>

                                                                            <div className="flex justify-between">
                                                                                <span>Shipping</span>
                                                                                <span>$55</span>
                                                                            </div>

                                                                            <div className="flex justify-between font-bold border-t pt-2 mt-2">
                                                                                <span>Total</span>
                                                                                <span>${auction?.currentBid + 55}</span>
                                                                            </div>
                                                                        </div>

                                                                        <Button
                                                                            type="submit"
                                                                            className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white"
                                                                            disabled={isProcessing}
                                                                        >
                                                                            {isProcessing ? (
                                                                                <div className="flex items-center justify-center">
                                                                                    <svg
                                                                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                        fill="none"
                                                                                        viewBox="0 0 24 24"
                                                                                    >
                                                                                        <circle
                                                                                            className="opacity-25"
                                                                                            cx="12"
                                                                                            cy="12"
                                                                                            r="10"
                                                                                            stroke="currentColor"
                                                                                            strokeWidth="4"
                                                                                        ></circle>
                                                                                        <path
                                                                                            className="opacity-75"
                                                                                            fill="currentColor"
                                                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                                        ></path>
                                                                                    </svg>
                                                                                    Processing...
                                                                                </div>
                                                                            ) : (
                                                                                <>
                                                                                    Pay With <span className="font-semibold ml-1 text-xl">stripe</span>
                                                                                </>
                                                                            )}
                                                                        </Button>
                                                                    </div>
                                                                </form>
                                                            </Form>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                                :
                                auction.status === "cancelled" ? (
                                    <Card className="border border-[#a39a85] overflow-hidden bg-[#f5f1e8]">
                                        <div className="bg-[#8a8170] py-3 px-4">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-[#f5f1e8] font-semibold text-lg">Auction Has Been Cancelled</h3>
                                                <Badge variant="outline" className="bg-[#f5f1e8]/10 text-[#f5f1e8] border-[#f5f1e8]/30">
                                                    Exclusive
                                                </Badge>
                                            </div>
                                        </div>

                                        <CardContent className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-[#e6e0d4] rounded-full p-2.5">
                                                    <CalendarClock className="h-5 w-5 text-[#8a8170]" />
                                                </div>
                                                <p className="text-[#5d5545] font-medium">This item will not be available for auction</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                                    : null
                    }

                </div>
            </div>

            {/* Tabs */}
            <Tabs
                defaultValue="description"
                value={activeTab}
                onValueChange={setActiveTab}
            >
                <TabsList className="border-b rounded-none w-full bg-transparent justify-start h-auto p-0">
                    <TabsTrigger
                        value="description"
                        className={cn(
                            "rounded-none data-[state=active]:shadow-none py-2.5 px-4",
                            activeTab === "description" ? "font-medium" : ""
                        )}
                    >
                        Description
                    </TabsTrigger>
                    <TabsTrigger
                        value="bidHistory"
                        className={cn(
                            "rounded-none data-[state=active]:shadow-none py-2.5 px-4",
                            activeTab === "bidHistory" ? "font-medium" : ""
                        )}
                    >
                        Bid History
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="pt-4">
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">
                            {auction.title}
                        </h2>

                        <div className="space-y-2">
                            <div
                                className="list-item list-none"
                                dangerouslySetInnerHTML={{
                                    __html: auction.description ?? "Blog Description",
                                }}
                            />
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="bidHistory" className="pt-4">
                    <BidHistory auctionId={auctionId} />
                </TabsContent>
            </Tabs>


            <RelatedAuction name={auction?.category?.name} />
        </div>
    );
}