import { useQuery } from "@tanstack/react-query"

interface RevenueData {
  month: string
  revenue: number
  booking: number
}

export function useRevenueData() {
  return useQuery<RevenueData[]>({
    queryKey: ["revenue-booking"],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/revenue-booking`)
      if (!response.ok) {
        throw new Error("Failed to fetch revenue data")
      }
      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
