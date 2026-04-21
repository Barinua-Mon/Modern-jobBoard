"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Clock, DollarSign, ExternalLink, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { removeJob } from "@/lib/actions"


export interface SavedJobInterface {
  id: string
  savedAt: Date
  jobId: string
  userId: string

  job: {
    id: string
    title: string
    company: string
    location: string
    description: string
    responsibilities: string
    requirements: string
    experienceLevel: string
    type: string
    tags: string[]
    posted: Date
    email: string
    featured: boolean
    benefits: string
    companySize?: string | null
    industry?: string | null
    founded?: string | null
    logo: string
    salary: string
    salaryMin?: number | null
    salaryMax?: number | null
    currency?: string | null
    posterId?: string | null
    updatedAt: Date

    applications: {
      id: string
      applicantId: string
      jobId: string
      createdAt: Date
      updatedAt: Date
    }[]
  }
}

export interface SavedJobUI {
  id: string
  jobId: string
  title: string
  company: string
  location: string
  type: string
  salary: string
  tags: string[]
  posted: Date
  logo: string
  featured: boolean

  savedDate: Date
  status: "active" | "applied"
}

export function SavedJobsList({initialSavedJobs}: {initialSavedJobs:SavedJobInterface[] }) {
  const [savedJobs, setSavedJobs] = useState<SavedJobUI[]>(() => initialSavedJobs.map((item)=>({
    jobId: item.jobId,
    savedDate: item.savedAt,
    status: item.job.applications.length > 0 ? "applied" : "active",
    ...item.job
  })))

  const [activeTab, setActiveTab] = useState("all");

  const handleRemovedJob = async (jobId: string)=>{
      // 1) Store previous state for role back
      const previousJobs = savedJobs;

      //2) Optimistically update UI
      setSavedJobs((prev)=> prev.filter((job)=> job.jobId !== jobId));

      try{
        //3) Call server action
        await removeJob(jobId)
      }catch(err){
        //4) Fallback to original job if operation fails
        setSavedJobs(previousJobs);
        console.error("failed to remove job:", err)
      }
  }


  const filteredJobs =
    activeTab === "all" ? savedJobs : savedJobs.filter((job) => job.status === activeTab)

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
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Saved Jobs</h1>
        <p className="text-muted-foreground">
          You have {savedJobs.length} saved {savedJobs.length === 1 ? "job" : "jobs"}
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            All <Badge className="ml-2">{savedJobs.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="active">
            Active <Badge className="ml-2">{savedJobs.filter((j) => j.status === "active").length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="applied">
            Applied <Badge className="ml-2">{savedJobs.filter((j) => j.status === "applied").length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredJobs.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-2">No saved jobs yet</h3>
              <p className="text-muted-foreground mb-6">Start saving jobs to keep track of opportunities you like</p>
              <Button asChild>
                <Link href="/">Browse Jobs</Link>
              </Button>
            </Card>
          ) : (
            filteredJobs.map((job) => (
              <Card key={job.id} className="p-6 hover:shadow-xl transition-all group relative overflow-hidden">
                {job.featured && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
                    Featured
                  </div>
                )}

                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Company Logo */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                      {job.logo}
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <Link href={`/jobs/${job.id}`}>
                        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors cursor-pointer">
                          {job.title}
                        </h3>
                      </Link>
                      <p className="text-muted-foreground">{job.company}</p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {job.salary}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {job.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                      <span>Posted {new Date(job.posted).toLocaleDateString("en-US",{
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })}</span>
                      <span>•</span>
                      <span>Saved {new Date(job.savedDate).toLocaleDateString("en-US",{
                        year: "numeric",
                        month:"short",
                        day:"numeric"
                      })}</span>
                      {job.status === "applied" && (
                        <>
                          <span>•</span>
                          <Badge variant="outline" className="text-xs">
                            Applied
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2 items-start">
                    <Button variant="ghost" size="icon" onClick={() => handleRemovedJob(job.jobId)} className="text-destructive">
                      <Trash2 className="h-5 w-5" />
                    </Button>
                    <Button className="flex-1 lg:flex-none gap-2" asChild>
                      <Link href={`/jobs/${job.id}`}>
                        View Job
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      {filteredJobs.length > 0 && (
        <Card className="p-6 mt-8 glass-effect">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold mb-1">Looking for more opportunities?</h3>
              <p className="text-sm text-muted-foreground">Browse thousands of jobs from top companies</p>
            </div>
            <Button asChild>
              <Link href="/">Browse All Jobs</Link>
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
