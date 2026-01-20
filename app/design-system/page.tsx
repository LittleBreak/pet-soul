"use client"

import * as React from "react"

import {
  PersonaCard,
  PetCard,
  CreditDisplay,
  ResultCard,
  PersonaSelector,
  ExportPanel,
  PhotoUploader,
  ResultCarousel,
  MemeEditor,
} from "@/components/business"
import { PERSONAS, getPersonaList } from "@/lib/constants/personas"
import type { Monologue, PersonaId } from "@/types"

// Mock data
const mockMonologues: Monologue[] = [
  {
    id: "1",
    content: "哼，这就是你今天的工作表现？勉强及格。本喵允许你今天多睡五分钟。",
    personaId: "aloof-boss",
    tone: "高冷",
  },
  {
    id: "2",
    content: "看什么看？没见过这么优雅的喵吗？快去给我倒杯水，跪着！",
    personaId: "aloof-boss",
    tone: "傲娇",
  },
  {
    id: "3",
    content: "今天的阳光不错，允许你陪我晒太阳。但是距离保持一米以上。",
    personaId: "aloof-boss",
    tone: "霸道",
  },
]

export default function DesignSystemPage() {
  const [selectedPersonaId, setSelectedPersonaId] =
    React.useState<PersonaId>("aloof-boss")
  const [selectedResultIndex, setSelectedResultIndex] = React.useState(0)

  return (
    <div className="container mx-auto py-8 px-4 space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">PetSoul Design System</h1>
        <p className="text-muted-foreground">Business Components Preview</p>
      </header>

      {/* PersonaCard */}
      <section>
        <h2 className="text-xl font-semibold mb-4">PersonaCard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <PersonaCard persona={PERSONAS["aloof-boss"]} />
          <PersonaCard persona={PERSONAS["chatty-auntie"]} selected />
          <PersonaCard
            persona={{ ...PERSONAS["literary-youth"], isPremium: true }}
            onSelect={() => alert("Selected!")}
          />
        </div>
      </section>

      {/* PetCard */}
      <section>
        <h2 className="text-xl font-semibold mb-4">PetCard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <PetCard
            pet={{
              name: "橘座",
              breed: "橘猫",
              petType: "cat",
              personality: "高冷",
            }}
          />
          <PetCard
            pet={{
              name: "旺财",
              avatarUrl: "https://placekitten.com/200/200",
              breed: "柯基",
              petType: "dog",
              personality: "活泼",
            }}
          />
        </div>
      </section>

      {/* CreditDisplay */}
      <section>
        <h2 className="text-xl font-semibold mb-4">CreditDisplay</h2>
        <div className="space-y-4 max-w-md">
          <div className="flex gap-4">
            <CreditDisplay used={2} total={5} variant="inline" />
            <CreditDisplay used={4} total={5} variant="inline" />
            <CreditDisplay used={5} total={5} variant="inline" />
            <CreditDisplay used={0} total={5} isPremium variant="inline" />
          </div>
          <CreditDisplay used={2} total={5} variant="detailed" />
          <CreditDisplay used={4} total={5} variant="detailed" />
          <CreditDisplay used={0} total={5} isPremium variant="detailed" />
        </div>
      </section>

      {/* ResultCard */}
      <section>
        <h2 className="text-xl font-semibold mb-4">ResultCard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockMonologues.map((monologue, index) => (
            <ResultCard
              key={monologue.id}
              result={monologue}
              selected={index === 0}
              onSelect={() => alert(`Selected: ${monologue.id}`)}
            />
          ))}
        </div>
      </section>

      {/* PersonaSelector */}
      <section>
        <h2 className="text-xl font-semibold mb-4">PersonaSelector</h2>
        <PersonaSelector
          personas={getPersonaList()}
          selectedId={selectedPersonaId}
          onSelect={setSelectedPersonaId}
        />
      </section>

      {/* ExportPanel */}
      <section>
        <h2 className="text-xl font-semibold mb-4">ExportPanel</h2>
        <div className="max-w-md">
          <ExportPanel
            onDownload={() => alert("Downloading...")}
            onShare={(platform) => alert(`Sharing to ${platform}`)}
          />
        </div>
      </section>

      {/* PhotoUploader */}
      <section>
        <h2 className="text-xl font-semibold mb-4">PhotoUploader</h2>
        <div className="max-w-md">
          <PhotoUploader
            onFileSelect={(file, processed) =>
              console.log("File selected:", file.name, processed)
            }
            onError={(error) => alert(`Error: ${error}`)}
          />
        </div>
      </section>

      {/* ResultCarousel */}
      <section>
        <h2 className="text-xl font-semibold mb-4">ResultCarousel</h2>
        <div className="max-w-md">
          <ResultCarousel
            results={mockMonologues}
            currentIndex={selectedResultIndex}
            onSelectResult={setSelectedResultIndex}
          />
        </div>
      </section>

      {/* MemeEditor */}
      <section>
        <h2 className="text-xl font-semibold mb-4">MemeEditor</h2>
        <div className="max-w-md">
          <MemeEditor
            imageUrl="https://placekitten.com/400/400"
            text="本喵今天心情不错！"
            showWatermark
            onExport={(dataUrl) => console.log("Exported:", dataUrl.slice(0, 50))}
          />
        </div>
      </section>
    </div>
  )
}
