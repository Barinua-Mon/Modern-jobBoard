"use client"

import { JobCard } from "@/components/job-card"

const jobs = [
  {
    id: 1,
    title: "Senior Full Stack Developer",
    company: "TechCorp",
    logo: "🚀",
    location: "Remote",
    type: "Full-time",
    salary: "$120k - $180k",
    tags: ["React", "Node.js", "TypeScript", "AWS"],
    posted: "2 days ago",
    featured: true,
  },
  {
    id: 2,
    title: "Frontend Engineer",
    company: "DataFlow",
    logo: "💾",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$100k - $150k",
    tags: ["React", "Next.js", "Tailwind CSS"],
    posted: "3 days ago",
    featured: false,
  },
  {
    id: 3,
    title: "DevOps Engineer",
    company: "CloudNine",
    logo: "☁️",
    location: "Remote",
    type: "Contract",
    salary: "$90k - $140k",
    tags: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    posted: "5 days ago",
    featured: true,
  },
  {
    id: 4,
    title: "UI/UX Designer",
    company: "CodeLabs",
    logo: "⚡",
    location: "New York, NY",
    type: "Full-time",
    salary: "$80k - $120k",
    tags: ["Figma", "Design Systems", "Prototyping"],
    posted: "1 week ago",
    featured: false,
  },
  {
    id: 5,
    title: "Backend Developer",
    company: "DevHub",
    logo: "🔧",
    location: "Remote",
    type: "Full-time",
    salary: "$110k - $160k",
    tags: ["Python", "Django", "PostgreSQL", "Redis"],
    posted: "1 week ago",
    featured: false,
  },
  {
    id: 6,
    title: "Mobile Developer",
    company: "ByteWorks",
    logo: "💻",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$95k - $145k",
    tags: ["React Native", "iOS", "Android"],
    posted: "2 weeks ago",
    featured: false,
  },
]

export function JobList() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          <span className="text-primary">{jobs.length}</span> Jobs Found
        </h2>
        <select className="px-4 py-2 rounded-lg border border-border bg-background text-sm">
          <option>Most Recent</option>
          <option>Highest Salary</option>
          <option>Most Relevant</option>
        </select>
      </div>

      <div className="space-y-4">
        {jobs.map((job, index) => (
          <JobCard key={job.id} job={job} index={index} />
        ))}
      </div>
    </div>
  )
}
