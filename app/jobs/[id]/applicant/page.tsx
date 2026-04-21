import { Header } from "@/components/header";
import { ApplicantsPage } from "@/components/job-applicants-page";
import { InterviewType } from "@/lib/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ApplicantsRoute({ params }: { params: Promise<{ id: string }> }) {
  //EXTRACT ID FROM PARAM
  const { id } = await params;

  //FIND JOB FROM DATABASE BASED ON ID
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      applications: {
        include: {
          applicant: {
            select: {
              id: true,
              name: true,
              image: true,
              bio: true,
              resume: true,
              skills: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if(!job) return redirect("/dashboard/joblisting");

  const application = job.applications.map(job=>({
         id: job.id,
         status: job.status?.toLowerCase() as "under_review" | "interview" | "hired" | "rejected",
         interviewType: job.interviewType?.toLocaleLowerCase() as "video" | "physical" | "phone",
         interviewDate: job.interviewDate,
         createdAt: job.createdAt,
         applicant: job.applicant
  }))
  
  return (
    <div className="min-h-screen">
      <Header />
      <ApplicantsPage application ={application} />
    </div>
  )
}