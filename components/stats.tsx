import { Suspense } from "react"
import { StatCards } from "./stat-cards"
import { Skeleton } from "@/components/ui/skeleton"

async function fetchStats() {
  const res = await fetch(`http://localhost:3000/api/stats`, {
    next: { revalidate: 3600 }, // refresh every hour
  })
  return res.json()
}

async function StatsContent() {
  const { activeJobs, companies, developers, successRate } = await fetchStats()

  return (
    <StatCards
      activeJobs={activeJobs}
      companies={companies}
      developers={developers}
      successRate={successRate}
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