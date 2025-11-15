"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Github, Mail, Chrome, ArrowRight, Briefcase } from "lucide-react"
import Link from "next/link"

export function SignInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    // Handle sign in logic here
  }

  const handleSocialSignIn = async (provider: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    // Handle social sign in logic here
  }

  return (
    <Card className="w-full max-w-md p-8 bg-card/50 backdrop-blur-xl border-border/50 shadow-2xl">
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <Briefcase className="h-12 w-12 text-primary" />
          <div className="absolute inset-0 bg-primary/20 blur-xl animate-glow" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
          Welcome Back
        </h1>
        <p className="text-muted-foreground text-center">Sign in to continue your job search journey</p>
      </div>

      <div className="space-y-4">
        {/* Social Sign In Buttons */}
        <Button
          variant="outline"
          className="w-full h-12 bg-background/50 hover:bg-background/80 border-border/50 transition-all hover:scale-[1.02] group"
          onClick={() => handleSocialSignIn("github")}
          disabled={isLoading}
        >
          <Github className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
          Continue with GitHub
        </Button>

        <Button
          variant="outline"
          className="w-full h-12 bg-background/50 hover:bg-background/80 border-border/50 transition-all hover:scale-[1.02] group"
          onClick={() => handleSocialSignIn("google")}
          disabled={isLoading}
        >
          <Chrome className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
          Continue with Google
        </Button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
          </div>
        </div>

        {/* Email Sign In Form */}
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary transition-colors"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Link href="/forgot-password" className="text-xs text-primary hover:text-primary/80 transition-colors">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 bg-background/50 border-border/50 focus:border-primary transition-colors"
              required
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-primary hover:bg-primary/90 transition-all hover:scale-[1.02] group"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Sign In
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </Card>
  )
}
