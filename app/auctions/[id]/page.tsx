import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import AuctionDetails from "@/components/auctions/auction-details/auction-details"

export default function AuctionPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8 px-4 mt-20">
      <Suspense fallback={<AuctionDetailsSkeleton />}>
        <AuctionDetails auctionId={params.id} />
      </Suspense>
    </div>
  )
}

function AuctionDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="h-[400px] w-full rounded-md" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-6 w-1/3" />
          <div className="grid grid-cols-4 gap-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div>
        <div className="border-b">
          <Skeleton className="h-10 w-48" />
        </div>
        <Skeleton className="h-40 w-full mt-4" />
      </div>
    </div>
  )
}
