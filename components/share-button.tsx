"use client"

import { Share2, Copy, Check } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function ShareButton({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = `${window.location.origin}/jobs/${jobId}`

    // use native share sheet on mobile
    if (navigator.share) {
      try {
        await navigator.share({
          title: jobTitle,
          text:  `Check out this job: ${jobTitle}`,
          url,
        })
      } catch {
        // user cancelled share — do nothing
      }
      return
    }

    // fallback: copy to clipboard on desktop
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success("Link copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Failed to copy link")
    }
  }

  return (
    <Button variant="outline" size="icon" onClick={handleShare} className="cursor-pointer">
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Share2 className="h-4 w-4" />
      )}
    </Button>
  )
}