"use client"

import { Button } from "@/components/ui/button"
import { MoveLeft, MoveRight } from "lucide-react"

interface SectionHeaderProps {
  title: string
  description?: string
  showControls?: boolean
  onPrev?: () => void
  onNext?: () => void
}

export function SectionHeader({ title, description, showControls = false, onPrev, onNext }: SectionHeaderProps) {
  return (
    <div className="mb-8 flex justify-between gap-4 items-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight md:text-5xl mt-2">{title}</h2>
        {description && <p className="text-xl text-[#4E4E4E] mt-2">{description}</p>}
      </div>

      {showControls && (
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={onPrev} className="h-[48px] w-[80px] rounded-sm border-[#645949]">
            <MoveLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button variant="outline" size="icon" onClick={onNext} className="h-[48px] w-[80px] rounded-sm border-[#645949]">
            <MoveRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      )}
    </div>
  )
}
