"use client"

import { useCallback, useEffect, useState } from "react"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { DollarSign, Calendar, Users, Percent } from 'lucide-react'

export default function SchoolFeesSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [yearlyFee, setYearlyFee] = useState(0)
  const [yearlyFeeNormal, setYearlyFeeNormal] = useState(0)

  const SchoolFeesFormData = schoolFeesSchema();
  const form = useForm<z.infer<typeof SchoolFeesFormData>>({
    resolver: zodResolver(SchoolFeesFormData),
    defaultValues: {
      year: new Date().getFullYear(),
      registrationFee: 0,
      ageStart: 0,
      ageEnd: 0,
      ageUnit: "months",
      monthlyFee: 0,
      yearlyFee: 0,
      siblingDiscountPrice: 50,
    },
  })

  const calculateFees = useCallback((monthlyFee: number) => {
    const yearlyFee = monthlyFee * 10; // 12 months - 2 months discount
    const yearlyFeeNormal = monthlyFee * 12; // 12 months Full price Monthly
    setYearlyFee(yearlyFee);
    setYearlyFeeNormal(yearlyFeeNormal);
    form.setValue("yearlyFee", yearlyFee);
  }, [form]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'monthlyFee') {
        calculateFees(value.monthlyFee as number);
      }
    });
    return () => subscription.unsubscribe();
  }, [calculateFees, form]);

  const onSubmit = async (data: z.infer<typeof SchoolFeesFormData>) => {
    setIsLoading(true)
    try {
      const addNewSchool = await newSchoolFees(data);
      console.log("School fees data:", data)
      toast({
        title: "Success",
        description: "School fees have been set up for the year.",
      })
      form.reset();
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
    <div className="max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <CustomInput
              name="year"
              control={form.control}
              label="Year"
              placeholder="Enter year"
              type="number"
              icon={Calendar}
            />
            <CustomInput
              name="registrationFee"
              control={form.control}
              label="Registration Fee"
              placeholder="Enter registration fee"
              type="number"
              icon={DollarSign}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Age Range</label>
            <div className="flex items-center gap-2">
              <CustomInput
                label="Start"
                name="ageStart"
                control={form.control}
                type="number"
                placeholder="Start"
                className="flex-1"
              />
              <span className="text-muted-foreground">to</span>
              <CustomInput
                name="ageEnd"
                label="End"
                control={form.control}
                type="number"
                placeholder="End"
                className="flex-1"
              />
              <CustomInput
                name="ageUnit"
                label="Unit"
                placeholder="Unit"
                control={form.control}
                select={true}
                options={[
                  { value: "months", label: "Months" },
                  { value: "years", label: "Years" },
                ]}
                className="w-32"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CustomInput
              name="monthlyFee"
              control={form.control}
              label="Monthly Fee"
              placeholder="Enter monthly fee"
              type="number"
              icon={DollarSign}
            />
            <CustomInput
              name="siblingDiscountPrice"
              control={form.control}
              label="Sibling Discount %"
              placeholder="Enter discount percentage"
              type="number"
              icon={Percent}
            />
          </div>

          <Card className="bg-muted/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Calculated Fees
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Yearly Fee (once-off)</span>
                <span className="font-medium">ZAR {yearlyFee.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Yearly Fee (monthly)</span>
                <span className="font-medium">ZAR {yearlyFeeNormal.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Setting up..." : "Set Up School Fees"}
          </Button>
        </form>
      </Form>
    </div>
  )
}