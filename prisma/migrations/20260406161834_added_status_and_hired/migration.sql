-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'CLOSED', 'DRAFT');

-- AlterEnum
ALTER TYPE "ApplicationStatus" ADD VALUE 'HIRED';

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "status" "Status";
