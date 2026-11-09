"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  technicians,
  getEquipment,
  getProduct,
  getCustomer,
  jobsForSerial,
} from "@/lib/data";

//Dropdown list for Technicians
const techItems = technicians.map((technician) => ({
  value: technician.id,
  label: technician.name,
}));

// Dropdown list for status of job
const statusItems = [
  "Received",
  "Diagnosing",
  "In Repair",
  "Testing",
  "Completed",
].map((status) => ({
  value: status,
  label: status,
}));

export function NewJobForm() {
  const [serial, setSerial] = useState("");
  const [customer, setCustomer] = useState("");
  const [product, setProduct] = useState("");
  const [fault, setFault] = useState("");
  const [tech, setTech] = useState<string | null>(null);
  const [status, setStatus] = useState("Received");
  const [received, setReceived] = useState(
    new Date().toLocaleDateString("en-CA"),
  ); //Update to austrlian format

  const [submitted, setSubmitted] = useState(false);

  //Check if the serial Number already exists
  const knownEquipment = getEquipment(serial.trim().toUpperCase());
  //Find the previous repairs for this job
  const repairHistory = knownEquipment
    ? jobsForSerial(knownEquipment.serial)
    : [];
  //Automatically add the customer and product data
  function onSerialChange(value: string) {
    setSerial(value);

    const equipmentItem = getEquipment(value.trim().toUpperCase());

    if (equipmentItem) {
      const customerDetails = getCustomer(equipmentItem.customerId);

      const productDetails = getProduct(equipmentItem.model);

      setCustomer(customerDetails?.name ?? "");
      setProduct(productDetails?.name ?? "");
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border bg-card px-6 py-12 text-center">
        <CheckCircle2 className="size-10 text-success" aria-hidden="true" />
        <h2 className="text-lg font-semibold">Job Booked in</h2>

        <p className="text-sm text-muted-foreground">
          Serial Number:{serial.toUpperCase()}
          recorded with status {status}
        </p>

        <p className="text-sm text-muted-foreground">
          Testing DB not implemented
        </p>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSubmitted(false)}>
            Book Another
          </Button>

          <Button nativeButton={false} render={<Link href="/jobs" />}>
            Back to jobs
          </Button>
        </div>
      </div>
    );
  }
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
      className="flex flex-col gap-6"
    >
      {/* Euipment Information */}
      <Section
        title="Equipment"
        description="Enter the serial number. Existing equipment will automatically populate customer and product details."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="serial">Serial Number</Label>

            <Input
              id="serial"
              required
              value={serial}
              onChange={(event) => onSerialChange(event.target.value)}
              placeholder="e.g. GF654439J"
              className="font-mono uppercase"
              autoComplete="off"
            />
            {/* Display equipment history when a matching serial is found */}
            {knownEquipment && (
              <div className="flex items-start gap-2 rounded-md border border-primary/30 bg-primary/10 p-3 text-sm">
                <History
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />

                <div>
                  <p>
                    Known equipment: {getProduct(knownEquipment.model)?.name}
                  </p>

                  <p>Previous repairs: {repairHistory.length}</p>

                  <Link
                    href={`/equipment/${knownEquipment.serial}`}
                    className="font-medium underline underline-offset-4"
                  >
                    View service history
                  </Link>
                </div>
              </div>
            )}
          </div>
          {/*Customer */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="customer">Customer</Label>
            <Input
              id="customer"
              required
              value={customer}
              onChange={(event) => setCustomer(event.target.value)}
              placeholder="Enter Customer Name"
            />
          </div>
          {/* Product */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="product">Product</Label>

            <Input
              id="product"
              required
              value={product}
              onChange={(event) => setProduct(event.target.value)}
              placeholder="Enter product name"
            />
          </div>
        </div>
      </Section>
      {/* Repair Information */}
      <Section title="Repair Details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Reported Fault */}
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="fault">Reported Fault</Label>
            <Textarea
              id="fault"
              required
              value={fault}
              onChange={(event) => setFault(event.target.value)}
              placeholder="Fault reported by the customer"
              rows={3}
            />
          </div>
          {/* Job Status */}
          <SelectField
            id="status"
            label="Status"
            items={statusItems}
            value={status}
            onChange={(selectedStatus) =>
              setStatus(selectedStatus ?? "Received")
            }
          />

          {/* Technician */}
          <SelectField
            id="technician"
            label="Technician"
            items={techItems}
            value={tech}
            onChange={setTech}
            placeholder="Assign technician"
          />
          {/* Date Received */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="received">Date Received</Label>

            <Input
              id="received"
              type="date"
              value={received}
              onChange={(event) => setReceived(event.target.value)}
            />
          </div>
        </div>
      </Section>
      {/*Form Buttons */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/jobs" />}
        >
          Cancel
        </Button>

        <Button type="submit">Save Job</Button>
      </div>
    </form>
  );
}

//Reusable section for grouping form fields

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-4 rounded-lg border bg-card p-5">
      <legend className="sr-only">{title}</legend>

      <div className="flex flex-col gap-0.5">
        <h2 className="font-semibold">{title}</h2>

        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {children}
    </fieldset>
  );
}

// Reusable dropdown field.
function SelectField({
  id,
  label,
  items,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  items: { value: string; label: string }[];
  value: string | null;
  onChange: (selectedValue: string | null) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>

      <Select
        items={items}
        value={value}
        onValueChange={(selectedValue) =>
          onChange(selectedValue as string | null)
        }
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
