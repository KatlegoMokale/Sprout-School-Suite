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
  name: z.string().min(1, "Name is required"),
  age: z.string().min(1, "Age is required"),
  teacherId: z.string().min(1, "Teacher ID is required"),
  teacherName: z.string().min(1, "Teacher name is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  currentEnrollment: z.number().min(0, "Current enrollment cannot be negative"),
  status: z.enum(['active', 'inactive']).default('active')
})

export default function EditClassForm({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: "",
      teacherId: "",
      teacherName: "",
      capacity: 25,
      currentEnrollment: 0,
      status: "active"
    },
  })

  useEffect(() => {
    const fetchClass = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/class/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch class")
        const data = await response.json()
        console.log("Class Data:", data)

        form.reset({
          name: data.name || "",
          age: data.age || "",
          teacherId: data.teacherId || "",
          teacherName: data.teacherName || "",
          capacity: data.capacity || 25,
          currentEnrollment: data.currentEnrollment || 0,
          status: data.status || "active"
        })
      } catch (error) {
        console.error("Error fetching class:", error)
        setError("Failed to fetch class data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchClass()
  }, [params.id, form])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/class/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to update class")

      toast({
        title: "Success",
        description: "Class updated successfully",
      })
      router.push("/manage-school")
    } catch (error) {
      console.error("Error updating class:", error)
      setError("Failed to update class")
      toast({
        title: "Error",
        description: "Failed to update class",
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
        <h1 className="text-2xl font-bold mb-6">Edit Class</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CustomInput
              control={form.control}
              name="name"
              label="Class Name"
              placeholder="Enter class name"
            />
            <CustomInput
              control={form.control}
              name="age"
              label="Age Group"
              placeholder="Enter age group"
            />
            <CustomInput
              control={form.control}
              name="teacherId"
              label="Teacher ID"
              placeholder="Enter teacher ID"
            />
            <CustomInput
              control={form.control}
              name="teacherName"
              label="Teacher Name"
              placeholder="Enter teacher name"
            />
            <CustomInput
              control={form.control}
              name="capacity"
              label="Class Capacity"
              placeholder="Enter class capacity"
              type="number"
            />
            <CustomInput
              control={form.control}
              name="currentEnrollment"
              label="Current Enrollment"
              placeholder="Enter current enrollment"
              type="number"
            />
            <CustomInput
              control={form.control}
              name="status"
              label="Status"
              placeholder="Select status"
              select={true}
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Class"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
} 