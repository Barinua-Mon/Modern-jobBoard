import prisma from "@/lib/prisma"
import { Suspense } from "react"
import { StatCards } from "./stat-cards"
import { Skeleton } from "@/components/ui/skeleton"

async function StatsContent() {
  const [activeJobs, companies] = await Promise.all([
    prisma.job.count({ where: { status: "ACTIVE" } }),
    prisma.job.groupBy({ by: ["company"] }).then((r) => r.length),
  ])

  return (
    <StatCards
      activeJobs={activeJobs}
      companies={companies}
      developers={0}
      successRate={95}
    />
  )
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-24 rounded-2xl" />
      ))}
    </div>
  )
}

export function Stats() {
  return (
    <section className="py-12 border-b border-border/40">
      <div className="container mx-auto px-4">
        <Suspense fallback={<StatsSkeleton />}>
          <StatsContent />
        </Suspense>
      </div>
    </section>
  )
}