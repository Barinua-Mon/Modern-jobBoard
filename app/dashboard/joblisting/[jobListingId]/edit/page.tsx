import { Header } from "@/components/header"
import EditJobForm from "@/components/edit-job-form"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export default async function EditJobPage({params}: { params: Promise<{ jobListingId: string }>}) {
    
   const { jobListingId } = await params

  const session = await auth()

  if (!session?.user) redirect("/signin")

  const job = await prisma.job.findUnique({
    where: { id: jobListingId, posterId: session.user.id }, // ensure only the owner can edit
  })

  if (!job) redirect("/dashboard/joblisting")

  return (
    <div className="min-h-screen">
      <Header />
      <EditJobForm job={job} />
    </div>
  )
}