"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const logoVariants = cva("inline-flex items-center gap-2", {
  variants: {
    size: {
      sm: "text-lg",
      default: "text-xl",
      lg: "text-2xl",
      xl: "text-3xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

const iconSizes = {
  sm: "w-6 h-6",
  default: "w-8 h-8",
  lg: "w-10 h-10",
  xl: "w-12 h-12",
}

export interface LogoProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof logoVariants> {
  showIcon?: boolean
  showText?: boolean
  iconOnly?: boolean
}

function Logo({
  className,
  size = "default",
  showIcon = true,
  showText = true,
  iconOnly = false,
  ...props
}: LogoProps) {
  const displayIcon = showIcon || iconOnly
  const displayText = showText && !iconOnly

  return (
    <div
      className={cn(logoVariants({ size, className }))}
      aria-label="PetSoul"
      {...props}
    >
      {displayIcon && (
        <LogoIcon className={iconSizes[size || "default"]} />
      )}
      {displayText && (
        <span className="font-heading font-bold tracking-tight">
          <span className="text-foreground">Pet</span>
          <span className="text-primary">Soul</span>
        </span>
      )}
    </div>
  )
}

type LogoIconProps = React.SVGAttributes<SVGElement>

function LogoIcon({ className, ...props }: LogoIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
      {...props}
    >
      {/* Paw pad - main circle */}
      <circle
        cx="24"
        cy="28"
        r="12"
        className="fill-primary"
      />
      {/* Toe pads */}
      <circle
        cx="14"
        cy="16"
        r="6"
        className="fill-primary"
      />
      <circle
        cx="24"
        cy="12"
        r="6"
        className="fill-primary"
      />
      <circle
        cx="34"
        cy="16"
        r="6"
        className="fill-primary"
      />
      {/* Inner highlight/soul effect */}
      <circle
        cx="24"
        cy="26"
        r="4"
        className="fill-primary-200 opacity-80"
      />
      {/* Sparkle accent */}
      <circle
        cx="30"
        cy="10"
        r="2"
        className="fill-primary-300"
      />
    </svg>
  )
}

export { Logo, LogoIcon, logoVariants }
