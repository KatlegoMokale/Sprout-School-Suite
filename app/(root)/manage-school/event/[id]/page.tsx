"use client"

import EditEventForm from "@/components/ui/EditEventForm"

export default function EditEventPage({ params }: { params: { id: string } }) {
  return <EditEventForm params={params} />
} 