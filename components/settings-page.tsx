"use client"

import { useState, useRef, useActionState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  X,
  User,
  FileText,
  Sparkles,
  Save,
  ArrowLeft,
  Mail,
  ShieldCheck,
  Camera,
  Upload,
  File,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { updateUserProfile } from "@/lib/actions"
import { Role } from "../lib/generated/prisma/enums";
import { toast } from "sonner"


type SettingsUser = {
  name?: string | null
  email?: string | null
  emailVerified?: Date | null
  image?: string | null
  bio?: string | null
  skills?: string[] | null
  resume?: string | null
  role?: string | null
}

const MAX_BIO_CHARS = 500
const MAX_IMAGE_MB = 5
const MAX_RESUME_MB = 10



export function SettingsPage({ user }: { user: SettingsUser }) {
  const [state, formAction, isPending] = useActionState(updateUserProfile, null);

  useEffect(()=>{
    if(!state) return;

    if(state.success){
      toast.success(state.message)
    }else{
      toast.error(state.message)
    }
  },[state])

  const [name, setName] = useState(user.name ?? "")
  const [bio, setBio] = useState(user.bio ?? "")
  const [role, setRole] = useState(user.role ?? "Applicant")

  // Avatar
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.image ?? null)
  const [avatarError, setAvatarError] = useState("")
  const imageInputRef = useRef<HTMLInputElement>(null)

  // Resume
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeFileName, setResumeFileName] = useState<string>(
    user.resume ? decodeURIComponent(user.resume.split("/").pop() ?? "resume") : ""
  )
  const [resumeError, setResumeError] = useState("")
  const resumeInputRef = useRef<HTMLInputElement>(null)

  // Skills
  const [skills, setSkills] = useState<string[]>(user.skills ?? [])
  const [skillInput, setSkillInput] = useState("")

  const bioWarning = MAX_BIO_CHARS - bio.length < 60

  // ── Handlers ──────────────────────────────────────────

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarError("")
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setAvatarError(`Image must be under ${MAX_IMAGE_MB}MB.`)
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const removeAvatar = () => {
    setAvatarPreview(null)
    setAvatarError("")
    if (imageInputRef.current) imageInputRef.current.value = ""
  }

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResumeError("")
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_RESUME_MB * 1024 * 1024) {
      setResumeError(`Resume must be under ${MAX_RESUME_MB}MB.`)
      return
    }
    setResumeFile(file)
    setResumeFileName(file.name)
  }

  const removeResume = () => {
    setResumeFile(null)
    setResumeFileName("")
    setResumeError("")
    if (resumeInputRef.current) resumeInputRef.current.value = ""
  }

  const addSkill = () => {
    const value = skillInput.trim()
    if (!value || skills.includes(value)) return
    setSkills([...skills, value])
    setSkillInput("")
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
  }



  // ── Render ────────────────────────────────────────────

  return (
    <div className="w-full px-4 sm:px-6 py-6 sm:py-8 max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto">

      {/* Back */}
      <Link href="/dashboard">
        <Button variant="ghost" size="sm" className="mb-5 gap-2 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Button>
      </Link>

      {/* Title */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage your profile and preferences</p>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {/* Form action */}
        <form action={formAction}>
          {/* ── Photo ── */}
          <Card className="p-5 sm:p-6">
            <SectionHeader icon={<Camera className="h-4 w-4" />} title="Photo" />
            <Separator className="my-3 sm:my-4" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              {/* Avatar circle */}
              <div
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-secondary border-2 border-dashed border-border shrink-0 overflow-hidden flex items-center justify-center cursor-pointer group self-center sm:self-auto"
                onClick={() => imageInputRef.current?.click()}
              >
                {avatarPreview ? (
                  <>
                    <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="h-5 w-5 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-muted-foreground">
                    <Upload className="h-5 w-5" />
                    <span className="text-[10px]">Upload</span>
                  </div>
                )}
              </div>

              <div className="flex-1 w-full sm:w-auto">
                <p className="text-sm font-medium mb-1">Profile photo</p>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  JPG, PNG or GIF · Max {MAX_IMAGE_MB}MB
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent text-xs gap-1.5"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <Upload className="h-3 w-3" />
                    Choose file
                  </Button>
                  {avatarPreview && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
                      onClick={removeAvatar}
                    >
                      <Trash2 className="h-3 w-3" />
                      Remove
                    </Button>
                  )}
                </div>
                {avatarError && (
                  <p className="text-xs text-destructive mt-2">{avatarError}</p>
                )}
              </div>
            </div>

            <input
              ref={imageInputRef}
              type="file"
              name="avatar"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </Card>

          {/* ── Account ── */}
          <Card className="p-5 sm:p-6">
            <SectionHeader icon={<ShieldCheck className="h-4 w-4" />} title="Account" />
            <Separator className="my-3 sm:my-4" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Mail className="h-3 w-3" /> Email
                </Label>
                <Input
                  value={user.email ?? ""}
                  disabled
                  className="bg-secondary/30 text-muted-foreground text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  {user.emailVerified ? "✓ Verified" : "⚠ Not verified"}
                </p>
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <Label className="text-sm">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="bg-secondary/40 w-full" name="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Applicant">
                      <span className="font-medium">Applicant</span>
                      <span className="text-xs text-muted-foreground ml-2">· Browse &amp; apply</span>
                    </SelectItem>
                    <SelectItem value="Employer">
                      <span className="font-medium">Employer</span>
                      <span className="text-xs text-muted-foreground ml-2">· Post &amp; review</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" name="role" value={role} />
                <p className="text-xs text-muted-foreground">
                  Switching to Recruiter lets you post jobs.
                </p>
              </div>
            </div>
          </Card>

          {/* ── Profile ── */}
          <Card className="p-5 sm:p-6">
            <SectionHeader icon={<User className="h-4 w-4" />} title="Profile" />
            <Separator className="my-3 sm:my-4" />
            <Field label="Full Name">
              <Input
                placeholder="Your full name"
                value={name}
                name="name"
                onChange={(e) => setName(e.target.value)}
                className="bg-secondary/40"
              />
            </Field>
          </Card>

          {/* Display only if logged in user is an Applicant */}
          {user.role === "Applicant" && (
            /* ── Bio ── */
            <Card className="p-5 sm:p-6">
              <SectionHeader icon={<FileText className="h-4 w-4" />} title="Bio" />
              <Separator className="my-3 sm:my-4" />
              <Textarea
                placeholder="Tell employers about yourself — experience, goals, what you're looking for..."
                value={bio}
                name="bio"
                onChange={(e) => setBio(e.target.value.slice(0, MAX_BIO_CHARS))}
                rows={4}
                className="bg-secondary/40 resize-none"
              />
              <div className="flex justify-end mt-1.5">
                <span className={`text-xs tabular-nums transition-colors ${bioWarning ? "text-destructive" : "text-muted-foreground"}`}>
                  {bio.length} / {MAX_BIO_CHARS}
                </span>
              </div>
            </Card>
          )}

          {/* Display only if logged in user is an Applicant */}
          {user.role === "Applicant" && (
            /* ── Skills ── */
            <Card className="p-5 sm:p-6">
              <SectionHeader icon={<Sparkles className="h-4 w-4" />} title="Skills" />
              <Separator className="my-3 sm:my-4" />

              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="e.g. React, Python, Figma..."
                  value={skillInput}
                  name="skills"
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); addSkill() }
                  }}
                  className="bg-secondary/40"
                />
                <Button
                  variant="outline"
                  onClick={addSkill}
                  disabled={!skillInput.trim()}
                  className="bg-transparent shrink-0"
                >
                  Add
                </Button>
              </div>

              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="gap-1.5 pr-1.5 pl-3 py-0.5 text-sm">
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="rounded-full p-0.5 hover:bg-destructive/20 transition-colors"
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  No skills yet — add some to improve your job matches.
                </p>
              )}
            </Card>
          )}

          {/* Display only if logged in user is an Applicant */}
          {user.role === "Applicant" && (
            /* ── Resume ── */
            <Card className="p-5 sm:p-6">
              <SectionHeader icon={<FileText className="h-4 w-4" />} title="Resume" />
              <Separator className="my-3 sm:my-4" />

              {resumeFileName ? (
                /* File selected state */
                <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 px-4 py-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <File className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{resumeFileName}</p>
                    {resumeFile && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs gap-1.5 h-8"
                      onClick={() => resumeInputRef.current?.click()}
                    >
                      <Upload className="h-3 w-3" />
                      Replace
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                      onClick={removeResume}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ) : (
                /* Empty state — upload zone */
                <div
                  className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-secondary/20 px-6 py-8 cursor-pointer hover:bg-secondary/40 transition-colors"
                  onClick={() => resumeInputRef.current?.click()}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">Upload your resume</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, DOC, DOCX · Max {MAX_RESUME_MB}MB
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="bg-transparent gap-1.5">
                    <Upload className="h-3 w-3" />
                    Choose file
                  </Button>
                </div>
              )}

              {resumeError && (
                <p className="text-xs text-destructive mt-2">{resumeError}</p>
              )}

              <input
                ref={resumeInputRef}
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={handleResumeUpload}
              />
            </Card>
          )}


          {/* ── Save / Cancel ── */}
          <div className="flex flex-col sm:flex-row-reverse gap-2 pt-1 pb-8">
            <Button type="submit" className="sm:flex-1 gap-2 h-11" disabled={isPending}>
              <Save className="h-4 w-4" />
              {isPending? "Applying Changes": "Save Changes"}
            </Button>
            <Link href="/dashboard" className="sm:flex-1">
              <Button variant="outline" className="w-full bg-transparent h-11">
                Cancel
              </Button>
            </Link>
          </div>
        </form>

      </div>
    </div>
  )
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-primary">{icon}</span>
      <h2 className="font-semibold text-sm tracking-tight">{title}</h2>
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <Label className="text-sm">{label}</Label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  )
}