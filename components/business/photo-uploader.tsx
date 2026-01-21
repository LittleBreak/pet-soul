"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import imageCompression from "browser-image-compression"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Camera,
  Upload,
  ImagePlus,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
} from "@/components/shared/icons"

type UploadState = "idle" | "dragging" | "uploading" | "done" | "error"

export interface ProcessedImage {
  file: File
  previewUrl: string
  width: number
  height: number
}

export interface PhotoUploaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onError"> {
  /** Callback when file is selected and processed */
  onFileSelect: (file: File, processed: ProcessedImage) => void
  /** Maximum file size in MB (default: 10) */
  maxSize?: number
  /** Accepted file types */
  accepts?: string[]
  /** Callback when an error occurs */
  onError?: (error: string) => void
}

const DEFAULT_ACCEPTS = ["image/jpeg", "image/png", "image/heic", "image/heif"]
const MAX_SIZE_MB = 10
const COMPRESS_THRESHOLD_MB = 2
const TARGET_SIZE_MB = 1

async function convertHeicToJpeg(file: File): Promise<File> {
  // Dynamic import for heic2any to reduce bundle size
  const heic2any = (await import("heic2any")).default
  const blob = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.9,
  })
  const convertedBlob = Array.isArray(blob) ? blob[0] : blob
  return new File([convertedBlob], file.name.replace(/\.heic$/i, ".jpg"), {
    type: "image/jpeg",
  })
}

async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: TARGET_SIZE_MB,
    maxWidthOrHeight: 2048,
    useWebWorker: true,
  }
  return await imageCompression(file, options)
}

function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
      URL.revokeObjectURL(img.src)
    }
    img.onerror = () => {
      reject(new Error("Failed to load image"))
      URL.revokeObjectURL(img.src)
    }
    img.src = URL.createObjectURL(file)
  })
}

function PhotoUploader({
  onFileSelect,
  maxSize = MAX_SIZE_MB,
  accepts = DEFAULT_ACCEPTS,
  onError,
  className,
  ...props
}: PhotoUploaderProps) {
  const [state, setState] = React.useState<UploadState>("idle")
  const [preview, setPreview] = React.useState<string | null>(null)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const processFile = React.useCallback(
    async (file: File) => {
      setState("uploading")
      setErrorMessage(null)

      try {
        // Validate size
        const sizeMB = file.size / (1024 * 1024)
        if (sizeMB > maxSize) {
          throw new Error(`File too large. Maximum size is ${maxSize}MB.`)
        }

        let processedFile = file

        // Convert HEIC to JPEG
        if (
          file.type === "image/heic" ||
          file.type === "image/heif" ||
          file.name.toLowerCase().endsWith(".heic")
        ) {
          processedFile = await convertHeicToJpeg(file)
        }

        // Compress if needed
        const processedSizeMB = processedFile.size / (1024 * 1024)
        if (processedSizeMB > COMPRESS_THRESHOLD_MB) {
          processedFile = await compressImage(processedFile)
        }

        // Get dimensions
        const dimensions = await getImageDimensions(processedFile)

        // Create preview URL
        const previewUrl = URL.createObjectURL(processedFile)
        setPreview(previewUrl)

        setState("done")

        onFileSelect(file, {
          file: processedFile,
          previewUrl,
          ...dimensions,
        })
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to process image"
        setErrorMessage(message)
        setState("error")
        onError?.(message)
      }
    },
    [maxSize, onFileSelect, onError]
  )

  const { getRootProps, getInputProps } = useDropzone({
    accept: accepts.reduce(
      (acc, type) => {
        acc[type] = []
        return acc
      },
      {} as Record<string, string[]>
    ),
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        processFile(acceptedFiles[0])
      }
    },
    onDragEnter: () => setState("dragging"),
    onDragLeave: () => setState((s) => (s === "dragging" ? "idle" : s)),
  })

  const reset = () => {
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    setPreview(null)
    setState("idle")
    setErrorMessage(null)
  }

  // Cleanup preview URL on unmount
  React.useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  // Corner bracket SVG component for decoration (matching design spec)
  const CornerBracket = ({
    position,
  }: {
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right"
  }) => {
    const positionClasses = {
      "top-left": "top-6 left-6",
      "top-right": "top-6 right-6",
      "bottom-left": "bottom-6 left-6",
      "bottom-right": "bottom-6 right-6",
    }

    const paths = {
      "top-left": "M2 10V2H10",
      "top-right": "M22 10V2H14",
      "bottom-left": "M2 14V22H10",
      "bottom-right": "M22 14V22H14",
    }

    return (
      <svg
        className={cn(
          "absolute w-6 h-6 text-primary/30 pointer-events-none",
          positionClasses[position]
        )}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        viewBox="0 0 24 24"
      >
        <path
          d={paths[position]}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <div
      data-slot="photo-uploader"
      data-state={state}
      className={cn("flex flex-col", className)}
      {...props}
    >
      {/* Upload Card */}
      <Card className="relative overflow-hidden bg-background/50 backdrop-blur-sm border-0 flex-1">
        {/* Preview state */}
        {preview && state === "done" && (
          <div className="relative aspect-square w-full h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Uploaded preview"
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
              <CheckCircle className="size-5" />
              <span className="text-sm font-medium">Ready to generate</span>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={reset}
              className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
              aria-label="Remove image"
            >
              <X className="size-4" />
            </Button>
          </div>
        )}

        {/* Upload area */}
        {!preview && (
          <div
            {...getRootProps()}
            className={cn(
              "relative w-full h-full min-h-70 flex flex-col items-center justify-center cursor-pointer",
              "border-3 border-dashed border-primary/30 hover:border-primary rounded-[2.5rem]",
              "transition-all duration-300",
              state === "dragging" && "border-primary bg-primary/5"
            )}
          >
            <input {...getInputProps()} />

            {/* Corner brackets decoration */}
            <CornerBracket position="top-left" />
            <CornerBracket position="top-right" />
            <CornerBracket position="bottom-left" />
            <CornerBracket position="bottom-right" />

            {state === "uploading" && (
              <>
                <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Loader2 className="size-12 text-primary animate-spin" />
                </div>
                <p className="text-sm text-muted-foreground">Processing...</p>
              </>
            )}

            {state === "error" && (
              <>
                <div className="size-24 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
                  <AlertCircle className="size-12 text-destructive" />
                </div>
                <p className="text-sm text-destructive text-center mb-2">
                  {errorMessage}
                </p>
                <Button variant="outline" size="sm" onClick={reset}>
                  Try Again
                </Button>
              </>
            )}

            {(state === "idle" || state === "dragging") && (
              <div className="flex flex-col items-center gap-6 p-6">
                <div
                  className={cn(
                    "size-24 rounded-full flex items-center justify-center transition-all duration-300",
                    state === "dragging"
                      ? "bg-primary text-background"
                      : "bg-primary/10 text-primary hover:bg-primary hover:text-background"
                  )}
                >
                  {state === "dragging" ? (
                    <Upload className="size-12" />
                  ) : (
                    <Camera className="size-12" />
                  )}
                </div>
                <div className="text-center space-y-2 max-w-60">
                  <p className="text-xl font-bold leading-tight">
                    {state === "dragging"
                      ? "Drop your image here"
                      : "Upload pet photo"}
                  </p>
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                    {state === "dragging"
                      ? `JPG, PNG, HEIC up to ${maxSize}MB`
                      : "Tap the camera to capture their inner thoughts"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Action Buttons - separate from card */}
      {!preview && (state === "idle" || state === "dragging") && (
        <div className="flex gap-4 mt-8">
          <Button
            {...getRootProps()}
            className="flex-1 h-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base shadow-lg shadow-primary/20"
          >
            <input {...getInputProps()} />
            <Camera className="size-5 mr-2" />
            Take Photo
          </Button>
          <Button
            {...getRootProps()}
            variant="outline"
            className="flex-1 h-14 rounded-full border-primary bg-transparent text-primary hover:bg-primary/10 font-bold text-base"
          >
            <input {...getInputProps()} />
            <ImagePlus className="size-5 mr-2" />
            Album
          </Button>
        </div>
      )}
    </div>
  )
}

export { PhotoUploader }
