"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const data = [
    { name: "Uhren", value: 20, color: "#1E3A8A" },
    { name: "Hotels", value: 15, color: "#F97316" },
    { name: "Einrichtungen", value: 10, color: "#7F1D1D" },
    { name: "Kunst", value: 25, color: "#3B82F6" },
    { name: "Restaurants", value: 10, color: "#1E293B" },
    { name: "Fashion", value: 15, color: "#84CC16" },
    { name: "Diverse Walk Throughz", value: 5, color: "#FACC15" },
]

export function BookingDonut() {
    const totalValue = data.reduce((sum, entry) => sum + entry.value, 0)
    const percentage = ((data[0].value / totalValue) * 100).toFixed(2)

    return (
        <div className="relative h-[300px] w-[500px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">{percentage}%</p>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-5 w-full">
                {data.map((entry, index) => (
                    <div key={index} className="flex items-center text-xs">
                        <div className="mr-1 h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                        <span className="text-nowrap">{entry.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
