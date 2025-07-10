


"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ChevronRight, Users, MapPin, Calendar, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PayPalCheckout from "./PayPalCheckout";
import StripeCheckout from "./pyment/StripeCheckout";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

interface ScheduleDate {
  date: string;
  active: boolean;
  participationsLimit: number;
  bookedCount: number;
  _id: string;
}

interface Location {
  country: string;
  city: string;
}

interface DealsCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  participations: number;
  maxParticipants?: number;
  image?: string;
  status?: string;
  time?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  scheduleDates?: ScheduleDate[];
  location?: Location;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function DealsCard({
  id,
  title,
  description,
  price,
  participations,
  maxParticipants,
  createdAt,
  updatedAt,
  image,
  status,
  time = 0,
  scheduleDates,
  location,
}: DealsCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [isPayPalModalOpen, setIsPayPalModalOpen] = useState(false);
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [isBookingSummaryOpen, setIsBookingSummaryOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"paypal" | "stripe" | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });
  const [clientSecret, setClientSecret] = useState<string>("");
  const [stripeLoading, setStripeLoading] = useState(false);

  const token = session?.user?.accessToken ?? "";

  useEffect(() => {
    if (time <= 0 || (!createdAt && !updatedAt)) {
      setTimeLeft({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
      });
      return;
    }

    const timer = setInterval(() => {
      const startTime = updatedAt || createdAt;
      if (!startTime) {
        clearInterval(timer);
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        return;
      }

      const endTime = new Date(new Date(startTime).getTime() + time * 60000);
      const now = new Date().getTime();
      const difference = endTime.getTime() - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [time, createdAt, updatedAt]);

  const createPaymentIntent = async () => {
    if (!bookingId) return;
    
    setStripeLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/create-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          bookingId: bookingId,
          price: price,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      toast.error("Failed to initialize payment");
      console.error(error);
    } finally {
      setStripeLoading(false);
    }
  };

  useEffect(() => {
    if (isStripeModalOpen && bookingId && !clientSecret) {
      createPaymentIntent();
    }
  }, [isStripeModalOpen, bookingId]);

  const handleBooking = async (notifyMe: boolean) => {
    if (!session?.user?.id) {
      toast.success("Please sign in to book this deal");
      return;
    }

    if (!notifyMe && status === "activate") {
      setIsBookingSummaryOpen(true);
    } else {
      await bookingPayment(notifyMe);
    }
  };

  const bookingPayment = async (notifyMe = false) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          dealsId: id,
          notifyMe: notifyMe,
          scheduleDate: scheduleDates?.[0]?.date,
          scheduleId: scheduleDates?.[0]?._id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.booking.notifyMe) {
          throw new Error("You have already notified for this deal");
        }
        setBookingId(data.booking._id);
        setIsBookingSummaryOpen(false);
        if (selectedPaymentMethod === "paypal") {
          setIsPayPalModalOpen(true);
        } else if (selectedPaymentMethod === "stripe") {
          setIsStripeModalOpen(true);
        }
      } else {
        const error = await response.json();
        throw new Error(error.message || "Something went wrong");
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const isDealExpired = timeLeft.isExpired;
  const isDealAtCapacity = maxParticipants ? participations >= maxParticipants : false;
  const hasTimeLimit = time > 0;
  // const hasAvailableSpots = maxParticipants ? participations < maxParticipants : true;

  const getFirstActiveDate = () => {
    if (!scheduleDates || scheduleDates.length === 0) return null;
    return scheduleDates.find((date) => date.active) || scheduleDates[0];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTimeUnit = (value: number, label: string) => (
    <div className="text-center">
      <div className="w-[35px] h-[35px] rounded-sm flex items-center justify-center">
        {value.toString().padStart(2, "0")}
      </div>
      <h1 className="text-xs">{label}</h1>
    </div>
  );

  const renderActionButton = () => {
    if (isDealExpired || isDealAtCapacity || status === "deactivate") {
      return (
        <Button
          className="w-full bg-black text-white font-semibold mt-2 hover:bg-black/80"
          onClick={() => handleBooking(true)}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Notify Me"}
        </Button>
      );
    }

    if (status === "activate") {
      return (
        <Button
          className="w-full bg-black text-white font-semibold mt-2 hover:bg-black/80"
          onClick={() => handleBooking(false)}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Book now"}
        </Button>
      );
    }

    return (
      <Button className="w-full bg-gray-400 text-white font-semibold mt-2" disabled>
        Unavailable
      </Button>
    );
  };

  const firstActiveDate = getFirstActiveDate();

  return (
    <>
      <Card className="overflow-hidden border-none bg-white p-2 max-w-[370px] hover:shadow-[0px_0px_10px_2px_#FFFFFF] transition-shadow duration-300 h-full">
        <Link href={`/deals/${id}`} className="no-underline">
          <div
            className="relative overflow-hidden rounded-lg"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Image
              src={image || "/placeholder.svg?height=222&width=370&query=deal image"}
              alt={title || "Deal Image"}
              width={600}
              height={400}
              className={`w-[370px] h-[222px] aspect-[5/4] object-cover rounded-lg ${
                isHovered ? "scale-105" : "scale-100"
              } transition-transform duration-300`}
            />
            {hasTimeLimit && status === "activate" && !isDealExpired && (
              <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center gap-2 font-semibold text-white">
                <div className="flex items-center gap-2 bg-black/30 px-2 py-1 rounded">
                  {formatTimeUnit(timeLeft.hours, "HR")}
                  <span>:</span>
                  {formatTimeUnit(timeLeft.minutes, "MIN")}
                  <span>:</span>
                  {formatTimeUnit(timeLeft.seconds, "SEC")}
                </div>
              </div>
            )}
          </div>
          <CardContent className="space-y-2 pt-4">
            <div className="grid grid-cols-3">
              <div className="col-span-2">
                <h3 className="font-bold text-[18px] my-1 line-clamp-1 text-[#212121]">{title}</h3>
                <p className="text-[16px] font-normal text-[#737373]">
                  <div
                    className="text-[#737373] truncate max-w-full"
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: description ?? "Deals Description",
                    }}
                  />
                </p>
                <Link href={`/deals/${id}`}>
                  <div className="flex items-center gap-1 text-black font-normal cursor-pointer text-[14px]">
                    <span>Show more</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              </div>
              <div className="col-span-1 flex flex-col gap-1 text-xs text-gray-600">
                {firstActiveDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(firstActiveDate.date)}</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{location.city}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">{price?.toFixed(2)} EUR</span>
              {!hasTimeLimit && maxParticipants && (
                <div className="flex gap-2 items-center text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>
                    {participations}/{maxParticipants} participants
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Link>
        <CardFooter>{renderActionButton()}</CardFooter>
      </Card>

      {/* Booking Summary Modal */}
      <Dialog open={isBookingSummaryOpen} onOpenChange={setIsBookingSummaryOpen}>
        <DialogContent className="p-0 max-w-md bg-gray-800 text-white border-none">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Booking Summary</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsBookingSummaryOpen(false)}
                className="text-white hover:bg-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex gap-4 mb-6">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={image || "/placeholder.svg?height=64&width=64"}
                  alt={title}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">{title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  {location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>
                        {location.city}, {location.country}
                      </span>
                    </div>
                  )}
                  {firstActiveDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(firstActiveDate.date)}</span>
                    </div>
                  )}
                </div>
                <div className="text-lg font-semibold text-white mt-2">{price?.toFixed(2)} EUR</div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-300">Subtotal</span>
                <span className="text-white">{price?.toFixed(2)} EUR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Save</span>
                <span className="text-white">0.00 EUR</span>
              </div>
              <hr className="border-gray-600" />
              <div className="flex justify-between font-semibold">
                <span className="text-white">Total</span>
                <span className="text-white">{price?.toFixed(2)} EUR</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${
                  selectedPaymentMethod === "paypal" ? "border-blue-500 bg-blue-500/10" : "border-gray-600"
                }`}
                onClick={() => setSelectedPaymentMethod("paypal")}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    selectedPaymentMethod === "paypal" ? "border-blue-500" : "border-gray-600"
                  } flex items-center justify-center`}
                >
                  {selectedPaymentMethod === "paypal" && (
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  )}
                </div>
                <span className="text-white">Pay With PayPal</span>
                <div className="ml-auto">
                  <span className="text-blue-500 font-semibold">PayPal</span>
                </div>
              </div>
              <div
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${
                  selectedPaymentMethod === "stripe" ? "border-blue-500 bg-blue-500/10" : "border-gray-600"
                }`}
                onClick={() => setSelectedPaymentMethod("stripe")}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    selectedPaymentMethod === "stripe" ? "border-blue-500" : "border-gray-600"
                  } flex items-center justify-center`}
                >
                  {selectedPaymentMethod === "stripe" && (
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  )}
                </div>
                <span className="text-white">Pay With Stripe</span>
                <div className="ml-auto">
                  <span className="text-blue-500 font-semibold">Stripe</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => bookingPayment(false)}
              disabled={isLoading || !selectedPaymentMethod}
              className="w-full bg-white text-black hover:bg-gray-100 font-semibold py-3"
            >
              {isLoading ? "Processing..." : "Pay now"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* PayPal Checkout Modal */}
      <Dialog open={isPayPalModalOpen} onOpenChange={setIsPayPalModalOpen}>
        <DialogContent className="p-5 w-full">
          {bookingId && (
            <PayPalCheckout amount={price} userId={session?.user?.id ?? ""} bookingId={bookingId} />
          )}
        </DialogContent>
      </Dialog>

      {/* Stripe Checkout Modal */}
      <Dialog open={isStripeModalOpen} onOpenChange={setIsStripeModalOpen}>
        <DialogContent className="p-5 w-full">
          {stripeLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : clientSecret && bookingId ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "night",
                  labels: "floating",
                },
              }}
            >
              <StripeCheckout />
            </Elements>
          ) : (
            <div className="text-center p-4">
              <p className="text-red-500">Failed to initialize payment. Please try again.</p>
              <Button
                onClick={() => createPaymentIntent()}
                className="mt-4 bg-blue-500 hover:bg-blue-600"
              >
                Retry
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}