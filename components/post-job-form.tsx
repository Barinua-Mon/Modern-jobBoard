"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Plus, X, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CreateJob } from "@/lib/actions"

export function PostJobForm() {
  const router = useRouter()
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [type, setType] = useState("")
  const [experienceLevel, setExpereinceLevel] = useState("")
  const [industry, setIndustry] = useState("")
  const [companySize, setCompanySize] = useState("")

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }
  

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <Link href="/">
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Post a Job</h1>
        <p className="text-muted-foreground">Find the perfect candidate for your team</p>
      </div>

      <form action={CreateJob}>
        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Basic Information</h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input name="title" placeholder="e.g. Senior Full Stack Developer" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name *</Label>
                  <Input name="company" placeholder="Your company name" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input name="location" placeholder="e.g. San Francisco, CA or Remote" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="type">Job Type *</Label>
                  <Select value={type} onValueChange={setType} required>
                    <SelectTrigger name="type">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                  <input type="hidden" name="type" value={type}/>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary">Salary Range *</Label>
                  <Input name="salary" placeholder="e.g. $120k - $180k" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experienceLevel">Experience Level *</Label>
                  <Select value={experienceLevel} onValueChange={setExpereinceLevel} required>
                    <SelectTrigger name="experienceLevel">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Entry</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                    </SelectContent>
                  </Select>
                   <input type="hidden" name="experienceLevel" value={experienceLevel}/>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Industry *</Label>
                <Select value={industry} onValueChange={setIndustry} required>
                  <SelectTrigger name="industry">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="medicine">Medicine</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" name="industry" value={industry} />
              </div>
            </div>
          </Card>

          {/* Job Description */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Job Description</h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description">About the Role *</Label>
                <Textarea
                  name="description"
                  placeholder="Describe the role, what the candidate will be doing, and what makes this opportunity exciting..."
                  className="min-h-32"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsibilities">Responsibilities *</Label>
                <Textarea
                  name="responsibilities"
                  placeholder="List the key responsibilities (one per line)..."
                  className="min-h-32"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements *</Label>
                <Textarea
                  name="requirements"
                  placeholder="List the required qualifications and skills (one per line)..."
                  className="min-h-32"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits & Perks</Label>
                <Textarea
                  name="benefits"
                  placeholder="List the benefits and perks (one per line)..."
                  className="min-h-24"
                />
              </div>
            </div>
          </Card>

          {/* Skills & Tags */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Skills & Tags</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tags">Required Skills</Label>
                <div className="flex gap-2">
                  <Input
                    name="tags"
                    placeholder="e.g. React, Node.js, TypeScript"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-2">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <input type="hidden" name="tag" value={tags.join(",")} />
            </div>
          </Card>

          {/* Company Information */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Company Information</h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company-description">About Your Company</Label>
                <Textarea
                  name="company-description"
                  placeholder="Tell candidates about your company, mission, and culture..."
                  className="min-h-24"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company-size">Company Size</Label>
                  <Select value={companySize} onValueChange={setCompanySize}>
                    <SelectTrigger name="company-size">
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="501-1000">501-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                  <input type="hidden" name="company-size" value={companySize}/>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Company Website</Label>
                  <Input name="website" type="url" placeholder="https://yourcompany.com" />
                </div>
              </div>
            </div>
          </Card>

          {/* Application Details */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Application Details</h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Application Email *</Label>
                <Input name="email" type="email" placeholder="jobs@yourcompany.com" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apply-url">Application URL (Optional)</Label>
                <Input name="apply-url" type="url" placeholder="https://yourcompany.com/careers/apply" />
              </div>
            </div>
          </Card>

          <Separator />

          {/* Pricing */}
          <Card className="p-8 glass-effect border-primary/30">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Featured Job Listing</h3>
                <p className="text-muted-foreground mb-4">
                  Get 3x more visibility with a featured listing. Your job will appear at the top of search results and
                  on the homepage.
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">$299</span>
                  <span className="text-muted-foreground">for 30 days</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Publishing..." : "Publish Job"}
            </Button>
            <Button type="button" variant="outline" size="lg" className="flex-1 bg-transparent" asChild>
              <Link href="/">Cancel</Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
