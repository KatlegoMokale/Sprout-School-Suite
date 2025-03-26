"use client"

import EditClassForm from "@/components/ui/EditClassForm"

export default function EditClassPage({ params }: { params: { id: string } }) {
  return <EditClassForm params={params} />
} 