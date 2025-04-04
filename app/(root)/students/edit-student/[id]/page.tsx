"use client"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CustomInput from "@/components/ui/CustomInput"
import { Select1, SelectContent, SelectItem, SelectTrigger, SelectValue1 } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { IClass, newStudentFormSchema, parseStringify } from "@/lib/utils"
import { updateStudent } from "@/lib/actions/user.actions"

export default function EditStudentForm({ params }: { params: Promise<{ id: string }> }) {
  const [classData, setClassData] = useState<IClass[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [formData, setFormData] = useState({})
  const router = useRouter()

  const studentFormSchema = newStudentFormSchema()
  const form = useForm<z.infer<typeof studentFormSchema>>({
    resolver: zodResolver(studentFormSchema),
  })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const unwrappedParams = await params
        const [classesResponse, studentResponse] = await Promise.all([
          fetch("/api/class"),
          fetch(`/api/students/${unwrappedParams.id}`)
        ])
        if (!classesResponse.ok || !studentResponse.ok) throw new Error("Failed to fetch data")
        const classesData = await classesResponse.json()
        const studentData = await studentResponse.json()
        
        setClassData(classesData)
        setFormData(studentData.student)
        
        // Set form values
        Object.entries(studentData.student).forEach(([key, value]) => {
          form.setValue(key as any, value as any)
        })
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to fetch data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [params, form])

  const onSubmit = async (data: z.infer<typeof studentFormSchema>) => {
    setIsConfirmOpen(true)
    const studentData: NewStudentParms = {
      firstName: data.firstName,
      secondName: data.secondName,
      surname: data.surname,
      dateOfBirth: data.dateOfBirth,
      age: data.age,
      gender: data.gender,
      address1: data.address1,
      homeLanguage: data.homeLanguage,
      allergies: data.allergies,
      medicalAidNumber: data.medicalAidNumber,
      medicalAidScheme: data.medicalAidScheme,
      studentClass: data.studentClass,
      p1_firstName: data.p1_firstName,
      p1_surname: data.p1_surname,
      p1_address1: data.p1_address1,
      p1_dateOfBirth: data.p1_dateOfBirth,
      p1_gender: data.p1_gender,
      p1_idNumber: data.p1_idNumber,
      p1_occupation: data.p1_occupation,
      p1_phoneNumber: data.p1_phoneNumber,
      p1_email: data.p1_email,
      p1_workNumber: data.p1_workNumber,
      p1_relationship: data.p1_relationship,
      p2_firstName: data.p2_firstName,
      p2_surname: data.p2_surname,
      p2_address1: data.p2_address1,
      p2_dateOfBirth: data.p2_dateOfBirth,
      p2_gender: data.p2_gender,
      p2_idNumber: data.p2_idNumber,
      p2_occupation: data.p2_occupation,
      p2_phoneNumber: data.p2_phoneNumber,
      p2_email: data.p2_email,
      p2_workNumber: data.p2_workNumber,
      p2_relationship: data.p2_relationship,
      studentStatus: data.studentStatus,
    };
    setFormData(studentData); 
  }

  const handleConfirmUpdate = async () => {
    setIsLoading(true)
    try {
      const unwrappedParams = await params
      await updateStudent(formData as NewStudentParms, unwrappedParams.id)
      toast({
        title: "Success",
        description: "Student information has been updated.",
      })
      router.push('/students')
    } catch (error) {
      console.error("Error updating student:", error)
      setError("An error occurred while updating the student information.")
    } finally {
      setIsLoading(false)
    }
  }
  const calculateAge = (birthDate: string): string => {
    const today = new Date()
    const birth = new Date(birthDate)
    let months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth())
    
    if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''}`
    } else {
      let years = Math.floor(months / 12)
      if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
        years -= 1
      }
      return parseStringify(`${years} year${years !== 1 ? 's' : ''}`)
    }
  }

  const handleClassChange = (value: string) => {
    form.setValue("studentClass", value)
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
    <div className="flex flex-col px-4">
      <Link href="/students" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Students
      </Link>
      <Card className="border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold mt-1">Edit Student Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Student Information Section */}
              <div className="bg-orange-50 rounded-lg p-5">
                <h2 className="text-xl font-semibold mb-4">Student Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomInput name="firstName" control={form.control} label="Name" placeholder="Enter Child Name" />
                  <CustomInput name="secondName" control={form.control} label="Second Name" placeholder="Enter Child Second Name" />
                  <CustomInput name="surname" control={form.control} label="Surname" placeholder="Enter Child Surname" />
                  <CustomInput
                    name="dateOfBirth"
                    control={form.control}
                    label="Date of Birth"
                    type="date"
                    placeholder="Enter Child Date of Birth"
                    onChange={(e) => {
                      const age = calculateAge(e.target.value)
                      form.setValue("age", age)
                    }}
                  />
                  <CustomInput name="age" control={form.control} label="Age" placeholder="Age will be calculated" readonly={true} />
                  <CustomInput
                    name="gender"
                    control={form.control}
                    label="Gender"
                    placeholder="Select Gender"
                    select={true}
                    options={[
                      { label: "Male", value: "Male" },
                      { label: "Female", value: "Female" },
                    ]}
                  />
                  <CustomInput name="address1" control={form.control} label="Address" placeholder="Enter Child Address" />
                  <CustomInput name="homeLanguage" control={form.control} label="Home Language" placeholder="Home Language" />
                  <CustomInput name="allergies" control={form.control} label="Allergies" placeholder="Allergies" />
                  <CustomInput name="medicalAidNumber" control={form.control} label="Medical Aid Number" placeholder="Medical Aid Number" />
                  <CustomInput name="medicalAidScheme" control={form.control} label="Medical Aid Scheme" placeholder="Medical Aid Scheme" />
                  <div className="form-item">
                    <div className="text-md font-semibold text-gray-600">Class</div>
                    <Select1 onValueChange={handleClassChange} value={form.getValues("studentClass")}>
                      <SelectTrigger className="w-full">
                        <SelectValue1 placeholder="Select Class" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {classData?.map((classItem) => (
                          <SelectItem key={classItem.$id} value={classItem.$id}>
                            {classItem.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select1>
                  </div>
                  <CustomInput
                    name="studentStatus"
                    control={form.control}
                    label="Student Status"
                    placeholder="Student Status"
                    select={true}
                    options={[
                      { label: "Active", value: "active" },
                      { label: "Non-Active", value: "non-active" },
                    ]}
                  />
                </div>
              </div>

              {/* Guardians Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Guardian 1 */}
                <div className="bg-orange-50 rounded-lg p-5">
                  <h2 className="text-xl font-semibold mb-4">Guardian 1</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <CustomInput
                      name="p1_relationship"
                      control={form.control}
                      label="Relationship"
                      placeholder="Select Relationship"
                      select={true}
                      options={[
                        { label: "Mother", value: "Mother" },
                        { label: "Father", value: "Father" },
                        { label: "Grand Mother", value: "Grand Mother" },
                        { label: "Grand Father", value: "Grand Father" },
                      ]}
                    />
                    <CustomInput name="p1_firstName" control={form.control} label="Name" placeholder="Enter Name" />
                    <CustomInput name="p1_surname" control={form.control} label="Surname" placeholder="Enter Surname" />
                    <CustomInput name="p1_email" control={form.control} label="Email" type="email" placeholder="Enter Email" />
                    <CustomInput name="p1_phoneNumber" control={form.control} label="Phone Number" placeholder="Enter Phone Number" />
                    <CustomInput name="p1_idNumber" control={form.control} label="ID Number" placeholder="Enter ID Number" />
                    <CustomInput
                      name="p1_gender"
                      control={form.control}
                      label="Gender"
                      placeholder="Enter gender"
                      select={true}
                      options={[
                        { label: "Male", value: "Male" },
                        { label: "Female", value: "Female" },
                      ]}
                    />
                    <CustomInput name="p1_dateOfBirth" control={form.control} label="Date Of Birth" type="date" placeholder="Enter Date of Birth" />
                    <CustomInput name="p1_address1" control={form.control} label="Address" placeholder="Enter Address" />
                    <CustomInput name="p1_occupation" control={form.control} label="Employer" placeholder="Enter Employer Name" />
                    <CustomInput name="p1_workNumber" control={form.control} label="Employer Phone Number" placeholder="Enter Employer Phone Number" />
                  </div>
                </div>

                {/* Guardian 2 */}
                <div className="bg-orange-50 rounded-lg p-5">
                  <h2 className="text-xl font-semibold mb-4">Guardian 2</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <CustomInput
                      name="p2_relationship"
                      control={form.control}
                      label="Relationship"
                      placeholder="Select Relationship"
                      select={true}
                      options={[
                        { label: "Mother", value: "Mother" },
                        { label: "Father", value: "Father" },
                        { label: "Grand Mother", value: "Grand Mother" },
                        { label: "Grand Father", value: "Grand Father" },
                      ]}
                    />
                    <CustomInput name="p2_firstName" control={form.control} label="Name" placeholder="Enter Name" />
                    <CustomInput name="p2_surname" control={form.control} label="Surname" placeholder="Enter Surname" />
                    <CustomInput name="p2_email" control={form.control} label="Email" type="email" placeholder="Enter Email" />
                    <CustomInput name="p2_phoneNumber" control={form.control} label="Phone Number" placeholder="Enter Phone Number" />
                    <CustomInput name="p2_idNumber" control={form.control} label="ID Number" placeholder="Enter ID Number" />
                    <CustomInput
                      name="p2_gender"
                      control={form.control}
                      label="Gender"
                      placeholder="Enter gender"
                      select={true}
                      options={[
                        { label: "Male", value: "Male" },
                        { label: "Female", value: "Female" },
                      ]}
                    />
                    <CustomInput name="p2_dateOfBirth" control={form.control} label="Date Of Birth" type="date" placeholder="Enter Date of Birth" />
                    <CustomInput name="p2_address1" control={form.control} label="Address" placeholder="Enter Address" />
                    <CustomInput name="p2_occupation" control={form.control} label="Employer" placeholder="Enter Employer Name" />
                    <CustomInput name="p2_workNumber" control={form.control} label="Employer Phone Number" placeholder="Enter Employer Phone Number" />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full transition-colors hover:bg-primary/90 bg-green-200 hover:bg-green-300" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Student...
                  </>
                ) : (
                  "Update Student"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
      <AlertDialogTitle className="hidden">Confirm Update</AlertDialogTitle>
        <AlertDialogContent>
          <AlertDialogHeader>Confirm Update</AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to update this student&apos;s information?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-slate-200" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="bg-orange-200 hover:bg-orange-300" onClick={handleConfirmUpdate}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}