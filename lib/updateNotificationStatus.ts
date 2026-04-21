import { revalidatePath } from "next/cache"
import { createNotification } from "./notification"
import prisma from "./prisma"
import { auth } from "./auth"
import { ApplicationStatus, InterviewType } from "../lib/generated/prisma/enums"

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
  interviewDate?: Date,
  interviewType?: InterviewType
) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const application = await prisma.application.update({
    where: { id: applicationId },
    data: {
      status,
      ...(interviewDate && { interviewDate }),
      ...(interviewType && { interviewType }),
    },
    include: {
      applicant: { select: { id: true, email: true, name: true } },
      job: { select: { title: true } },
    },
  })

  // Only notify the APPLICANT — recruiter notification already
  // happens in ApplyJob when they first apply
  if (status === ApplicationStatus.INTERVIEW && application.applicant.email) {
    const dateStr = interviewDate
      ? new Date(interviewDate).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "TBD"

    await createNotification({
      userId: application.applicant.id,       // ← applicant only
      type: "INTERVIEW_REMINDER",
      title: "Interview Scheduled 🎉",
      message: `You have an interview for "${application.job.title}" on ${dateStr}${interviewType ? ` via ${interviewType}` : ""}.`,
      link: `/dashboard`,
      userEmail: application.applicant.email, // ← applicant's email only
      userName: application.applicant.name,
    })
  }

  revalidatePath("/dashboard")
}