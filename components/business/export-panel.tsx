"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Share2, Loader2 } from "@/components/shared/icons"
import { SHARE_PLATFORMS } from "@/lib/constants/share"

export interface ExportPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Callback when download button is clicked */
  onDownload: () => void | Promise<void>
  /** Callback when a share platform is selected */
  onShare: (platformId: string) => void | Promise<void>
  /** Whether download is in progress */
  downloading?: boolean
  /** Disabled state */
  disabled?: boolean
}

function ExportPanel({
  onDownload,
  onShare,
  downloading = false,
  disabled = false,
  className,
  ...props
}: ExportPanelProps) {
  const [sharingPlatform, setSharingPlatform] = React.useState<string | null>(
    null
  )

  const handleDownload = async () => {
    if (disabled || downloading) return
    await onDownload()
  }

  const handleShare = async (platformId: string) => {
    if (disabled || sharingPlatform) return
    setSharingPlatform(platformId)
    try {
      await onShare(platformId)
    } finally {
      setSharingPlatform(null)
    }
  }

  return (
    <Card
      data-slot="export-panel"
      className={cn("p-4", className)}
      {...props}
    >
      <div className="flex flex-col gap-4">
        {/* Share section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Share2 className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium">Share to</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {SHARE_PLATFORMS.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handleShare(platform.id)}
                disabled={disabled || sharingPlatform !== null}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-3 rounded-xl",
                  "bg-muted/50 hover:bg-muted transition-colors",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                aria-label={`Share to ${platform.name}`}
              >
                {sharingPlatform === platform.id ? (
                  <Loader2 className="size-6 animate-spin" />
                ) : (
                  <span
                    className="text-2xl"
                    style={{ color: platform.color }}
                    role="img"
                    aria-hidden="true"
                  >
                    {platform.icon}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {platform.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Download button */}
        <Button
          onClick={handleDownload}
          disabled={disabled || downloading}
          loading={downloading}
          className="w-full"
          size="lg"
        >
          <Download className="size-5" />
          Save to Device
        </Button>
      </div>
    </Card>
  )
}

export { ExportPanel }
