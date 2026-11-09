
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Pencil } from "lucide-react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import { PageHeader,StatusBadge, SerialLink, SourceTag } from "@/components/crm/shared";
import { getJob, getCustomer, getProduct, getTechnician, formatCurrency, formatDate, jobTotal, daysBetween, jobs } from "@/lib/data";
import Link  from "next/link";

type JobDeatailPageProps = {params: Promise<{ id: string}>; };

export default async function JobDetailPage({params,}: JobDeatailPageProps){
    //Get seleted ID from the URL
    const {id} = await params;
    //Find the matching service job
    const job = getJob(id);

    if (!job) {notFound();}

    // Get the Technician, product, and customer that is linked to job
    const customer = getCustomer(job.customerId);
    const product = getProduct(job.model);
    const technician = getTechnician(job.technicianId);

    //Calcualte how long the repair has taken.
    const turnaround = job.completedDate ?  `${daysBetween(job.receivedDate, job.completedDate)} days`
    : "In Progress";

    //Calcualte the total repair cost.
    const totalCost = jobTotal(job);

    return (
        <div className= "mx auto flex max-w-5xl flex-col gap-6">

            {/*Back Button */}
            <Button
            variant={"ghost"}
            size={"sm"}
            className={"self-start"}
            nativeButton={false}
            render={<Link href="/jobs"/>}>

                <ArrowLeft data-icon="inline-start" />
                All Jobs
            </Button>
            {/*Page heading and Job status */}
            <PageHeader
                title={`Job ${job.id}`}
                description={`${product?.name} for ${customer?.name}`}
                actions={
                    <div className="flex items-center gap-2">
                        <SourceTag source={job.source}/>
                        <StatusBadge status={job.status}/> 
                        <Button
                            variant="default"
                            className="bg-primary text-primary-foreground hover:bg-primary/80"
                            nativeButton={false}
                            render={<Link href={`/jobs/${job.id}/edit`} />}
                            >
                                <Pencil data-icon="inline-start"/>
                                Edit Job
                            </Button>

                    </div>
                }
            />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

        {/*Repair Information */}
        <section className="flex flex-col gap-5 rounded-lg border bg-card p-5 lg:col-span-2">

            <Field label="Work performed">
            <p className="text-pretty">
              {job.workPerformed || (
                <span className="text-muted-foreground">
                  Awaiting diagnosis.
                </span>
              )}
            </p>
          </Field>

          <Field label="Components Replaced">
            {job.componentsReplaced.length > 0 ?(
                <div className="flex flex-wrap gap-2">
                    {job.componentsReplaced.map((component) =>(
                        <Badge
                            key={component}
                            variant="secondary"
                            className="font-mono"
                            >
                                {component}
                            </Badge>
                    ))}
                </div>
            ):(
                <p className="text-muted-foreground">
                    None Recorded
                </p>
            )}
          </Field>
          {/*Show invoice reference for imported repair records */}
          {job.invoiceNumber && (
            <div className="flex items-center gap-3 rounded-md border border-dashed p-3 text-sm">
                <FileText
                className="size-4 text-chart-2"
                aria-hidden="true"
            />
            <span>
                Extracted from Vendor invoice {" "}
                <span className="font-mono font-medium">
                    {job.invoiceNumber}
                </span>
                .pdf
            </span>
            </div>
        )}
        </section>
        {/* Job information sidebar */}
        <aside className="flex flex-col gap-4">

          {/* Equipment and repair dates */}
          <dl className="grid grid-cols-2 gap-4 rounded-lg border bg-card p-5 text-sm">

            <Item label="Serial">
              <SerialLink serial={job.serial} />
            </Item>

            <Item label="Part number">
              <span className="font-mono">
                {product?.partNumber}
              </span>
            </Item>

            <Item label="Received">
              {formatDate(job.receivedDate)}
            </Item>

            <Item label="Completed">
              {formatDate(job.completedDate)}
            </Item>

            <Item label="Technician">
              {technician?.name}
            </Item>

            <Item label="Turnaround">
              {turnaround}
            </Item>

        </dl>
                  {/* Repair costs */}
          <dl className="flex flex-col gap-2 rounded-lg border bg-card p-5 text-sm">

            <Row
              label={`Labour (${job.labourHours} h)`}
              value={formatCurrency(job.labourCost)}
            />

            <Row
              label="Parts"
              value={formatCurrency(job.partsCost)}
            />

            <div className="my-1 border-t" />

            <Row
              label="Total"
              value={formatCurrency(totalCost)}
              strong
            />

          </dl>

          {/* Customer contact information */}
          <div className="rounded-lg border bg-card p-5 text-sm">

            <p className="font-medium">
              {customer?.name}
            </p>

            <p className="text-muted-foreground">
              {customer?.site}
            </p>

            <p className="mt-2">
              {customer?.contact}
            </p>

            <p className="text-muted-foreground">
              {customer?.phone}
            </p>

          </div>

        </aside>
      </div>
    </div>
  );
}

// Reusable section for displaying repair information.
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </h2>

      {children}
    </div>
  );
}


// Reusable item for displaying job and equipment details.
function Item({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">
        {label}
      </dt>

      <dd className="font-medium">
        {children}
      </dd>
    </div>
  );
}


// Reusable row for displaying repair costs.
function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <dt
        className={
          strong
            ? "font-semibold"
            : "text-muted-foreground"
        }
      >
        {label}
      </dt>

      <dd
        className={
          strong
            ? "font-semibold tabular-nums"
            : "tabular-nums"
        }
      >
        {value}
      </dd>
    </div>
  );
}


        
