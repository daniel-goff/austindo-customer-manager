"use client";

import { useState } from "react";
import { formatCurrency, type Customer } from "@/lib/data";
import { CustomerForm } from "@/components/crm/customer-form";
import { Plus, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

// Customer details combined with equipment and repair statistics.
type CustomerWithStats = Customer & {
  boards: number;
  repairs: number;
  open: number;
  spend: number;
};

type CustomersBrowserProps = {
  initialCustomers: CustomerWithStats[];
};

export function CustomersBrowser({ initialCustomers }: CustomersBrowserProps) {
  const [customers, setCustomers] =
    useState<CustomerWithStats[]>(initialCustomers);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  function saveCustomer(customerDetails: Customer) {
    setCustomers((currentCustomers) => {
      // Check whether the customer already exists.
      const existingCustomer = currentCustomers.find(
        (customer) => customer.id === customerDetails.id,
      );

      if (existingCustomer) {
        // Update customer details while preserving statistics.
        return currentCustomers.map((customer) =>
          customer.id === customerDetails.id
            ? { ...customer, ...customerDetails }
            : customer,
        );
      } else {
        // New customers start with zero equipment and repairs.
        const newCustomer: CustomerWithStats = {
          ...customerDetails,
          boards: 0,
          repairs: 0,
          open: 0,
          spend: 0,
        };

        return [...currentCustomers, newCustomer];
      }
    });

    setShowForm(false);
    setEditingCustomer(null);
  }

  function editCustomer(customer: Customer) {
    setEditingCustomer(customer);
    setShowForm(true);
  }

  function deleteCustomer(customerId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?",
    );

    if (!confirmed) {
      return;
    }

    setCustomers((currentCustomers) =>
      currentCustomers.filter((customer) => customer.id !== customerId),
    );
  }

  function cancelForm() {
    setShowForm(false);
    setEditingCustomer(null);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Add Customer Button */}
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={() => {
            setEditingCustomer(null);
            setShowForm(true);
          }}
        >
          <Plus data-icon="inline-start" />
          Add Customer
        </Button>
      </div>
      {showForm && (
        <CustomerForm
          key={editingCustomer?.id ?? "new"}
          customer={editingCustomer ?? undefined}
          onSave={saveCustomer}
          onCancel={cancelForm}
        />
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {customers.map((customer) => (
          <div key={customer.id} className="rounded-lg border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{customer.name}</h2>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  {customer.site}
                </p>
              </div>
              {customer.open > 0 && (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[12px] font-medium text-primary">
                  {customer.open} open
                </span>
              )}
            </div>

            {/* Customer Statistics */}
            <div className="mt-4 grid grid-cols-3 gap-2 rounded-md bg-muted/60 p-3 text-center">
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

            {/* Customer contact information */}
            <div className="mt-4 space-y-2 text-sm">
              <p className="font-medium">{customer.contact}</p>

              {/* Email address */}
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground" />

                <a
                  href={`mailto:${customer.email}`}
                  className="text-muted-foreground hover:text-primary hover:underline"
                >
                  {customer.email}
                </a>
              </div>

              {/* Phone number */}
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-muted-foreground" />

                <a
                  href={`tel:${customer.phone.replace(/\s/g, "")}`}
                  className="text-muted-foreground hover:text-primary hover:underline"
                >
                  {customer.phone}
                </a>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2 ">
              <button
                type="button"
                onClick={() => editCustomer(customer)}
                className="rounded-md border px-3 border-border py-1.5 text-sm transition-colours hover:border-primary"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => deleteCustomer(customer.id)}
                className="rounded-md border border-border px-3 py-1.5 text-sm text-destructive transition-colours hover:border-primary"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
