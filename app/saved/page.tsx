import { Header } from "@/components/header"
import { SavedJobsList } from "@/components/saved-jobs-list"
import { getSavedJobs } from "@/lib/actions"

export default async function SavedJobsPage() {
  const savedJobs = await getSavedJobs();

  return (
    <div className="min-h-screen">
      <Header />
      <SavedJobsList initialSavedJobs= {savedJobs} />
    </div>
  )
}
