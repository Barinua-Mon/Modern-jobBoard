import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const [activeJobs, companies, developers, hiredCount, totalApplications] = await Promise.all([
    prisma.job.count({ where: { status: "ACTIVE" } }),
    prisma.job.groupBy({ by: ["company"] }).then((r) => r.length), // unique companies
    prisma.user.count({ where: { role: "Applicant" } }),
    prisma.application.count({ where: { status: "HIRED" } }),
    prisma.application.count(),
  ])

  const successRate =
    totalApplications > 0 ? Math.round((hiredCount / totalApplications) * 100) : 0

  return NextResponse.json({ activeJobs, companies, developers, successRate })
}