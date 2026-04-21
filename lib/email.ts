import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function sendEmail({
  to,
  subject,
  body,
}: {
  to: string
  subject: string
  body: string
}) {
  try {
    const result = await transporter.sendMail({
      from: `"JobBoard" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html: body,
    })
    console.log("Email sent:", result.messageId)
  } catch (error) {
    console.error("Email send failed:", error)
  }
}