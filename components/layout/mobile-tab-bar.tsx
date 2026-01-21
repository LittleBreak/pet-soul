"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, History, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface TabItem {
  href: string
  label: string
  icon: typeof Home
}

const tabs: TabItem[] = [
  { href: "/", label: "首页", icon: Home },
  { href: "/history", label: "历史", icon: History },
  { href: "/profile", label: "我的", icon: User },
]

export function MobileTabBar() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 glass safe-area-inset-bottom"
      role="navigation"
      aria-label="主导航"
    >
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          const Icon = tab.icon

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1",
                "transition-colors duration-200",
                "focus-ring rounded-lg",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "w-6 h-6 transition-transform duration-200",
                  isActive && "scale-110"
                )}
                aria-hidden="true"
              />
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
