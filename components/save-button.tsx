"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { saveJob, unsaveJob } from "@/lib/actions"

export function SaveButton({
  jobId,
  initialSaved,
  userId,
}: {
  jobId: string
  initialSaved: boolean
  userId?: string
}) {
  const router = useRouter()
  const [isSaved, setIsSaved] = useState(initialSaved)
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    if (!userId) {
      toast.error("Please sign in to save jobs")
      return
    }

    const previous = isSaved;

    // optimistic update
    setIsSaved(!previous);

    startTransition(async () => {
      try {
        if (previous) {
          // unsaving — no undo needed
          await unsaveJob(jobId)
          toast.success("Removed from saved jobs")
        } else {
          // saving — show undo
          await saveJob(jobId)

          toast.success("Job saved!", {
            duration: 5000,
            action: {
              label: "Undo",
              onClick: async () => {
                setIsSaved(false)         // revert UI instantly
                await unsaveJob(jobId)    // revert on server
                toast.success("Undo successful")
                router.refresh()
              },
            },
          })
        }

        router.refresh()
      } catch {
        setIsSaved(previous) // rollback on error
        toast.error("Something went wrong")
      }
    })
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={isPending}
      className={`cursor-pointer ${isSaved ? "text-primary" : ""}`}
    >
      <Bookmark className={`h-5 w-5 transition-all ${isSaved ? "fill-current scale-110" : ""}`} />
    </Button>
  )
}