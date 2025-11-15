import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { JobFilters } from "@/components/job-filters"
import { JobList } from "@/components/job-list"
import { FeaturedCompanies } from "@/components/featured-companies"
import { Stats } from "@/components/stats"

export default function Home() {
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
            <JobList />
          </main>
        </div>
      </div>
    </div>
  )
}
