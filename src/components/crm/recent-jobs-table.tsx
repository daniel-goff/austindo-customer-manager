import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getCustomer, getProduct, getTechnician, formatCurrency, formatDate, jobTotal, type ServiceJob } from "@/lib/data"
import { StatusBadge, SerialLink, SourceTag } from "./shared"

export function JobsTable({ jobs, showSource = false }: { jobs: ServiceJob[]; showSource?: boolean }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-4">Job</TableHead>
            <TableHead>Serial</TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="hidden lg:table-cell">Customer</TableHead>
            <TableHead className="hidden md:table-cell">Technician</TableHead>
            <TableHead>Received</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="pr-4 text-right">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                No jobs match these filters.
              </TableCell>
            </TableRow>
          )}
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="pl-4">
                <div className="flex items-center gap-2">
                  <Link href={`/jobs/${job.id}`} className="font-mono text-sm text-muted-foreground hover:text-primary">
                    {job.id}
                  </Link>
                  {showSource && <SourceTag source={job.source} />}
                </div>
              </TableCell>
              <TableCell>
                <SerialLink serial={job.serial} />
              </TableCell>
              <TableCell>{getProduct(job.model)?.name}</TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground">{getCustomer(job.customerId)?.name}</TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">{getTechnician(job.technicianId)?.name}</TableCell>
              <TableCell className="tabular-nums text-muted-foreground">{formatDate(job.receivedDate)}</TableCell>
              <TableCell>
                <StatusBadge status={job.status} />
              </TableCell>
              <TableCell className="pr-4 text-right tabular-nums">{job.completedDate ? formatCurrency(jobTotal(job)) : "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function RecentJobsTable({ jobs }: { jobs: ServiceJob[] }) {
  return (
    <section aria-labelledby="recent-heading" className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <h2 id="recent-heading" className="text-base font-semibold">
          Recent in-house jobs
        </h2>
        <Link href="/jobs" className="text-sm text-muted-foreground hover:text-primary">
          All service jobs
        </Link>
      </div>
      <JobsTable jobs={jobs} />
    </section>
  )
}
