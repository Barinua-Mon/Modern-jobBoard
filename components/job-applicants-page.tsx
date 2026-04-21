"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  CircleDot,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// ── Types ─────────────────────────────────────────────────────────────────────

// Mirrors Prisma ApplicationStatus enum
type ApplicationStatus = "under_review" | "interview" | "hired" | "rejected"

// Mirrors Prisma InterviewType enum (extend as needed)
type InterviewType = "VIDEO" | "PHYSICAL" | "PHONE"

interface ApplicantRow {
  id: string                  // application id — used in URL
  status: "under_review" | "interview" | "hired" | "rejected"
  createdAt: Date
  interviewDate: Date | null
  interviewType: "video" | "physical" | "phone"
  applicant: {                // matches User model (via Application.applicant relation)
    id: string
    name: string | null
    email: string | null
    image: string | null
    bio: string | null
    skills: string[]          // String[] on User
    resume: string | null
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const getStatusStyle = (status: ApplicationStatus) => {
  switch (status) {
    case "under_review": return "bg-blue-500/20 text-blue-500 border-blue-500/30"
    case "interview":    return "bg-accent/20 text-accent border-accent/30"
    case "rejected":     return "bg-destructive/20 text-destructive border-destructive/30"
    case "hired":        return "bg-green-500/20 text-green-500 border-green-500/30"
    default:             return "bg-secondary text-muted-foreground"
  }
}

const getStatusIcon = (status: ApplicationStatus) => {
  switch (status) {
    case "under_review": return <Clock className="h-3 w-3" />
    case "interview":    return <CheckCircle2 className="h-3 w-3" />
    case "rejected":     return <XCircle className="h-3 w-3" />
    case "hired":        return <CheckCircle2 className="h-3 w-3" />
    default:             return <CircleDot className="h-3 w-3" />
  }
}

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  under_review: "Under Review",
  interview:    "Interview",
  rejected:     "Rejected",
  hired:        "Hired",
}

const timeAgo = (date: Date) => {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24))
  if (diff === 0) return "Today"
  if (diff === 1) return "Yesterday"
  return `${diff} days ago`
}

const initials = (name: string | null) =>
  name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "??"

// ── Constants ─────────────────────────────────────────────────────────────────

const ALL_STATUSES = ["ALL", "under_review", "interview", "hired", "rejected"] as const
type FilterValue = typeof ALL_STATUSES[number]

const JOB_TITLES: Record<string, string> = {
  "cmmwiz9zo0000psp7bjhanqld": "Senior Frontend Developer",
  "cmmwiz9zo0001psp7bjhanqle": "Product Designer",
  "cmmwiz9zo0002psp7bjhanqlf": "Backend Engineer",
  "cmmwiz9zo0003psp7bjhanqlg": "DevOps Engineer",
  "cmmwiz9zo0004psp7bjhanqlh": "Mobile Developer (React Native)",
  "cmmwiz9zo0005psp7bjhanqli": "QA Engineer",
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ApplicantsPage({ application }: { application: ApplicantRow[] }) {
  const params   = useParams()
  const jobId    = params.id as string
  const jobTitle = JOB_TITLES[jobId] ?? "Applicants"

  const [statusFilter, setStatusFilter] = useState<FilterValue>("ALL")

  const counts: Record<FilterValue, number> = {
    ALL:          application.length,
    under_review: application.filter((a) => a.status === "under_review").length,
    interview:    application.filter((a) => a.status === "interview").length,
    hired:        application.filter((a) => a.status === "hired").length,
    rejected:     application.filter((a) => a.status === "rejected").length,
  }

  const filtered = statusFilter === "ALL"
    ? application
    : application.filter((a) => a.status === statusFilter)

  const filterLabel = (s: FilterValue) =>
    s === "ALL" ? "All" : STATUS_LABEL[s as ApplicationStatus]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">

      {/* Back → application listings */}
      <Link href="/dashboard/joblisting">
        <Button variant="ghost" className="mb-6 gap-2 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Listings
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{jobTitle}</h1>
        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {application.length} applicant{application.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              statusFilter === s
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-secondary/40 text-muted-foreground border-border hover:bg-secondary"
            }`}
          >
            {filterLabel(s)}{" "}
            <span className="opacity-70">({counts[s]})</span>
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <Card className="p-12 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold">No applicants match</p>
            <p className="text-sm text-muted-foreground mt-1">Try a different filter.</p>
          </div>
        </Card>
      ) : (
        <Card className="divide-y divide-border/50">
          {filtered.map((item) => (
            <Link
              key={item.id}
              href={`/jobs/${jobId}/applicant/${item.id}`}
              className="flex items-center gap-4 px-5 py-4 hover:bg-secondary/20 transition-colors group"
            >
              {/* Avatar — uses User.image */}
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0 overflow-hidden">
                {item.applicant.image ? (
                  <img
                    src={item.applicant.image}
                    alt={item.applicant.name ?? ""}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials(item.applicant.name)
                )}
              </div>

              {/* Info — uses User.name, User.email, User.skills */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">
                  {item.applicant.name ?? "Unknown"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {item.applicant.email}
                </p>
                {item.applicant.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {item.applicant.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-[10px] px-1.5 py-0">
                        {skill}
                      </Badge>
                    ))}
                    {item.applicant.skills.length > 3 && (
                      <span className="text-[10px] text-muted-foreground self-center">
                        +{item.applicant.skills.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Status + date — uses Application.status (enum) & Application.createdAt */}
              <div className="text-right shrink-0">
                <Badge className={`${getStatusStyle(item.status)} gap-1 text-xs mb-1`}>
                  {getStatusIcon(item.status)}
                  {STATUS_LABEL[item.status]}
                </Badge>
                <p className="text-xs text-muted-foreground">{timeAgo(item.createdAt)}</p>
                {/* Show interview date when status is interview */}
                {item.status === "interview" && item.interviewDate && (
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {new Date(item.interviewDate).toLocaleDateString()}
                    {item.interviewType ? ` · ${item.interviewType}` : ""}
                  </p>
                )}
              </div>

              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </Link>
          ))}
        </Card>
      )}

      {filtered.length > 0 && (
        <p className="text-xs text-muted-foreground text-center mt-4">
          Showing {filtered.length} of {application.length} applicant{application.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  )
}