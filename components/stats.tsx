"use client"

import { useEffect, useRef, useState } from "react"
import { Briefcase, Building2, Users, TrendingUp } from "lucide-react"

function StatCard({
  icon: Icon,
  value,
  label,
  delay = 0,
}: { icon: any; value: string; label: string; delay?: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={`glass-effect rounded-2xl p-6 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <div className="text-3xl font-bold">{value}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </div>
    </div>
  )
}

export function Stats() {
  return (
    <section className="py-12 border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Briefcase} value="10,000+" label="Active Jobs" delay={0} />
          <StatCard icon={Building2} value="2,500+" label="Companies" delay={100} />
          <StatCard icon={Users} value="50,000+" label="Developers" delay={200} />
          <StatCard icon={TrendingUp} value="95%" label="Success Rate" delay={300} />
        </div>
      </div>
    </section>
  )
}
