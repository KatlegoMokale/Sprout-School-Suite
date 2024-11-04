"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import CustomInput from "@/components/ui/CustomInput"
import { Select1, SelectContent, SelectItem, SelectTrigger, SelectValue1 } from "@/components/ui/select"
import { ISchoolFees, IStudent, studentFeesSchema } from "@/lib/utils"
import { newStudentRegistration } from "@/lib/actions/user.actions"

export default function StudentFeesManagement() {
  const [isLoading, setIsLoading] = useState(false)
  const [students, setStudents] = useState<IStudent[]>([])
  const [filteredStudents, setFilteredStudents] = useState<IStudent[]>([])
  const [schoolFees, setSchoolFees] = useState<ISchoolFees[]>([])
  const [showHiddenFields, setShowHiddenFields] = useState(false)
  const [registeredYears, setRegisteredYears] = useState<Record<string, number[]>>({})
  const [selectedYear, setSelectedYear] = useState<number | null>(null)

  const currentYear = new Date().getFullYear()
  const yearRange = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)

  const StudentFeesSchema = studentFeesSchema()
  const form = useForm<z.infer<typeof StudentFeesSchema>>({
    resolver: zodResolver(StudentFeesSchema),
    defaultValues: {
      studentId: "",
      schoolFeesRegId: "",
      startDate: "",
      endDate: "",
      fees: 0,
      totalFees: 0,
      paidAmount: 0,
      balance: 0,
      paymentFrequency: "monthly",
      nextPaymentDate: 0,
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsResponse, schoolFeesResponse, registrationsResponse] = await Promise.all([
          fetch("/api/students"),
          fetch("/api/school-fees-setup"),
          fetch("/api/student-school-fees")
        ])
        if (!studentsResponse.ok || !schoolFeesResponse.ok || !registrationsResponse.ok) throw new Error("Failed to fetch data")
        const studentsData = await studentsResponse.json()
        const schoolFeesData = await schoolFeesResponse.json()
        const registrationsData = await registrationsResponse.json()
        setStudents(studentsData)
        setFilteredStudents(studentsData)
        setSchoolFees(schoolFeesData)
        
        // Process registrations data to create a map of student IDs to registered years
        const regYears: Record<string, number[]> = {}
        registrationsData.forEach((reg: any) => {
          if (!regYears[reg.studentId]) {
            regYears[reg.studentId] = []
          }
          regYears[reg.studentId].push(new Date(reg.startDate).getFullYear())
        })
        setRegisteredYears(regYears)

        console.log("Students:", studentsData)
        console.log("School fees:", schoolFeesData)
        console.log("Registered years:", regYears)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name === 'startDate' || name === 'endDate') {
        calculateFees()
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  useEffect(() => {
    if (selectedYear) {
      const filtered = students.filter(student => !registeredYears[student.$id]?.includes(selectedYear))
      setFilteredStudents(filtered)
    } else {
      setFilteredStudents(students)
    }
  }, [selectedYear, students, registeredYears])

  const onSubmit = async (data: z.infer<typeof StudentFeesSchema>) => {
    setIsLoading(true)
    try {
      const startYear = new Date(data.startDate).getFullYear()
      const studentRegisteredYears = registeredYears[data.studentId] || []
      
      if (studentRegisteredYears.includes(startYear)) {
        throw new Error("Student is already registered for this year")
      }

      const newRegistration = await newStudentRegistration(data)
      console.log("Student fees data:", data)
      toast({
        title: "Success",
        description: "Student fees have been updated.",
      })

      // Update the registered years for this student
      setRegisteredYears(prev => ({
        ...prev,
        [data.studentId]: [...(prev[data.studentId] || []), startYear]
      }))

      // Reset the form
      form.reset()
      setShowHiddenFields(false)

      // Update filtered students
      if (selectedYear) {
        setFilteredStudents(prev => prev.filter(student => student.$id !== data.studentId))
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

  const calculateFees = () => {
    const startDate = form.getValues("startDate")
    const endDate = form.getValues("endDate")
    const paymentFrequency = form.getValues("paymentFrequency")
    const schoolFeesRegId = form.getValues("schoolFeesRegId")
    const studentId = form.getValues("studentId")

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
      totalFees = (selectedSchoolFees.monthlyFee * monthsDiff)
    } else if (paymentFrequency === 'yearly') {
      totalFees = selectedSchoolFees.yearlyFee
    }

    form.setValue("fees", selectedSchoolFees.monthlyFee)
    form.setValue("totalFees", totalFees)
    form.setValue("balance", totalFees)
    setShowHiddenFields(true)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Student Year Registration</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="yearFilter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filter by Year</FormLabel>
                  <Select1 
                    onValueChange={(value) => {
                      const year = parseInt(value);
                      setSelectedYear(year);
                      field.onChange(year);
                      form.setValue("studentId", "");
                      form.setValue("schoolFeesRegId", "");
                      setShowHiddenFields(false);
                    }} 
                    value={field.value?.toString()}
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
                      {filteredStudents.map(student => (
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
                      {schoolFees.map(fee => {
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
                          :
                          <></>
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
              onChange={() => calculateFees()}
            />

            <CustomInput
              name="endDate"
              placeholder="Select end date"
              control={form.control}
              label="End Date"
              type="date"
              onChange={() => calculateFees()}
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
              onChange={() => calculateFees()}
            />

            {!showHiddenFields && (
              <Button type="button" onClick={calculateFees} className="w-full">
                Continue
              </Button>
            )}

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
                  placeholder="Select next payment date"
                  name="nextPaymentDate"
                  control={form.control}
                  label="Next Payment Date"
                  type="number"
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Student Fees"}
                </Button>
              </>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}