"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { PersonaCard } from "./persona-card"
import { getPersonaList } from "@/lib/constants/personas"
import type { Persona, PersonaId } from "@/types"

export interface PersonaSelectorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Custom list of personas (defaults to all personas from constants) */
  personas?: Persona[]
  /** Currently selected persona ID */
  selectedId: PersonaId
  /** Callback when a persona is selected */
  onSelect: (id: PersonaId) => void
}

function PersonaSelector({
  personas,
  selectedId,
  onSelect,
  className,
  ...props
}: PersonaSelectorProps) {
  const personaList = personas ?? getPersonaList()
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  return (
    <div
      data-slot="persona-selector"
      className={cn("w-full", className)}
      {...props}
    >
      {/* Mobile: Horizontal scroll with snap */}
      <div
        ref={scrollContainerRef}
        role="listbox"
        aria-label="Select a persona"
        className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:hidden"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {personaList.map((persona) => (
          <PersonaCard
            key={persona.id}
            persona={persona}
            selected={persona.id === selectedId}
            onSelect={() => onSelect(persona.id)}
            className="flex-shrink-0 w-[280px] snap-center"
          />
        ))} 
      </div>

      {/* Desktop: 2-3 column grid */}
      <div
        role="listbox"
        aria-label="Select a persona"
        className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {personaList.map((persona) => (
          <PersonaCard
            key={persona.id}
            persona={persona}
            selected={persona.id === selectedId}
            onSelect={() => onSelect(persona.id)}
          />
        ))}
      </div>
    </div>
  )
}

export { PersonaSelector }
