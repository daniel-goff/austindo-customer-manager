import { PageHeader } from "@/components/crm/shared"
import { CustomersBrowser } from "@/components/crm/customer-browser"

import {
  customers,
  equipment,
  jobs,
  jobTotal,
  isOpen,
} from "@/lib/data"

export default function CustomersPage() {

  // Calculate statistics for each customer.
  const customerRows = customers.map((customer) => {

    // Find all repair jobs belonging to this customer.
    const customerJobs = jobs.filter(
      (job) => job.customerId === customer.id
    )

    // Count equipment belonging to this customer.
    const boardCount = equipment.filter(
      (board) => board.customerId === customer.id
    ).length

    // Calculate the total cost of completed repairs.
    const totalSpend = customerJobs.reduce(
      (total, job) =>
        total + (job.completedDate ? jobTotal(job) : 0),
      0
    )

    // Combine customer details with their statistics.
    return {
      ...customer,
      boards: boardCount,
      repairs: customerJobs.length,
      open: customerJobs.filter(isOpen).length,
      spend: totalSpend,
    }
  })

  return (
    <div className="mx-auto flex max-w-7xl flex-col">

      <PageHeader
        title="Customers"
        description="View and manage your customers."
      />

      <CustomersBrowser initialCustomers={customerRows} />

    </div>
  )
}


/*
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHeader } from "@/components/crm/shared";
import {
  customers,
  equipment,
  jobs,
  jobTotal,
  isOpen,
  formatCurrency,
} from "@/lib/data";

export default function CustomersPage() {
  // Summary f each customer and repair history
  const customerRows = customers.map((customer) => {
    // Find all the jobs associated with this customer.
    const customerJobs = jobs.filter((job) => job.customerId === customer.id);

    //Count eqipment beloging to this customer
    const boardCount = equipment.filter(
      (board) => board.customerId === customer.id,
    ).length;

    //Calcualte the $ of completed repair.
    const totalSpend = customerJobs.reduce(
      (total, job) => total + (job.completedDate ? jobTotal(job) : 0),
      0,
    );
    // combine the customer details with the calculated stats.
    return {
      ...customer,
      boards: boardCount,
      repairs: customerJobs.length,
      open: customerJobs.filter(isOpen).length,
      spend: totalSpend,
    };
  });

  return (
    <div className="mx-auto flex max-w-7xl flex-col">
      <PageHeader
        title="Customers"
        description="View and manage your customers."
      />

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {customerRows.map((customer) => (
          <li
            key={customer.id}
            className="flex flex-col gap-4 rounded-lg border bg-card p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{customer.name}</h2>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {customer.site}
                </p>
              </div>
              {customer.open > 0 && (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 test-xs font-medium text-primary">
                  {customer.open} open
                </span>
              )}
            </div>
            {/* Customer Stats */

             /*
            <div className="grid grid-cols-3 gap-2 rounded-md bg-muted/60 p-3 text-center">
              <div>
                <p className="text-xs text-muted-foreground">Boards</p>
                <p className="text-sm font-semibold">{customer.boards}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Repairs</p>
                <p className="text-sm font-semibold">{customer.repairs}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Spend</p>
                <p className="text-sm font-semibold">
                  {formatCurrency(customer.spend)}
                </p>
              </div>
            </div>
            {/* Customer contact information */
            /*/*
            <div className="flex flex-col gap-1 text-sm">
              <p className="font-medium">{customer.contact}</p>

              <a
                href={`mailto:${customer.email}`}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-primary"
              >
                <Mail className="size-3.5" />
                {customer.email}
              </a>

              <a
                href={`tel:${customer.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-primary"
              >
                <Phone className="size-3.5" />
                {customer.phone}
              </a>
            </div>
            <Link
              href={`/jobs?customer=${customer.id}`}
              className="mt-auto text-sm font-medium text-primary hover:underline"
            >
              View service jobs
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
*/