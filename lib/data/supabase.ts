// lib/data/savedJobs.ts (new file)
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getSavedJobs() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return [];  // or throw, depending on your needs

    return prisma.savedJob.findMany({
        where: { userId }  // ← also fix this (see bug below)
    });
}

export async function getAppliedJobs() {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return [];  // or throw, depending on your needs

    return prisma.application.findMany({
        where: { applicantId:userId }  // ← also fix this (see bug below)
    });
}