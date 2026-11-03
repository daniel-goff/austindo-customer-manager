import { LayoutDashboard, Wrench, CircuitBoard, Building2, FileUp, BarChart3 } from "lucide-react"

export const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/jobs", label: "Service Jobs", icon: Wrench },
  { href: "/equipment", label: "Equipment", icon: CircuitBoard },
  { href: "/customers", label: "Customers", icon: Building2 },
  { href: "/import", label: "PDF Import", icon: FileUp },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
]

export function isActive(pathname: string, href: string) {

  // Check whether we are on the dashboard
  if (href === "/") {
    return pathname === "/"
  }

  // Check whether the current page matches the navigation link
  if (pathname === href) {
    return true
  }

  // Check whether we are viewing a page within this section
  return pathname.startsWith(`${href}/`)
}