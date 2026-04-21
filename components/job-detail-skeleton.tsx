import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function JobDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Skeleton className="h-9 w-28 mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">

          {/* Job Header */}
          <Card className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-5 w-1/3" />
                </div>
                <div className="flex flex-wrap gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-4 w-24" />
                  ))}
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-6 w-16 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Description, Responsibilities, Requirements, Benefits */}
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-8 space-y-4">
              <Skeleton className="h-7 w-48" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </Card>
          ))}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Apply card */}
          <Card className="p-6 space-y-4">
            <Skeleton className="h-10 w-full rounded-lg" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1 rounded-lg" />
              <Skeleton className="h-10 flex-1 rounded-lg" />
            </div>
          </Card>

          {/* Company info */}
          <Card className="p-6 space-y-4">
            <Skeleton className="h-6 w-40" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </Card>

          {/* Similar jobs */}
          <Card className="p-6 space-y-4">
            <Skeleton className="h-6 w-32" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2 pb-4 border-b border-border/40 last:border-0">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}