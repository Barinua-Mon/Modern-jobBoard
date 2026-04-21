


import { Header } from "@/components/header"
import { UserDashboard } from "@/components/user-dashboard"
import { RecruiterDashboard } from "@/components/recruiter-dashboard"
import { auth } from "@/lib/auth"
import { getAppliedJobs, getSavedJobs } from "@/lib/data/supabase"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/")

  // Fetch full user from DB so we have role, skills, bio, etc.
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      role: true,
      resume: true,
      bio: true,
      skills: true,
    },
  })

  if (!user) redirect("/")

  // ── Recruiter view ──────────────────────────────────────────────────────
  if (user.role === "Employer") {
    const jobsPosted = await prisma.job.findMany({
      where: { posterId: user.id },
      orderBy: { posted: "desc" },
      include: {
        _count: { select: { applications: true } },
      },
    })

    const recentApplications = await prisma.application.findMany({
      where: {
        job: { posterId: user.id },
      },
      include:{
        job: true,
        applicant:true
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    })

  

    return (
      <div className="min-h-screen">
        <Header />
        <RecruiterDashboard
          user={user}
          jobsPosted={jobsPosted}
          recentApplications={recentApplications}
        />
      </div>
    )
  }


  // ── Applicant view ──────────────────────────────────────────────────────
const [savedJobs, appliedJobs] = await Promise.all([
  prisma.savedJob.findMany({
    where: { userId: user.id },
    orderBy: { savedAt: "desc" },
  }),
  prisma.application.findMany({
    where: { applicantId: user.id },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          company: true,
          logo: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  }),
])

return (
  <div className="min-h-screen">
    <Header />
    <UserDashboard savedJobs={savedJobs} appliedJobs={appliedJobs} user={user} />
  </div>
)
}
