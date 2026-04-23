"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Bell, BellRing, Briefcase, CalendarCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface Notification {
    id: string
    type: string
    title: string
    message: string
    read: boolean
    link: string | null
    createdAt: string
}

interface NotificationBellProps {
    userId: string
    userRole: string
}

export function NotificationBell({ userId, userRole }: NotificationBellProps) {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [open, setOpen] = useState(false)
    const [permitted, setPermitted] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const prevUnreadIds = useRef<Set<string>>(new Set())

    const unreadCount = notifications.filter((n) => !n.read).length

    // ── Request browser notification permission once on mount ──────────────
    useEffect(() => {
        if ("Notification" in window) {
            if (Notification.permission === "granted") {
                setPermitted(true)
            } else if (Notification.permission === "default") {
                Notification.requestPermission().then((perm) => {
                    setPermitted(perm === "granted")
                })
            }
        }
    }, [])

    // ── Fetch + fire browser popups for NEW unread notifications ──────────
    const fetchNotifications = useCallback(() => {
        fetch("/api/notifications")
            .then((r) => r.json())
            .then((data: Notification[]) => {
                // Filter by role
                const filtered = data.filter((n) => {
                    if (n.type === "NEW_APPLICANT") return userRole === "Employer"
                    if (n.type === "INTERVIEW_REMINDER") return userRole === "Applicant"
                    return true
                })

                setNotifications(filtered)

                // Fire browser popups for new unread notifications
                if (permitted || Notification.permission === "granted") {
                    filtered
                        .filter((n) => !n.read && !prevUnreadIds.current.has(n.id))
                        .forEach((n) => {
                            new Notification(n.title, {
                                body: n.message,
                                icon: "/favicon.ico",
                                tag: n.id,
                            })
                        })
                }

                prevUnreadIds.current = new Set(filtered.filter((n) => !n.read).map((n) => n.id))
            })
            .catch(() => { })
    }, [permitted, userRole])

    // ── Poll every 30 seconds ─────────────────────────────────────────────
    useEffect(() => {
        fetchNotifications() // immediate fetch on mount

        const interval = setInterval(fetchNotifications, 30_000)
        return () => clearInterval(interval)
    }, [fetchNotifications])

    // ── Close dropdown on outside click ───────────────────────────────────
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [])

    // ── Open dropdown + mark all read ─────────────────────────────────────
    const handleOpen = async () => {
        setOpen((prev) => !prev)
        if (!open && unreadCount > 0) {
            await fetch("/api/notifications", { method: "PATCH" })
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
            prevUnreadIds.current = new Set() // reset seen set after marking read
        }
    }

    const timeAgo = (date: string) => {
        const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)

        if (seconds < 5) return "Just now"
        if (seconds < 60) return `${seconds}s ago`

        const minutes = Math.floor(seconds / 60)
        if (minutes < 60) return `${minutes}m ago`

        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours}h ago`

        const days = Math.floor(hours / 24)
        if (days < 7) return `${days}d ago`

        const weeks = Math.floor(days / 7)
        if (weeks < 4) return `${weeks}w ago`

        const months = Math.floor(days / 30)
        if (months < 12) return `${months}mo ago`

        const years = Math.floor(days / 365)
        return `${years}y ago`
    }

    return (
        <div ref={ref} className="relative">

            {/* ── Bell button ── */}
            <Button variant="outline" size="icon" onClick={handleOpen} className="relative">
                {unreadCount > 0 ? (
                    <BellRing className="h-4 w-4 text-primary animate-pulse" />
                ) : (
                    <Bell className="h-4 w-4" />
                )}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </Button>

            {/* ── Dropdown ── */}
            {open && (
                <Card className="fixed right-2 top-20 w-72 z-[100] shadow-xl overflow-y-auto max-h-[80vh]">

                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
                        <h3 className="font-semibold text-sm">Notifications</h3>
                        <span className="text-xs text-muted-foreground">
                            {unreadCount === 0 ? "All caught up ✓" : `${unreadCount} unread`}
                        </span>
                    </div>

                    {/* List */}
                    <div className="max-h-96 overflow-y-auto divide-y divide-border/40">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-2 text-center px-4">
                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                                    <Bell className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <p className="text-sm font-medium">No notifications yet</p>
                                <p className="text-xs text-muted-foreground">
                                    We'll let you know when something happens.
                                </p>
                            </div>
                        ) : (
                            notifications.map((n) => {
                                const Icon = n.type === "NEW_APPLICANT" ? Briefcase : CalendarCheck

                                const content = (
                                    <div
                                        className={`flex gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors ${!n.read ? "bg-primary/5" : ""
                                            }`}
                                    >
                                        {/* Icon */}
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${n.type === "NEW_APPLICANT" ? "bg-blue-500/15" : "bg-accent/15"
                                                }`}
                                        >
                                            <Icon
                                                className={`h-4 w-4 ${n.type === "NEW_APPLICANT" ? "text-blue-500" : "text-accent"
                                                    }`}
                                            />
                                        </div>

                                        {/* Text */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold leading-snug">{n.title}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                                                {n.message}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground mt-1">
                                                {timeAgo(n.createdAt)}
                                            </p>
                                        </div>

                                        {/* Unread dot */}
                                        {!n.read && (
                                            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                                        )}
                                    </div>
                                )

                                return n.link ? (
                                    <Link key={n.id} href={n.link} onClick={() => setOpen(false)}>
                                        {content}
                                    </Link>
                                ) : (
                                    <div key={n.id}>{content}</div>
                                )
                            })
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-2 border-t border-border/40 text-center">
                            <p className="text-xs text-muted-foreground">
                                Showing last {notifications.length} notifications
                            </p>
                        </div>
                    )}
                </Card>
            )}
        </div>
    )
}