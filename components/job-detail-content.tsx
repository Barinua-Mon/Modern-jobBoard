"use client"

import { useState } from "react"
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

// Mock data - in a real app, this would come from an API
const jobData: Record<string, any> = {
  "1": {
    id: 1,
    title: "Senior Full Stack Developer",
    company: "TechCorp",
    logo: "🚀",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120k - $180k",
    tags: ["React", "Node.js", "TypeScript", "AWS"],
    posted: "2 days ago",
    featured: true,
    description: `We're looking for an experienced Full Stack Developer to join our growing team. You'll be working on cutting-edge web applications that serve millions of users worldwide.`,
    responsibilities: [
      "Design and develop scalable web applications using React and Node.js",
      "Collaborate with cross-functional teams to define and implement new features",
      "Write clean, maintainable, and well-documented code",
      "Participate in code reviews and mentor junior developers",
      "Optimize applications for maximum speed and scalability",
    ],
    requirements: [
      "5+ years of experience in full-stack development",
      "Strong proficiency in React, Node.js, and TypeScript",
      "Experience with cloud platforms (AWS, Azure, or GCP)",
      "Excellent problem-solving and communication skills",
      "Bachelor's degree in Computer Science or related field",
    ],
    benefits: [
      "Competitive salary and equity package",
      "Health, dental, and vision insurance",
      "Flexible work hours and remote options",
      "Professional development budget",
      "Unlimited PTO",
    ],
    companySize: "500-1000 employees",
    industry: "Technology",
    founded: "2015",
  },
}

export function JobDetailContent({ jobId }: { jobId: string }) {
  const [isSaved, setIsSaved] = useState(false)
  const job = jobData[jobId] || jobData["1"]

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
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-xl bg-secondary flex items-center justify-center text-4xl">
                  {job.logo}
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
                    Posted {job.posted}
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
              {job.responsibilities.map((item: string, index: number) => (
                <li key={index} className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Requirements */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Requirements</h2>
            <ul className="space-y-3">
              {job.requirements.map((item: string, index: number) => (
                <li key={index} className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Benefits */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Benefits & Perks</h2>
            <ul className="space-y-3">
              {job.benefits.map((item: string, index: number) => (
                <li key={index} className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Apply Card */}
          <Card className="p-6 glass-effect sticky top-24">
            <div className="space-y-4">
              <Button className="w-full" size="lg">
                Apply for this Position
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2 bg-transparent" onClick={() => setIsSaved(!isSaved)}>
                  <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                  {isSaved ? "Saved" : "Save"}
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
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
            <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
              <Link href={`/companies/${job.company.toLowerCase()}`}>View Company Profile</Link>
            </Button>
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
