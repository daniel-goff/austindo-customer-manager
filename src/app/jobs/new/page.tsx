import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/crm/shared";
import { NewJobForm } from "@/components/crm/new-job-form";

export default function NewJobPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="self-start"
        nativeButton={false}
        render={<Link href="/jobs" />}
      >
        <ArrowLeft data-icon="inline-start" />
        All Jobs
      </Button>
      <PageHeader
        title="New service job"
        description="Book a card into the repair centre and record the work carried out."
      />
      <NewJobForm />
    </div>
  );
}
