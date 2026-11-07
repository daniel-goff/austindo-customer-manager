"use client"

import {useState} from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead,TableHeader,TableRow} from "@/components/ui/table"
import { equipment,getProduct, getCustomer, jobsForSerial,jobTotal,formatCurrency, formatDate} from "@/lib/data"
import { SerialLink, StatusBadge} from "./shared"
import { Span } from "next/dist/trace"

// Prepare the equipment information for the table.
const equipmentRows = equipment.map((equipmentItem) => {
  const history = jobsForSerial(equipmentItem.serial)

  // Calculate the total cost of completed repairs.
  const totalSpend = history.reduce((total, job) => {
    if (job.completedDate) {
      return total + jobTotal(job)
    }

    return total
  }, 0)

  return {
    ...equipmentItem,
    product: getProduct(equipmentItem.model),
    customer: getCustomer(equipmentItem.customerId),
    repairs:history.length,
    spend: totalSpend,
    last:history[0],
  }
  })

export function EquipmentBrowser({
  initialQuery,
}: {
  initialQuery: string
}) {
  const [query, setQuery] = useState(initialQuery)

  // Convert the search text to lowercase.
  const searchQuery = query.trim().toLowerCase()

  // Find equipment matching the search text.
  const filteredEquipment = equipmentRows.filter((equipmentItem) => {
    const searchFields = [
      equipmentItem.serial,
      equipmentItem.model,
      equipmentItem.product?.name,
      equipmentItem.product?.partNumber,
      equipmentItem.customer?.name,
    ]

    return searchFields.some((field) =>
      field?.toLowerCase().includes(searchQuery)
    )
  })

  // Show equipment with the most repairs first.
  filteredEquipment.sort(
    (first, second) => second.repairs - first.repairs
  )

  return (
    <div className="flex flex-col gap-4">
        {/*Search Box*/}
        <div className="relative">
            <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-forground"
            aria-hidden="true"
        />
         <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Serial number, part number, product or customer"
          aria-label="Search equipment"
          className="h-10 pl-9 font-mono"
        />
      </div>
      {/* Number of matching boards */}
      <p className="text-sm text-muted-forground" aria-live="polite">
        {filteredEquipment.length}boards
      </p>
      {/*Equipment Table*/}
      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-4">Serial</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="hidden md:table-cell">Customer</TableHead>
                     <TableHead className="text-right">Repairs</TableHead>
                     <TableHead className="hidden sm:table-cell text-right">Lifetime Cost</TableHead>
                     <TableHead className="hidden sm:table-cell text-right">Last Seen</TableHead>
                     <TableHead className="hidden lg:table-cell">Last Seen</TableHead>
                     <TableHead className="pr-4">Latest Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredEquipment.map((equipmentItem) =>(
                    <TableRow key={equipmentItem.serial}>
                        <TableCell className="pl-4">
                            <SerialLink serial={equipmentItem.serial} />
                        </TableCell>
                        <TableCell>
                        <div className="flex flex-col">
                            <span>{equipmentItem.product?.name}</span>
                            <span className="font-mono text-xs text-muted-foreground">
                            {equipmentItem.product?.partNumber}
                            </span>
                        </div>
                        </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                    {equipmentItem.customer?.name}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                    <span
                    className={
                      equipmentItem.repairs >= 6
                        ? "font-semibold text-primary"
                        : ""
                    }
                  >
                    {equipmentItem.repairs}
                  </span>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-right tabular-nums">
                    {formatCurrency(equipmentItem.spend)}
                </TableCell>
                <TableCell className="hidden lg:table-cell tabular-nums text-muted-foreground">
                    {formatDate(equipmentItem.last?.receivedDate)}
                </TableCell>
                 <TableCell className="pr-4">
                  {equipmentItem.last ? (
                    <StatusBadge status={equipmentItem.last.status} />
                  ) : (
                    "—"
                  )}
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}