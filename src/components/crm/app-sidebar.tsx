"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { navItems, isActive } from "./nav-items"

export function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <Image src="/ACS.svg" alt="Austindo Consulting Services" width={40} height={40} className="rounded-full" />
      <span className="flex flex-col leading-tight">
        <span className="text-lg font-semibold text-sidebar-accent-foreground">AUSTINDO</span>
        <span className="text-base uppercase tracking-wider text-sidebar-foreground/60">Electronics</span>
      </span>
    </Link>
  )
}

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
      <div className="px-5 py-5">
        <Brand />
      </div>
      <nav aria-label="Main" className="flex-1 px-4">
        <ul className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-base transition-colors",
                    active
                      ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className={cn("size-4", active && "text-sidebar-primary")} aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="m-3 flex items-center gap-3 rounded-md border border-sidebar-border px-3 py-2.5">
        <span className="flex size-8 items-center justify-center rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
         DG
        </span>
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-sm font-medium text-sidebar-accent-foreground">Daniel Goff</span>
          <span className="text-xs text-sidebar-foreground/60">Administrator</span>
        </span>
      </div>
    </aside>
  )
}