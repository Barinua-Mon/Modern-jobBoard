import prisma from "@/lib/prisma"
import { sendEmail } from "@/lib/email"

interface CreateNotificationParams {
  userId: string
  type: "NEW_APPLICANT" | "INTERVIEW_REMINDER"
  title: string
  message: string
  link?: string
  userEmail: string
  userName?: string | null
}

export async function createNotification({
  userId,
  type,
  title,
  message,
  link,
  userEmail,
  userName,
}: CreateNotificationParams) {
  // 1. Save in-app notification
  await prisma.notification.create({
    data: { userId, type, title, message, link },
  })

  // 2. Send email
  await sendEmail({
    to: userEmail,
    subject: title,
    body: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
        <h2 style="margin-bottom:8px">${title}</h2>
        <p style="color:#666">${message}</p>
        ${link ? `<a href="${process.env.AUTH_URL}${link}" 
          style="display:inline-block;margin-top:16px;padding:10px 20px;background:#6366f1;color:white;border-radius:8px;text-decoration:none">
          View Details
        </a>` : ""}
        <p style="margin-top:24px;font-size:12px;color:#999">
          You received this email from JobBoard. 
        </p>
      </div>
    `,
  })
}