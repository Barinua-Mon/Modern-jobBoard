
import { Header } from "@/components/header"
import JobDetailContent from "@/components/job-detail-content"
import { JobDetailSkeleton } from "@/components/job-detail-skeleton";
import { Job } from "@/components/job-list";
import { getJobById } from "@/lib/utils/data";
import { Suspense } from "react";


export async function generateStaticParams() {
  //FETCH ALL JOBS FROM API
  const res = await fetch("http://localhost:3000/api/jobs", { cache: "reload" });
  const jobs: Job[] = await res.json();

  return jobs.map((job) => ({ id: job.id }))

}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  //EXTRACT ID FROM PARAMS
  const { id } = await params;

  //PASS ID TO API ROUTE TO FETCH JOB BASED ON ID
  const res = await getJobById(id);

  //GIVE AN INTERFACE TO THE JOB
  const job: Job = res;

  return (
    <div className="min-h-screen">
      <Header />
      <Suspense fallback={<JobDetailSkeleton />}>
        <JobDetailContent job={job} />
      </Suspense>
    </div>
  )
}
