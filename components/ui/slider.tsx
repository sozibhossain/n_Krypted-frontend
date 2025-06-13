"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

interface SliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {
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
        data-slot="slider"
        value={value}
        onValueChange={onValueChange}
        min={min}
        max={max}
        step={1}
        className={cn(
          "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="bg-muted relative grow overflow-hidden rounded-full h-1.5"
        >
          <SliderPrimitive.Range
            data-slot="slider-range"
            className="bg-primary absolute h-full transition-all duration-200 ease-out"
          />
        </SliderPrimitive.Track>

        {value.map((_, index) => (
          <SliderPrimitive.Thumb
            key={index}
            data-slot="slider-thumb"
            className="block size-4 rounded-full bg-background border border-primary shadow-sm transition-all duration-200 ease-out hover:ring-4 focus-visible:ring-4 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
      </SliderPrimitive.Root>

      {/* Max Label */}
      <span className="text-sm text-muted-foreground w-6 text-right">{max}</span>
    </div>
  )
}

export { Slider }