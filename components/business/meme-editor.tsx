"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Type, Palette, Wand2, Loader2 } from "@/components/shared/icons"
import { FONTS, FILTERS, DEFAULT_TEXT_STYLE, WATERMARK } from "@/lib/constants/ui"
import type { MemeConfig, TextStyle, TextPosition } from "@/types"

// Dynamic import for Konva to avoid SSR issues
const Stage = dynamic(() => import("react-konva").then((mod) => mod.Stage), {
  ssr: false,
})
const Layer = dynamic(() => import("react-konva").then((mod) => mod.Layer), {
  ssr: false,
})
const KonvaImage = dynamic(() => import("react-konva").then((mod) => mod.Image), {
  ssr: false,
})
const Text = dynamic(() => import("react-konva").then((mod) => mod.Text), {
  ssr: false,
})

type FilterType = keyof typeof FILTERS
type ControlTab = "font" | "filter"

export interface MemeEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** URL of the image to edit */
  imageUrl: string
  /** Text to display on the meme */
  text: string
  /** Optional style overrides */
  styleOptions?: Partial<MemeConfig>
  /** Callback when meme is exported */
  onExport?: (dataUrl: string) => void
  /** Whether to show watermark (for free users) */
  showWatermark?: boolean
}

function MemeEditor({
  imageUrl,
  text,
  styleOptions,
  onExport,
  showWatermark = true,
  className,
  ...props
}: MemeEditorProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stageInstance, setStageInstance] = React.useState<any>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Image state
  const [image, setImage] = React.useState<HTMLImageElement | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [dimensions, setDimensions] = React.useState({ width: 400, height: 400 })

  // Text state
  const [textStyle, setTextStyle] = React.useState<TextStyle>({
    ...DEFAULT_TEXT_STYLE,
    ...styleOptions?.textStyle,
  })
  const [textPosition, setTextPosition] = React.useState<TextPosition>({
    x: 50,
    y: 80,
    rotation: 0,
    ...styleOptions?.textPosition,
  })

  // Filter state
  const [filter, setFilter] = React.useState<FilterType>(
    (styleOptions?.filter as FilterType) ?? "none"
  )

  // UI state
  const [activeTab, setActiveTab] = React.useState<ControlTab>("font")
  const [selectedFontIndex, setSelectedFontIndex] = React.useState(0)

  // Load image
  React.useEffect(() => {
    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      setImage(img)
      setLoading(false)

      // Calculate dimensions to fit container
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth
        const aspectRatio = img.width / img.height
        const height = containerWidth / aspectRatio
        setDimensions({ width: containerWidth, height })
      }
    }
    img.onerror = () => {
      setLoading(false)
    }
    img.src = imageUrl
  }, [imageUrl])

  // Handle text drag
  const handleTextDragEnd = (e: { target: { x: () => number; y: () => number } }) => {
    const x = (e.target.x() / dimensions.width) * 100
    const y = (e.target.y() / dimensions.height) * 100
    setTextPosition((prev) => ({ ...prev, x, y }))
  }

  // Font selection
  const handleFontSelect = (index: number) => {
    setSelectedFontIndex(index)
    setTextStyle((prev) => ({ ...prev, fontFamily: FONTS[index].family }))
  }

  // Export meme
  const handleExport = React.useCallback(() => {
    if (!stageInstance) return

    const dataUrl = stageInstance.toDataURL({ pixelRatio: 2 })
    onExport?.(dataUrl)
  }, [onExport, stageInstance])

  // Calculate actual pixel positions from percentages
  const textX = (textPosition.x / 100) * dimensions.width
  const textY = (textPosition.y / 100) * dimensions.height
  const watermarkX = (WATERMARK.position.x / 100) * dimensions.width
  const watermarkY = (WATERMARK.position.y / 100) * dimensions.height

  return (
    <div
      data-slot="meme-editor"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      {/* Canvas container */}
      <div ref={containerRef}>
        <Card className="overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center aspect-square">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div
              style={{
                filter: FILTERS[filter].css || undefined,
              }}
            >
              <Stage
                ref={(node) => setStageInstance(node)}
                width={dimensions.width}
                height={dimensions.height}
              >
                <Layer>
                  {/* Background image */}
                  {image && (
                    <KonvaImage
                      image={image}
                      width={dimensions.width}
                      height={dimensions.height}
                    />
                  )}

                  {/* Draggable text */}
                  <Text
                    text={text}
                    x={textX}
                    y={textY}
                    fontSize={textStyle.fontSize}
                    fontFamily={textStyle.fontFamily}
                    fill={textStyle.color}
                    stroke={textStyle.strokeColor}
                    strokeWidth={textStyle.strokeWidth}
                    fontStyle={textStyle.isBold ? "bold" : "normal"}
                    rotation={textPosition.rotation}
                    draggable
                    onDragEnd={handleTextDragEnd}
                    offsetX={0}
                    align="center"
                  />

                  {/* Watermark */}
                  {showWatermark && (
                    <Text
                      text={WATERMARK.text}
                      x={watermarkX}
                      y={watermarkY}
                      fontSize={WATERMARK.fontSize}
                      fill={WATERMARK.color}
                      opacity={0.6}
                    />
                  )}
                </Layer>
              </Stage>
            </div>
          )}
        </Card>
      </div>

      {/* Controls */}
      <Card className="p-4">
        {/* Tab buttons */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={activeTab === "font" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("font")}
            className="flex-1"
          >
            <Type className="size-4 mr-1" />
            Font
          </Button>
          <Button
            variant={activeTab === "filter" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("filter")}
            className="flex-1"
          >
            <Wand2 className="size-4 mr-1" />
            Filter
          </Button>
        </div>

        {/* Font controls */}
        {activeTab === "font" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Font family selection */}
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">
                Font Style
              </label>
              <div className="flex flex-wrap gap-2">
                {FONTS.map((font, index) => (
                  <Badge
                    key={font.id}
                    variant={selectedFontIndex === index ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleFontSelect(index)}
                  >
                    {font.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Font size slider */}
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">
                Font Size: {textStyle.fontSize}px
              </label>
              <Slider
                value={[textStyle.fontSize]}
                onValueChange={([value]) =>
                  setTextStyle((prev) => ({ ...prev, fontSize: value }))
                }
                min={12}
                max={72}
                step={2}
              />
            </div>

            {/* Color selection */}
            <div>
              <label className="text-xs text-muted-foreground mb-2 block flex items-center gap-1">
                <Palette className="size-3" />
                Text Color
              </label>
              <div className="flex gap-2">
                {["#FFFFFF", "#000000", "#FF6B6B", "#4ECDC4", "#FFE66D"].map(
                  (color) => (
                    <button
                      key={color}
                      onClick={() =>
                        setTextStyle((prev) => ({ ...prev, color }))
                      }
                      className={cn(
                        "size-8 rounded-full border-2 transition-all",
                        textStyle.color === color
                          ? "border-primary scale-110"
                          : "border-transparent"
                      )}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Filter controls */}
        {activeTab === "filter" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <label className="text-xs text-muted-foreground mb-2 block">
              Image Filter
            </label>
            <div className="flex gap-2">
              {(Object.keys(FILTERS) as FilterType[]).map((filterKey) => (
                <Badge
                  key={filterKey}
                  variant={filter === filterKey ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setFilter(filterKey)}
                >
                  {FILTERS[filterKey].name}
                </Badge>
              ))}
            </div>
          </motion.div>
        )}
      </Card>

      {/* Export button */}
      {onExport && (
        <Button onClick={handleExport} size="lg" className="w-full">
          Export Meme
        </Button>
      )}
    </div>
  )
}

export { MemeEditor }
