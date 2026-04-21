-- CreateEnum
CREATE TYPE "InterviewType" AS ENUM ('VIDEO', 'PHYSICAL', 'PHONE');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('UNDER_REVIEW', 'INTERVIEW', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "interviewDate" TIMESTAMP(3),
ADD COLUMN     "interviewType" "InterviewType",
ADD COLUMN     "status" "ApplicationStatus" NOT NULL DEFAULT 'UNDER_REVIEW';

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
