"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  value: number[]
  onValueChange: (value: number[]) => void
  min?: number
  max?: number
  className?: string
}

function Slider({
  className,
  value,
  onValueChange,
  min = 0,
  max = 100,
  ...props
}: SliderProps) {
  return (
    <div className="flex items-center space-x-2 w-full">
      {/* Min Label */}
      <span className="text-sm text-muted-foreground w-6 text-left">{min}</span>

      {/* Slider */}
      <SliderPrimitive.Root
        value={value}
        onValueChange={onValueChange}
        min={min}
        max={max}
        step={1}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        
        {value.map((_, index) => (
          <SliderPrimitive.Thumb
            key={index}
            className={cn(
              "block h-4 w-4 rounded-full border-2 border-primary bg-background ring-offset-background",
              "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50",
              // Improved thumb styling for better dragging
              "cursor-pointer active:cursor-grabbing",
              "hover:scale-110 active:scale-105",
              "transition-transform duration-100 ease-out"
            )}
            // Remove any touch-action or user-select styles from here as they're handled by the root
          />
        ))}
      </SliderPrimitive.Root>

      {/* Max Label */}
      <span className="text-sm text-muted-foreground w-6 text-right">{max}</span>
    </div>
  )
}

export { Slider }