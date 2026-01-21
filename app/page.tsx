'use client'

import { useAppStore } from '@/lib/stores/use-app-store'
import { useAIAnalysis } from '@/lib/hooks/use-ai-analysis'
import { useMemeGenerator } from '@/lib/hooks/use-meme-generator'
import {
  PhotoUploader,
  PersonaSelector,
  ResultCarousel,
  MemeEditor,
  ExportPanel,
  type ProcessedImage,
} from '@/components/business'
import { PERSONAS } from '@/lib/constants/personas'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Loader2, RefreshCw, Sparkles } from '@/components/shared/icons'
import type { Monologue } from '@/types'

export default function HomePage() {
  const step = useAppStore((s) => s.step)

  switch (step) {
    case 'upload':
      return <UploadView />
    case 'persona':
      return <PersonaView />
    case 'result':
      return <ResultView />
    default:
      return <UploadView />
  }
}

function UploadView() {
  const setPhoto = useAppStore((s) => s.setPhoto)

  const handleFileSelect = (_file: File, processed: ProcessedImage) => {
    setPhoto(processed.previewUrl)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        {/* Branding */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-heading font-bold">
            PetSoul
          </h1>
          <p className="text-muted-foreground">
            给你的宠物配上灵魂独白
          </p>
        </div>

        {/* Photo Uploader */}
        <PhotoUploader
          onFileSelect={handleFileSelect}
          className="w-full"
        />

        {/* Subtitle */}
        <p className="text-center text-sm text-muted-foreground">
          上传一张宠物照片，AI 将为它生成专属内心戏
        </p>
      </div>
    </div>
  )
}

function PersonaView() {
  const currentPhoto = useAppStore((s) => s.currentPhoto)
  const selectedPersonaId = useAppStore((s) => s.selectedPersonaId)
  const isGenerating = useAppStore((s) => s.isGenerating)
  const generationError = useAppStore((s) => s.generationError)
  const setPersona = useAppStore((s) => s.setPersona)
  const resetFlow = useAppStore((s) => s.resetFlow)

  const { generateMemeText } = useAIAnalysis()

  const handleBack = () => {
    resetFlow()
  }

  const handleGenerate = () => {
    generateMemeText()
  }

  return (
    <div className="flex min-h-screen flex-col px-4 py-6">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            disabled={isGenerating}
          >
            <ArrowLeft className="size-5" />
          </Button>
          <h2 className="text-xl font-heading font-semibold">
            选择人设
          </h2>
        </div>

        {/* Photo Preview */}
        {currentPhoto && (
          <Card className="overflow-hidden">
            <div className="relative aspect-square w-full max-w-xs mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentPhoto}
                alt="Uploaded pet"
                className="size-full object-cover"
              />
            </div>
          </Card>
        )}

        {/* Persona Selector */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            选择一个人设风格
          </h3>
          <PersonaSelector
            selectedId={selectedPersonaId}
            onSelect={setPersona}
          />
        </div>

        {/* Error Message */}
        {generationError && (
          <div className="rounded-lg bg-error/10 border border-error/20 p-4 text-center">
            <p className="text-sm text-error">{generationError}</p>
          </div>
        )}

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          size="lg"
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              AI 正在生成中...
            </>
          ) : (
            <>
              <Sparkles className="size-5" />
              生成内心戏
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

function ResultView() {
  const currentPhoto = useAppStore((s) => s.currentPhoto)
  const selectedPersonaId = useAppStore((s) => s.selectedPersonaId)
  const generatedCaptions = useAppStore((s) => s.generatedCaptions)
  const selectedCaptionIndex = useAppStore((s) => s.selectedCaptionIndex)
  const selectCaption = useAppStore((s) => s.selectCaption)
  const setFinalMeme = useAppStore((s) => s.setFinalMeme)
  const finalMemeImage = useAppStore((s) => s.finalMemeImage)
  const resetFlow = useAppStore((s) => s.resetFlow)

  const { downloadMeme } = useMemeGenerator()

  // Convert captions to Monologue[] for ResultCarousel
  const persona = PERSONAS[selectedPersonaId]
  const monologues: Monologue[] = generatedCaptions.map((content, i) => ({
    id: `monologue-${i}`,
    content,
    personaId: selectedPersonaId,
    tone: persona?.styleTags[0] || '',
  }))

  const currentCaption = generatedCaptions[selectedCaptionIndex] || ''

  const handleExport = (dataUrl: string) => {
    setFinalMeme(dataUrl)
  }

  const handleDownload = () => {
    if (finalMemeImage) {
      downloadMeme(finalMemeImage)
    }
  }

  const handleShare = async (platformId: string) => {
    if (!finalMemeImage) return

    // Use Web Share API if available
    if (navigator.share) {
      try {
        // Convert data URL to blob for sharing
        const response = await fetch(finalMemeImage)
        const blob = await response.blob()
        const file = new File([blob], 'petsoul-meme.png', { type: 'image/png' })

        await navigator.share({
          title: 'PetSoul - 宠物内心戏',
          text: currentCaption,
          files: [file],
        })
      } catch (error) {
        // User cancelled or share failed
        console.log('Share cancelled or failed:', error)
      }
    } else {
      // Fallback: download the image
      console.log(`Sharing to ${platformId} not implemented, downloading instead`)
      handleDownload()
    }
  }

  const handleStartNew = () => {
    resetFlow()
  }

  if (!currentPhoto) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Button onClick={handleStartNew}>返回首页</Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col px-4 py-6">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <h2 className="text-xl font-heading font-semibold">
            选择你喜欢的内心戏
          </h2>
          <p className="text-sm text-muted-foreground">
            左右滑动切换，拖动文字调整位置
          </p>
        </div>

        {/* Result Carousel */}
        {monologues.length > 0 && (
          <ResultCarousel
            results={monologues}
            currentIndex={selectedCaptionIndex}
            onSelectResult={selectCaption}
          />
        )}

        {/* Meme Editor */}
        <MemeEditor
          imageUrl={currentPhoto}
          text={currentCaption}
          onExport={handleExport}
          showWatermark={true}
        />

        {/* Export Panel */}
        <ExportPanel
          onDownload={handleDownload}
          onShare={handleShare}
          disabled={!finalMemeImage}
        />

        {/* Start New Button */}
        <Button
          variant="outline"
          onClick={handleStartNew}
          className="w-full"
        >
          <RefreshCw className="size-4" />
          重新开始
        </Button>
      </div>
    </div>
  )
}
