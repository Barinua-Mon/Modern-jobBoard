"use client"

import { useActionState, useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  Mail,
  FileText,
  Download,
  CalendarCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Video,
  Phone,
  MapPin,
  Sparkles,
  User,
  CircleDot,
  Send,
  Loader2,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { InviteForInterview } from "@/lib/actions"
import { toast } from "sonner"

// ── Mock data (same applicants as applicants-page) ────────────────────────────

interface UserApplications {
  id: string
  status: string
  createdAt: Date
  interviewDate: Date | null
  interviewType: string | null
  jobId: string
  applicant: {
    id: string
    name: string | null
    email: string | null
    image: string | null
    bio: string | null
    skills: string[]
    resume: string | null
  }
}

interface JobTitle { title: string }

// ── Helpers ───────────────────────────────────────────────────────────────────

const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending": return "bg-blue-500/20 text-blue-500 border-blue-500/30"
    case "interview": return "bg-accent/20 text-accent border-accent/30"
    case "rejected": return "bg-destructive/20 text-destructive border-destructive/30"
    case "hired": return "bg-green-500/20 text-green-500 border-green-500/30"
    default: return "bg-secondary text-muted-foreground"
  }
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending": return <Clock className="h-3 w-3" />
    case "interview": return <CheckCircle2 className="h-3 w-3" />
    case "rejected": return <XCircle className="h-3 w-3" />
    case "hired": return <CheckCircle2 className="h-3 w-3" />
    default: return <CircleDot className="h-3 w-3" />
  }
}

const getInterviewIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "video": return <Video className="h-4 w-4" />
    case "phone": return <Phone className="h-4 w-4" />
    case "inperson": return <MapPin className="h-4 w-4" />
    default: return <CalendarCheck className="h-4 w-4" />
  }
}

const initials = (name: string | null) =>
  name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "??"

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  })

const formatTime = (date: Date) =>
  new Date(date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })

// ── Component ─────────────────────────────────────────────────────────────────

export default function ApplicantDetailPage({ applicationUserDetail, jobTitle }: { applicationUserDetail: UserApplications, jobTitle: JobTitle }) {
  const params = useParams();
  const jobId = params.id as string;

  const [state, formAction, isPending] = useActionState(InviteForInterview, null)

   useEffect(()=>{
    if(!state) return;

    if(state.success){
      toast.success(state.message)
    }else{
      toast.error(state.message)
    }
  },[state])


  // Interview form
  const [interviewDate, setInterviewDate] = useState("")
  const [interviewTime, setInterviewTime] = useState("")
  const [interviewType, setInterviewType] = useState("")
  
  // Optimistic status
  const [currentStatus, setCurrentStatus] = useState(applicationUserDetail?.status ?? "pending")


  // 404-style fallback
  if (!applicationUserDetail) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href={`/jobs/${jobId}/applicant`}>
          <Button variant="ghost" className="mb-6 gap-2 -ml-2 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Applicants
          </Button>
        </Link>
        <Card className="p-12 flex flex-col items-center justify-center text-center gap-4">
          <p className="font-semibold">Applicant not found</p>
          <p className="text-sm text-muted-foreground">
            This application may have been removed.
          </p>
        </Card>
      </div>
    )
  }

  const { applicant } = applicationUserDetail;
  const { title } = jobTitle;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">

      {/* Back → applicants list */}
      <Link href={`/jobs/${jobId}/applicant`}>
        <Button variant="ghost" className="mb-6 gap-2 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Applicants
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: profile ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Profile card */}
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary shrink-0 overflow-hidden">
                {applicant.image ? (
                  <img src={applicant.image} alt={applicant.name ?? ""} className="w-full h-full object-cover" />
                ) : (
                  initials(applicant.name)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-xl font-bold">{applicant.name ?? "Unknown"}</h1>
                  <Badge className={`${getStatusStyle(currentStatus)} gap-1 text-xs`}>
                    {getStatusIcon(currentStatus)}
                    {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {applicant.email}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Applied for:{" "}
                  <span className="text-foreground font-medium">{title}</span>
                  {" · "}
                  {formatDate(applicationUserDetail.createdAt)}
                </p>
              </div>
            </div>

            <Separator className="mb-5" />

            {/* Bio */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-sm">About</h2>
              </div>
              {applicant.bio ? (
                <p className="text-sm text-muted-foreground leading-relaxed">{applicant.bio}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">No bio provided.</p>
              )}
            </div>

            {/* Skills */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-sm">Skills</h2>
              </div>
              {applicant.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {applicant.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-sm px-3 py-0.5">
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No skills listed.</p>
              )}
            </div>
          </Card>

          {/* Resume */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-4 w-4 text-primary" />
              <h2 className="font-semibold text-sm">Resume</h2>
            </div>
            {applicant.resume ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-lg border border-border bg-secondary/30 px-4 py-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {decodeURIComponent(applicant.resume.split("/").pop() ?? "resume")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">PDF / DOC document</p>
                </div>
                <a href={applicant.resume} target="_blank" rel="noopener noreferrer" download>
                  <Button variant="outline" size="sm" className="gap-1.5 bg-transparent shrink-0">
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </Button>
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border border-dashed border-border px-4 py-5 text-muted-foreground">
                <FileText className="h-5 w-5 shrink-0" />
                <p className="text-sm">No resume uploaded by this applicant.</p>
              </div>
            )}
          </Card>

          {/* Existing interview details */}
          {applicationUserDetail.interviewDate && (
            <Card className="p-6 border-accent/30 bg-accent/5">
              <div className="flex items-center gap-2 mb-4">
                <CalendarCheck className="h-4 w-4 text-accent" />
                <h2 className="font-semibold text-sm text-accent">Interview Scheduled</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Date</p>
                  <p className="text-sm font-medium">{formatDate(applicationUserDetail.interviewDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Time</p>
                  <p className="text-sm font-medium">{formatTime(applicationUserDetail.interviewDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Type</p>
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    {applicationUserDetail.interviewType && getInterviewIcon(applicationUserDetail.interviewType)}
                    {applicationUserDetail.interviewType}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* ── Right: actions ── */}
        <div className="space-y-5">
          {/* Interview invite */}

          <form action={formAction}>
            <input type="hidden" name="applicationId" value={applicationUserDetail.id} />

            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <CalendarCheck className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-sm">
                  {applicationUserDetail.status === "INTERVIEW"
                    ? "Update Interview"
                    : "Invite to Interview"}
                </h2>
              </div>
              <Separator className="mb-4" />

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Interview Type</Label>
                  <Select value={interviewType} onValueChange={setInterviewType}>
                    <SelectTrigger className="bg-secondary/40 w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VIDEO">
                        <span className="flex items-center gap-2">
                          <Video className="h-3.5 w-3.5" /> Video Call
                        </span>
                      </SelectItem>
                      <SelectItem value="PHONE">
                        <span className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5" /> Phone Call
                        </span>
                      </SelectItem>
                      <SelectItem value="PHYSICAL">
                        <span className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5" /> In Person
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <input type="hidden" name="interviewType" value={interviewType} />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" /> Date
                  </Label>
                  <input
                    type="date"
                    name="interviewDate"
                    value={interviewDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-secondary/40 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3 w-3" /> Time
                  </Label>
                  <input
                    type="time"
                    name="interviewTime"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-secondary/40 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full gap-2 mt-1"
                  disabled={!interviewDate || !interviewTime || !interviewType || isPending}
                >
                  <Send className="h-4 w-4" />
                  {applicationUserDetail.status === "INTERVIEW" ? "Update Invite" : "Send Invite"}
                </Button>
              </div>
            </Card>
          </form>

          {/* Status actions */}
          <Card className="p-5">
            <h2 className="font-semibold text-sm mb-4">Update Status</h2>
            <Separator className="mb-4" />
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 bg-transparent text-green-500 border-green-500/30 hover:bg-green-500/10 hover:text-green-500"
                onClick={() => setCurrentStatus("hired")}
                disabled={currentStatus === "hired"}
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark as Hired
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 bg-transparent text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setCurrentStatus("rejected")}
                disabled={currentStatus === "rejected"}
              >
                <XCircle className="h-4 w-4" />
                Reject Applicant
              </Button>
            </div>
          </Card>

        </div>
      </div>
    </div>
  )
}