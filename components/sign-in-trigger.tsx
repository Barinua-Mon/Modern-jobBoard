"use client"

import { createContext, useContext, useState } from "react"
import { SignInModal } from "@/components/sign-in-modal"

const SignInContext = createContext<{ openSignIn: () => void }>({
  openSignIn: () => {},
})

export function SignInProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <SignInContext.Provider value={{ openSignIn: () => setIsOpen(true) }}>
      {children}
      <SignInModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </SignInContext.Provider>
  )
}

export const useSignIn = () => useContext(SignInContext)