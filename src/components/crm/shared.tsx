import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { cn} from "@/lib/utils"
import type { JobStatus, JobSource } from "@/lib/data"

  
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">{title}</h1>
        {description && <p className="text-sm text-muted-foreground text-pretty">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

const statusStyles: Record<JobStatus, string> = {
  Received: "bg-chart-2/15 text-chart-2 ring-chart-2/30",
  Diagnosing: "bg-chart-4/20 text-foreground ring-chart-4/40",
  "In Repair": "bg-primary/15 text-primary ring-primary/30",
  Testing: "bg-chart-5/15 text-chart-5 ring-chart-5/30",
  Completed: "bg-success/15 text-success ring-success/30",
  Scrapped: "bg-destructive/15 text-destructive ring-destructive/30",
}

export function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        statusStyles[status],
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  )
}

export function SourceTag({ source }: { source: JobSource }) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        source === "PDF Import" ? "bg-chart-2/15 text-chart-2" : "bg-muted text-muted-foreground",
      )}
    >
      {source === "PDF Import" ? "Imported" : "In-house"}
    </span>
  )
}

export function SerialLink({ serial, className }: { serial: string; className?: string }) {
  return (
    <Link
      href={`/equipment/${serial}`}
      className={cn("font-mono text-sm font-medium text-foreground underline-offset-4 hover:text-primary hover:underline", className)}
    >
      {serial}
    </Link>
  )
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string
  value: string
  hint?: string
  icon: LucideIcon
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
      </div>
      <span className="text-2xl font-semibold tracking-tight tabular-nums">{value}</span>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  )
}