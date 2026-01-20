"use client"

import {
  CircleCheck,
  CircleX,
  Info,
  Loader2,
  TriangleAlert,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      position="top-center"
      icons={{
        success: <CircleCheck className="size-4 text-success" />,
        info: <Info className="size-4 text-secondary" />,
        warning: <TriangleAlert className="size-4 text-accent-600" />,
        error: <CircleX className="size-4 text-error" />,
        loading: <Loader2 className="size-4 animate-spin text-primary" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "group toast flex items-center gap-3 w-full rounded-xl border bg-card p-4 shadow-lg",
          title: "text-sm font-medium text-card-foreground",
          description: "text-sm text-muted-foreground",
          actionButton:
            "bg-primary text-primary-foreground text-sm font-medium px-3 py-1.5 rounded-lg",
          cancelButton:
            "bg-muted text-muted-foreground text-sm font-medium px-3 py-1.5 rounded-lg",
          success: "border-success/30 bg-success/5",
          error: "border-error/30 bg-error/5",
          warning: "border-accent-500/30 bg-accent-500/5",
          info: "border-secondary/30 bg-secondary/5",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
