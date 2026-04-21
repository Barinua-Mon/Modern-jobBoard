"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, DollarSign, Bookmark, ExternalLink, Briefcase, CheckCircle2 } from "lucide-react"
import Link from "next/link";
import { Job } from '@/components/job-list'
import { ApplyJob } from "@/lib/actions"
import { ApplyButton } from "./apply-action"
import { SaveButton } from "./save-button"
import { useSignIn } from "./sign-in-trigger"



export function JobCard({ job, index, hasApplied, userId, initialSaved, userRole }:
  { job: Job; index: number; hasApplied: boolean, userId?: string | null, initialSaved: boolean, userRole?: string }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const {openSignIn} = useSignIn()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 100)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [index])

  return (
    <Card
      ref={ref}
      className={`p-6 hover:shadow-xl transition-all duration-500 group relative overflow-hidden ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
        } ${job.featured ? "border-primary/50" : ""}`}
    >
      {job.featured && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
          Featured
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform text-3xl">
            {job.logo ?? "💼"}
          </div>
        </div>

        {/* Job Details */}
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{job.title}</h3>
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
            <div className="flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              {job.experienceLevel}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {job.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className={`flex md:flex-col gap-2 items-start ${job.featured ? "md:mt-6" : ""}`}>
          {!userId ? (
            // 👇 Guest user
            // ""
              <Button onClick={openSignIn} className=" text-primary-foreground hover:bg-primary/90 font-medium shadow-sm cursor-pointer">Sign in to apply</Button>
            
          ) : userRole === "Applicant" ? (
            <>
              <SaveButton
                jobId={job.id}
                initialSaved={initialSaved}
                userId={userId}
              />

              {hasApplied ? (
                <Button
                  disabled
                  variant="outline"
                  className="flex-1 md:flex-none gap-2 text-green-500 border-green-500/30"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Applied
                </Button>
              ) : (
                <ApplyButton
                  posterId={job.posterId!}
                  jobId={job.id}
                  jobTitle={job.title}
                />
              )}
            </>
          ) : null}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
        <span>Posted {new Date(job.posted).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        })}</span>
        <Link href={`/jobs/${job.id}`} className="text-primary hover:underline">
          View Details →
        </Link>
      </div>
    </Card>
  )
}
