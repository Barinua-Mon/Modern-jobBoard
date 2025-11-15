import { Header } from "@/components/header"
import { SavedJobsList } from "@/components/saved-jobs-list"

export default function SavedJobsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <SavedJobsList />
    </div>
  )
}
