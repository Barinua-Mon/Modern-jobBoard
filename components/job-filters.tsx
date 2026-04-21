"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"

const jobTypes        = ["Full-time", "Part-time", "Contract", "Freelance"]
const experienceLevels = ["Entry Level", "Mid Level", "Senior", "Lead"]
const locations       = ["Remote", "Hybrid", "On-site"]

export function JobFilters() {
  const router      = useRouter()
  const searchParams = useSearchParams()

  // Initialise from current URL so filters survive page refresh
  const [selectedTypes,  setSelectedTypes]  = useState<string[]>(
    searchParams.getAll("type")
  )
  const [selectedLevels, setSelectedLevels] = useState<string[]>(
    searchParams.getAll("level")
  )
  const [selectedLocs,   setSelectedLocs]   = useState<string[]>(
    searchParams.getAll("location")
  )
  const [salary, setSalary] = useState([
    Number(searchParams.get("minSalary") ?? 0),
  ])

  const toggle = (
    value: string,
    selected: string[],
    setSelected: (v: string[]) => void
  ) => {
    setSelected(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    )
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    // Preserve existing hero search params
    const q        = searchParams.get("q")
    const location = searchParams.get("location")
    if (q)        params.set("q", q)
    if (location) params.set("location", location)

    selectedTypes.forEach((t) => params.append("type", t))
    selectedLevels.forEach((l) => params.append("level", l))
    selectedLocs.forEach((l) => params.append("workLocation", l))
    if (salary[0] > 0) params.set("minSalary", String(salary[0]))

    router.push(`/?${params.toString()}`)
  }

  const resetFilters = () => {
    setSelectedTypes([])
    setSelectedLevels([])
    setSelectedLocs([])
    setSalary([0])

    // Keep hero search params, drop filter params
    const params = new URLSearchParams()
    const q        = searchParams.get("q")
    const location = searchParams.get("location")
    if (q)        params.set("q", q)
    if (location) params.set("location", location)

    router.push(`/?${params.toString()}`)
  }

  return (
    <Card className="p-6 sticky top-20 glass-effect">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Filters</h2>
      </div>

      <div className="space-y-6">
        {/* Job Type */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Job Type</Label>
          {jobTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={selectedTypes.includes(type)}
                onCheckedChange={() => toggle(type, selectedTypes, setSelectedTypes)}
              />
              <label htmlFor={type} className="text-sm font-medium cursor-pointer">
                {type}
              </label>
            </div>
          ))}
        </div>

        {/* Experience Level */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Experience Level</Label>
          {experienceLevels.map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <Checkbox
                id={level}
                checked={selectedLevels.includes(level)}
                onCheckedChange={() => toggle(level, selectedLevels, setSelectedLevels)}
              />
              <label htmlFor={level} className="text-sm font-medium cursor-pointer">
                {level}
              </label>
            </div>
          ))}
        </div>

        {/* Work Location */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Work Location</Label>
          {locations.map((loc) => (
            <div key={loc} className="flex items-center space-x-2">
              <Checkbox
                id={loc}
                checked={selectedLocs.includes(loc)}
                onCheckedChange={() => toggle(loc, selectedLocs, setSelectedLocs)}
              />
              <label htmlFor={loc} className="text-sm font-medium cursor-pointer">
                {loc}
              </label>
            </div>
          ))}
        </div>

        {/* Salary Range */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">
            Minimum Salary: {salary[0] > 0 ? `$${salary[0]}k` : "Any"}
          </Label>
          <Slider value={salary} onValueChange={setSalary} max={200} step={10} className="w-full" />
        </div>

        <Button className="w-full" onClick={applyFilters}>
          Apply Filters
        </Button>
        <Button variant="outline" className="w-full bg-transparent" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
    </Card>
  )
}