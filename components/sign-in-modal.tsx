"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { SignInForm } from "@/components/sign-in-form"

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal wrapper — sits above backdrop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-8 overflow-y-auto"
          >
            <div className="relative w-full max-w-md my-auto">
              {/* X button — anchored to top-right of the card */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 z-[70] w-8 h-8 flex items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <SignInForm />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}