"use client"

import { Button } from "@/components/ui/button"
import { useSignIn } from "./sign-in-trigger"

export function SignInToApplyButton() {
  const { openSignIn } = useSignIn()
  return (
    <Button
      onClick={openSignIn}
      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm cursor-pointer"
    >
      Sign in to apply
    </Button>
  )
}