"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Cat, Dog } from "@/components/shared/icons"
import type { PetType } from "@/types"

export interface PetCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Pet information */
  pet: {
    name: string
    avatarUrl?: string
    breed: string
    petType: PetType
    personality?: string
  }
}

const PetTypeIcon: Record<PetType, React.ReactNode> = {
  cat: <Cat className="size-5" />,
  dog: <Dog className="size-5" />,
  rabbit: "🐰",
  hamster: "🐹",
  bird: "🐦",
  other: "🐾",
}

function PetCard({ pet, className, ...props }: PetCardProps) {
  const initials = pet.name.slice(0, 2).toUpperCase()

  return (
    <Card
      data-slot="pet-card"
      className={cn("p-4", className)}
      {...props}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <Avatar size="xl">
          {pet.avatarUrl ? (
            <AvatarImage src={pet.avatarUrl} alt={pet.name} />
          ) : null}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-heading font-semibold text-lg truncate">
              {pet.name}
            </h3>
            <span className="text-muted-foreground">
              {PetTypeIcon[pet.petType]}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" size="sm">
              {pet.breed}
            </Badge>
            {pet.personality && (
              <Badge variant="muted" size="sm">
                {pet.personality}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export { PetCard }
