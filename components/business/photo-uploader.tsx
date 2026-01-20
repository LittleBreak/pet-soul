"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import imageCompression from "browser-image-compression"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
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

  return (
    <Card
      data-slot="photo-uploader"
      data-state={state}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      {/* Preview state */}
      {preview && state === "done" && (
        <div className="relative aspect-square w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Uploaded preview"
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
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

      {/* Upload states */}
      {!preview && (
        <div
          {...getRootProps()}
          className={cn(
            "flex flex-col items-center justify-center p-8 aspect-square",
            "border-2 border-dashed rounded-2xl transition-colors cursor-pointer",
            state === "dragging"
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50",
            state === "error" && "border-error bg-error/5"
          )}
        >
          <input {...getInputProps()} />

          {state === "uploading" && (
            <>
              <Loader2 className="size-12 text-primary animate-spin mb-4" />
              <p className="text-sm text-muted-foreground">Processing...</p>
            </>
          )}

          {state === "error" && (
            <>
              <AlertCircle className="size-12 text-error mb-4" />
              <p className="text-sm text-error text-center mb-2">
                {errorMessage}
              </p>
              <Button variant="outline" size="sm" onClick={reset}>
                Try Again
              </Button>
            </>
          )}

          {(state === "idle" || state === "dragging") && (
            <>
              {state === "dragging" ? (
                <Upload className="size-12 text-primary mb-4" />
              ) : (
                <ImagePlus className="size-12 text-muted-foreground mb-4" />
              )}
              <p className="text-sm font-medium mb-1">
                {state === "dragging"
                  ? "Drop your image here"
                  : "Upload a photo of your pet"}
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, HEIC up to {maxSize}MB
              </p>
            </>
          )}
        </div>
      )}
    </Card>
  )
}

export { PhotoUploader }
