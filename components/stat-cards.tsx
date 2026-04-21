"use client"

import { useEffect, useRef, useState } from "react"
import { Briefcase, Building2, Users, TrendingUp } from "lucide-react"

function StatCard({
  icon: Icon,
  value,
  label,
  delay = 0,
}: {
  icon: any
  value: string
  label: string
  delay?: number
}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={`glass-effect rounded-2xl p-4 md:p-6 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
        <div className="p-2 md:p-3 rounded-xl bg-primary/10 shrink-0">
          <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
        </div>
        <div>
          <div className="text-2xl md:text-3xl font-bold leading-tight">{value}</div>
          <div className="text-xs md:text-sm text-muted-foreground">{label}</div>
        </div>
      </div>
    </div>
  )
}

export function StatCards({
  activeJobs,
  companies,
  developers,
  successRate,
}: {
  activeJobs: number
  companies: number
  developers: number
  successRate: number
}) {
  const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(0)}k+` : `${n}+`)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      <StatCard icon={Briefcase} value={fmt(activeJobs)}  label="Active Jobs"   delay={0}   />
      <StatCard icon={Building2} value={fmt(companies)}   label="Companies"     delay={100} />
      <StatCard icon={Users}     value={fmt(developers)}  label="Developers"    delay={200} />
      <StatCard icon={TrendingUp} value={`${successRate}%`} label="Success Rate" delay={300} />
    </div>
  )
}