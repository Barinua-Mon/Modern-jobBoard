"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Briefcase, Menu, X } from "lucide-react"
import Link from "next/link"
import { useSignIn } from "./sign-in-trigger"
import { useSession } from "next-auth/react"
import { signOutAction } from "@/lib/actions"

export function Header() {
  const [isDark, setIsDark] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { openSignIn } = useSignIn()
  const { data: session } = useSession()

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark")
    setIsDark(!isDark)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative">
            <Briefcase className="h-8 w-8 text-primary" />
            <div className="absolute inset-0 bg-primary/20 blur-xl animate-glow" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            DevJobs
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Find Jobs
          </Link>
          <Link href="/saved" className="text-sm font-medium hover:text-primary transition-colors">
            Saved Jobs
          </Link>
          <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="relative overflow-hidden group">
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {session ? (
            <Button
              onClick={() => {
                signOutAction()
                setIsMobileMenuOpen(false)
              }}
              variant="outline"
              className="w-full bg-transparent"  // ← full width, always visible
            >
              Sign Out
            </Button>
          ) : (
            <Button onClick={openSignIn} className="bg-primary hover:bg-primary/90 hidden sm:inline-flex cursor-pointer">
              Sign In
            </Button>
          )}

          <Button variant="outline" className="hidden sm:inline-flex bg-transparent" asChild>
            <Link href="/post-job">Post a Job</Link>
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">

            {session ? (
              <Button
                onClick={() => {
                  signOutAction()
                  setIsMobileMenuOpen(false)
                }}
                variant="outline"
                className="w-full bg-transparent"  // ← full width, always visible
              >
                Sign Out
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() => {
                  openSignIn()
                  setIsMobileMenuOpen(false)
                }}
              >
                Sign In
              </Button>
            )}

            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              Find Jobs
            </Link>
            <Link href="/saved" className="text-sm font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              Saved Jobs
            </Link>
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              Dashboard
            </Link>
            <Link href="/post-job" className="text-sm font-medium hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
              Post a Job
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}