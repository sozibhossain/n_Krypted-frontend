"use client"

import { useQuery } from "@tanstack/react-query"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
// import { Skeleton } from "@/components/ui/skeleton"

// Define colors for the chart
const COLORS = [
    "#1E3A8A", // Blue
    "#F97316", // Orange
    "#7F1D1D", // Red
    "#3B82F6", // Light Blue
    "#1E293B", // Dark Blue
    "#84CC16", // Green
    "#FACC15", // Yellow
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#14B8A6", // Teal
]

// Define the type for the booking data
interface BookingData {
    _id: string
    name: string
    value: number
}

// Function to fetch booking stats
const fetchBookingStats = async (): Promise<BookingData[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/booking-stats`)
    if (!response.ok) {
        throw new Error("Failed to fetch booking stats")
    }
    return response.json()
}

export function BookingDonut() {
    // Fetch data using TanStack Query
    const { data, isLoading, error } = useQuery({
        queryKey: ["bookingStats"],
        queryFn: fetchBookingStats,
    })

    // Handle loading state
    if (isLoading) {
        return (
            <div className="relative h-[300px] w-[500px]">
                <div className="flex h-full items-center justify-center">
                    <div className="space-y-4 w-full">
                        {/* <Skeleton className="h-[160px] w-[160px] rounded-full mx-auto" /> */}
                        <div className="grid grid-cols-3 gap-5 w-full">
                            {[...Array(6)].map((_, index) => (
                                <div key={index} className="flex items-center">
                                    {/* <Skeleton className="h-3 w-3 mr-1 rounded-full" />
                                    <Skeleton className="h-4 w-20" /> */}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Handle error state
    if (error || !data) {
        return (
            <div className="relative h-[300px] w-[500px] flex items-center justify-center">
                <p className="text-red-500">{error instanceof Error ? error.message : "Failed to load data"}</p>
            </div>
        )
    }

    // Calculate total value and percentage for the first item
    const totalValue = data.reduce((sum, entry) => sum + entry.value, 0)
    const percentage = data.length > 0 ? ((data[0].value / totalValue) * 100).toFixed(2) : "0.00"

    // Prepare data with colors
    const chartData = data.map((item, index) => ({
        ...item,
        color: COLORS[index % COLORS.length], // Cycle through colors if more items than colors
    }))

    return (
        <div className="relative h-[300px] w-[500px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">{percentage}%</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-5 w-full">
                {chartData.map((entry, index) => (
                    <div key={index} className="flex items-center text-xs">
                        <div className="mr-1 h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                        <span className="text-nowrap">{entry.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
