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
import { Select1, SelectContent, SelectItem, SelectTrigger, SelectValue1 } from "@/components/ui/select"
import { studentFeesSchema } from "@/lib/utils"
import { Label } from "./label"

// const studentFeesSchema = z.object({
//   studentId: z.string().min(1, "Student ID is required"),
//   year: z.number().min(2000).max(2100),
//   totalFees: z.number().min(0),
//   paidAmount: z.number().min(0),
//   balance: z.number(),
//   paymentFrequency: z.enum(['monthly', 'quarterly', 'yearly']),
//   nextPaymentDate: z.string(),
// })

// type StudentFeesFormData = z.infer<typeof studentFeesSchema>

interface Student {
  $id: string
  firstName: string
  surname: string
}

export default function StudentFeesManagement() {
  const [isLoading, setIsLoading] = useState(false)
  const [students, setStudents] = useState<Student[]>([])

  const  StudentFeesSchema = studentFeesSchema()
  const form = useForm<z.infer<typeof StudentFeesSchema>>({
    resolver: zodResolver(StudentFeesSchema),
    defaultValues: {
      studentId: "",
      year: new Date().getFullYear(),
      age: "",
      startDate:"",
      endDate:"",
      registrationFee: 0,
      fees: 0,
      totalFees: 0,
      paidAmount: 0,
      balance: 0,
      paymentFrequency: "monthly",
      nextPaymentDate: new Date().toISOString().split('T')[0],
    },
  })

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students')
        if (!response.ok) throw new Error('Failed to fetch students')
        const data = await response.json()
        setStudents(data)
      } catch (error) {
        console.error('Error fetching students:', error)
        toast({
          title: "Error",
          description: "Failed to fetch students. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchStudents()
  }, [])

  const onSubmit = async (data: z.infer<typeof StudentFeesSchema>) => {
    setIsLoading(true)
    try {
      // Here you would typically send the data to your API
      // For example: await fetch('/api/student-fees', { method: 'POST', body: JSON.stringify(data) })
      console.log("Student fees data:", data)
      toast({
        title: "Success",
        description: "Student fees have been updated.",
      })
    } catch (error) {
      console.error("Error updating student fees:", error)
      toast({
        title: "Error",
        description: "Failed to update student fees. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const calculateBalance = (totalFees: number, paidAmount: number) => {
    const balance = totalFees - paidAmount
    form.setValue('balance', balance)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Manage Student Fees</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* <Label className="block mb-2">Student Name</Label> */}
            <CustomInput
              name="studentId"
              control={form.control}
              label="Student"
              placeholder="Select a student"
              select={true}
              options={students.map(student => ({
                value: student.$id,
                label: `${student.firstName} ${student.surname}`
              }))}
            />
            <CustomInput
              name="year"
              control={form.control}
              label="Year"
              placeholder="Enter year"
              type="number"
            />
            <CustomInput
              name="totalFees"
              control={form.control}
              label="Total Fees"
              placeholder="Enter total fees"
              type="number"
              onChange={(e) => {
                const value = parseFloat(e.target.value)
                form.setValue('totalFees', value)
                calculateBalance(value, form.getValues('paidAmount'))
              }}
            />
            <CustomInput
              name="paidAmount"
              control={form.control}
              label="Paid Amount"
              placeholder="Enter paid amount"
              type="number"
              onChange={(e) => {
                const value = parseFloat(e.target.value)
                form.setValue('paidAmount', value)
                calculateBalance(form.getValues('totalFees'), value)
              }}
            />
            <CustomInput
              name="balance"
              control={form.control}
              label="Balance"
              placeholder="Balance"
              type="number"
              readonly={true}
            />
            <CustomInput
              name="paymentFrequency"
              control={form.control}
              label="Payment Frequency"
              placeholder="Select payment frequency"
              select={true}
              options={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly' },
                { value: 'yearly', label: 'Yearly' },
              ]}
            />
            <CustomInput
              name="nextPaymentDate"
              control={form.control}
              label="Next Payment Date"
              placeholder="Select next payment date"
              type="date"
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Student Fees"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}