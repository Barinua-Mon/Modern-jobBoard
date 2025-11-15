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
} from "lucide-react"
import Link from "next/link"

// Mock user data
const userData = {
  name: "Alex Johnson",
  email: "alex.johnson@email.com",
  avatar: "👤",
  profileCompletion: 75,
  stats: {
    savedJobs: 12,
    applications: 8,
    profileViews: 156,
    interviewsScheduled: 3,
  },
  recentApplications: [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      company: "TechCorp",
      logo: "🚀",
      appliedDate: "2 days ago",
      status: "under-review",
    },
    {
      id: 2,
      title: "Product Designer",
      company: "DesignCo",
      logo: "🎨",
      appliedDate: "5 days ago",
      status: "interview",
    },
    {
      id: 3,
      title: "Frontend Developer",
      company: "StartupXYZ",
      logo: "⚡",
      appliedDate: "1 week ago",
      status: "rejected",
    },
  ],
  recommendedJobs: [
    {
      id: 4,
      title: "Backend Engineer",
      company: "CloudTech",
      logo: "☁️",
      location: "Remote",
      salary: "$130k - $170k",
      match: 95,
    },
    {
      id: 5,
      title: "DevOps Engineer",
      company: "InfraCo",
      logo: "🔧",
      location: "San Francisco, CA",
      salary: "$140k - $180k",
      match: 88,
    },
  ],
  upcomingInterviews: [
    {
      id: 1,
      title: "Product Designer",
      company: "DesignCo",
      logo: "🎨",
      date: "Tomorrow",
      time: "2:00 PM",
      type: "Video Call",
    },
  ],
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "under-review":
      return "bg-blue-500/20 text-blue-500 border-blue-500/30"
    case "interview":
      return "bg-accent/20 text-accent border-accent/30"
    case "rejected":
      return "bg-destructive/20 text-destructive border-destructive/30"
    default:
      return "bg-secondary"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "under-review":
      return <Clock className="h-3 w-3" />
    case "interview":
      return <CheckCircle2 className="h-3 w-3" />
    case "rejected":
      return <XCircle className="h-3 w-3" />
    default:
      return null
  }
}

export function UserDashboard() {
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
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-3xl">
            {userData.avatar}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{userData.name}</h1>
            <p className="text-muted-foreground">{userData.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Profile Completion */}
      <Card className="p-6 mb-8 glass-effect">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Profile Completion</h3>
          <span className="text-sm text-muted-foreground">{userData.profileCompletion}%</span>
        </div>
        <Progress value={userData.profileCompletion} className="mb-3" />
        <p className="text-sm text-muted-foreground">
          Complete your profile to increase your chances of getting hired by {100 - userData.profileCompletion}%
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
          <p className="text-2xl font-bold mb-1">{userData.stats.savedJobs}</p>
          <p className="text-sm text-muted-foreground">Saved Jobs</p>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <FileText className="h-5 w-5 text-accent" />
            </div>
            <TrendingUp className="h-4 w-4 text-accent" />
          </div>
          <p className="text-2xl font-bold mb-1">{userData.stats.applications}</p>
          <p className="text-sm text-muted-foreground">Applications</p>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Eye className="h-5 w-5 text-blue-500" />
            </div>
            <TrendingUp className="h-4 w-4 text-accent" />
          </div>
          <p className="text-2xl font-bold mb-1">{userData.stats.profileViews}</p>
          <p className="text-sm text-muted-foreground">Profile Views</p>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-accent" />
            </div>
            <TrendingUp className="h-4 w-4 text-accent" />
          </div>
          <p className="text-2xl font-bold mb-1">{userData.stats.interviewsScheduled}</p>
          <p className="text-sm text-muted-foreground">Interviews</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Interviews */}
          {userData.upcomingInterviews.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Upcoming Interviews</h2>
              <div className="space-y-4">
                {userData.upcomingInterviews.map((interview) => (
                  <Card key={interview.id} className="p-4 bg-accent/10 border-accent/30">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-2xl">
                        {interview.logo}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{interview.title}</h3>
                        <p className="text-sm text-muted-foreground">{interview.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">{interview.date}</p>
                        <p className="text-xs text-muted-foreground">{interview.time}</p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {interview.type}
                        </Badge>
                      </div>
                    </div>
                  </Card>
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
            <div className="space-y-4">
              {userData.recentApplications.map((app) => (
                <div key={app.id}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-2xl">
                      {app.logo}
                    </div>
                    <div className="flex-1">
                      <Link href={`/jobs/${app.id}`}>
                        <h3 className="font-semibold hover:text-primary transition-colors cursor-pointer">
                          {app.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">{app.company}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getStatusColor(app.status)} gap-1 mb-1`}>
                        {getStatusIcon(app.status)}
                        {app.status.replace("-", " ")}
                      </Badge>
                      <p className="text-xs text-muted-foreground">{app.appliedDate}</p>
                    </div>
                  </div>
                  <Separator className="mt-4" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Recommended Jobs */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
            <div className="space-y-4">
              {userData.recommendedJobs.map((job) => (
                <div key={job.id} className="pb-4 border-b border-border/40 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-xl">
                      {job.logo}
                    </div>
                    <div className="flex-1">
                      <Link href={`/jobs/${job.id}`}>
                        <h3 className="font-semibold text-sm hover:text-primary transition-colors cursor-pointer">
                          {job.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-muted-foreground">{job.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>{job.location}</span>
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {job.match}% Match
                    </Badge>
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/jobs/${job.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-transparent" variant="outline" asChild>
              <Link href="/">Browse More Jobs</Link>
            </Button>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" asChild>
                <Link href="/saved">
                  <Bookmark className="h-4 w-4" />
                  View Saved Jobs
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" asChild>
                <Link href="/post-job">
                  <Briefcase className="h-4 w-4" />
                  Post a Job
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                <FileText className="h-4 w-4" />
                Update Resume
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
