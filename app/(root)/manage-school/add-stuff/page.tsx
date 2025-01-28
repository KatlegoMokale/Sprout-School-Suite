"use client"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CustomInput from "@/components/ui/CustomInput"
import { Select1, SelectContent, SelectItem, SelectTrigger, SelectValue1 } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"
import { newStuffFormSchema } from "@/lib/utils"
import { newStuff } from "@/lib/actions/user.actions"
import { autocomplete } from "@/lib/google"
// import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js"

const formSchema = newStuffFormSchema()

export default function AddStuff() {
  const [formData, setFormData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // const [predictions, setPredictions] = useState<PlaceAutocompleteResult[]>([])
  const [input, setInput] = useState("")
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      secondName: "",
      surname: "",
      dateOfBirth: "",
      idNumber: "",
      address1: "",
      contact: "",
      email: "",
      gender: "",
      position: "",
      startDate: "",
    },
  })

  // useEffect(() => {
  //   const fetchPredictions = async () => {
  //     if (input.length > 2) {
  //       const predictions = await autocomplete(input)
  //       setPredictions(predictions ?? [])
  //     }
  //   }
  //   fetchPredictions()
  // }, [input])

  // const handlePredictionSelect = (prediction: PlaceAutocompleteResult) => {
  //   setInput(prediction.description)
  //   const addressComponents = prediction.terms
  //   const address1 = addressComponents[0].value + " " + addressComponents[1].value
  //   const city = addressComponents[2].value
  //   form.setValue("address1", address1 + ", " + city)
  // }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setFormData(data)
    setIsConfirmOpen(true)
  }

  const handleConfirmAddStuff = async () => {
    setIsLoading(true)
    try {
      const stuffData = formData as z.infer<typeof formSchema>;
      const newStuffData: NewStuffParams = {
        ...stuffData,
        secondName: stuffData.secondName || '' // Provide a default empty string if secondName is undefined
      };
      await newStuff(newStuffData)
      toast({
        title: "Success",
        description: "New staff member has been added successfully.",
      })
      // router.push("/manage-school")
    } catch (error) {
      console.error("Error submitting form:", error)
      setError("An error occurred while submitting the form. Please try again.")
      toast({
        title: "Error",
        description: "Failed to add new staff member. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Link href="/manage-school" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Manage School
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Add New Staff Member</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomInput
                  control={form.control}
                  name="firstName"
                  label="First Name"
                  placeholder="Enter first name"
                />
                <CustomInput
                  control={form.control}
                  name="secondName"
                  label="Second Name"
                  placeholder="Enter second name"
                />
                <CustomInput
                  control={form.control}
                  name="surname"
                  label="Surname"
                  placeholder="Enter surname"
                />
                <CustomInput
                  control={form.control}
                  name="dateOfBirth"
                  label="Date of Birth"
                  placeholder="Enter date of birth"
                  type="date"
                />
                <CustomInput
                  control={form.control}
                  name="idNumber"
                  label="ID Number"
                  placeholder="Enter ID number"
                />
                <CustomInput
                  control={form.control}
                  name="gender"
                  label="Gender"
                  placeholder="Select gender"
                  select={true}
                  options={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                  ]}
                />
                <CustomInput
                  control={form.control}
                  name="contact"
                  label="Phone Number"
                  placeholder="Enter phone number"
                />

                 <CustomInput
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="Enter email"
                />

                <CustomInput
                  control={form.control}
                  name="address1"
                  label="Address"
                  placeholder="Enter address"
                  onChange={(e) => setInput(e.target.value)}
                />
                
                <CustomInput
                  control={form.control}
                  name="position"
                  label="Position"
                  placeholder="Enter position"
                />
                <CustomInput
                  control={form.control}
                  name="startDate"
                  label="Start Date"
                  placeholder="Enter start date"
                  type="date"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding Staff...
                    </>
                  ) : (
                    "Add Staff Member"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Adding New Staff Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to add this staff member?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsConfirmOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAddStuff}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {error && <div className="mt-4 text-red-500">{error}</div>}
    </div>
  )
}