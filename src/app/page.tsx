import Link from "next/link"
import { Activity, CheckCircle2, Clock, DollarSign, Plus, FileUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PageHeader, StatCard } from "@/components/crm/shared"
import { SerialSearch } from "@/components/crm/serial-search"
import { RecentJobsTable } from "@/components/crm/recent-jobs-table"
import { WorkloadBoard } from "@/components/crm/workload-board"

import { jobs, isOpen, jobTotal, formatCurrency, daysBetween } from "@/lib/data"

export default function DashboardPage() {

  // Find all jobs that are currently open
  const openJobs = jobs.filter(isOpen)

  // Find completed in-house repairs
  const completedJobs = jobs.filter((job) => {
    return job.source === "Manual" && Boolean(job.completedDate)
  })

  // Find jobs completed during 2026
  const completedThisYear = completedJobs.filter((job) => {
    return job.completedDate?.startsWith("2026")
  })

  // Calculate average in-house turnaround time
  let totalRepairDays = 0

  for (const job of completedJobs) {
    if (job.completedDate) {
      totalRepairDays += daysBetween(
        job.receivedDate,
        job.completedDate
      )
    }
  }

  const avgTurnaround = completedJobs.length > 0
    ? totalRepairDays / completedJobs.length
    : 0

  // Find completed repairs imported from vendor invoices
  const vendorJobs = jobs.filter((job) => {
    return job.source === "PDF Import" && Boolean(job.completedDate)
  })

  // Calculate average vendor turnaround time
  let totalVendorDays = 0

  for (const job of vendorJobs) {
    if (job.completedDate) {
      totalVendorDays += daysBetween(
        job.receivedDate,
        job.completedDate
      )
    }
  }

  const avgVendorTurnaround = vendorJobs.length > 0
    ? totalVendorDays / vendorJobs.length
    : 0

  // Calculate the total value of repairs completed in 2026
  let repairValue = 0

  for (const job of completedThisYear) {
    repairValue += jobTotal(job)
  }

  // Find the eight most recent in-house repair jobs
  const recentJobs = jobs
    .filter((job) => job.source === "Manual")
    .sort((firstJob, secondJob) => {
      return (
        new Date(secondJob.receivedDate).getTime() -
        new Date(firstJob.receivedDate).getTime()
      )
    })
    .slice(0, 8)

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">

      <PageHeader
        title="Dashboard"
        description="Electronics division overview: Beresfield repair centre"
        actions={
          <>
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/import" />}
            >
              <FileUp data-icon="inline-start" />
              Import Invoices
            </Button>

            <Button
              nativeButton={false}
              render={<Link href="/jobs/new" />}
            >
              <Plus data-icon="inline-start" />
              New service job
            </Button>
          </>
        }
      />

      <SerialSearch />

      <section
        aria-label="Key metrics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >

        <StatCard
          label="Open jobs"
          value={String(openJobs.length)}
          hint="Across all repair stages"
          icon={Activity}
        />

        <StatCard
          label="Completed in 2026"
          value={String(completedThisYear.length)}
          hint="In-house repairs"
          icon={CheckCircle2}
        />

        <StatCard
          label="Avg turnaround"
          value={`${avgTurnaround.toFixed(1)} days`}
          hint={`vs ${avgVendorTurnaround.toFixed(0)} days via US vendor`}
          icon={Clock}
        />

        <StatCard
          label="Repair value 2026"
          value={formatCurrency(repairValue)}
          hint="Labour + parts, invoiced"
          icon={DollarSign}
        />

      </section>

      <WorkloadBoard jobs={openJobs} />

      <RecentJobsTable jobs={recentJobs} />

    </div>
  )
}