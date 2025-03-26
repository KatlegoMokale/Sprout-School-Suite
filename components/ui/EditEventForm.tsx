"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomInput from "@/components/ui/CustomInput"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

const formSchema = z.object({
  eventName: z.string().min(1, "Event name is required"),
  date: z.string().min(1, "Date is required"),
  amount: z.number().min(0, "Amount must be a positive number"),
  description: z.string().min(1, "Description is required"),
})

export default function EditEventForm({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: "",
      date: "",
      amount: 0,
      description: "",
    },
  })

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/event/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch event")
        const data = await response.json()
        const eventData = data.data

        form.reset({
          eventName: eventData.eventName,
          date: eventData.date,
          amount: eventData.amount,
          description: eventData.description,
        })
      } catch (error) {
        console.error("Error fetching event:", error)
        setError("Failed to fetch event data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvent()
  }, [params.id, form])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/event/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to update event")

      toast({
        title: "Success",
        description: "Event updated successfully",
      })
      router.push("/manage-school")
    } catch (error) {
      console.error("Error updating event:", error)
      setError("Failed to update event")
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto py-10">
      <Link href="/manage-school" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Manage School
      </Link>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Event</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CustomInput
              control={form.control}
              name="eventName"
              label="Event Name"
              placeholder="Enter event name"
            />
            <CustomInput
              control={form.control}
              name="date"
              label="Date"
              placeholder="Enter event date"
              type="date"
            />
            <CustomInput
              control={form.control}
              name="amount"
              label="Amount"
              placeholder="Enter event amount"
              type="number"
            />
            <CustomInput
              control={form.control}
              name="description"
              label="Description"
              placeholder="Enter event description"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Event"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
} 