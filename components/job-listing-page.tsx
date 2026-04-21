"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  PlusCircle,
  MapPin,
  Users,
  Timer,
  MoreVertical,
  Eye,
  Pencil,
  XCircle,
  Briefcase,
  CheckCircle2,
  CircleDot,
  Clock,
} from "lucide-react"
import Link from "next/link"

// ── Types ─────────────────────────────────────────────────────────────────────

interface Job {
  id: string
  title: string
  location: string | null
  type: string | null
  salary: string | null
  status: "active" | "closed" | "draft" 
  posted: Date
  _count: {
    applications: number
  }
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_JOBS: Job[] = [
  {
    id: "job_1",
    title: "Senior Frontend Developer",
    location: "Remote",
    type: "Full-time",
    salary: "$120k - $160k",
    status: "active",
    posted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    _count: { applications: 14 },
  },
  {
    id: "job_2",
    title: "Product Designer",
    location: "Lagos, Nigeria",
    type: "Full-time",
    salary: "$80k - $110k",
    status: "active",
    posted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    _count: { applications: 8 },
  },
  {
    id: "job_3",
    title: "Backend Engineer",
    location: "Remote",
    type: "Contract",
    salary: "$100k - $140k",
    status: "active",
    posted: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    _count: { applications: 21 },
  },
  {
    id: "job_4",
    title: "DevOps Engineer",
    location: "Abuja, Nigeria",
    type: "Full-time",
    salary: "$90k - $130k",
    status: "draft",
    posted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    _count: { applications: 0 },
  },
  {
    id: "job_5",
    title: "Mobile Developer (React Native)",
    location: "Remote",
    type: "Part-time",
    salary: "$70k - $100k",
    status: "closed",
    posted: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    _count: { applications: 37 },
  },
  {
    id: "job_6",
    title: "QA Engineer",
    location: "Port Harcourt, Nigeria",
    type: "Full-time",
    salary: "$60k - $80k",
    status: "closed",
    posted: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    _count: { applications: 12 },
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

const daysLive = (date: Date) => {
  const diff = Math.floor(
    (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
  )
  if (diff === 0) return "Posted today"
  if (diff === 1) return "1 day live"
  return `${diff} days live`
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "active": return "bg-accent/20 text-accent border-accent/30"
    case "closed": return "bg-destructive/20 text-destructive border-destructive/30"
    case "draft":  return "bg-secondary text-muted-foreground border-border"
    default:       return "bg-secondary"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active": return <CheckCircle2 className="h-3 w-3" />
    case "closed": return <XCircle className="h-3 w-3" />
    case "draft":  return <CircleDot className="h-3 w-3" />
    default:       return null
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export function JobListingPage({EmployersPostedJobs}: {EmployersPostedJobs: Job[]}) {
  //const [EmployersPostedJobs, setJobs] = useState<Job[]>(MOCK_JOBS)
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [jobs, setJobs] = useState(EmployersPostedJobs)
 
  const filtered = EmployersPostedJobs
    .filter((job) =>
      statusFilter === "all" || job.status === statusFilter
    )
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.posted).getTime() - new Date(a.posted).getTime()
      if (sortBy === "oldest")
        return new Date(a.posted).getTime() - new Date(b.posted).getTime()
      if (sortBy === "most-applicants")
        return (b._count.applications ?? 0) - (a._count.applications ?? 0)
      return 0
    })


  const activeCount = EmployersPostedJobs.filter((j) => j.status === "active").length
  const totalApplicants = EmployersPostedJobs.reduce((sum, j) => sum + (j._count.applications ?? 0), 0)

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">

      {/* Back */}
      <Link href="/dashboard">
        <Button variant="ghost" className="mb-6 gap-2 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Button>
      </Link>

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Job Listings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage all your posted EmployersPostedJobs
          </p>
        </div>
        <Button className="gap-2 sm:shrink-0" asChild>
          <Link href="/post-job">
            <PlusCircle className="h-4 w-4" />
            Post a New Job
          </Link>
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <p className="text-xs text-muted-foreground mb-1">Total Jobs</p>
          <p className="text-2xl font-bold">{EmployersPostedJobs.length}</p>
        </Card>
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <p className="text-xs text-muted-foreground mb-1">Active</p>
          <p className="text-2xl font-bold text-accent">{activeCount}</p>
        </Card>
        <Card className="p-4 hover:shadow-lg transition-shadow col-span-2 sm:col-span-1">
          <p className="text-xs text-muted-foreground mb-1">Total Applicants</p>
          <p className="text-2xl font-bold">{totalApplicants}</p>
        </Card>
      </div>

      {/* Filter bar — no search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px] bg-secondary/40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[180px] bg-secondary/40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="most-applicants">Most Applicants</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Jobs list */}
      {filtered.length === 0 ? (
        <Card className="p-12 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
            <Briefcase className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-base">No EmployersPostedJobs match this filter</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try a different status filter.
            </p>
          </div>
        </Card>
      ) : (
        <Card className="divide-y divide-border/50">
          {filtered.map((job) => (
            <div
              key={job.id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 hover:bg-secondary/20 transition-colors"
            >
              {/* Icon */}
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>

              {/* Main info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  {/* Title links to applicants list */}
                  <Link href={`/jobs/${job.id}/applicant`}>
                    <h3 className="font-semibold text-sm hover:text-primary transition-colors cursor-pointer">
                      {job.title}
                    </h3>
                  </Link>
                  <Badge className={`${getStatusStyle(job.status)} gap-1 text-xs`}>
                    {getStatusIcon(job.status)}
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  {job.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </span>
                  )}
                  {job.type && (
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {job.type}
                    </span>
                  )}
                  {job.salary && <span>{job.salary}</span>}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                <div className="flex items-center gap-1.5 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">{job._count.applications}</span>
                  <span className="text-muted-foreground text-xs hidden sm:inline">
                    applicants
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Timer className="h-3.5 w-3.5" />
                  {daysLive(job.posted)}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {/* View Applicants — links to applicants list page */}
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent gap-1.5 hidden sm:flex"
                  asChild
                >
                  <Link href={`/jobs/${job.id}/applicant`}>
                    <Users className="h-3.5 w-3.5" />
                    Applicants
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {/* → Applicants list */}
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/jobs/${job.id}/applicant`}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Users className="h-4 w-4" />
                        View Applicants
                      </Link>
                    </DropdownMenuItem>
                    {/* → Public job preview */}
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/jobs/${job.id}`}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Eye className="h-4 w-4" />
                        Preview Listing
                      </Link>
                    </DropdownMenuItem>
                    {/* → Edit job */}
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/dashboard/joblisting/${job.id}/edit`}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit Job
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Result count */}
      {filtered.length > 0 && (
        <p className="text-xs text-muted-foreground text-center mt-4">
          Showing {filtered.length} of {EmployersPostedJobs.length} job{EmployersPostedJobs.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  )
}