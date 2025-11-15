"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Building2, MapPin, Users, Calendar, Globe, Linkedin, Twitter, ArrowLeft, Briefcase, Heart } from "lucide-react"
import Link from "next/link"

// Mock company data
const companyData: Record<string, any> = {
  techcorp: {
    name: "TechCorp",
    logo: "🚀",
    tagline: "Building the future of technology",
    description:
      "TechCorp is a leading technology company focused on creating innovative solutions that transform how people work and live. With a team of world-class engineers and designers, we're pushing the boundaries of what's possible.",
    industry: "Technology",
    size: "500-1000 employees",
    founded: "2015",
    location: "San Francisco, CA",
    website: "https://techcorp.com",
    social: {
      linkedin: "https://linkedin.com/company/techcorp",
      twitter: "https://twitter.com/techcorp",
    },
    culture: [
      "Innovation-driven environment",
      "Work-life balance",
      "Continuous learning opportunities",
      "Diverse and inclusive workplace",
      "Remote-friendly culture",
    ],
    benefits: [
      "Competitive salary and equity",
      "Health, dental, and vision insurance",
      "401(k) matching",
      "Unlimited PTO",
      "Professional development budget",
      "Home office stipend",
    ],
    openPositions: [
      {
        id: 1,
        title: "Senior Full Stack Developer",
        department: "Engineering",
        location: "San Francisco, CA",
        type: "Full-time",
        posted: "2 days ago",
      },
      {
        id: 2,
        title: "Product Designer",
        department: "Design",
        location: "Remote",
        type: "Full-time",
        posted: "1 week ago",
      },
      {
        id: 3,
        title: "DevOps Engineer",
        department: "Engineering",
        location: "San Francisco, CA",
        type: "Full-time",
        posted: "3 days ago",
      },
    ],
    gallery: ["🎨", "💻", "🏢", "🎉"],
  },
}

export function CompanyProfile({ companySlug }: { companySlug: string }) {
  const [isFollowing, setIsFollowing] = useState(false)
  const company = companyData[companySlug] || companyData.techcorp

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/">
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Button>
      </Link>

      {/* Company Header */}
      <Card className="p-8 mb-8 glass-effect">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-secondary flex items-center justify-center text-5xl">
              {company.logo}
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{company.name}</h1>
              <p className="text-xl text-muted-foreground">{company.tagline}</p>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                {company.industry}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                {company.size}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {company.location}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Founded {company.founded}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button className="gap-2" onClick={() => setIsFollowing(!isFollowing)}>
                <Heart className={`h-4 w-4 ${isFollowing ? "fill-current" : ""}`} />
                {isFollowing ? "Following" : "Follow Company"}
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent" asChild>
                <a href={company.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4" />
                  Website
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href={company.social.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href={company.social.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Company Content Tabs */}
      <Tabs defaultValue="about" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="jobs">
            Jobs <Badge className="ml-2">{company.openPositions.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="culture">Culture</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
        </TabsList>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-6">
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">About {company.name}</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">{company.description}</p>

            <Separator className="my-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Industry</h3>
                <p className="text-muted-foreground">{company.industry}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Company Size</h3>
                <p className="text-muted-foreground">{company.size}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Headquarters</h3>
                <p className="text-muted-foreground">{company.location}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Founded</h3>
                <p className="text-muted-foreground">{company.founded}</p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Company Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {company.gallery.map((item: string, index: number) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg bg-secondary flex items-center justify-center text-6xl hover:scale-105 transition-transform cursor-pointer"
                >
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Jobs Tab */}
        <TabsContent value="jobs" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Open Positions</h2>
              <Badge variant="secondary">{company.openPositions.length} jobs available</Badge>
            </div>

            <div className="space-y-4">
              {company.openPositions.map((job: any) => (
                <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <Link href={`/jobs/${job.id}`}>
                        <h3 className="text-xl font-semibold hover:text-primary transition-colors cursor-pointer">
                          {job.title}
                        </h3>
                      </Link>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {job.department}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Posted {job.posted}
                        </div>
                      </div>
                      <Badge variant="secondary">{job.type}</Badge>
                    </div>
                    <Button asChild>
                      <Link href={`/jobs/${job.id}`}>View Job</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Culture Tab */}
        <TabsContent value="culture">
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Our Culture</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {company.culture.map((item: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <p className="text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Benefits Tab */}
        <TabsContent value="benefits">
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Benefits & Perks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {company.benefits.map((item: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2" />
                  <p className="text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
