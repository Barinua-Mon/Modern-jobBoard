"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"

export function JobFilters() {
  const [salary, setSalary] = useState([50])

  const jobTypes = ["Full-time", "Part-time", "Contract", "Freelance"]
  const experienceLevels = ["Entry Level", "Mid Level", "Senior", "Lead"]
  const locations = ["Remote", "Hybrid", "On-site"]

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
              <Checkbox id={type} />
              <label
                htmlFor={type}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
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
              <Checkbox id={level} />
              <label
                htmlFor={level}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {level}
              </label>
            </div>
          ))}
        </div>

        {/* Location */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Work Location</Label>
          {locations.map((location) => (
            <div key={location} className="flex items-center space-x-2">
              <Checkbox id={location} />
              <label
                htmlFor={location}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {location}
              </label>
            </div>
          ))}
        </div>

        {/* Salary Range */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Minimum Salary: ${salary[0]}k</Label>
          <Slider value={salary} onValueChange={setSalary} max={200} step={10} className="w-full" />
        </div>

        <Button variant="outline" className="w-full bg-transparent">
          Reset Filters
        </Button>
      </div>
    </Card>
  )
}
