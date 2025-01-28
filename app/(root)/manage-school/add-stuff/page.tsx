"use client"

import React, { useState } from "react"
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"
import { newStuffFormSchema } from "@/lib/utils"
import { newStuff } from "@/lib/actions/user.actions"

const formSchema = newStuffFormSchema()

export default function AddStuff() {
  const [formData, setFormData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
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
        secondName: stuffData.secondName || ''
      };
      console.log("Attempting to add new staff member:", newStuffData);
      
      const response = await newStuff(newStuffData)
      console.log("Response from newStuff:", response);
      
      if (response && response.success) {
        toast({
          title: "Success",
          description: "New staff member has been added successfully.",
        })
        router.push("/manage-school")
      } else {
        throw new Error(response?.message || "Failed to add new staff member")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setError(`An error occurred while submitting the form: ${error}`)
      toast({
        title: "Error",
        description: `Failed to add new staff member: ${error}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsConfirmOpen(false)
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
              {/* ... (form fields remain unchanged) ... */}
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