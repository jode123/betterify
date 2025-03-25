"use client"

import type React from "react"
import { useState, useCallback, createContext, useContext } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface CopyrightWarningContextType {
  isWarningOpen: boolean
  showCopyrightWarning: (onProceed: () => void) => void
  handleProceed: () => void
  handleClose: () => void
}

interface CopyrightWarningProviderProps {
  children: React.ReactNode
}

const CopyrightWarningContext = createContext<CopyrightWarningContextType | undefined>(undefined)

export function CopyrightWarningProvider({ children }: CopyrightWarningProviderProps) {
  const [isWarningOpen, setIsWarningOpen] = useState(false)
  const [onProceedCallback, setOnProceedCallback] = useState<(() => void) | null>(null)

  const showCopyrightWarning = useCallback((onProceed: () => void) => {
    setOnProceedCallback(() => onProceed)
    setIsWarningOpen(true)
  }, [])

  const handleProceed = useCallback(() => {
    if (onProceedCallback) {
      onProceedCallback()
      setOnProceedCallback(null)
    }
    setIsWarningOpen(false)
  }, [onProceedCallback])

  const handleClose = useCallback(() => {
    setIsWarningOpen(false)
    setOnProceedCallback(null)
  }, [])

  const value = {
    isWarningOpen,
    showCopyrightWarning,
    handleProceed,
    handleClose,
  }

  return <CopyrightWarningContext.Provider value={value}>{children}</CopyrightWarningContext.Provider>
}

export function useCopyrightWarning() {
  const context = useContext(CopyrightWarningContext)
  if (!context) {
    throw new Error("useCopyrightWarning must be used within a CopyrightWarningProvider")
  }
  return context
}

interface CopyrightWarningModalProps {
  isOpen: boolean
  onClose: () => void
  onProceed: () => void
}

export function CopyrightWarningModal({ isOpen, onClose, onProceed }: CopyrightWarningModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Copyright Warning</DialogTitle>
          <DialogDescription>
            Downloading copyrighted material without permission may infringe copyright laws. Please ensure you have the
            necessary rights before proceeding.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={onProceed}>
            Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

