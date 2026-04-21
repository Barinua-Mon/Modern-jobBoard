"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Briefcase,
  Bookmark,
  FileText,
  TrendingUp,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Settings,
  Bell,
  CalendarCheck,
  Mail,
} from "lucide-react"
import Link from "next/link"
import { NotificationBell } from "./notification-bell"
import { calculateProfileCompletion } from "@/lib/utils/data"

// ── Types ────────────────────────────────────────────────────────────────────

interface SavedJob {
  id: string
  savedAt: Date
  jobId: string
  userId: string
}

interface AppliedJob {
  id: string
  status: string
  jobId: string
  applicantId: string
  createdAt: Date
  updatedAt: Date
  interviewType: string | null
  interviewDate: Date | null
  job: {
    id: string
    title: string
    company: string
    logo: string | null
  }
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

// ── Component ────────────────────────────────────────────────────────────────

export function UserDashboard({
  savedJobs,
  appliedJobs,
  user,
}: {
  savedJobs: SavedJob[]
  appliedJobs: AppliedJob[]
  user: any
}) {
  const completion = calculateProfileCompletion(user)
  const profile = { ...user, profileCompletion: completion }

  const upcomingInterviews = appliedJobs.filter(
    (a) =>
      a.status.toLowerCase() === "interview" &&
      a.interviewDate !== null &&
      new Date(a.interviewDate) >= new Date()
  )

  const interviewsScheduled = upcomingInterviews.length

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
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
            {profile.image ? (
              <img src={profile.image} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              "👤"
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <p className="text-muted-foreground">{profile.email}</p>
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
          <span className="text-sm text-muted-foreground">{profile.profileCompletion}%</span>
        </div>
        <Progress value={profile.profileCompletion} className="mb-3" />
        <p className="text-sm text-muted-foreground">
          Complete your profile to increase your chances of getting hired by{" "}
          {100 - profile.profileCompletion}%
        </p>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Bookmark className="h-5 w-5 text-primary" />
            </div>
            <TrendingUp className="h-4 w-4 text-accent" />
          </div>
          <p className="text-2xl font-bold mb-1">{savedJobs.length}</p>
          <p className="text-sm text-muted-foreground">Saved Jobs</p>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <FileText className="h-5 w-5 text-accent" />
            </div>
            <TrendingUp className="h-4 w-4 text-accent" />
          </div>
          <p className="text-2xl font-bold mb-1">{appliedJobs.length}</p>
          <p className="text-sm text-muted-foreground">Applications</p>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Eye className="h-5 w-5 text-blue-500" />
            </div>
            <TrendingUp className="h-4 w-4 text-accent" />
          </div>
          <p className="text-2xl font-bold mb-1">—</p>
          <p className="text-sm text-muted-foreground">Profile Views</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">

          {/* Upcoming Interviews */}
          {upcomingInterviews.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Upcoming Interviews</h2>
              <div className="space-y-4">
                {upcomingInterviews.map((interview) => (
                  <Link
                    key={interview.id}
                    href={`/jobs/${interview.job.id}`}
                    className="block group"
                  >
                    <Card className="p-4 bg-accent/10 border-accent/30 hover:border-accent/60 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-2xl shrink-0">
                          {interview.job.logo ?? "💼"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                            {interview.job.title}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {interview.job.company}
                          </p>
                        </div>
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

          {/* Recent Applications */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Applications</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/saved">View All</Link>
              </Button>
            </div>

            {appliedJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">No applications yet</p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Start applying to jobs to track your applications here.
                </p>
                <Button size="sm" variant="outline" className="mt-1 bg-transparent" asChild>
                  <Link href="/">Browse Jobs</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {appliedJobs.slice(0, 5).map((app) => (
                  <div key={app.id}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-2xl shrink-0">
                        {app.job.logo ?? "💼"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/jobs/${app.job.id}`}>
                          <h3 className="font-semibold text-sm hover:text-primary transition-colors cursor-pointer truncate">
                            {app.job.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-muted-foreground truncate">{app.job.company}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge className={`${getStatusColor(app.status)} gap-1 mb-1`}>
                          {getStatusIcon(app.status)}
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </Badge>
                        <p className="text-xs text-muted-foreground">{daysAgo(app.createdAt)}</p>
                      </div>
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" asChild>
                <Link href="/saved">
                  <Bookmark className="h-4 w-4" />
                  View Saved Jobs ({savedJobs.length})
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" asChild>
                <Link href="/">
                  <Briefcase className="h-4 w-4" />
                  Browse Jobs
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" asChild>
                <Link href="/dashboard/settings">
                  <FileText className="h-4 w-4" />
                  Update Resume
                </Link>
              </Button>
            </div>
          </Card>

          {/* Application Status Breakdown */}
          {appliedJobs.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Application Status</h3>
              <div className="space-y-3">
                {(["pending", "interview", "hired", "rejected"] as const).map((status) => {
                  const count = appliedJobs.filter(
                    (a) => a.status.toLowerCase() === status
                  ).length
                  if (count === 0) return null
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <Badge className={`${getStatusColor(status)} gap-1`}>
                        {getStatusIcon(status)}
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Badge>
                      <span className="text-sm font-semibold">{count}</span>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}