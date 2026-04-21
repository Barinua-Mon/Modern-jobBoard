
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { JobFilters } from "@/components/job-filters"
import JobList from "@/components/job-list"
import { FeaturedCompanies } from "@/components/featured-companies"
import  {Stats}  from "@/components/stats"
import { Suspense } from "react"
import { JobListSkeleton } from "@/components/job-card-skeleton"

export const dynamic = "force-dynamic"

interface Props {
  searchParams: Promise<{
    q?: string
    location?: string
    type?: string | string[]
    level?: string | string[]
    minSalary?: string
  }>
}

export default async function Home({ searchParams }: Props) {

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Stats />
      <FeaturedCompanies />
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <JobFilters />
          </aside>
          <main className="lg:col-span-3">
            <Suspense fallback={<JobListSkeleton/>}>
              <JobList searchParams={searchParams} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}