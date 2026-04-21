import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET - fetch notifications
export async function GET() {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json([], { status: 401 })

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    })

    const notifications = await prisma.notification.findMany({
        where: {
            userId: session.user.id,  // ← only this user's notifications
            // Extra guard: only return relevant types per role
            type: user?.role === "Employer"
                ? "NEW_APPLICANT"
                : "INTERVIEW_REMINDER",
        },
        orderBy: { createdAt: "desc" },
        take: 20,
    })

    return NextResponse.json(notifications)
}

// PATCH - mark all as read
export async function PATCH() {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({}, { status: 401 })

    await prisma.notification.updateMany({
        where: { userId: session.user.id, read: false },
        data: { read: true },
    })

    return NextResponse.json({ success: true })
}