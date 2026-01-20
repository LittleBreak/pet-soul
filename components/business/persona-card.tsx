import * as React from "react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "@/components/shared/icons"
import type { Persona } from "@/types"

export interface PersonaCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Persona data to display */
  persona: Persona
  /** Whether this card is selected */
  selected?: boolean
  /** Callback when card is clicked */
  onSelect?: () => void
}

function PersonaCard({
  persona,
  selected = false,
  onSelect,
  className,
  ...props
}: PersonaCardProps) {
  return (
    <Card
      data-slot="persona-card"
      data-selected={selected || undefined}
      hover={onSelect ? "lift" : "none"}
      onClick={onSelect}
      className={cn(
        "relative p-4 transition-all",
        selected && "ring-2 ring-primary border-primary",
        onSelect && "cursor-pointer",
        className
      )}
      {...props}
    >
      {/* Selected indicator */}
      {selected && (
        <div className="absolute top-2 right-2 size-5 rounded-full bg-primary flex items-center justify-center">
          <Check className="size-3 text-primary-foreground" />
        </div>
      )}

      {/* Icon and name */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl" role="img" aria-label={persona.name}>
          {persona.icon}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-base truncate">
            {persona.name}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {persona.description}
          </p>
        </div>
      </div>

      {/* Style tags */}
      <div className="flex flex-wrap gap-1 mt-2">
        {persona.styleTags.map((tag) => (
          <Badge key={tag} variant="muted" size="sm">
            {tag}
          </Badge>
        ))}
        {persona.isPremium && (
          <Badge variant="accent" size="sm">
            Premium
          </Badge>
        )}
      </div>
    </Card>
  )
}

export { PersonaCard }
