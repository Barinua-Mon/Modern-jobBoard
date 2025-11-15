"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, DollarSign, Bookmark, ExternalLink } from "lucide-react"
import Link from "next/link"

interface Job {
  id: number
  title: string
  company: string
  logo: string
  location: string
  type: string
  salary: string
  tags: string[]
  posted: string
  featured: boolean
}

export function JobCard({ job, index }: { job: Job; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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
      className={`p-6 hover:shadow-xl transition-all duration-500 cursor-pointer group relative overflow-hidden ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
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
          <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
            {job.logo}
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
        <div className="flex md:flex-col gap-2 items-start">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSaved(!isSaved)}
            className={isSaved ? "text-primary" : ""}
          >
            <Bookmark className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
          </Button>
          <Button className="flex-1 md:flex-none gap-2">
            Apply Now
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
        <span>Posted {job.posted}</span>
        <Link href={`/jobs/${job.id}`} className="text-primary hover:underline">
          View Details →
        </Link>
      </div>
    </Card>
  )
}
