import { Header } from "@/components/header"
import { JobDetailContent } from "@/components/job-detail-content"

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="min-h-screen">
      <Header />
      <JobDetailContent jobId={id} />
    </div>
  )
}
