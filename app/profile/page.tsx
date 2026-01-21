'use client'

import { Settings, HelpCircle, Info, ChevronRight, User } from 'lucide-react'
import { useUserStore } from '@/lib/stores/use-user-store'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { CreditDisplay } from '@/components/business/credit-display'

const MENU_ITEMS = [
  {
    id: 'settings',
    icon: Settings,
    label: '设置',
  },
  {
    id: 'help',
    icon: HelpCircle,
    label: '帮助与反馈',
  },
  {
    id: 'about',
    icon: Info,
    label: '关于 PetSoul',
  },
] as const

export default function ProfilePage() {
  const userProfile = useUserStore((s) => s.userProfile)
  const remainingFreeQuota = useUserStore((s) => s.remainingFreeQuota)

  const totalQuota = 5
  const usedQuota = totalQuota - remainingFreeQuota

  const handleMenuClick = (itemId: string) => {
    // Placeholder for future navigation
    console.log(`Menu item clicked: ${itemId}`)
  }

  return (
    <div className="flex min-h-screen flex-col px-4 py-6">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        {/* Header */}
        <h1 className="text-xl font-heading font-semibold">我的</h1>

        {/* User Card */}
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <Avatar size="xl">
              {userProfile?.avatar ? (
                <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
              ) : null}
              <AvatarFallback>
                <User className="size-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-semibold text-lg">
                {userProfile?.name || 'Guest User'}
              </h2>
              <p className="text-sm text-muted-foreground">
                点击登录以保存你的创作
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Credit Card */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              今日使用额度
            </h3>
            <CreditDisplay
              variant="detailed"
              used={usedQuota}
              total={totalQuota}
            />
          </CardContent>
        </Card>

        {/* Menu List */}
        <Card>
          <div className="divide-y divide-border">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className="flex items-center gap-4 w-full p-4 hover:bg-muted/50 transition-colors text-left"
                >
                  <Icon className="size-5 text-muted-foreground" />
                  <span className="flex-1">{item.label}</span>
                  <ChevronRight className="size-5 text-muted-foreground" />
                </button>
              )
            })}
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground pt-4">
          PetSoul v1.0.0
        </p>
      </div>
    </div>
  )
}
