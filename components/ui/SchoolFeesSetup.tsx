"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import CustomInput from "@/components/ui/CustomInput"
import { schoolFeesSchema } from "@/lib/utils"
import { newSchoolFees } from "@/lib/actions/user.actions"


export default function SchoolFeesSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [yearlyFee, setYearlyFee] = useState(0)

  const SchoolFeesFormData = schoolFeesSchema();
  const form = useForm<z.infer<typeof SchoolFeesFormData>>({
    resolver: zodResolver(SchoolFeesFormData),
    defaultValues: {
      year: new Date().getFullYear(),
      registrationFee: 0,
      age: "",
      monthlyFee: 0,
      yearlyFee: 0,
      siblingDiscountPrice: 50,
    },
  })

  const calculateFees = (monthlyFee: number) => {
    const yearlyFee = monthlyFee * 10; // 12 months - 2 months discount // 3 months - 1 month discount
    setYearlyFee(yearlyFee);
    form.setValue("yearlyFee", yearlyFee);
  }

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'monthlyFee') {
        calculateFees(value.monthlyFee as number);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);


  const onSubmit = async (data: z.infer<typeof SchoolFeesFormData>) => {
    setIsLoading(true)
    try {
      const addNewSchool = await newSchoolFees(data);
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
    setFormData(data);
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
              name="yearlyFee"
              control={form.control}
              label="Yearly Fee"
              placeholder="Enter yearly fee"
              type="number"
            />
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <h3 className="text-lg font-semibold mb-2">Calculated Fees</h3>
              <p>Yearly Fee (once-off): R {yearlyFee.toFixed(2)}</p>
            </div>
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