import { JobCard } from "@/components/job-card"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"


interface Filters {
  q?: string
  location?: string
  type?: string | string[]
  level?: string | string[]
  minSalary?: string
}

export interface Job {
  id: string
  title: string
  company: string
  location: string
  description: string
  responsibilities: string
  requirements: string
  experienceLevel: string
  type: string
  tags: string[]
  posted: Date
  email: string
  featured: boolean
  benefits: string | null   // ← null not undefined
  companySize: string | null
  industry: string | null
  founded: string | null
  logo: string | null
  salary: string | null
  salaryMin: number | null
  salaryMax: number | null
  currency: string | null
  posterId: string | null
  status: "ACTIVE" | "CLOSED" | "DRAFT" | null
}

export default async function JobList({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string
    location?: string
    type?: string | string[]
    level?: string | string[]
    minSalary?: string
  }>
}) {
  const { q, location, type, level, minSalary } = await searchParams;

  
  let userId: string | undefined
  try {
    const session = await auth()
    userId = session?.user?.id
  } catch {
    // Auth adapter failed — treat user as guest, jobs still load
    userId = undefined
  }

  const user = userId
    ? await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })
    : null;

  const userRole = user?.role;

  const types = type ? (Array.isArray(type) ? type : [type]) : []
  const levels = level ? (Array.isArray(level) ? level : [level]) : []


  const [jobs, applications, savedJobs] = await Promise.all([
    prisma.job.findMany({
      where: {
        status: "ACTIVE",
        ...(q && {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { company: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { tags: { has: q } },
          ],
        }),
        ...(location && { location: { contains: location, mode: "insensitive" } }),
        ...(types.length && { type: { in: types } }),
        ...(levels.length && { experienceLevel: { in: levels } }),
        ...(minSalary && { salaryMin: { gte: Number(minSalary) * 1000 } }),
      },
      orderBy: [{ featured: "desc" }, { posted: "desc" }],
    }),

    // fetch the logged-in user's applied job IDs
    userId
      ? prisma.application.findMany({
        where: { applicantId: userId },
        select: { jobId: true },
      })
      : [],

    //fetch the logged-in user's saved job
    userId
      ? prisma.savedJob.findMany({
        where: { userId: userId },
        select: { jobId: true },
      })
      : []
  ])

  // turn it into a Set for O(1) lookup
  const appliedJobIds = new Set(applications.map((a) => a.jobId));
  const savedJobIds = new Set(savedJobs.map((s) => s.jobId));


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          <span className="text-primary">{jobs.length}</span>{" "}
          {q ? `Results for "${q}"` : "Jobs Found"}
        </h2>
        <select className="px-4 py-2 rounded-lg border border-border bg-background text-sm">
          <option>Most Recent</option>
          <option>Highest Salary</option>
          <option>Most Relevant</option>
        </select>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="font-medium">No jobs found</p>
          <p className="text-sm mt-1">Try different keywords or location</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job, index) => (
            <JobCard
              key={job.id} job={job}
              index={index}
              hasApplied={appliedJobIds.has(job.id)}
              initialSaved={savedJobIds.has(job.id)}
              userId={userId ?? null}
              userRole={userRole}
            />
          ))}
        </div>
      )}
    </div>
  )
}