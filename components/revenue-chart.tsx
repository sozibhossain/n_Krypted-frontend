"use client"

import { useState } from "react"
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Generate dummy data for the chart
const generateMonthlyData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    return months.map((month) => {
        // Generate random values between 200 and 1200 for revenue
        const revenue = Math.floor(Math.random() * (1200 - 200) + 200)
        // Generate random values between 200 and 1200 for booking
        const booking = Math.floor(Math.random() * (1200 - 200) + 200)

        return {
            month,
            revenue,
            booking,
        }
    })
}

export function RevenueChart() {
    const [data, setData] = useState(generateMonthlyData())
    console.log(setData);
    
    const [hoveredData, setHoveredData] = useState<{ revenue: number; booking: number } | null>(null)

    const formatYAxis = (value: number) => {
        if (value === 0) return "0"
        if (value === 200) return "$200"
        if (value === 400) return "$400"
        if (value === 600) return "$600"
        if (value === 800) return "$800"
        if (value === 1000) return "$1k"
        if (value === 1200) return "$1.2k"
        return `$${value}`
    }

   /* eslint-disable @typescript-eslint/no-explicit-any */
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="rounded-lg border bg-[#BABABA] p-2 shadow-sm ">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center">
                            <div className="mr-2 h-2 w-2 rounded-full bg-[#10B981]"></div>
                            <span className="text-xs">Revenue:</span>
                            <span className="ml-1 font-bold text-xs">${payload[0].value}</span>
                        </div>
                        <div className="flex items-center">
                            <div className="mr-2 h-2 w-2 rounded-full bg-[#3B82F6]"></div>
                            <span className="text-xs">Booking:</span>
                            <span className="ml-1 font-bold text-xs">${payload[1].value}%</span>
                        </div>
                    </div>
                </div>
            )
        }
        return null
    }

    return (
        <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                    onMouseMove={(data) => {
                        if (data.activePayload) {
                            setHoveredData({
                                revenue: data.activePayload[0].value,
                                booking: data.activePayload[1].value,
                            })
                        }
                    }}
                    onMouseLeave={() => setHoveredData(null)}
                >
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorBooking" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#6B7280" }}
                        tickFormatter={formatYAxis}
                        domain={[0, 1200]}
                        ticks={[0, 200, 400, 600, 800, 1000, 1200]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#10B981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        dot={{ r: 0 }}
                        activeDot={{ r: 4, fill: "#10B981", stroke: "white", strokeWidth: 2 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="booking"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={{ r: 0 }}
                        activeDot={{ r: 4, fill: "#3B82F6", stroke: "white", strokeWidth: 2 }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
            {hoveredData && (
                <div className="mt-2 flex items-center justify-center space-x-4">
                    <div className="flex items-center">
                        <div className="mr-2 h-3 w-3 rounded-full bg-[#10B981]"></div>
                        <span className="text-sm ">Revenue: ${hoveredData.revenue}</span>
                    </div>
                    <div className="flex items-center">
                        <div className="mr-2 h-3 w-3 rounded-full bg-[#3B82F6]"></div>
                        <span className="text-sm">Booking: ${hoveredData.booking}</span>
                    </div>
                </div>
            )}
        </div>
    )
}
