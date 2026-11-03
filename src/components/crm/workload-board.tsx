import Link from "next/link"
import { openStatuses, getProduct, getCustomer, getTechnician, formatDate, type ServiceJob } from "@/lib/data"
import { StatusBadge } from "./shared"

export function WorkloadBoard({ jobs }: { jobs: ServiceJob[] }) {

  return (
    <section aria-labelledby="workload-heading" className="flex flex-col gap-3">

      <div className="flex items-baseline justify-between">
        <h2 id="workload-heading" className="text-base font-semibold">
          Bench workload
        </h2>

        <Link
          href="/jobs?status=open"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          View all open jobs
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

        {openStatuses.map((status) => {

          // Find jobs belonging to this status
          const statusJobs = jobs.filter((job) => {
            return job.status === status
          })

          return (
            <div
              key={status}
              className="flex flex-col gap-2 rounded-lg border bg-muted/40 p-3"
            >
              <div className="flex items-center justify-between px-1">
                <StatusBadge status={status} />

                <span className="text-xs tabular-nums text-muted-foreground">
                  {statusJobs.length}
                </span>
              </div>

              <ul className="flex flex-col gap-2">

                {statusJobs.map((job) => {

                  // Retrieve the tech assigned to this job
                  const technician = getTechnician(job.technicianId)

                  return (
                    <li key={job.id}>
                      <Link
                        href={`/jobs/${job.id}`}
                        className="flex flex-col gap-1 rounded-md border bg-card p-3 transition-colors hover:border-primary/50"
                      >
                        <div className="flex items-center justify-between gap-2">

                          <span className="font-mono text-sm font-medium">
                            {job.serial}
                          </span>

                          <span
                            className="flex size-6 items-center justify-center rounded-full bg-muted text-[10px] font-semibold"
                            title={technician?.name}
                          >
                            {technician?.initials}
                          </span>
                        </div>

                        <span className="text-sm">
                          {getProduct(job.model)?.name}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          {getCustomer(job.customerId)?.name} · {formatDate(job.receivedDate)}
                        </span>
                      </Link>
                    </li>
                  )
                })}

              </ul>
            </div>
          )
        })}

      </div>
    </section>
  )
}