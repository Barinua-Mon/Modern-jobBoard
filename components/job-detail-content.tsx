
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Clock,
  DollarSign,
  Bookmark,
  Share2,
  Building2,
  Users,
  Calendar,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { Job } from "./job-list"
import prisma from "@/lib/prisma"
import { ApplyJob, saveJob } from "@/lib/actions"
import { auth } from "@/lib/auth"
import { SaveButton } from "./save-button"
import { ShareButton } from "./share-button"
import { ApplyButton } from "./apply-action"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail } from "lucide-react"
import { SignInToApplyButton } from "./signin-in-apply-button"



export default async function JobDetailContent({ job }: { job: Job }) {
  const session = await auth();
  const userId = session?.user?.id;
  const jobId = job.id;
  const jobTitle = job.title;

  // Fetch full user to get role
  const user = userId
    ? await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })
    : null;

  const isApplicant = user?.role === "Applicant" || !user; // treat logged-out as applicant view

  // Only fetch save/apply state if applicant
  const savedJob =
    isApplicant && userId
      ? await prisma.savedJob.findUnique({
        where: { userId_jobId: { userId, jobId } },
      })
      : null;
  const isSaved = !!savedJob;

  const applied =
    isApplicant && userId
      ? await prisma.application.findUnique({
        where: { applicantId_jobId: { applicantId: userId, jobId } },
      })
      : null;
  const isApplied = !!applied;


  // Only fetch applicants if employer
  const applicants =
    !isApplicant
      ? await prisma.application.findMany({
        where: { jobId },
        include: {
          applicant: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              bio: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
      : [];


  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-blue-500/20 text-blue-500 border-blue-500/30"
      case "interview": return "bg-accent/20 text-accent border-accent/30"
      case "rejected": return "bg-destructive/20 text-destructive border-destructive/30"
      case "hired": return "bg-green-500/20 text-green-500 border-green-500/30"
      default: return "bg-secondary"
    }
  }



  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/">
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header */}
          <Card className="p-8 glass-effect">
            <div className="flex flex-col md:flex-row gap-6">
              {/*Company Logo */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform text-3xl">
                  {job.logo ?? "💼"}
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  {job.featured && (
                    <Badge className="mb-2 bg-primary/20 text-primary border-primary/30">Featured Job</Badge>
                  )}
                  <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                  <p className="text-xl text-muted-foreground">{job.company}</p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {job.type}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    {job.salary}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Posted {new Date(job.posted).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Job Description */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">About the Role</h2>
            <p className="text-muted-foreground leading-relaxed">{job.description}</p>
          </Card>

          {/* Responsibilities */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Responsibilities</h2>
            <ul className="space-y-3">
              {job.responsibilities /*.map((item: string, index: number) => (
                <li key={index} className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))*/}
            </ul>
          </Card>

          {/* Requirements */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Requirements</h2>
            <ul className="space-y-3">
              {job.requirements/*.map((item: string, index: number) => (
                <li key={index} className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))*/}
            </ul>
          </Card>

          {/* Benefits */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Benefits & Perks</h2>
            <ul className="space-y-3">
              {job.benefits/*.map((item: string, index: number) => (
                <li key={index} className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))*/}
            </ul>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Apply Card */}
          {/* Apply Card */}
          <Card className="p-6 glass-effect sticky top-24">
            {isApplicant ? (
              // ── Applicant view ──
              <div className="space-y-4">
                {!userId ? (
                  // Guest user
                  <SignInToApplyButton />
                ) : (
                  <>
                    <ApplyButton posterId={job.posterId!} jobId={job.id} jobTitle={job.title} />
                    <div className="flex gap-2">
                      <SaveButton jobId={jobId} initialSaved={isSaved} userId={userId} />
                      <ShareButton jobId={jobId} jobTitle={jobTitle} />
                    </div>
                  </>
                )}
              </div>
            ) : (
              // ── Employer view ──
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Applicants</h3>
                  <Badge variant="secondary">{applicants.length}</Badge>
                </div>

                {applicants.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">No applicants yet</p>
                    <p className="text-xs text-muted-foreground">
                      Share this listing to attract candidates.
                    </p>
                    <ShareButton jobId={jobId} jobTitle={jobTitle} />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {applicants.map((app) => (
                      <Link
                        key={app.id}
                        href={`/jobs/${jobId}/applicant/${app.id}`}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors group"
                      >
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                          {app.applicant.image ? (
                            <img
                              src={app.applicant.image}
                              alt={app.applicant.name ?? "Applicant"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-lg">👤</span>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                            {app.applicant.name ?? "Unknown"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                            <Mail className="h-3 w-3 shrink-0" />
                            {app.applicant.email}
                          </p>
                        </div>

                        {/* Status badge */}
                        <Badge className={`${getStatusColor(app.status)} text-xs shrink-0`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </Badge>
                      </Link>
                    ))}

                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Company Info */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">About {job.company}</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Industry</p>
                  <p className="font-medium">{job.industry}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Company Size</p>
                  <p className="font-medium">{job.companySize}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Founded</p>
                  <p className="font-medium">{job.founded}</p>
                </div>
              </div>
            </div>
            
          </Card>

          {/* Similar Jobs */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Similar Jobs</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="pb-4 border-b border-border/40 last:border-0 last:pb-0">
                  <h4 className="font-medium mb-1 hover:text-primary cursor-pointer transition-colors">
                    Frontend Developer
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">StartupXYZ</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    Remote
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
