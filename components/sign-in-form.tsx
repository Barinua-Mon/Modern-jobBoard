"use client"

import type React from "react"
import { useActionState, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Github, Mail, Chrome, ArrowRight, Briefcase } from "lucide-react"
import Link from "next/link"
import { SignInActionWithCredentials, SignInActionWithGithub, SignInActionWithGoogle } from "@/lib/actions"
import { OAuthButton } from "./oAuth-button"

export function SignInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [state, formAction, pending] = useActionState(
    SignInActionWithCredentials,
    null
  )

  return (
    <Card className="w-full max-w-md px-5 py-4 sm:px-8 sm:py-6 bg-card/50 backdrop-blur-xl border-border/50 shadow-2xl">

      {/* Header — compact */}
      <div className="flex flex-col items-center mb-4 sm:mb-6">
        <div className="relative mb-2">
          <Briefcase className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          <div className="absolute inset-0 bg-primary/20 blur-xl animate-glow" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1">
          Welcome Back
        </h1>
        <p className="text-muted-foreground text-center text-xs sm:text-sm">
          Sign in to continue your job search journey
        </p>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {/* GitHub */}
        <form action={SignInActionWithGithub}>
          <OAuthButton icon={Github} label="Continue with GitHub" />
        </form>

        {/* Google */}
        <form action={SignInActionWithGoogle}>
          <OAuthButton icon={Chrome} label="Continue with Google" />
        </form>

        {/* Divider */}
        <div className="relative my-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          {/* <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
          </div> */}
        </div>

        {/* Email form */}
        {/* <form action={formAction} className="space-y-2 sm:space-y-3">
          {state?.error && (
            <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
              {state.error}
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"   // ← name attr is how formData reads it
              type="email"
              placeholder="you@example.com"
              disabled={pending}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"  // ← same here
              type="password"
              placeholder="••••••••"
              disabled={pending}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                Please wait...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Continue with Email
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </form> */}


        {/* Footer */}
        <div className="text-center pt-2 border-t border-border/50">
          <p className="text-xs sm:text-sm text-muted-foreground">
           We’ll check if you have an account, and help create one if you don’t.
            {/* <Link href="/signin" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign up for free
            </Link> */}
          </p>
        </div>
      </div>
    </Card>
  )
}