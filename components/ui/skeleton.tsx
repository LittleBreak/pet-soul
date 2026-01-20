import { cn } from "@/lib/utils"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Use shimmer animation instead of pulse */
  shimmer?: boolean
}

function Skeleton({ className, shimmer = true, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "rounded-lg bg-muted",
        shimmer
          ? // Shimmer animation (moving gradient)
            "skeleton"
          : // Pulse animation (opacity change)
            "animate-pulse",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
