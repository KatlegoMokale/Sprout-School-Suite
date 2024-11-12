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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog"
import { IClass, newStudentFormSchema, parseStringify } from "@/lib/utils"
import { updateStudent } from "@/lib/actions/user.actions"

interface PageProps {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

type StudentFormData = z.infer<ReturnType<typeof newStudentFormSchema>>;

export default function EditStudentForm({ params }: PageProps) {
  const [classData, setClassData] = useState<IClass[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [formData, setFormData] = useState<StudentFormData | null>(null)
  const router = useRouter()

  const studentFormSchema = newStudentFormSchema()
  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      firstName: "",
      surname: "",
      dateOfBirth: "",
      age: "",
      gender: "",
      address1: "",
      homeLanguage: "",
      allergies: "",
      medicalAidNumber: "",
      medicalAidScheme: "",
      studentClass: "",
      studentStatus: "active",
      p1_relationship: "",
      p1_firstName: "",
      p1_surname: "",
      p1_email: "",
      p1_phoneNumber: "",
      p1_idNumber: "",
      p1_gender: "",
      p1_dateOfBirth: "",
      p1_address1: "",
      p1_occupation: "",
      p1_workNumber: "",
      p2_relationship: "",
      p2_firstName: "",
      p2_surname: "",
      p2_email: "",
      p2_phoneNumber: "",
      p2_idNumber: "",
      p2_gender: "",
      p2_dateOfBirth: "",
      p2_address1: "",
      p2_occupation: "",
      p2_workNumber: "",
      secondName: ""
    }
  })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [classesResponse, studentResponse] = await Promise.all([
          fetch("/api/class"),
          fetch(`/api/students/${params.id}`)
        ])
        if (!classesResponse.ok || !studentResponse.ok) throw new Error("Failed to fetch data")
        const classesData = await classesResponse.json()
        const studentData = await studentResponse.json()
        
        setClassData(classesData)
        
        // Ensure the student data matches our form schema
        const formattedStudentData: StudentFormData = {
          ...form.getValues(), // Get default values
          ...studentData.student, // Spread in the fetched data
        }
        
        setFormData(formattedStudentData)
        
        // Set form values
        Object.entries(formattedStudentData).forEach(([key, value]) => {
          form.setValue(key as keyof StudentFormData, value)
        })
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to fetch data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [params.id, form])

  const onSubmit = async (data: StudentFormData) => {
    setFormData(data)
    setIsConfirmOpen(true)
  }

  const handleConfirmUpdate = async () => {
    if (!formData) {
      setError("No form data available")
      return
    }

    setIsLoading(true)
    try {
      await updateStudent(formData, params.id)
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
              <Tabs defaultValue="student">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="student">Student Information</TabsTrigger>
                  <TabsTrigger value="guardian1">Guardian 1</TabsTrigger>
                  <TabsTrigger value="guardian2">Guardian 2</TabsTrigger>
                </TabsList>
                <TabsContent value="student" className="space-y-4">
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
                </TabsContent>
                <TabsContent value="guardian1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </TabsContent>
                <TabsContent value="guardian2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </TabsContent>
              </Tabs>
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