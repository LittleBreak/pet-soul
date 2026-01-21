'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { History, Sparkles, Calendar } from 'lucide-react'
import { useUserStore, type MemeRecord } from '@/lib/stores/use-user-store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function HistoryPage() {
  const router = useRouter()
  const history = useUserStore((s) => s.history)
  const [selectedRecord, setSelectedRecord] = useState<MemeRecord | null>(null)

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(timestamp))
  }

  const handleStartCreating = () => {
    router.push('/')
  }

  // Empty state
  if (history.length === 0) {
    return (
      <div className="flex min-h-screen flex-col px-4 py-6">
        <div className="mx-auto w-full max-w-2xl space-y-6">
          {/* Header */}
          <h1 className="text-xl font-heading font-semibold">历史记录</h1>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <History className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold mb-2">暂无创作记录</h2>
            <p className="text-muted-foreground max-w-xs mb-6">
              开始创作你的第一个宠物内心戏吧
            </p>
            <Button onClick={handleStartCreating}>
              <Sparkles className="size-4" />
              开始创作
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // History grid
  return (
    <div className="flex min-h-screen flex-col px-4 py-6">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        {/* Header */}
        <h1 className="text-xl font-heading font-semibold">历史记录</h1>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4">
          {history.map((record) => (
            <Card
              key={record.id}
              hover="lift"
              className="overflow-hidden"
              onClick={() => setSelectedRecord(record)}
            >
              <div className="aspect-square relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={record.imageUrl}
                  alt="Meme"
                  className="size-full object-cover"
                />
              </div>
              <div className="p-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="size-3" />
                <span>{formatDate(record.createdAt)}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog
        open={!!selectedRecord}
        onOpenChange={(open) => !open && setSelectedRecord(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>预览</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedRecord.imageUrl}
                  alt="Meme preview"
                  className="w-full h-auto"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                {formatDate(selectedRecord.createdAt)}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
