"use client"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DealsCardSkeleton() {
    return (
        <Card className="overflow-hidden border border-gray-800 bg-gray-900/50 h-full">
            <Skeleton className="h-[400px] w-full rounded-none " />
          
        </Card>
    )
}
