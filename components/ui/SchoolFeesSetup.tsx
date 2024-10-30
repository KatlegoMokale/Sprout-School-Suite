"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import CustomInput from "@/components/ui/CustomInput"
import { schoolFeesSchema } from "@/lib/utils"

// const schoolFeesSchema = z.object({
//   year: z.number().min(2000).max(2100),
//   registrationFee: z.number().min(0),
//   reRegistrationFee: z.number().min(0),
//   monthlyFee: z.number().min(0),
//   quarterlyFee: z.number().min(0),
//   yearlyFee: z.number().min(0),
//   siblingDiscountPercentage: z.number().min(0).max(100),
// })

// type SchoolFeesFormData = z.infer<typeof schoolFeesSchema>

export default function SchoolFeesSetup() {
  const [isLoading, setIsLoading] = useState(false)

  const SchoolFeesFormData = schoolFeesSchema();
  const form = useForm<z.infer<typeof SchoolFeesFormData>>({
    resolver: zodResolver(SchoolFeesFormData),
    defaultValues: {
      year: new Date().getFullYear(),
      registrationFee: 0,
      age: "",
      monthlyFee: 0,
      quarterlyFee: 0,
      yearlyFee: 0,
      siblingDiscountPrice: 0,
    },
  })

  const onSubmit = async (data: z.infer<typeof SchoolFeesFormData>) => {
    setIsLoading(true)
    try {
      // Here you would typically send the data to your API
      // For example: await fetch('/api/school-fees', { method: 'POST', body: JSON.stringify(data) })
      console.log("School fees data:", data)
      toast({
        title: "Success",
        description: "School fees have been set up for the year.",
      })
    } catch (error) {
      console.error("Error setting up school fees:", error)
      toast({
        title: "Error",
        description: "Failed to set up school fees. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Set Up School Fees</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CustomInput
              name="year"
              control={form.control}
              label="Year"
              placeholder="Enter year"
              type="number"
            />
            <CustomInput
              name="registrationFee"
              control={form.control}
              label="Registration Fee"
              placeholder="Enter registration fee"
              type="number"
            />
            <CustomInput
            name="age"
            control={form.control}
            placeholder="Select age"
            label="Age"
            select={true}
            options={[
              { value: "Babies", label: "3 months - 1 Year" },
              { value: "2 Years", label: "2 Years" },
              { value: "3 - 6 Years", label: "3 - 6 Years" },
            ]}
            />
            <CustomInput
              name="monthlyFee"
              control={form.control}
              label="Monthly Fee"
              placeholder="Enter monthly fee"
              type="number"
            />
            <CustomInput
              name="quarterlyFee"
              control={form.control}
              label="Quarterly Fee"
              placeholder="Enter quarterly fee"
              type="number"
            />
            <CustomInput
              name="yearlyFee"
              control={form.control}
              label="Yearly Fee"
              placeholder="Enter yearly fee"
              type="number"
            />
            <CustomInput
              name="siblingDiscountPrice"
              control={form.control}
              label="Sibling Discount Percentage"
              placeholder="Enter sibling discount percentage"
              type="number"
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Setting up..." : "Set Up School Fees"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}