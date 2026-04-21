import { Header } from "@/components/header";
import ApplicantDetailPage from "@/components/job-applicantId-page";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect, RedirectType } from "next/navigation";


export default async function ApplicantDetailRoute({ params }: { params: Promise<{ id: string, applicationId:string }> }) {
  //EXTRACT ID FROM PARAMS
  const { id:jobId, applicationId } = await params;
  
  
   const [applicationUserDetail, job] = await Promise.all([
    prisma.application.findUnique({
      where: { id: applicationId },
      include: { applicant: true },
    }),
    prisma.job.findUnique({ where: { id: jobId } }),
  ])

  // redirect if either is missing
  if (!applicationUserDetail || !job) return redirect(`/jobs/${jobId}/applicant`)

  return (
    <div className="min-h-screen">
      <Header />
      <ApplicantDetailPage applicationUserDetail = {applicationUserDetail} jobTitle = {{title : job.title}} />
    </div>
  )
}