"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  Briefcase,
  Building2,
  MapPin,
  Mail,
  DollarSign,
  Tag,
  FileText,
  Star,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { updateJob } from "@/lib/actions"

interface Job {
  id:               string
  title:            string
  company:          string
  location:         string
  description:      string
  responsibilities: string
  requirements:     string
  experienceLevel:  string
  type:             string
  tags:             string[]
  posted:           Date
  email:            string
  featured:         boolean
  benefits:         string
  companySize:      string | null
  industry:         string | null
  founded:          string | null
  logo:             string
  salary:           string
  salaryMin:        number | null
  salaryMax:        number | null
  currency:         string | null
  posterId:         string | null
  updatedAt:        Date
  status:           "ACTIVE" | "CLOSED" | "DRAFT" | null
}

export default function EditJobForm({ job }: { job: Job }) {
  // Select fields need controlled state to work with FormData
  const [type, setType]                   = useState(job.type)
  const [experienceLevel, setExperienceLevel] = useState(job.experienceLevel)
  const [currency, setCurrency]           = useState(job.currency ?? "USD")
 const [status, setStatus]                   = useState<string>(job.status ?? "ACTIVE")
  const [featured, setFeatured]           = useState(String(job.featured))

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href={`/dashboard/jobs/${job.id}`}>
        <Button variant="ghost" className="mb-6 gap-2 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Job
        </Button>
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Job</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update the details for <span className="text-foreground font-medium">{job.title}</span>
        </p>
      </div>

      <form action={updateJob} className="space-y-6">
        {/* Pass job ID */}
        <input type="hidden" name="id" value={job.id} />

        {/* Hidden inputs for Select values */}
        <input type="hidden" name="type"            value={type} />
        <input type="hidden" name="experienceLevel" value={experienceLevel} />
        <input type="hidden" name="currency"        value={currency} />
        <input type="hidden" name="status"          value={status} />
        <input type="hidden" name="featured"        value={featured} />

        {/* ── Basic Info ── */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="h-4 w-4 text-primary" />
            <h2 className="font-semibold text-sm">Basic Information</h2>
          </div>
          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Job Title</Label>
              <Input name="title" defaultValue={job.title} placeholder="e.g. Senior Frontend Developer" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Company</Label>
              <Input name="company" defaultValue={job.company} placeholder="e.g. Acme Corp" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Location</Label>
              <Input name="location" defaultValue={job.location} placeholder="e.g. Lagos, Nigeria" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Contact Email</Label>
              <Input name="email" defaultValue={job.email} type="email" placeholder="hr@company.com" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Job Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="bg-secondary/40">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {["Full-time", "Part-time", "Contract", "Freelance", "Internship"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Experience Level</Label>
              <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                <SelectTrigger className="bg-secondary/40">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {["Junior", "Mid-level", "Senior", "Lead", "Executive"].map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* ── Description ── */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-primary" />
            <h2 className="font-semibold text-sm">Job Details</h2>
          </div>
          <Separator />

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Description</Label>
            <Textarea name="description" defaultValue={job.description} rows={4} className="bg-secondary/40 resize-none" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Responsibilities</Label>
            <Textarea name="responsibilities" defaultValue={job.responsibilities} rows={4} className="bg-secondary/40 resize-none" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Requirements</Label>
            <Textarea name="requirements" defaultValue={job.requirements} rows={4} className="bg-secondary/40 resize-none" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Benefits</Label>
            <Textarea name="benefits" defaultValue={job.benefits} rows={3} className="bg-secondary/40 resize-none" />
          </div>
        </Card>

        {/* ── Salary ── */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <h2 className="font-semibold text-sm">Salary</h2>
          </div>
          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Salary Label</Label>
              <Input name="salary" defaultValue={job.salary} placeholder="e.g. $80k - $100k" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Min (numeric)</Label>
              <Input name="salaryMin" type="number" defaultValue={job.salaryMin ?? ""} placeholder="80000" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Max (numeric)</Label>
              <Input name="salaryMax" type="number" defaultValue={job.salaryMax ?? ""} placeholder="100000" />
            </div>
          </div>

          <div className="w-40 space-y-1.5">
            <Label className="text-xs text-muted-foreground">Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="bg-secondary/40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["USD", "EUR", "GBP", "NGN", "CAD", "AUD"].map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* ── Company Info ── */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-4 w-4 text-primary" />
            <h2 className="font-semibold text-sm">Company Info</h2>
          </div>
          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Industry</Label>
              <Input name="industry" defaultValue={job.industry ?? ""} placeholder="e.g. Fintech" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Company Size</Label>
              <Input name="companySize" defaultValue={job.companySize ?? ""} placeholder="e.g. 50-200" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Founded</Label>
              <Input name="founded" defaultValue={job.founded ?? ""} placeholder="e.g. 2015" />
            </div>
          </div>
        </Card>

        {/* ── Tags & Settings ── */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="h-4 w-4 text-primary" />
            <h2 className="font-semibold text-sm">Tags & Settings</h2>
          </div>
          <Separator />

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Tags <span className="opacity-60">(comma separated)</span>
            </Label>
            <Input name="tags" defaultValue={job.tags.join(", ")} placeholder="e.g. React, Remote, TypeScript" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="bg-secondary/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Star className="h-3 w-3" /> Featured
              </Label>
              <Select value={featured} onValueChange={setFeatured}>
                <SelectTrigger className="bg-secondary/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* ── Submit ── */}
        <div className="flex gap-3 justify-end pb-8">
          <Link href={`/dashboard/jobs/${job.id}`}>
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" className="px-8">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}