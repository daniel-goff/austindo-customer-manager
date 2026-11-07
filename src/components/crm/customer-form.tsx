"use client"

import { useState } from "react"
import type { SubmitEvent, ReactNode } from "react"
import type { Customer } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type CustomerFormProps = {
  customer?: Customer;
  onSave: (customer: Customer) => void;
  onCancel: () => void;
};

export function CustomerForm({
  customer,
  onSave,
  onCancel,
}: CustomerFormProps) {
  const [name, setName] = useState(customer?.name ?? "");
  const [site, setSite] = useState(customer?.site ?? "");
  const [contact, setContact] = useState(customer?.contact ?? "");
  const [email, setEmail] = useState(customer?.email ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");
  const [address, setAddress] = useState(customer?.address ?? "")

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const customerDetails: Customer = {
      id: customer?.id ?? crypto.randomUUID(),
      name: name.trim(),
      site: site.trim(),
      address: address.trim(),
      contact: contact.trim(),
      email: email.trim(),
      phone: phone.trim(),
    };
    onSave(customerDetails);
  }
return (
  <form onSubmit={handleSubmit} className="flex flex-col gap-6">

    {/* Customer Information */}
    <Section
      title="Customer information"
      description="Enter the company's details."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        <div className="flex flex-col gap-2">
          <Label htmlFor="customer-name">Company name</Label>

          <Input
            id="customer-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter company name"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="customer-site">Site / Location</Label>

          <Input
            id="customer-site"
            type="text"
            value={site}
            onChange={(event) => setSite(event.target.value)}
            placeholder="e.g. Mt Thorley, NSW"
            required
          />
        </div>

      </div>
    </Section>

    {/* Contact Information */}
    <Section
      title="Contact information"
      description="Primary contact details for this customer."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="customer-contact">Contact person</Label>

          <Input
            id="customer-contact"
            type="text"
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            placeholder="Enter contact name"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="customer-email">Email</Label>

          <Input
            id="customer-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="contact@company.com.au"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="customer-phone">Phone</Label>

          <Input
            id="customer-phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="04XX XXX XXX"
            required
          />
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="customer-Address">Address</Label>

          <Input
            id="customer-Address"
            type="text"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="e.g. 29 Maskey Rd, Mt Thorley, NSW, 2330"
            required
          />
        </div>

      </div>
    </Section>

    {/* Form Buttons */}
    <div className="flex justify-end gap-2">

      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>

      <Button type="submit">
        {customer ? "Update Customer" : "Save Customer"}
      </Button>

    </div>

  </form>
)
}

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <fieldset className="flex flex-col gap-4 rounded-lg border bg-card p-5">

      <legend className="sr-only">{title}</legend>

      <div className="flex flex-col gap-0.5">

        <h2 className="font-semibold">
          {title}
        </h2>

        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}

      </div>

      {children}

    </fieldset>
  )
}