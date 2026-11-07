import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader, StatusBadge, SourceTag } from "@/components/crm/shared";
import {getEquipment, getProduct,getCustomer, getTechnician, jobsForSerial, jobTotal, formatCurrency, formatDate,} from "@/lib/data";
import { Suspense } from "react";

export default function EquipmentPage({
  params,
}: {
  params: Promise<{ serial: string }>
}) {
  return (
    <Suspense fallback={<div>Loading equipment details...</div>}>
      <EquipmentDetails params={params} />
    </Suspense>
  )
}

async function EquipmentDetails({
  params,
}: {
  params: Promise<{ serial: string }>
}) {
  const { serial } = await params;

  //Find the equipment using the serial number from the url.
  const equipmentItem = getEquipment(decodeURIComponent(serial));

  if (!equipmentItem) notFound();

  //Get the product, customer and repair history.
  const product = getProduct(equipmentItem.model);
  const customer = getCustomer(equipmentItem.customerId);
  const history = jobsForSerial(equipmentItem.serial);

  //only include completed repairs when calculating cost and labour hours.
  const completedJobs = history.filter((job) => job.completedDate);
  // Calc. the total repair cost.
  const totalSpend = completedJobs.reduce(
    (total, job) => total + jobTotal(job),
    0,
  );
  // Calc the total hours spent on completed repairs.
  const totalHours = completedJobs.reduce(
    (total, job) => total + (job.labourHours || 0),
    0,
  );

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <Button
        variant="ghost"
        size="sm"
        className="self-start"
        nativeButton={false}
        render={<Link href="/equipment" />}
      >
        <ArrowLeft data-icon="inline-start" />
        All Equipment
      </Button>
      <PageHeader
        title={equipmentItem.serial}
        description={`${product?.name} - ${product?.partNumber} - ${customer?.name} - ${customer?.site}`}
        actions={
          <Button nativeButton={false} render={<Link href="/jobs/new" />}>
            <Plus data-icon="inline-start" />
            Book in for repair
          </Button>
        }
      />
      <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-4">
        {[
          ["Total repairs", String(history.length)],
          ["Lifetime repair cost", formatCurrency(totalSpend)],
          ["Technician hours", `${totalHours} h`],
          [
            "first serviced",
            formatDate(history.at(-1)?.receivedDate ?? equipmentItem.firstSeen),
          ],
        ].map(([label, value]) => (
          <div key={label} className="flex flex-col gap-1 bg-card p-4">
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="text-lg font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      <section
        aria-labelledby="history-heading"
        className="flex flex-col gap-3"
      >
        <h2 id="history-heading" className="text-base font-semibold">
          Service history
        </h2>
        {history.length === 0 ? (
          <p className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
            No repairs recoded for this board yet.
          </p>
        ) : (
          <ol className="relative flex flex-col gap-4 border-l pl-6">
            {history.map((job) => (
              <li key={job.id} className="relative">
                <span
                  className="absolute -left-[31px] top-5 size-2.5 rounded-full border-2 border-background bg-primary"
                  aria-hidden="true"
                />
                <article className="flex flex-col gap-3 rounded-lg border bg-card p-4">
                  <header className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex-wrap items-center gap-2">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="font-mono text-sm font-medium hover:text-primary"
                      >
                        {job.id}
                      </Link>
                      <SourceTag source={job.source} />
                      <span className="text-sm text-muted-foreground">
                        {formatDate(job.receivedDate)} →{" "}
                        {formatDate(job.completedDate)}
                      </span>
                    </div>
                    <StatusBadge status={job.status} />
                  </header>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Fault: </span>
                    {job.reportedFault}
                  </p>

                  <footer className="flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-sm">
                    <div className="flex flex-wrap gap-1.5">
                      {job.componentsReplaced.map((component) => (
                        <Badge
                          key={component}
                          variant="secondary"
                          className="font-mono"
                        >
                          {component}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-muted-foreground">
                      {getTechnician(job.technicianId)?.name} ·{" "}
                      {job.labourHours} h ·{" "}
                      <span className="font-medium text-foreground tabular-nums">
                        {job.completedDate
                          ? formatCurrency(jobTotal(job))
                          : "In progress"}
                      </span>
                    </span>
                  </footer>
                </article>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
