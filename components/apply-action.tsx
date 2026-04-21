"use client"

import { useActionState, useEffect } from "react"
import { Button } from "./ui/button";
import { CheckCircle2, ExternalLink, Loader2 } from "lucide-react";
import { ApplyJob } from "@/lib/actions";
import {toast} from "sonner"

// extract the form into its own small component
// so each card has its own independent state
export function ApplyButton({ jobId, jobTitle, posterId }: { jobId: string; jobTitle: string; posterId: string}) {
  const [state, formAction, isPending] = useActionState(ApplyJob, null);

   useEffect(() => {
    if (!state) return

    if (state.success) {
      toast.success(state.message)  // ← green toast, auto disappears
    } else {
      toast.error(state.message)    // ← red toast, auto disappears
    }
  }, [state])
  
  return (
    <div className="flex flex-col gap-1">
      <form action={formAction}>
        <input type="hidden" name="jobId"    value={jobId} />
        <input type="hidden" name="jobTitle" value={jobTitle} />
        <input type="hidden" name="posterId" value={posterId} />
        <Button
          type="submit"
          disabled={isPending || state?.success === true}
          className="cursor-pointer flex-1 md:flex-none gap-2"
        >
          {isPending ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Applying...</>
          ) : state?.success ? (
            <><CheckCircle2 className="h-4 w-4" /> Applied</>
          ) : (
            <><ExternalLink className="h-4 w-4" /> Apply Now</>
          )}
        </Button>
      </form>
    </div>
  )
}