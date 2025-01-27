"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useDispatch, useSelector } from 'react-redux'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import CustomInput from "@/components/ui/CustomInput"
import { Select1, SelectContent, SelectItem, SelectTrigger, SelectValue1 } from "@/components/ui/select"
import { ISchoolFees, IStudent, IStudentFeesSchema } from "@/lib/utils"
import { newStudentRegistration, updateStudentBalance } from "@/lib/actions/user.actions"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { AppDispatch, RootState } from "@/lib/store"
import { fetchStudents, selectStudents, selectStudentsStatus } from '@/lib/features/students/studentsSlice'
import { fetchSchoolFeesSetup, selectSchoolFeesSetup, selectSchoolFeesSetupStatus  } from '@/lib/features/schoolFeesSetup/schoolFeesSetupSlice'
import { fetchStudentSchoolFees, selectStudentSchoolFees, selectStudentSchoolFeesStatus } from '@/lib/features/studentSchoolFees/studentSchoolFeesSlice'

export default function StudentRegistration() {
  const dispatch = useDispatch<AppDispatch>()
  const [isLoading, setIsLoading] = useState(false)
  const [showHiddenFields, setShowHiddenFields] = useState(false)
  const [registeredYears, setRegisteredYears] = useState<Record<string, number[]>>({})
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [registrationProgress, setRegistrationProgress] = useState({ registered: 0, notRegistered: 0 })

  const students = useSelector(selectStudents)
  const studentsStatus = useSelector(selectStudentsStatus)
  const schoolFees = useSelector(selectSchoolFeesSetup)
  const schoolFeesStatus = useSelector(selectSchoolFeesSetupStatus)
  const studentSchoolFees = useSelector(selectStudentSchoolFees)
  const studentSchoolFeesStatus = useSelector(selectStudentSchoolFeesStatus)

  const currentYear = new Date().getFullYear()
  const yearRange = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)

  const form = useForm<IStudentFeesSchema & { year: string }>({
    resolver: zodResolver(z.object({
      $id: z.string().optional(),
      studentId: z.string().min(1, "Student is required"),
      schoolFeesRegId: z.string().min(1, "School fees registration is required"),
      startDate: z.string().min(1, "Start date is required"),
      endDate: z.string().min(1, "End date is required"),
      fees: z.number().min(0),
      totalFees: z.number().min(0),
      paidAmount: z.number().min(0),
      balance: z.number().min(0),
      paymentFrequency: z.string().min(1, "Payment frequency is required"),
      paymentDate: z.number().min(1, "Payment date is required"),
      year: z.string().optional(),
    })),
    defaultValues: {
      $id: "",
      studentId: "",
      schoolFeesRegId: "",
      startDate: "",
      endDate: "",
      fees: 0,
      totalFees: 0,
      paidAmount: 0,
      balance: 0,
      paymentFrequency: "monthly",
      paymentDate: 1,
      year: "",
    },
  })

  useEffect(() => {
    if (studentsStatus === 'idle') {
      dispatch(fetchStudents())
    }
    if (schoolFeesStatus === 'idle') {
      dispatch(fetchSchoolFeesSetup())
    }
    if (studentSchoolFeesStatus === 'idle') {
      dispatch(fetchStudentSchoolFees())
    }
  }, [dispatch, studentsStatus, schoolFeesStatus, studentSchoolFeesStatus])

  useEffect(() => {
    if (studentSchoolFeesStatus === 'succeeded') {
      const regYears: Record<string, number[]> = {}
      studentSchoolFees.forEach((reg) => {
        if (!regYears[reg.studentId]) {
          regYears[reg.studentId] = []
        }
        regYears[reg.studentId].push(new Date(reg.startDate).getFullYear())
      })
      setRegisteredYears(regYears)
    }
  }, [studentSchoolFees, studentSchoolFeesStatus])

  const filteredStudents = useCallback(() => {
    if (selectedYear) {
      return students.filter(student => !registeredYears[student.$id]?.includes(selectedYear))
    }
    return students
  }, [students, selectedYear, registeredYears])

  useEffect(() => {
    if (selectedYear) {
      const filtered = filteredStudents()
      const registered = students.length - filtered.length
      const notRegistered = filtered.length
      setRegistrationProgress({ registered, notRegistered })
    } else {
      setRegistrationProgress({ registered: 0, notRegistered: 0 })
    }
  }, [selectedYear, students, filteredStudents])

  const onSubmit = async (data: IStudentFeesSchema & { year: string }) => {
    setIsLoading(true)
    try {
      const startYear = parseInt(data.year)
      const studentRegisteredYears = registeredYears[data.studentId] || []
      const myStudent = students.find(student => student.$id === data.studentId)
      let oldBalance = myStudent?.balance || 0;
      let totalFees = data.totalFees + oldBalance;
      
      if (studentRegisteredYears.includes(startYear)) {
        throw new Error("Student is already registered for this year")
      }

      const newRegistration = await newStudentRegistration(data)
      if(myStudent?.balance !== undefined){
        await updateStudentBalance(myStudent?.$id, totalFees);
      }

      console.log("Student fees data:", data)
      toast({
        title: "Success",
        description: "Student fees have been updated.",
      })

      setRegisteredYears(prev => ({
        ...prev,
        [data.studentId]: [...(prev[data.studentId] || []), startYear]
      }))

      form.reset()
      setShowHiddenFields(false)

      if (selectedYear) {
        setRegistrationProgress(prev => ({
          registered: prev.registered + 1,
          notRegistered: prev.notRegistered - 1
        }))
      }
    } catch (error) {
      console.error("Error updating student fees:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update student fees. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const calculateFees = useCallback(() => {
    const { startDate, endDate, paymentFrequency, schoolFeesRegId, studentId, year } = form.getValues()
    let registrationFee = 0
    const selectedRegistration = schoolFees.find(fee => fee.$id === schoolFeesRegId)
    if (selectedRegistration) {
      registrationFee = selectedRegistration.registrationFee || 0
    }

    console.log("Registration Fee:" + registrationFee)

    if (!startDate || !endDate || !paymentFrequency || !schoolFeesRegId || !studentId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields before calculating fees.",
        variant: "destructive",
      })
      return
    }

    const startYear = new Date(startDate).getFullYear()
    const studentRegisteredYears = registeredYears[studentId] || []
    
    if (studentRegisteredYears.includes(startYear)) {
      toast({
        title: "Error",
        description: "Student is already registered for this year.",
        variant: "destructive",
      })
      return
    }

    const selectedSchoolFees = schoolFees.find(fee => fee.$id === schoolFeesRegId)
    if (!selectedSchoolFees) return

    const start = new Date(startDate)
    const end = new Date(endDate)
    const monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1

    let totalFees = 0
    if (paymentFrequency === 'monthly') {
      totalFees = (selectedSchoolFees.monthlyFee * monthsDiff) + registrationFee
    } else if (paymentFrequency === 'yearly') {
      totalFees = selectedSchoolFees.yearlyFee + registrationFee
    }

    form.setValue("fees", selectedSchoolFees.monthlyFee)
    form.setValue("totalFees", totalFees)
    form.setValue("balance", totalFees)
    setShowHiddenFields(true)
  }, [form, schoolFees, registeredYears])

  return (
    <Card className="w-full max-w-2xl border-none mx-auto">
      <CardHeader>
        <CardTitle>Student Year Registration</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(70vh-12rem)] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Filter by Year</FormLabel>
                    <Select1 
                      onValueChange={(value) => {
                        const year = parseInt(value);
                        setSelectedYear(year);
                        field.onChange(value);
                        form.setValue("studentId", "");
                        form.setValue("schoolFeesRegId", "");
                        setShowHiddenFields(false);
                      }} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue1 placeholder="Select year to filter" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {yearRange.map(year => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select1>
                  </FormItem>
                )}
              />

              {selectedYear && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Registration Progress</div>
                  <Progress value={(registrationProgress.registered / students.length) * 100} className="w-full "  />
                  <div className="text-sm text-muted-foreground">
                    Registered: {registrationProgress.registered} | Not Registered: {registrationProgress.notRegistered}
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student</FormLabel>
                    <Select1 onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("schoolFeesRegId", "");
                      setShowHiddenFields(false);
                    }} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue1 placeholder="Select a student" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredStudents().map(student => (
                          <SelectItem key={student.$id} value={student.$id}>
                            {student.firstName} {student.surname} - {student.age}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select1>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="schoolFeesRegId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age Group</FormLabel>
                    <Select1 onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue1 placeholder="Select age group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {schoolFees.map((fee) => {
                          const isRegistered = registeredYears[form.getValues("studentId")]?.includes(fee.year);
                          return (
                            fee.year === selectedYear ? 
                            <SelectItem 
                              key={fee.$id} 
                              value={fee.$id}
                              disabled={isRegistered}
                            >
                              {fee.ageStart}-{fee.ageEnd} {fee.ageUnit}
                              {isRegistered && (
                                <span className="ml-2 text-xs text-red-500">
                                  (Already registered)
                                </span>
                              )}
                            </SelectItem>
                            : null
                          );
                        })}
                      </SelectContent>
                    </Select1>
                  </FormItem>
                )}
              />

              <CustomInput
                name="startDate"
                placeholder="Select start date"
                control={form.control}
                label="Start Date"
                type="date"
              />

              <CustomInput
                name="endDate"
                placeholder="Select end date"
                control={form.control}
                label="End Date"
                type="date"
              />

              <CustomInput
                name="paymentFrequency"
                control={form.control}
                label="Payment Frequency"
                placeholder="Select payment frequency"
                select={true}
                options={[
                  { value: "monthly", label: "Monthly" },
                  { value: "yearly", label: "Yearly" },
                ]}
              />

              <Button type="button" onClick={calculateFees} className="w-full">
                Calculate Fees
              </Button>

              {showHiddenFields && (
                <>
                  <CustomInput
                    name="fees"
                    placeholder="Enter monthly fee"
                    control={form.control}
                    label="Monthly Fee"
                    type="number"
                    readonly={true}
                  />

                  <CustomInput
                    name="totalFees"
                    placeholder="Enter total fees"
                    control={form.control}
                    label="Total Fees"
                    type="number"
                    readonly={true}
                  />

                  <CustomInput
                    name="paidAmount"
                    placeholder="Enter paid amount"
                    control={form.control}
                    label="Paid Amount"
                    type="number"
                    onChange={(e) => {
                      const value = parseFloat(e.target.value)
                      form.setValue("paidAmount", value)
                      const totalFees = form.getValues("totalFees")
                      form.setValue("balance", totalFees - value)
                    }}
                  />

                  <CustomInput
                    name="balance"
                    placeholder="Enter balance"
                    control={form.control}
                    label="Balance"
                    type="number"
                    readonly={true}
                  />

                  <CustomInput
                    placeholder="Select payment date"
                    name="paymentDate"
                    control={form.control}
                    label="Payment Date"
                    type="number"
                  />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Register Student"}
                  </Button>
                </>
              )}
            </form>
          </Form>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}