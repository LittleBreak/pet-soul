import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Crown, Zap, AlertTriangle } from "@/components/shared/icons"

const creditDisplayVariants = cva("", {
  variants: {
    variant: {
      inline: "inline-flex items-center gap-2",
      detailed: "flex flex-col gap-2",
    },
  },
  defaultVariants: {
    variant: "inline",
  },
})

export interface CreditDisplayProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof creditDisplayVariants> {
  /** Credits used today */
  used: number
  /** Total credits available */
  total: number
  /** Whether user has premium status */
  isPremium?: boolean
}

function CreditDisplay({
  used,
  total,
  isPremium = false,
  variant = "inline",
  className,
  ...props
}: CreditDisplayProps) {
  const remaining = total - used
  const isWarning = remaining <= 1
  const percentage = Math.min((used / total) * 100, 100)

  if (variant === "inline") {
    return (
      <div
        data-slot="credit-display"
        data-variant="inline"
        className={cn(creditDisplayVariants({ variant }), className)}
        {...props}
      >
        {isPremium ? (
          <Badge variant="accent" className="gap-1">
            <Crown className="size-3" />
            Premium
          </Badge>
        ) : (
          <Badge
            variant={isWarning ? "error" : "secondary"}
            className="gap-1"
          >
            {isWarning && <AlertTriangle className="size-3" />}
            <Zap className="size-3" />
            {remaining}/{total}
          </Badge>
        )}
      </div>
    )
  }

  // Detailed variant with progress bar
  return (
    <div
      data-slot="credit-display"
      data-variant="detailed"
      className={cn(creditDisplayVariants({ variant }), className)}
      {...props}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {isPremium ? "Premium" : "Daily Credits"}
        </span>
        {isPremium ? (
          <Badge variant="accent" className="gap-1">
            <Crown className="size-3" />
            Unlimited
          </Badge>
        ) : (
          <span
            className={cn(
              "text-sm font-medium",
              isWarning ? "text-error" : "text-foreground"
            )}
          >
            {remaining} / {total} remaining
          </span>
        )}
      </div>

      {!isPremium && (
        <div
          role="progressbar"
          aria-valuenow={used}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`${used} of ${total} credits used`}
          className="relative h-2 w-full overflow-hidden rounded-full bg-muted"
        >
          <div
            className={cn(
              "h-full transition-all duration-300",
              isWarning ? "bg-error" : "bg-primary"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}

      {isWarning && !isPremium && (
        <div className="flex items-center gap-1 text-xs text-error">
          <AlertTriangle className="size-3" />
          <span>
            {remaining === 0
              ? "No credits left. Reset tomorrow."
              : "Low credits remaining!"}
          </span>
        </div>
      )}
    </div>
  )
}

export { CreditDisplay, creditDisplayVariants }
