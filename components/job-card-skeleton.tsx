import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function JobCardSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Logo */}
        <Skeleton className="w-16 h-16 rounded-xl shrink-0" />

        {/* Details */}
        <div className="flex-1 space-y-3">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>

          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex md:flex-col gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-20" />
      </div>
    </Card>
  )
}

export function JobListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  )
}