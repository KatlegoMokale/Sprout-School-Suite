"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import CustomInput from "@/components/ui/CustomInput"
import { staffSalarySchema } from "@/lib/utils"

// const staffSalarySchema = z.object({
//   staffId: z.string().min(1, "Staff member is required"),
//   baseSalary: z.number().min(0, "Base salary must be a positive number"),
//   bonuses: z.number().min(0, "Bonuses must be a positive number"),
//   deductions: z.number().min(0, "Deductions must be a positive number"),
//   paymentDate: z.string().min(1, "Payment date is required"),
// })

// type StaffSalaryFormData = z.infer<typeof staffSalarySchema>

interface StaffMember {
  $id: string
  firstName: string
  surname: string
}

export default function StaffSalaryManagement() {
  const [isLoading, setIsLoading] = useState(false)
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])

  const StaffSalarySchema = staffSalarySchema();
  const form = useForm<z.infer<typeof StaffSalarySchema>>({
    resolver: zodResolver(StaffSalarySchema),
    defaultValues: {
      staffId: "",
      baseSalary: 0,
      bonuses: 0,
      deductions: 0,
      paymentDate: new Date().toISOString().split('T')[0],
      staffStatus: "Active"
    },
  })

  useEffect(() => {
    const fetchStaffMembers = async () => {
      try {
        const response = await fetch('/api/stuff')
        if (!response.ok) throw new Error('Failed to fetch staff members')
        const data = await response.json()
        setStaffMembers(data)
      } catch (error) {
        console.error('Error fetching staff members:', error)
        toast({
          title: "Error",
          description: "Failed to fetch staff members. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchStaffMembers()
  }, [])

  const onSubmit = async (data: z.infer<typeof StaffSalarySchema>) => {
    setIsLoading(true)
    try {
      // Here you would typically send the data to your API
      // For example: await fetch('/api/staff-salary', { method: 'POST', body: JSON.stringify(data) })
      console.log("Staff salary data:", data)
      toast({
        title: "Success",
        description: "Staff salary has been updated.",
      })
    } catch (error) {
      console.error("Error updating staff salary:", error)
      toast({
        title: "Error",
        description: "Failed to update staff salary. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const calculateNetSalary = () => {
    const baseSalary = form.getValues('baseSalary')
    const bonuses = form.getValues('bonuses')
    const deductions = form.getValues('deductions')
    return baseSalary + bonuses - deductions
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Manage Staff Salary</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CustomInput
              name="staffId"
              control={form.control}
              label="Staff Member"
              placeholder="Select a staff member"
              select={true}
              options={staffMembers.map(staff => ({
                value: staff.$id,
                label: `${staff.firstName} ${staff.surname}`
              }))}
            />
            <CustomInput
              name="baseSalary"
              control={form.control}
              label="Base Salary"
              placeholder="Enter base salary"
              type="number"
              onChange={() => form.trigger('baseSalary')}
            />
            <CustomInput
              name="bonuses"
              control={form.control}
              label="Bonuses"
              placeholder="Enter bonuses"
              type="number"
              onChange={() => form.trigger('bonuses')}
            />
            <CustomInput
              name="deductions"
              control={form.control}
              label="Deductions"
              placeholder="Enter deductions"
              type="number"
              onChange={() => form.trigger('deductions')}
            />
            <CustomInput
              name="paymentDate"
              control={form.control}
              label="Payment Date"
              placeholder="Select payment date"
              type="date"
            />
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <h3 className="text-lg font-semibold mb-2">Salary Summary</h3>
              <p>Net Salary: R {calculateNetSalary().toFixed(2)}</p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Staff Salary"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}