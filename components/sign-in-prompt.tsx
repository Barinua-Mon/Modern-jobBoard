// components/sign-in-prompt.tsx
"use client"

import Link from "next/link"
import { useSignIn } from "./sign-in-trigger"
import { useEffect } from "react"

export function SignInPrompt() {
    const { openSignIn } = useSignIn()

    useEffect(() => {
        openSignIn()
    }, [])

    return (
        <Link href="/signin">
            <div className="text-center py-20 text-muted-foreground">
                <p className="font-medium">Please sign in to view jobs</p>
            </div>
        </Link>
    )
}