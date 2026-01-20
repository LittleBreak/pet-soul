import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  errorMessage?: string
}

function Textarea({
  className,
  error,
  errorMessage,
  ...props
}: TextareaProps) {
  return (
    <div className="relative w-full">
      <textarea
        data-slot="textarea"
        aria-invalid={error || undefined}
        className={cn(
          // Base styles
          "flex min-h-24 w-full rounded-xl border bg-background px-4 py-3 text-base transition-all resize-none",
          // Placeholder
          "placeholder:text-muted-foreground",
          // Border
          "border-input",
          // Focus state - primary color glow
          "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30",
          // Focus visible for keyboard navigation
          "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30",
          // Error state
          error && "border-error ring-2 ring-error/20 focus:border-error focus:ring-error/30",
          // Selection
          "selection:bg-primary selection:text-primary-foreground",
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Dark mode
          "dark:bg-input/30",
          className
        )}
        {...props}
      />
      {error && errorMessage && (
        <p className="mt-1.5 text-sm text-error">{errorMessage}</p>
      )}
    </div>
  )
}

export { Textarea }
