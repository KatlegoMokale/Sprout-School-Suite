"use client"

import React, { useEffect, useState, useCallback } from "react"
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
import { IClass, studentFormSchema, parseStringify, NewStudentParms } from "@/lib/utils"
import { updateStudent } from "@/lib/actions/user.actions"

export default function EditStudentForm({ params }: { params: { id: string } }) {
  const [classData, setClassData] = useState<IClass[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [formData, setFormData] = useState<NewStudentParms | null>(null)
  const router = useRouter()

  const calculateAge = useCallback((birthDate: string): string => {
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
  }, [])

  const schema = studentFormSchema();
  type FormData = z.infer<typeof schema>;
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      secondName: "",
      surname: "",
      dateOfBirth: "",
      age: "",
      gender: "",
      address: {
        street: "",
        city: "",
        province: "",
        postalCode: "",
        country: "South Africa"
      },
      homeLanguage: "",
      allergies: "",
      medicalAidNumber: "",
      medicalAidScheme: "",
      studentClass: "",
      studentStatus: "active",
      balance: 0,
      lastPaid: "",
      parent1: {
        relationship: "",
        firstName: "",
        surname: "",
        email: "",
        phoneNumber: "",
        idNumber: "",
        gender: "",
        dateOfBirth: "",
        address: {
          street: "",
          city: "",
          province: "",
          postalCode: "",
          country: "South Africa"
        },
        occupation: "",
        workNumber: ""
      },
      parent2: undefined
    }
  })

  useEffect(() => {
    let isMounted = true;

    const fetchStudent = async () => {
      if (!params.id) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/students/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch student data");
        }
        const data = await response.json();
        console.log("Fetched student data:", data);

        if (data && isMounted) {
          const age = calculateAge(data.dateOfBirth);
          form.reset({
            firstName: data.firstName || "",
            secondName: data.secondName || "",
            surname: data.surname || "",
            dateOfBirth: data.dateOfBirth || "",
            age: age || "",
            gender: data.gender || "",
            address: {
              street: data.address?.street || "",
              city: data.address?.city || "",
              province: data.address?.province || "",
              postalCode: data.address?.postalCode || "",
              country: data.address?.country || "South Africa"
            },
            homeLanguage: data.homeLanguage || "",
            allergies: data.allergies || "",
            medicalAidNumber: data.medicalAidNumber || "",
            medicalAidScheme: data.medicalAidScheme || "",
            studentClass: data.studentClass || "",
            studentStatus: data.studentStatus || "active",
            balance: data.balance || 0,
            lastPaid: data.lastPaid || "",
            parent1: {
              relationship: data.parent1?.relationship || "",
              firstName: data.parent1?.firstName || "",
              surname: data.parent1?.surname || "",
              email: data.parent1?.email || "",
              phoneNumber: data.parent1?.phoneNumber || "",
              idNumber: data.parent1?.idNumber || "",
              gender: data.parent1?.gender || "",
              dateOfBirth: data.parent1?.dateOfBirth || "",
              address: {
                street: data.parent1?.address?.street || "",
                city: data.parent1?.address?.city || "",
                province: data.parent1?.address?.province || "",
                postalCode: data.parent1?.address?.postalCode || "",
                country: data.parent1?.address?.country || "South Africa"
              },
              occupation: data.parent1?.occupation || "",
              workNumber: data.parent1?.workNumber || ""
            },
            parent2: data.parent2 ? {
              relationship: data.parent2.relationship || "",
              firstName: data.parent2.firstName || "",
              surname: data.parent2.surname || "",
              email: data.parent2.email || "",
              phoneNumber: data.parent2.phoneNumber || "",
              idNumber: data.parent2.idNumber || "",
              gender: data.parent2.gender || "",
              dateOfBirth: data.parent2.dateOfBirth || "",
              address: {
                street: data.parent2.address?.street || "",
                city: data.parent2.address?.city || "",
                province: data.parent2.address?.province || "",
                postalCode: data.parent2.address?.postalCode || "",
                country: data.parent2.address?.country || "South Africa"
              },
              occupation: data.parent2.occupation || "",
              workNumber: data.parent2.workNumber || ""
            } : undefined
          });
        }
      } catch (error) {
        console.error("Error fetching student:", error);
        if (isMounted) {
          setError("Failed to fetch student data. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchStudent();

    return () => {
      isMounted = false;
    };
  }, [params.id, calculateAge, form]);

  const onSubmit = async (data: FormData) => {
    setIsConfirmOpen(true);
    const studentData: NewStudentParms = {
      firstName: data.firstName,
      secondName: data.secondName || undefined,
      surname: data.surname,
      address: {
        street: data.address.street,
        city: data.address.city,
        province: data.address.province,
        postalCode: data.address.postalCode,
        country: data.address.country
      },
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      age: data.age,
      homeLanguage: data.homeLanguage,
      allergies: data.allergies || undefined,
      medicalAidNumber: data.medicalAidNumber || undefined,
      medicalAidScheme: data.medicalAidScheme || undefined,
      studentClass: data.studentClass,
      studentStatus: data.studentStatus as 'active' | 'inactive' | 'graduated',
      balance: data.balance,
      lastPaid: data.lastPaid || undefined,
      parent1: {
        relationship: data.parent1.relationship,
        firstName: data.parent1.firstName,
        surname: data.parent1.surname,
        email: data.parent1.email,
        phoneNumber: data.parent1.phoneNumber,
        idNumber: data.parent1.idNumber,
        gender: data.parent1.gender,
        dateOfBirth: data.parent1.dateOfBirth,
        address: {
          street: data.parent1.address.street,
          city: data.parent1.address.city,
          province: data.parent1.address.province,
          postalCode: data.parent1.address.postalCode,
          country: data.parent1.address.country
        },
        occupation: data.parent1.occupation || undefined,
        workNumber: data.parent1.workNumber || undefined
      },
      parent2: data.parent2 ? {
        relationship: data.parent2.relationship || undefined,
        firstName: data.parent2.firstName || undefined,
        surname: data.parent2.surname || undefined,
        email: data.parent2.email || undefined,
        phoneNumber: data.parent2.phoneNumber || undefined,
        idNumber: data.parent2.idNumber || undefined,
        gender: data.parent2.gender || undefined,
        dateOfBirth: data.parent2.dateOfBirth || undefined,
        address: data.parent2.address ? {
          street: data.parent2.address.street || undefined,
          city: data.parent2.address.city || undefined,
          province: data.parent2.address.province || undefined,
          postalCode: data.parent2.address.postalCode || undefined,
          country: data.parent2.address.country || undefined
        } : undefined,
        occupation: data.parent2.occupation || undefined,
        workNumber: data.parent2.workNumber || undefined
      } : undefined
    };
    setFormData(studentData);
  };

  const handleConfirmUpdate = async () => {
    if (!formData) return;
    
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

  const handleClassChange = (value: string) => {
    form.setValue("studentClass", value);
  };

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
                    <div className="col-span-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CustomInput name="address.street" control={form.control} label="Street Address" placeholder="Enter Street Address" />
                        <CustomInput name="address.city" control={form.control} label="City" placeholder="Enter City" />
                        <CustomInput name="address.province" control={form.control} label="Province" placeholder="Enter Province" />
                        <CustomInput name="address.postalCode" control={form.control} label="Postal Code" placeholder="Enter Postal Code" />
                      </div>
                    </div>
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
                            <SelectItem key={classItem._id} value={classItem._id}>
                              {classItem.name} ({classItem.age})
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
                      name="parent1.relationship"
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
                    <CustomInput name="parent1.firstName" control={form.control} label="Name" placeholder="Enter Name" />
                    <CustomInput name="parent1.surname" control={form.control} label="Surname" placeholder="Enter Surname" />
                    <CustomInput name="parent1.email" control={form.control} label="Email" type="email" placeholder="Enter Email" />
                    <CustomInput name="parent1.phoneNumber" control={form.control} label="Phone Number" placeholder="Enter Phone Number" />
                    <CustomInput name="parent1.idNumber" control={form.control} label="ID Number" placeholder="Enter ID Number" />
                    <CustomInput
                      name="parent1.gender"
                      control={form.control}
                      label="Gender"
                      placeholder="Enter gender"
                      select={true}
                      options={[
                        { label: "Male", value: "Male" },
                        { label: "Female", value: "Female" },
                      ]}
                    />
                    <CustomInput name="parent1.dateOfBirth" control={form.control} label="Date Of Birth" type="date" placeholder="Enter Date of Birth" />
                    <div className="col-span-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CustomInput name="parent1.address.street" control={form.control} label="Street Address" placeholder="Enter Street Address" />
                        <CustomInput name="parent1.address.city" control={form.control} label="City" placeholder="Enter City" />
                        <CustomInput name="parent1.address.province" control={form.control} label="Province" placeholder="Enter Province" />
                        <CustomInput name="parent1.address.postalCode" control={form.control} label="Postal Code" placeholder="Enter Postal Code" />
                      </div>
                    </div>
                    <CustomInput name="parent1.occupation" control={form.control} label="Employer" placeholder="Enter Employer Name" />
                    <CustomInput name="parent1.workNumber" control={form.control} label="Employer Phone Number" placeholder="Enter Employer Phone Number" />
                  </div>
                </TabsContent>
                <TabsContent value="guardian2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomInput
                      name="parent2.relationship"
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
                    <CustomInput name="parent2.firstName" control={form.control} label="Name" placeholder="Enter Name" />
                    <CustomInput name="parent2.surname" control={form.control} label="Surname" placeholder="Enter Surname" />
                    <CustomInput name="parent2.email" control={form.control} label="Email" type="email" placeholder="Enter Email" />
                    <CustomInput name="parent2.phoneNumber" control={form.control} label="Phone Number" placeholder="Enter Phone Number" />
                    <CustomInput name="parent2.idNumber" control={form.control} label="ID Number" placeholder="Enter ID Number" />
                    <CustomInput
                      name="parent2.gender"
                      control={form.control}
                      label="Gender"
                      placeholder="Enter gender"
                      select={true}
                      options={[
                        { label: "Male", value: "Male" },
                        { label: "Female", value: "Female" },
                      ]}
                    />
                    <CustomInput name="parent2.dateOfBirth" control={form.control} label="Date Of Birth" type="date" placeholder="Enter Date of Birth" />
                    <div className="col-span-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CustomInput name="parent2.address.street" control={form.control} label="Street Address" placeholder="Enter Street Address" />
                        <CustomInput name="parent2.address.city" control={form.control} label="City" placeholder="Enter City" />
                        <CustomInput name="parent2.address.province" control={form.control} label="Province" placeholder="Enter Province" />
                        <CustomInput name="parent2.address.postalCode" control={form.control} label="Postal Code" placeholder="Enter Postal Code" />
                      </div>
                    </div>
                    <CustomInput name="parent2.occupation" control={form.control} label="Employer" placeholder="Enter Employer Name" />
                    <CustomInput name="parent2.workNumber" control={form.control} label="Employer Phone Number" placeholder="Enter Employer Phone Number" />
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