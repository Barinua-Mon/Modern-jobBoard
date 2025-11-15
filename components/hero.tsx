"use client"

import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/20 py-20 md:py-32">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
              Find Your Dream{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                Developer Job
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty">
              Discover thousands of tech opportunities from top companies worldwide. Your next career move starts here.
            </p>
          </div>

          {/* Search bar */}
          <div className="glass-effect rounded-2xl p-2 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Job title, keywords, or company"
                  className="pl-10 h-12 border-0 bg-background/50 focus-visible:ring-1"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="City, state, or remote"
                  className="pl-10 h-12 border-0 bg-background/50 focus-visible:ring-1"
                />
              </div>
              <Button size="lg" className="h-12 px-8 bg-primary hover:bg-primary/90">
                Search Jobs
              </Button>
            </div>
          </div>

          {/* Popular searches */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">Popular:</span>
            {["React Developer", "Full Stack", "DevOps", "UI/UX Designer"].map((term) => (
              <button
                key={term}
                className="text-sm px-3 py-1 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
