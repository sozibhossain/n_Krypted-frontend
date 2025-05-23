import { Skeleton } from "@/components/ui/skeleton"

export function DealsSkeleton() {
    return (
        <div className="rounded-lg overflow-hidden bg-[#212121]">
            {/* Image skeleton */}
            <Skeleton className="w-full h-48 rounded-none" />

            <div className="p-4 space-y-4 flex justify-between">
                {/* Status badge skeleton */}
                <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-10 rounded-md" />
                </div>

                {/* Title skeleton */}
                <Skeleton className="h-7 w-full" />

                {/* Description skeleton */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>

                {/* Price skeleton */}
                <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-6 w-32" />
                </div>

                {/* Button skeleton */}
                <Skeleton className="h-10 w-full rounded-md" />
            </div>
        </div>
    )
}
