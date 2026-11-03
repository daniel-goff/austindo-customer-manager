"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Brand } from "./app-sidebar"
import { navItems, isActive } from "./nav-items"

export function MobileNav() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-20 border-b border-sidebar-border bg-sidebar text-sidebar-foreground md:hidden">
      <div className="px-4 pt-3">
        <Brand />
      </div>
      <nav aria-label="Main" className="overflow-x-auto px-2 py-2">
        <ul className="flex gap-1">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-sm",
                    active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80",
                  )}
                >
                  <item.icon className={cn("size-3.5", active && "text-sidebar-primary")} aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}