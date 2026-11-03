import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/crm/shared"
import { JobsBrowser } from "@/components/crm/jobs-browser"

type JobsPageProps = {
  searchParams: Promise<{
    status?: string
    customer?: string
  }>
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const { status, customer } = await searchParams

  return (
    <div className="mx-auto flex max-w-7xl flex-col">
      <PageHeader
        title="Service Jobs"
        description="Beresfield repair records"
        actions={
          <Button nativeButton={false} render={<Link href="/jobs/new" />}>
            <Plus data-icon="inline-start" />
            New service Job
          </Button>
        }
      />

      <JobsBrowser
        initialStatus={status === "open" ? "open" : "all"}
        initialCustomer={customer ?? "all"}
      />
    </div>
  )
}