"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "@/components/shared/icons"
import type { Monologue } from "@/types"

export interface ResultCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Monologue result to display */
  result: Monologue
  /** Whether this card is selected */
  selected?: boolean
  /** Callback when card is selected */
  onSelect?: () => void
}

function ResultCard({
  result,
  selected = false,
  onSelect,
  className,
  ...props
}: ResultCardProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(result.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <Card
      data-slot="result-card"
      data-selected={selected || undefined}
      variant="glass"
      hover={onSelect ? "glow" : "none"}
      onClick={onSelect}
      className={cn(
        "relative p-6 transition-all",
        selected && "ring-2 ring-primary",
        onSelect && "cursor-pointer",
        className
      )}
      {...props}
    >
      {/* Selected indicator */}
      {selected && (
        <div className="absolute top-3 right-3 size-6 rounded-full bg-primary flex items-center justify-center">
          <Check className="size-4 text-primary-foreground" />
        </div>
      )}

      {/* Tone badge */}
      <Badge variant="muted" size="sm" className="mb-4">
        {result.tone}
      </Badge>

      {/* Monologue content - large Chinese typography */}
      <p className="text-lg md:text-xl font-medium leading-relaxed text-foreground mb-4 pr-8">
        {result.content}
      </p>

      {/* Copy button */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleCopy}
        className="absolute bottom-3 right-3"
        aria-label={copied ? "Copied!" : "Copy text"}
      >
        {copied ? (
          <Check className="size-4 text-success" />
        ) : (
          <Copy className="size-4" />
        )}
      </Button>
    </Card>
  )
}

export { ResultCard }
