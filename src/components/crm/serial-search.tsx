"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { equipment, getProduct, getCustomer, jobsForSerial } from "@/lib/data"

export function SerialSearch() {
  const router = useRouter()
  const [query, setQuery] = useState("")

  // Find equipment matching the entered serial number
  const searchQuery = query.trim().toUpperCase()

  let matches = equipment.filter((equipmentItem) => {
    return equipmentItem.serial.includes(searchQuery)
  })

  // Only display results after entering two characters
  if (searchQuery.length < 2) {
    matches = []
  }

  // Display a maximum of five results
  matches = matches.slice(0, 5)

  // Handle the search button
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const serialNumber = query.trim().toUpperCase()

    const exactMatch = equipment.find((equipmentItem) => {
      return equipmentItem.serial === serialNumber
    })

    if (exactMatch) {
      router.push(`/equipment/${exactMatch.serial}`)
    } else {
      router.push(`/equipment?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div className="relative rounded-lg border bg-card p-4">
      <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row" role="search">
        <label htmlFor="serial-search" className="sr-only">
          Search by serial number
        </label>

        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />

          <Input
            id="serial-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Look up a board by serial number, e.g. GDC19…"
            className="h-10 pl-9 font-mono"
            autoComplete="off"
          />
        </div>

        <Button type="submit" size="lg" className="h-10">
          Look up history
        </Button>
      </form>

      {matches.length > 0 && (
        <ul className="mt-3 flex flex-col divide-y rounded-md border">
          {matches.map((matchingEquipment) => (
            <li key={matchingEquipment.serial}>
              <button
                type="button"
                onClick={() => router.push(`/equipment/${matchingEquipment.serial}`)}
                className="flex w-full flex-wrap items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
              >
                <span className="font-mono font-medium">
                  {matchingEquipment.serial}
                </span>

                <span className="text-muted-foreground">
                  {getProduct(matchingEquipment.model)?.name} ·{" "}
                  {getCustomer(matchingEquipment.customerId)?.name} .{" "}
                  {jobsForSerial(matchingEquipment.serial).length} repairs
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}