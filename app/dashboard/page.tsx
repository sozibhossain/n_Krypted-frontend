"use client";


import Layout from "@/components/dashboard/layout";
// import { apiService } from "@/lib/api-service";






import { DollarSign, Users, Calendar, Award } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/stat-card"
import { RevenueChart } from "@/components/revenue-chart"
import { BookingDonut } from "@/components/king-donut";




// interface Auction {
//   _id: string;
//   title: string;
//   currentBid: number;
//   status: string;
//   endsIn?: string;
//   bidCount: number; // Added bidCount property
// }

// interface TopBidder {
//   _id: string;
//   username: string;
//   auctionsWon: number;
//   totalAmount: number;
// }

export default function Dashboard() {


  return (
    <Layout>
      <div className="flex  flex-col  ">
        <div className="flex flex-col  ">
          <h1 className="text-[40px] text-[#1F2937] font-bold tracking-tight">Dashboard</h1>
          <p className="text-xl text-[#4B5563] font-normal">Welcome back to your admin panel</p>

          <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Revenue"
              value="$51,250"
              percentageChange={10}
              trend="up"
              description="last 100 today"
              icon={<DollarSign className="h-4 w-4 text-green-500" />}
              iconColor="bg-green-100"
            />
            <StatCard
              title="Total Booking"
              value="$51,250"
              percentageChange={10}
              trend="up"
              description="last 100 today"
              icon={<Calendar className="h-4 w-4 text-green-500" />}
              iconColor="bg-green-100"
            />
            <StatCard
              title="Total Customers"
              value="51,250"
              percentageChange={10}
              trend="up"
              description="last 100 today"
              icon={<Users className="h-4 w-4 text-green-500" />}
              iconColor="bg-green-100"
            />
            <StatCard
              title="Total Deals"
              value="250"
              percentageChange={10}
              trend="up"
              description="last 100 today"
              icon={<Award className="h-4 w-4 text-green-500" />}
              iconColor="bg-green-100"
            />
          </div>

          <div className="mt-5 flex flex-wrap md:flex-nowrap gap-y-5 justify-between  ">
            <Card className="px-6 py-6 bg-[#FFFFFF] shadow-lg rounded-[8px] w-full md:w-[73%] min-h-[450px]">
              <CardHeader>
                <CardTitle>
                  <div className="space-y-1 ">
                    <h3 className="text-[32px] text-[#212121] font-semibold">Statistic</h3>
                    <p className="text-sm text-[#4E4E4E] font-normal mt-3">Revenue and Booking</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RevenueChart />
              </CardContent>
            </Card>
            <Card className="px-6 py-6 bg-[#FFFFFF] shadow-lg rounded-[8px] w-full md:w-[25%] min-h-[450px]">
              <CardHeader>
                <CardTitle>
                  <div className="space-y-1">
                    <h3 className="text-[32px] text-[#212121] font-semibold">Most booking</h3>
                    <p className="text-sm text-[#4E4E4E] font-normal mt-3">Most bookings in the Category?</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <BookingDonut />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
