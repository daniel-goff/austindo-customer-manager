"use client"

import {useState} from "react"
import {Search} from "lucide-react"
import {Input} from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { jobs, customers, isOpen, getProduct, getCustomer } from "@/lib/data"
import {JobsTable} from "./recent-jobs-table"

const PAGE_SIZE = 25

const statusOptions = [
    {value: "all", label: "All statuses" },
    {value: "open", label: "open jobs" },
    {value: "Completed", label: "Completed" },
    {value: "Scrapped", label: "Scrapped" },
]
const sourceOptions = [
    {value: "all", label: "All Sources" },
    {value: "Manual", label: "In-House" },
    {value: "PDF Import", label: "Imported" },
]

const customerOptions = [{ value: "all", label: "All customers"}, ...customers.map((customer) => ({value: customer.id, label: customer.name}))]

export function JobsBrowser({initialStatus, initialCustomer }: {initialStatus: string, initialCustomer: string}) {
    const [query, setQuery] = useState("")
    const [status, setStatus] = useState(initialStatus)
    const [source, setSource] = useState("all")
    const [customer, setCustomer] = useState(initialCustomer)
    const [limit, setLimit] = useState(PAGE_SIZE)

const searchQuery = query.trim().toLowerCase()

const filtered = jobs.filter((job) => {

    // Filter jobs by status
    if (status === "open" && !isOpen(job)) {
        return false
    }

    if (status !== "all" && status !== "open") {
        if (job.status !== status) {
            return false
        }
    }

    // Filter jobs by source
    if (source !== "all" && job.source !== source) {
        return false
    }

    // Filter jobs by customer
    if (customer !== "all" && job.customerId !== customer) {
        return false
    }

    // Show all matching jobs when search is empty
    if (searchQuery === "") {
        return true
    }

    // Search the job information
    const searchFields = [
        job.id,
        job.serial,
        job.invoiceNumber,
        getProduct(job.model)?.name,
        getCustomer(job.customerId)?.name,
        job.reportedFault
    ]

    // Check whether any field contains the search text
    return searchFields.some((field) => {
        if (typeof field !== "string") {
            return false
        }

        return field.toLowerCase().includes(searchQuery)
    })
})

      return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            value={query}
            onChange={(inputEvent) => {
              setQuery(inputEvent.target.value)
              setLimit(PAGE_SIZE)
            }}
            placeholder="Search serial, job ID, invoice, product, customer or fault"
            aria-label="Search jobs"
            className="h-9 pl-9"
          />
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:flex">
          <FilterSelect label="Status" value={status} onChange={setStatus} options={statusOptions} />
          <FilterSelect label="Source" value={source} onChange={setSource} options={sourceOptions} />
          <FilterSelect label="Customer" value={customer} onChange={setCustomer} options={customerOptions} />
        </div>
      </div>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Showing {Math.min(limit, filtered.length)} of {filtered.length} jobs
      </p>
      <JobsTable jobs={filtered.slice(0, limit)} showSource />
      {filtered.length > limit && (
        <button
          type="button"
          onClick={() => setLimit((currentLimit) => currentLimit + PAGE_SIZE)}
          className="self-center rounded-md border px-4 py-2 text-sm hover:bg-muted"
        >
          Load more
        </button>
      )}
    </div>
  )
}
function FilterSelect({
    label,
    value,
    onChange, 
    options,
}:{
    label:string 
    value:string 
    onChange: (value: string) => void 
    options: {value:string; label: string}[]
}) {
    return (
    <Select items={options} value={value} onValueChange={(selectedValue) => onChange(selectedValue as string)}>
      <SelectTrigger aria-label={label} className="h-9 w-full lg:w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

    