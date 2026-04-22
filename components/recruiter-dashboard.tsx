"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Briefcase,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Settings,
  Bell,
  Users,
  PlusCircle,
  LayoutList,
  Eye,
  CalendarCheck,
  MapPin,
  Timer,
} from "lucide-react"
import Link from "next/link"
import { NotificationBell } from "./notification-bell"
import { calculateProfileCompletion } from "@/lib/data/calculateProfileCompletion"

// ── Types ────────────────────────────────────────────────────────────────────

interface JobPosted {
  id: string
  title: string
  location: string | null
  posted: Date
  _count?: {
    applications: number
  }
}

interface RecentApplications {
  id: string
  applicantId: string
  jobId: string
  status: string
  createdAt: Date
  updatedAt: Date
  interviewType: string | null
  interviewDate: Date | null
  applicant: {
    id: string
    name: string | null
    image: string | null
  }
  job: {
    id: string
    title: string
  }
}

interface RecruiterDashboardProps {
  user: any
  jobsPosted: JobPosted[]
  recentApplications: RecentApplications[]
}


// ── Helpers ──────────────────────────────────────────────────────────────────

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-blue-500/20 text-blue-500 border-blue-500/30"
    case "interview":
      return "bg-accent/20 text-accent border-accent/30"
    case "rejected":
      return "bg-destructive/20 text-destructive border-destructive/30"
    case "hired":
      return "bg-green-500/20 text-green-500 border-green-500/30"
    default:
      return "bg-secondary"
  }
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return <Clock className="h-3 w-3" />
    case "interview":
      return <CheckCircle2 className="h-3 w-3" />
    case "rejected":
      return <XCircle className="h-3 w-3" />
    case "hired":
      return <CheckCircle2 className="h-3 w-3" />
    default:
      return null
  }
}

const daysAgo = (date: Date) => {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
  if (diff === 0) return "Today"
  if (diff === 1) return "Yesterday"
  return `${diff} days ago`
}

const daysLive = (date: Date) => {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
  return `${diff}d live`
}


// ── Component ────────────────────────────────────────────────────────────────

export function RecruiterDashboard({
  user,
  jobsPosted,
  recentApplications,
}: RecruiterDashboardProps) {
  const completion = calculateProfileCompletion(user)
  const recruiter = { ...user, profileCompletion: completion }

  const totalApplicants = jobsPosted.reduce(
    (sum, job) => sum + (job._count?.applications ?? 0),
    0
  )
  const activeListings = jobsPosted.length
  const interviewsScheduled = recentApplications.filter(
    (a) => a.status.toLowerCase() === "interview"
  ).length

  const upcomingInterviews = recentApplications.filter(
  (a) =>
    a.status.toLowerCase() === "interview" &&
    a.interviewDate !== null &&
    new Date(a.interviewDate) >= new Date()
)

  return (
    <div className="container mx-auto px-4 py-8">

      {/* Back */}
      <Link href="/">
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Button>
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-3xl overflow-hidden">
            {recruiter.image ? (
              <img src={recruiter.image} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              "👤"
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-3xl font-bold">{recruiter.name}</h1>
              <Badge variant="secondary" className="text-xs">Recruiter</Badge>
            </div>
            <p className="text-muted-foreground">{recruiter.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
         <NotificationBell userId={user.id} userRole={user.role} />
          <Link href="/dashboard/settings">
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Completion */}
      <Card className="p-6 mb-8 glass-effect">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Profile Completion</h3>
          <span className="text-sm text-muted-foreground">{recruiter.profileCompletion}%</span>
        </div>
        <Progress value={recruiter.profileCompletion} className="mb-3" />
        <p className="text-sm text-muted-foreground">
          Complete your profile to attract better candidates by {100 - recruiter.profileCompletion}%
        </p>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <TrendingUp className="h-4 w-4 text-accent" />
          </div>
          <p className="text-2xl font-bold mb-1">{activeListings}</p>
          <p className="text-sm text-muted-foreground">Jobs Posted</p>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-accent" />
            </div>
            <TrendingUp className="h-4 w-4 text-accent" />
          </div>
          <p className="text-2xl font-bold mb-1">{totalApplicants}</p>
          <p className="text-sm text-muted-foreground">Total Applicants</p>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Eye className="h-5 w-5 text-blue-500" />
            </div>
            <TrendingUp className="h-4 w-4 text-accent" />
          </div>
          <p className="text-2xl font-bold mb-1">{activeListings}</p>
          <p className="text-sm text-muted-foreground">Active Listings</p>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <CalendarCheck className="h-5 w-5 text-accent" />
            </div>
            <TrendingUp className="h-4 w-4 text-accent" />
          </div>
          <p className="text-2xl font-bold mb-1">{interviewsScheduled}</p>
          <p className="text-sm text-muted-foreground">Interviews</p>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Left: main content ── */}
        <div className="lg:col-span-2 space-y-8">

          {/* Upcoming Interviews */}
          {upcomingInterviews.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Upcoming Interviews</h2>
              <div className="space-y-4">
                {upcomingInterviews.map((interview) => (
                  <Link
                    key={interview.id}
                    href={`/jobs/${interview.job.id}/applicant/${interview.id}/`}
                    className="block group"
                  >
                    <Card className="p-4 bg-accent/10 border-accent/30 hover:border-accent/60 transition-colors">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                          {interview.applicant.image ? (
                            <img
                              src={interview.applicant.image}
                              alt={interview.applicant.name ?? "Applicant"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            "👤"
                          )}
                        </div>

                        {/* Name + Role */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                            {interview.applicant.name ?? "Unknown Applicant"}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">
                            Applied for: {interview.job.title}
                          </p>
                        </div>

                        {/* Date + Type */}
                        <div className="text-right shrink-0">
                          <p className="font-semibold text-sm">
                            {new Date(interview.interviewDate!).toLocaleDateString(undefined, {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(interview.interviewDate!).toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          {interview.interviewType && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              {interview.interviewType}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {/* Recent Applicants */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Applicantions</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/joblisting">View All</Link>
              </Button>
            </div>

            {recentApplications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">No applicants yet</p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Post a job to start receiving applications from candidates.
                </p>
                <Button size="sm" variant="outline" className="mt-1 bg-transparent gap-1.5" asChild>
                  <Link href="/post-job">
                    <PlusCircle className="h-3.5 w-3.5" />
                    Post a Job
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentApplications.slice(0, 5).map((applicant) => (
                  <div key={applicant.id}>
                    <Link href={`/jobs/${applicant.job.id}/applicant/${applicant.id}/`} className="flex items-center gap-4 group">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                        {applicant.applicant.image ? (
                          <img
                            src={applicant.applicant.image}
                            alt={applicant.applicant.name ?? "Applicant"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          "👤"
                        )}
                      </div>

                      {/* Name + Job */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                          {applicant.applicant.name ?? "Unknown Applicant"}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                          Applied for: {applicant.job.title}
                        </p>
                      </div>

                      {/* Status + Date */}
                      <div className="text-right shrink-0">
                        <Badge className={`${getStatusColor(applicant.status)} gap-1 mb-1`}>
                          {getStatusIcon(applicant.status)}
                          {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {daysAgo(applicant.createdAt)}
                        </p>
                      </div>
                    </Link>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* ── Right: sidebar ── */}
        <div className="lg:col-span-1 space-y-6">

          {/* Active Listings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Active Listings</h2>

            {jobsPosted.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No jobs posted yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobsPosted.slice(0, 4).map((job) => (
                  <div
                    key={job.id}
                    className="pb-4 border-b border-border/40 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-xl shrink-0">
                        💼
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/jobs/${job.id}`}>
                          <h3 className="font-semibold text-sm hover:text-primary transition-colors cursor-pointer truncate">
                            {job.title}
                          </h3>
                        </Link>
                        {job.location && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs gap-1">
                          <Users className="h-3 w-3" />
                          {job._count?.applications ?? 0} applicants
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Timer className="h-3 w-3" />
                          {daysLive(job.posted)}
                        </span>
                      </div>
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/jobs/${job.id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 bg-transparent"
                asChild
              >
                <Link href="/post-job">
                  <PlusCircle className="h-4 w-4" />
                  Post a New Job
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-2 bg-transparent"
                asChild
              >
                <Link href="/dashboard/joblisting">
                  <FileText className="h-4 w-4" />
                  Manage Listings
                </Link>
              </Button>
            </div>
          </Card>

        </div>
      </div>
    </div>
  )
}