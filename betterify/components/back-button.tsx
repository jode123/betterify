"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export function BackButton() {
  const router = useRouter()

  return (
    <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.back()} aria-label="Go back">
      <ChevronLeft className="h-5 w-5" />
    </Button>
  )
}

