import { Header } from "@/components/header"
import { JobListingPage } from "@/components/job-listing-page"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

import { redirect } from "next/navigation"

export default async function JobListingRoute() {
   const session = await auth();
   const userId = session?.user.id;
   if (!userId) redirect("/")

//   // Guard — only recruiters can access
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  })
  if (!user || user.role !== "Employer") redirect("/dashboard");

  const jobs = await prisma.job.findMany({
    where:{posterId: userId},
    include:{_count: { select: {applications: true} } }
  }) 

  const EmployersPostedJobs = jobs.map(job => ({
  id: job.id,
  title: job.title,
  location: job.location,
  type: job.type,
  salary: job.salary,
  posted: job.posted,
  _count: job._count,

  // ✅ FIX status here
  status: job.status?.toLowerCase() as "active" | "closed" | "draft"
}))


  return (
    <div className="min-h-screen">
      <Header />
      <JobListingPage EmployersPostedJobs = {EmployersPostedJobs} />
    </div>
  )
}