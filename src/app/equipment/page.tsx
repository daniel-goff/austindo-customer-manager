import { Suspense } from "react"
import { PageHeader } from "@/components/crm/shared"
import { EquipmentBrowser } from "@/components/crm/equipment-browser"

type EquipmentPageProps = {
  searchParams: Promise<{ q?: string }>
}

export default function EquipmentPage({ searchParams }: EquipmentPageProps) {
  return (
    <Suspense fallback={<div>Loading equipment...</div>}>
      <EquipmentContent searchParams={searchParams} />
    </Suspense>
  )
}

async function EquipmentContent({ searchParams }: EquipmentPageProps) {
  const { q: searchQuery } = await searchParams

  return (
    <div className="mx-auto flex max-w-7xl flex-col">
      <PageHeader
        title="Equipment"
        description="Every control card ACS or the previous vendor has serviced, searchable by serial number."
      />

      <EquipmentBrowser initialQuery={searchQuery ?? ""} />
    </div>
  )
}